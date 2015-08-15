/**
 * Search movies by actor
 */
function  searchMoviesByActor()
{
	var actor = document.getElementById('search-movie').value;
	jQuery("#search-movie").val("");
	if(!(0 === $.trim(actor).length))
	{
		$( "#alert" ).remove();
		
		$.ajax({
			type: "POST",
			url: 'php/layer.php',
			dataType: 'json',
			async: false,
			data: {query: "http://api.themoviedb.org/3/search/person?query="+actor.replace(" ","%20")+"&api_key=66ddf266d5a95c3d2f0e4637fe6e9a36&sort_by=release_date.desc"},
			success: function(data){
							showMoviesByActor(data)
						}
		});
	}	
	else
	{
		$("<div id='alert' class='alert alert-danger '>"+
		  "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>"+
		  "<strong>Please fill the actor.</strong></div>").insertBefore( "#container" );	
	}
}

/**
 * Search movies released in the last week
 */
function  searchMoviesByActualWeek()
{
	var today = new Date();
    var lastWeek = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate() - 7);
		
	$.ajax({
		type: "POST",
		url: 'php/layer.php',
		dataType: 'json',
		data: {query: "http://api.themoviedb.org/3/discover/movie?primary_release_date.gte="+
			lastWeek.getFullYear()+"-"+lastWeek.getMonth()+"-"+lastWeek.getDate()+"&primary_release_date.lte="+
			today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate()+"&api_key=b039c5475dd61fb3fe2f3ceebcd67ae6"},

		success: function(data){
						showLoadMovies(data, "New Movies")
					}
	});	
}

/**
 * Search movie information ( image, description, reselase date and video) 
 * by movie identificator
 * @param {Number} id 
 * @return {String} result
 */
function  searchMovieById(id)
{
	var result = "";
	
	$.ajax({
		type: "POST",
		url: 'php/layer.php',
		dataType: 'json',
		async: false,
		data: {query: "http://api.themoviedb.org/3/movie/"+id+"?api_key=b039c5475dd61fb3fe2f3ceebcd67ae6"},
		success: function(data){
						result = detail(data);
					}
	});
	
	$.ajax({
		type: "POST",
		url: 'php/layer.php',
		dataType: 'json',
		async: false,
		data: {query: "http://api.themoviedb.org/3/movie/"+id+"/videos?api_key=b039c5475dd61fb3fe2f3ceebcd67ae6"},
		success: function(data){
						result += video(data);
					}
	});
	
	return result;
}

/**
 * Buid and set the view from the list of movies where the actor’s name appears sort by chronological order.
 * @param {Json} movies 
 */
function showMoviesByActor(movies)
{
	// Clean the div body_content container
	jQuery("#body_content").empty();
	var result = "<h2><b>Search Results:</b></h2>";  
	var title;
	var image;
	var vote;
	if(0 == movies.total_results) 
	{
		result += "<p><b>Sorry, no results found.</b></p>";  
	}
	
	// verify if have results
	if(movies!=null && movies.results!=null) {
		
		for(var i = 0; i < movies.results.length; i++)	{
			result += "<div class='row'>";
			result += "<h3>"+movies.results[i].name+"</h3>";				
			
			for(var j = 0; j < movies.results[i].known_for.length; j++) {
				result += "<div class='col-lg-4'>"; 	
				title = "No title";
				image = "images/image_not_found.jpg";
				vote = "0";				
								
				if(movies.results[i].known_for[j].poster_path != null)
				{
					image = "https://image.tmdb.org/t/p/w130"+movies.results[i].known_for[j].poster_path;
				}
				
				if(movies.results[i].known_for[j].original_title != null)
				{
					title = movies.results[i].known_for[j].original_title;
				}
				
				if(movies.results[i].known_for[j].vote_average != null)
				{
					vote = movies.results[i].known_for[j].vote_average;
				}
				
				result += "<img class='img-circle'  src='"+image+"' alt='"+title+"' width='170' height='170' />"+		
						  "<h3>"+title+"</h3>"+
						  "<p> Votes Average: "+vote+"</p>"+
						  "<p><a class='btn btn-default' href=\"javascript:lightbox(lightbox_details("+movies.results[i].known_for[j].id+"));\" role='button'>View details »</a></p></div>";
			} 			
			result += "</div>";
		}
		
	// Set the new content to div body_content
	jQuery("#body_content").html(result);
	} 
}

