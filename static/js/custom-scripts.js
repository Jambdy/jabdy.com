function getContent(id){  
	/* Query stored content in DynamodDB table
	   Implemented to prevent content appearing in search engines */
	let pw = prompt("Please enter password");
    $.get( "https://zxzx0j2dth.execute-api.us-east-1.amazonaws.com/prod/items/"+id+"?password="+pw, function( data ) {
        $( "#content_main" ).html(data.Content.S);
    });
}  