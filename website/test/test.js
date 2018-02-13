sc2.init(
{
	app: 'steemmakers.app',
	//callbackURL: 'http://localhost/test/loggedin.php',
	callbackURL: 'https://www.steemmakers.com/test/loggedin.php',
	scope: ['login'],
});

function SetProfileInfo()
{
	if ($.cookie("access_token") != null)
	{
		$("#login").hide();
		$("#logout").show();
		sc2.setAccessToken($.cookie("access_token"));
		sc2.me(function (err, result)
		{
			if (!err)
			{
				if(result.account.json_metadata)
				{
					$("#accountName").text(result.account.name);
					$("#accountName").show();
					var profileImage = JSON.parse(result.account.json_metadata)['profile']['profile_image'];

					if(profileImage)
					{
						$("#profileImage").attr("src", profileImage);
						$("#profileImage").show();
					}
				}
			}
		});
	}
	else
	{
		var loginUrl = sc2.getLoginURL();
		$("#login").attr("href", loginUrl);
		$("#login").show();
		$("#logout").hide();
		$("#profileImage").hide();
		$("#accountName").hide();
	}
}

function Logout()
{
	sc2.revokeToken(function (err, result)
	{
		$.removeCookie("access_token", { path: '/' });
		$.removeCookie("username", { path: '/' });
		$.removeCookie("expires_in", { path: '/' });

		SetProfileInfo();
	});
}