/**
 * Buid and set the view from the list of movies in theaters sort by chronological order.
 * @param {Json} movies 
 * @param {String} header 
 */
function showLoadMovies(movies,header)
{
	// Clean the div body_content container
	jQuery("#body_content").empty();
	
	var title;
	var image;
	var vote;
	
	// verify if have results
	if(movies!=null && movies.results!=null) {
		var result = "<h3>"+header+"</h3>";
		result += "<div class='row'>";
		for(var i = 0; i < movies.results.length; i++)	{
			
			title = "No title";
			image = "images/image_not_found.jpg";
			vote = "0";
			
			result += "<div class='col-lg-4'>"; 			
				
			if(movies.results[i].poster_path != null)
			{
				image = "https://image.tmdb.org/t/p/w130"+movies.results[i].poster_path;
			}
				
			if(movies.results[i].original_title != null)
			{
				title = movies.results[i].original_title;
			}
			
			if(movies.results[i].vote_average != null)
			{
				vote = movies.results[i].vote_average;
			}	
			
		   result += "<img class='img-circle'  src='"+image+"' alt='"+title+"' width='170' height='170' />"+		
						  "<h3>"+title+"</h3>"+
						  "<p> Votes Average: "+vote+"</p>"+
						  "<p><a class='btn btn-default' href=\"javascript:lightbox(lightbox_details("+movies.results[i].id+"));\" role='button'>View details »</a></p></div>";
		}
			result += "</div>";
	// Set the new content to div body_content
	jQuery("#body_content").html(result);
	} 
}

/**
 * Load the first view of movies.
 */
$("#body_content").ready(
function load()
{
	searchMoviesByActualWeek();
});

/**
 * Capture the keydown event.
 * @param {event} e 
 */
function keydown(e)
{
    if (e.keyCode == 13) {
		searchMoviesByActor();		
	}   
}

/**
 * Return the lightbox content.
 * @param {Number} id 
 * @return {String} movieDetails
 */
function lightbox_details(id)
{	
	var movieDetails = searchMovieById(id);
	return movieDetails;   
}

/**
 * Build the view for movie details (image and overview).
 * @param {Json} movie 
 * @return {String} Movie details
 */
function detail(movie)
{	
	var result;
	var title = "No title";
	var image = "images/image_not_found.jpg";
	var date = "No Release Date";
	
	if(movie.poster_path != null)
	{
		image = "https://image.tmdb.org/t/p/w130"+movie.poster_path;
	}
		
	if(movie.original_title != null)
	{
		title = movie.original_title;
	}
	
	if(movie.release_date != null)
	{
		date = movie.release_date;
	}	
	
	return "<table><tr><td><img src='"+image+"' alt='"+title+"' width='200' height='300' /></td><td>"+
		   "<h2>"+title+"</h2></br>"+
		   movie.overview+" </br>"+		 
		   "Release Date: "+movie.release_date+"</td></tr>";
}

/**
 * Build the view for movie details (Video).
 * @param {Json} movie 
 * @return {String} Movie details
 */
function video(movie)
{	
	var result ="</table>";
	//verify if have results and trailer
	if(movie != null && movie.results !=null && movie.results.length > 0) 
	{
		result = "<tr><td colspan='2'></br><embed id='"+movie.results[0].id+"' style='position: absolute; top:300; left: 0;' width='100%' height='100%' frameborder='0' "+
		"webkitallowfullscreen mozallowfullscreen allowfullscreen allowfullscreen='false' allowscriptaccess='always' quality='high' bgcolor='#000000' name='"+movie.results[0].id+"' "+
		"src='http://www.youtube.com/v/"+movie.results[0].key+"?enablejsapi=1&version=3&playerapiid=ytplayer' type='application/x-shockwave-flash'><td></tr></table>";   
	}
  return result;
}
