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

		<script type="text/javascript" src="js/script.js"></script> 
		<script type="text/javascript" src="js/image.js"></script>
		<script type="text/javascript" src="js/body.js"></script>
		<link href="css/bootstrap.min.css" rel="stylesheet"> 
		<link href="css/main.css" rel="stylesheet">
		<script type="text/javascript">

		</script>
	</head>
	<body class="bg-secondary">
		<?php include("navbar.php"); ?>
		
		<div class="container" style="width: 75%;">
			<form id="addArticle" action="submitpost.php">
				<div class="form-group">
					<input type="text" class="form-control" placeholder="Article link" id="linkBox">
					<button type="button" class="btn btn-primary" id="ParseLinkButton">Parse link</button>
				</div>
				<div class="form-group">
					<input type="text" class="form-control" placeholder="Author" id="authorBox" name="author">
					<input type="text" class="form-control" placeholder="Permlink" id="permLinkBox" name="permlink">
					<button type="button" class="btn btn-primary" id="GeneratePreviewButton">Validate</button>

					<div class="form-group" id="article1" style="display: none">
						<div class="spinner" id="spinner1" style="float: none; margin: 0 auto;"></div>
					</div>
					
				</div>
				<div class="form-group" id="categoryselector">
					<label class="radio-inline"><input type="radio" name="category" value="makers" id="MakersRadio" checked>Makers</label>
					<label class="radio-inline"><input type="radio" name="category" value="diy" id="DIYRadio">DIY</label>
				</div>
				<div id="keywordCheckBoxes">
				<?php
					require_once('./src/database.php');

					$database = new Database();
						
					$query = "SELECT name FROM keywords_categories INNER JOIN keywords ON keywords_categories.keywords_id=keywords.id WHERE categories_id=1";
					$queryResult = $database->select($query);
					echo '<div class="form-group" id="makerscheckboxes">';
					for ($i = 0; $i < count($queryResult); $i++)
					{
						echo
						'<div class="form-check">
							<label class="form-check-label" for="defaultCheck1"><input class="form-check-input" type="checkbox" name="keywords[]" value="',$queryResult[$i]['name'],'" id="defaultCheck1">',$queryResult[$i]['name'],'</label>
						</div>';
					}
					echo '</div>';
					$query = "SELECT name FROM keywords_categories INNER JOIN keywords ON keywords_categories.keywords_id=keywords.id WHERE categories_id=2";
					$queryResult = $database->select($query);
					echo '<div class="form-group" id="diycheckboxes" style="display: none">';
					for ($i = 0; $i < count($queryResult); $i++)
					{
						echo
						'<div class="form-check">
							<label class="form-check-label" for="defaultCheck1"><input class="form-check-input" type="checkbox" value="" id="defaultCheck1">',$queryResult[$i]['name'],'</label>
						</div>';
					}
					echo '</div>';

				?>
				</div>

				<button type="submit" class="btn btn-primary">Submit</button>
			</form>
			<div id="form-messages"></div>
		</div>

		<?php include("footer.php"); ?>


		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/js/bootstrap.min.js" ></script>

		<script>
			$(function ()
			{
				$('#ParseLinkButton').on('click', function (e)
				{
					var regex = new RegExp("(?<=@)(.*)(\/)(.*)");
					var matched = regex.exec($('#linkBox').val());

					if(matched.length === 4)
					{
						$('#authorBox').val(matched[1]);
						$('#permLinkBox').val(matched[3]);
					}

					return false;
				});

				$('#GeneratePreviewButton').on('click', function (e)
				{
					$('#article1').toggle();
					storyPreview(1, $('#authorBox').val(), $('#permLinkBox').val());

					return false;
				});

				$("#categoryselector :input").change(function()
				{
					$('#keywordCheckBoxes').find('input:checkbox').prop('checked', false);
					if($("#DIYRadio").is(':checked'))
					{
						$('#diycheckboxes').show();
						$('#makerscheckboxes').hide();
					}
					else
					{
						$('#diycheckboxes').hide();
						$('#makerscheckboxes').show();
					}
					return false;
				});

				//$('#addArticle').validator();

				$('#addArticle').submit(function(event)
				{
					event.preventDefault();
					var formData = $('#addArticle').serialize();

					$.ajax(
					{
						type: 'POST',
						url: $('#addArticle').attr('action'),
						data: formData
					})
					.done(function(response)
					{
						$('#form-messages').removeClass('error');
						$('#form-messages').addClass('success');

						$('#form-messages').text(response.message);

						$('#linkBox').val('');
						$('#authorBox').val('');
						$('#permLinkBox').val('');
						$('#keywordCheckBoxes').find('input:checkbox').prop('checked', false);
					})
					.fail(function(data)
					{
						$('#form-messages').removeClass('success');
						$('#form-messages').addClass('error');

						if (data.responseText !== '')
						{
							$('#form-messages').text(data.responseText);
						}
						else
						{
							$('#form-messages').text('Oops! An error occured and your entry was not added.');
						}
					});
				});
			});
		</script>

	</body>
</html>
