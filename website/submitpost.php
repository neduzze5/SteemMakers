<?php

	$okMessage = 'Blog post submitted, thank you!';
	$errorMessage = 'Oops, something went wrong.';

	if (!empty($_POST['author']) &&
		!empty($_POST['permlink']) &&
		!empty($_POST['category']) &&
		!empty($_POST['keywords']))
	{


		try
		{
			// TODO: Add to database
			$responseArray = array('type' => 'success', 'message' => $okMessage);
		}
		catch (\Exception $e)
		{
			$responseArray = array('type' => 'danger', 'message' => $errorMessage);
		}

		// if requested by AJAX request return JSON response
		if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
			$encoded = json_encode($responseArray);

			header('Content-Type: application/json');

			echo $encoded;
		}
		// else just display the message
		else {
			echo $responseArray['message'];
		}
	};
?>