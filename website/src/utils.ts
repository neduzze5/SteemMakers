import {htmlReady} from './htmlReady'
declare var Remarkable:any;

steem.api.setOptions({ url: 'https://api.steemit.com' });

export function createPostHtml (author: string, permlink: string) : void
{
	steem.api.getContent(author, permlink, function(err, post)
	{
		if(!err && post.body !== "")
		{
			// Remove html comments to preventapi invalid result causing by for example only open tag and no close tag
			var parsedBody = post.body.replace(/<!--([\s\S]+?)(-->|$)/g, '(html comment removed: $1)');

			// Don't understand why
			parsedBody = parsedBody.replace(/^\s+</gm, '<');

			var remarkable = new Remarkable(
			{
				html: true, // remarkable renders first then sanitize runs...
				breaks: true,
				linkify: false, // linkify is done locally
				typographer: false, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
				quotes: '“”‘’',
			});

			parsedBody = remarkable.render(parsedBody);

			const htmlReadyOptions = { mutate: true, resolveIframe: true };
			var htmlified: any;
			if (parsedBody)
			{
				htmlified = htmlReady(parsedBody);
			}

	// 		parsedBody = htmlReady(parsedBody, htmlReadyOptions);
	// 		parsedBody = parsedBody.replace(dtubeImageRegex, '');
	// 		parsedBody = sanitizeHtml(parsedBody, sanitizeConfig({}));
			
			parsedBody = "";
		}
	});
}