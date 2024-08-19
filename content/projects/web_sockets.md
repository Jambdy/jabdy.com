+++
title = "Utilize WebSocket"
description = "Provide near realtime updates via WebSocket"
tags = [
"AWS",
"Personal Project",
"Famous Fishbowl"
]
date = 2024-07-27
author = "James Abdy"
+++

As discussed in the "Handle Overwrites" post, the Famous Fishbowl app is a game that allows multiple users to play at the same time on different devices. While the game updates are more turn base than dynamic, there are still scenarios where fast updates are beneficial like showing the current score during a turn. I decided to utilize Websockets to reduce the update time. WebSockets utilize a persistent two-way connection in order to support low latency updates. This change required extending my AWS backend and streaming the data in the frontend Flutter app.


## Using WebSocket API in API Gateway

The first step to implement WebSockets in AWS was to create a new API in API Gateway. This is an "AWS::ApiGatewayV2::Api" type in the Cloudformation template as shown below:
~~~
  FamousFishbowlWebSocket:
    Type: AWS::ApiGatewayV2::Api
    Properties:
      Name: FamousFishbowlWebSocket
      ProtocolType: WEBSOCKET
      RouteSelectionExpression: "$request.body.action"
~~~


## Incorporating WebSocket in Flutter app


## References

[Link to GitHub project] (https://github.com/Jambdy/famous-fishbowl-backend/tree/d5ba076f8c07b65c3c4cf8d82aa69d268d4670fe)


https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-overview.html

https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html