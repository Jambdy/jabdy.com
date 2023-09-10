function getContent(id){  
	/* Query stored content in DynamodDB table
	   Implemented to prevent content appearing in search engines */	
	console.log("Hello James1");  
	//$( "#content_main" ).text("hefjlkdj");
	$.get( "https://s3boc3luof.execute-api.us-east-1.amazonaws.com/prod/items/"+id, function( data ) {
		$( "#content_main" ).html(data.Content);
	});
}  