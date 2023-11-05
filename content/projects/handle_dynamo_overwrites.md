+++
title = "Handle Overwrites"
description = "Avoid stale updates in DynamoDB using List Append and Condition Expressions" 
tags = [
"AWS",
"Personal Project",
"Famous Fishbowl"
]
date = 2023-11-04
author = "James Abdy"
+++

<div style="margin-bottom:40px">
<img class="center" style="width:400px; margin-bottom:0px" src="/img/handle_stale_updates/stale_bread.jpg">
<div style="text-align: center; font-size: 10px;" >No one likes stale bread or stale data</div>
</div>


For my simple game app, Famous Fishbowl, I need to allow multiple users to update the game state (e.g., adding names to guess, starting turns, etc.). These updates introduce the possibility of conflicts that may overwrite other users' actions. In this post, I will describe the actions I took to mitigate this risk.

## Prior Implementation

The initial implementation of the game state update just used the DynamoDB put_item method to naively replace the entire game record with the game record updated by a user action (shown below).

~~~
table.put_item(
Item={
    'id': request_json['id'],
    'state': request_json['state'],
    'creationTime': request_json['creationTime'],
    'completionTime': request_json['completionTime'],
    'categories': request_json['categories'],
    'names': request_json['names'],
    'round': request_json['round'],
    'curTeam': request_json['curTeam'],
    'teamScores': request_json['teamScores'],
    'timeRemaining': request_json['timeRemaining'],
    'turnResumeTime': request_json['turnResumeTime']
}
)
~~~

Within the app, the client polls the server every 5 seconds to get the latest version of the game. Problems arise when multiple users make updates before a new version of the game record is retrieved, with the latest user action overwriting the previous user action. There are two main examples where this could occur, each with different solutions.

## List Append for Name Updates

When users start a game, they are prompted to enter names that will be guessed later as shown in the screenshot below:

<img class="center" style="width:300px" src="/img/handle_stale_updates/add_names.png">

Names can be entered concurrently by multiple users. With the previous implementation, users submitting names within a short time window could cause overwrites. The correct behavior is to append the new set of names to the existing names list. This is accomplished with the list_append update expression shown in the code snippet below:

~~~
update_string = 'SET #names = list_append(#names, :names)'
expression_values = {
    ':names': request_json['names']
}
expression_names = {
    '#names': 'names'
}

table.update_item(
    Key={
        'pk': 'gameInstance',
        'sk': id_str
    },
    UpdateExpression=update_string,
    ExpressionAttributeNames=expression_names,
    ExpressionAttributeValues=expression_values
)
~~~

As one would expect, this operation works with DynamoDB attributes defined with the List type. The attribute name is identified in the ExpressionAttributeNames parameter, and the passed value is set in ExpressionAttributeValues.

## Condition Expressions for Turn Starts

The other primary scenario that could result in conflicting updates is when two users attempt to start a turn simultaneously. Only one player should be able to view names/give clues at a time, while the other players should see the turn-in-progress screen shown below:

<img class="center" style="width:300px" src="/img/handle_stale_updates/wait_turn.png">

Again due to timing issues, it was possible for two users to initiate the start turn action at the same time (admittedly this is more of an edge case than the add names scenario since this game is designed for local multiple player and presumably players would know who is going next). To handle this I utilized the ConditionExpression option for the DynamoDB update_item method.

ConditionExpression will reject an update unless the specified condition is met. In this case, the condition is that the stored lastUpdateTime attribute for the game record is less than or equal to the lastUpdateTime stored on the client. This ensures that the new update does not overwrite a previous update that was not loaded onto the client. The code snippet below demonstrates this implementation:

~~~
table.update_item(
    Key={
        'pk': 'gameInstance',
        'sk': id_str
    },
    ExpressionAttributeNames=expression_names,
    ExpressionAttributeValues=expression_values,
    UpdateExpression=update_string,
    ConditionExpression='attribute_not_exists(#lastUpdateTime) OR #lastUpdateTime <= :lastUpdateTime',
    ReturnValuesOnConditionCheckFailure='ALL_OLD'
)
~~~

If the update is stale, the stored game record will be returned in the response when the ReturnValuesOnConditionCheckFailure parameter is set to 'All_OLD'. The game state on the client is then updated with the latest version excluding the rejected update. I made some API calls on the client synchronous to support this behavior, ensuring that the game screens would not progress until a non-stale update was confirmed.

## Future State

I will replace the polling approach with web sockets to support real time updates and limit the possibility of conflicts. There will probably still be some overwrites, so the steps that were described in this post are still applicable.

## References

[Link to GitHub project] (https://github.com/Jambdy/famous-fishbowl-backend/tree/d5ba076f8c07b65c3c4cf8d82aa69d268d4670fe)


https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html#Expressions.UpdateExpressions.SET.UpdatingListElements

https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html