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
		<div class="container">
			<?php
				require_once('./src/database.php'); 
				require_once('./src/paginator.php'); 
				$database = new Database();
				
				$query = "SELECT name, p.permlink FROM (SELECT * FROM approved_posts) p INNER JOIN users u ON p.author_id = u.id ORDER BY p.reviewed_on DESC";

				$limit = ( isset( $_GET['limit'] ) ) ? $_GET['limit'] : 10;
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
		<?php include("footer.php"); ?>
	</body>
</html>
