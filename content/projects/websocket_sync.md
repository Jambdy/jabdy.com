+++
title = "Real-Time WebSockets"
description = "Replace polling with WebSockets for instant multiplayer sync"
tags = [
"AWS",
"Personal Project",
"Famous Fishbowl",
"Flutter"
]
date = 2024-01-15
author = "James Abdy"
+++

<div style="margin-bottom:40px">
<img class="center" style="width:400px; margin-bottom:10px" src="/img/websocket_sync/websocket_logo.png">
<div style="text-align: center; font-size: 10px;">WebSocket protocol enables real-time bidirectional communication</div>
</div>


In a [previous article](/projects/handle_dynamo_overwrites/), I described how I used DynamoDB condition expressions and list append operations to mitigate stale update issues in Famous Fishbowl. While these techniques reduced conflicts, the underlying polling architecture still introduced latency and the possibility of race conditions. In this post, I will explain how I replaced the polling approach with WebSockets to enable real-time game state synchronization.

## Previous Implementation

The original implementation had each client poll the backend every 5 seconds to check for game state changes. This approach had several limitations:

* Players experienced delays of up to 5 seconds before seeing other players' actions
* Frequent HTTP requests consumed unnecessary bandwidth and server resources
* Concurrent updates within the polling window could still cause conflicts
* The user experience felt sluggish, especially during active gameplay

I had noted in the conclusion of the previous article that I planned to implement WebSockets, and that time finally came.

## WebSocket Architecture

AWS API Gateway V2 provides native support for WebSocket APIs, which made it a natural choice for this serverless application. The architecture consists of three main components:

### API Gateway WebSocket API

I added a WebSocket API to the SAM template with a custom domain:

~~~
FamousFishbowlWebSocket:
  Type: AWS::ApiGatewayV2::Api
  Properties:
    Name: FamousFishbowlWebSocket
    ProtocolType: WEBSOCKET
    RouteSelectionExpression: "$request.body.action"
~~~

The RouteSelectionExpression tells API Gateway to route messages based on the action field in the request body. I configured two main routes: one for game updates and one for client disconnections.

### Connection Management

When a client connects to the WebSocket, API Gateway assigns a unique connection ID. I store these connection IDs in DynamoDB, grouped by game ID:

~~~
def add_connection(connection_id, game_id):
    table.put_item(
        Item={
            'pk': f'gameConnection_{game_id}',
            'sk': connection_id
        }
    )
~~~

This allows me to query all active connections for a specific game and broadcast updates to all players. When a client disconnects, a Lambda function removes the connection record:

~~~
def lambda_handler(event, _):
    request_context = event.get('requestContext', {})
    connection_id = request_context.get('connectionId')
    remove_connection(connection_id)
~~~

### Broadcasting Updates

The most important function sends game state updates to all connected players. I use the API Gateway Management API to post messages directly to client connections:

~~~
def send_to_connections(endpoint_url, game_id, origin_connection_id, data, return_to_sender=False):
    pk = f'gameConnection_{game_id}'
    response = table.query(
        KeyConditionExpression=Key('pk').eq(pk)
    )
    connection_ids = [item.get('sk', '') for item in response.get('Items', {})]

    api_management_client = boto3.client(
        'apigatewaymanagementapi',
        endpoint_url=endpoint_url
    )

    for connection_id in connection_ids:
        if (return_to_sender and connection_id == origin_connection_id) or \
           (not return_to_sender and connection_id != origin_connection_id):
            api_management_client.post_to_connection(
                Data=json.dumps(data),
                ConnectionId=connection_id
            )
~~~

The return_to_sender parameter controls whether the update is sent back to the client that initiated it. For most operations, the originating client already has the updated state locally, so I only broadcast to other players.

## Frontend Implementation

On the Flutter side, I used the web_socket_channel package to manage the WebSocket connection. I created a service class to encapsulate all WebSocket operations:

~~~
class GamesWebSocket {
  WebSocketChannel? channel;

  void connectToSocket() {
    channel = WebSocketChannel.connect(
      Uri.parse(Constants.webSocketEndPoint),
    );
  }

  void updateGameViaWebSocket({required Game game, required Map<String, dynamic> updatedItems}) {
    int currentUpdateTime = DateTime.now().toUtc().millisecondsSinceEpoch;
    updatedItems['currentUpdateTime'] = currentUpdateTime;
    updatedItems['lastUpdateTime'] = game.lastUpdateTime;

    var body = {
      'action': 'updateGame',
      'gameAction': 'updateGame',
      'gameId': game.id.toUpperCase(),
      'updatedItems': updatedItems
    };
    channel!.sink.add(jsonEncode(body));
  }
}
~~~

The UI components use Flutter's StreamBuilder widget to listen for incoming messages and automatically rebuild when new game state arrives:

~~~
body: StreamBuilder(
  stream: gamesWebSocket?.channel?.stream,
  builder: (context, snapshot) {
    if (snapshot.hasData && snapshot.data != socketData) {
      context.read<GameProvider>().refreshGame(snapshot.data! as String);
      socketData = snapshot.data as String;
    }

    switch (context.watch<GameProvider>().game!.gameState) {
      case GameState.startPending:
        currentScreen = PlayGameScreens.addNames;
      case GameState.turnInProgress:
        currentScreen = PlayGameScreens.playTurn;
    }

    return buildUI();
  }
)
~~~

This pattern ensures the UI always reflects the current game state without any manual polling logic.

## Handling Concurrent Updates

Even with WebSockets, it is still possible for multiple players to submit updates simultaneously. I retained the optimistic concurrency control from the previous implementation using timestamps:

~~~
response = table.update_item(
    Key={'pk': 'gameInstance', 'sk': game_id},
    UpdateExpression=update_string,
    ConditionExpression='attribute_not_exists(#lastUpdateTime) OR #lastUpdateTime <= :lastUpdateTime',
    ReturnValuesOnConditionCheckFailure='ALL_OLD'
)
~~~

If an update has a stale timestamp, DynamoDB rejects it and returns the current game state. The backend then broadcasts this fresh state to all clients, ensuring everyone stays synchronized.

## Results

The WebSocket implementation dramatically improved the multiplayer experience:

* Game state updates now appear in under 1 second instead of up to 5 seconds
* The optimistic locking strategy prevents any data inconsistencies
* Players can see actions happen in real-time, making the game feel more responsive

The transition from polling to WebSockets required changes across the entire stack (infrastructure, backend Lambda functions, and frontend UI), but the improvement in user experience made it worthwhile.

## References

[Link to GitHub project (frontend)] (https://github.com/Jambdy/famous_fishbowl)

[Link to GitHub project (backend)] (https://github.com/Jambdy/famous-fishbowl-backend)

https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api.html

https://pub.dev/packages/web_socket_channel
