function getContent(id){  
	/* Query stored content in DynamodDB table
	   Implemented to prevent content appearing in search engines */
	let pw = prompt("Please enter password");
	if(pw === 'MSProjects') {
		$.get( "https://s3boc3luof.execute-api.us-east-1.amazonaws.com/prod/items/"+id, function( data ) {
    		$( "#content_main" ).html(data.Content);
    	});
	}
}  