<?php
	require_once('../src/database.php'); 

	function IsAuthorizedReviewer()
	{
		$verifiedUser = false;
		$authenticatedUser = false;

		if(isset($_COOKIE["username"]) && isset($_COOKIE["access_token"]))
		{
			$username = $_COOKIE["username"];
			$access_token = $_COOKIE["access_token"];

			$json_url = "https://steemconnect.com/api/me?access_token=".$access_token;
			$content = @file_get_contents($json_url);
			if($content !== FALSE)
			{
				$data = json_decode($content, TRUE);
				if($username = $data['user'])
				{
					$database = new Database();
						
					$query = "SELECT enabled FROM reviewers INNER JOIN users ON reviewers.user_id=users.id WHERE name = '".$username."'";
					$queryResult = $database->select( $query );
		
					if (count($queryResult) > 0)
					{
						if($queryResult[0]['enabled'] === "1")
						{
							return true;
						}
					}
				}
				else
				{
					return false;
				}
			}
		}
		else
		{
			return false;
		}
	}
?>