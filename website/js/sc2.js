sc2.init(
{
	app: 'steemmakers.app',
	callbackURL: 'http://localhost/loggedin.php',
	//callbackURL: 'https://www.steemmakers.com/loggedin.php',
	scope: ['login'],
});

function SetProfileInfo()
{
	if ($.cookie("access_token") != null)
	{
		sc2.setAccessToken($.cookie("access_token"));
		sc2.me(function (err, result)
		{
			if (!err)
			{
				if(result.account.json_metadata)
				{
					var profileImage = JSON.parse(result.account.json_metadata)['profile']['profile_image'];

					$("#accountName").append(result.account.name);
					if(profileImage)
					{
						$("#profileImage").attr("src", profileImage);
					}
				}
			}
			else
			{
				var loginUrl = sc2.getLoginURL();
				$("#login").attr("href", loginUrl);
			}
		});
	}
	else
	{
		var loginUrl = sc2.getLoginURL();
		$("#login").attr("href", loginUrl);
	}
}

function Logout()
{
	sc2.revokeToken(function (err, result)
	{
		$.removeCookie("access_token", { path: '/' });
		$.removeCookie("username", { path: '/' });
		$.removeCookie("expires_in", { path: '/' });

		location.reload();
	});
}