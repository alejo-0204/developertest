<?php
	/**
	 * Communication layer with the movie database API
	 */
	$ch = curl_init();

	curl_setopt($ch, CURLOPT_URL, $_POST['query']);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
	curl_setopt($ch, CURLOPT_HEADER, FALSE);

	curl_setopt($ch, CURLOPT_HTTPHEADER, array(
	  "Accept: application/json"
	));

	$response = curl_exec($ch);
	curl_close($ch);

	echo $response;

?>