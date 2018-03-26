<?php
	require_once('./src/utils.php');

	function addActiveClass($page)
	{
		if($_SERVER['PHP_SELF'] == $page)
		{
			echo " active"; 
		}
	}
?>

<nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
	<div class="container"> 
		<img src="img/logo.png" width="40" height="40" style="margin:5px;">
		<a class="navbar-brand" href="https://www.steemmakers.com" style="font-family: 'Rajdhani', sans-serif; font-size: 40px; line-height:40px; font-weight: 700; font-style: normal;">
			SteemMakers
		</a>
		<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarResponsive">
			<ul class="navbar-nav ml-auto navbar-items-bottom">
				<li class="nav-item<?php addActiveClass('/index.php'); ?>">
					<a class="nav-link" href="index.php">Home</a>
				</li>
				<li class="nav-item<?php addActiveClass('/blog.php'); ?>">
					<a class="nav-link" href="blog.php">Blog</a>
				</li>
				<li class="nav-item dropdown">
					<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						Info
					</a>
					<div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
						<a class="dropdown-item<?php addActiveClass('/about.php'); ?>" href="about.php">About</a>
						<a class="dropdown-item<?php addActiveClass('/faq.php'); ?>" href="faq.php">FAQ</a>
						<a class="dropdown-item<?php addActiveClass('/steemmakersdelegation.php'); ?>" href="steemmakersdelegation.php">Delegate to us</a>
						<a class="dropdown-item<?php addActiveClass('/steemmakerstrail.php'); ?>" href="steemmakerstrail.php">Follow our trail</a>
					</div>
				</li>
				<li class="nav-item<?php addActiveClass('/contact.php'); ?>">
					<a class="nav-link" href="contact.php">Contact</a>
				</li>
				<?php
					if(IsLoggedOnUser())
					{
						echo 
						'<li class="nav-item dropdown">
							<a class="nav-link dropdown-toggle" href="#" id="accountName" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></a>
							<div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">';
						if(IsAuthorizedReviewer())
						{
							echo '		<a class="dropdown-item" href="addpost.php">Add post</a>';
						}
						echo
						'		<a class="dropdown-item" href="#" id=\'logout\' onclick="Logout();return false;">Logout</a>
							</div>
						</li>
						<li class="nav-item d-none d-md-block"><img src="" id="profileImage" height="40" width="40" style="margin-right: 10px; border-radius: 5px;"></li>';
					}
					else
					{
						echo 
						'<li class="nav-item dropdown">
							<a class="nav-link" href="" id=\'login\'>Login</a>
						</li>';
					}
				?>
			</ul>
		</div>
	</div>
</nav>
<script>SetProfileInfo();</script>