<!DOCTYPE html>
<html lang="en">

	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

		<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js" integrity="sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh" crossorigin="anonymous"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js" integrity="sha384-alpBpkh1PFOepccYVYDB4do5UnbKysX5WZXm3XxPqe5iKTfUKjNkCk9SaVuEZflJ" crossorigin="anonymous"></script>
		<script src="https://cdn.steemjs.com/lib/latest/steem.min.js"></script>

		<script src="https://cdn.jsdelivr.net/remarkable/1.7.1/remarkable.min.js"></script>

		<script type="text/javascript" src="js/script.js?t=1234"></script> 
		<script type="text/javascript" src="js/image.js"></script>
		<script type="text/javascript" src="js/body.js"></script>
		<link href="css/bootstrap.min.css" rel="stylesheet"> 
		<link href="css/main.css" rel="stylesheet"> 
	</head>
	<body class="bg-secondary">
		<nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
			<div class="container">
				<a class="navbar-brand" href="https://www.steemmakers.com">SteemMakers</a>
				<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse" id="navbarResponsive">
					<ul class="navbar-nav ml-auto">
						<li class="nav-item active">
							<a class="nav-link" href="#">Home<span class="sr-only">(current)</span></a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="about.html">About</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="blog.html">Blog</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="contact.html">Contact</a>
						</li>
					</ul>
				</div>
			</div>
		</nav>
		<div class="container">
			<?php
				require_once('./src/database.php'); 
				require_once('./src/paginator.php'); 
				$database = new Database();
				
				$query = "SELECT name, p.permlink FROM (SELECT * FROM approved_posts ORDER BY voted_on DESC) p INNER JOIN users u ON p.author_id = u.id ORDER BY p.voted_on DESC";

				$limit = ( isset( $_GET['limit'] ) ) ? $_GET['limit'] : 5;
				$page = ( isset( $_GET['page'] ) ) ? $_GET['page'] : 1;
				$links = 3;

				$paginator = new Paginator( $database, $query );
				$results = $paginator->getData( $limit, $page );
				for ($i = 0; $i < count($results->data); $i++)
				{
					echo '<div class="row" id="article',$i,'">';
					echo '<div class="spinner" id="spinner',$i,'" style="float: none; margin: 0 auto;"></div>';
					echo '<script>';
					echo '  storyPreview(',$i,', \'',$results->data[$i]['name'],'\', \'',$results->data[$i]['permlink'],'\');';
					echo '</script>';
					echo '</div>';
				}
			?>
		</div>
		<div class="text-center">
			<div class="d-inline-block">
				<?php
					echo $paginator->createLinks( $links );
				?>
			</div>
		</div>
		<footer class="navbar-dark bg-primary fixed-bottom">
			<div class="container">
				<p class="text-center text-light">Copyright &copy; SteemMakers 2017 - A community driven project founded by <a href="http://www.steemit.com/@jefpatat" class="text-white" style="text-decoration: underline;">@jefpatat</a>.<br/>
					Our gratitude goes to of <a href="courtesy.html" class="text-white" style="text-decoration: underline;">all these nice people</a>.
				</p>
			</div>
		</footer>
	</body>
</html>
