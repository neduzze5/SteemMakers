<!DOCTYPE html>
<html lang="en">
	<head>
		<?php include("./src/globalhead.php"); ?>

		<script src="https://cdn.jsdelivr.net/remarkable/1.7.1/remarkable.min.js"></script>
		<script src="https://cdn.steemjs.com/lib/latest/steem.min.js"></script>
	</head>
	<body class="bg-secondary">
		<?php include("navbar.php"); ?>
		<div class="container article">
			<div class="row">
				<div id="app"></div>
			</div>
		</div>
		<?php include("footer.php"); ?>
	</body>
	<script src="./dist/build.js"></script>
</html>