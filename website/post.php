<!DOCTYPE html>
<html lang="en">
	<head>
		<?php include("./src/globalhead.php"); ?>

		<script src="https://cdn.jsdelivr.net/remarkable/1.7.1/remarkable.min.js"></script>
		<script src="https://cdn.steemjs.com/lib/latest/steem.min.js"></script>


		 <script type="text/javascript" src="js/steem.js?filever=<?php echo filesize('./js/steem.js')?>"></script> 
		
	</head>
	<body class="bg-secondary">
		<?php include("navbar.php"); ?>
		<div id="app"></div>
		<?php include("footer.php"); ?>
	</body>
	<script src="./dist/build.js"></script>
</html>