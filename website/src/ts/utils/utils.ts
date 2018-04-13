import * as sanitize from 'sanitize-html';
import {prepareHTML} from './vendor/prepareHTML'
declare var Remarkable:any;

steem.api.setOptions({ url: 'https://api.steemit.com' });

export function createPostHtml (author: string, permlink: string, callback: (error :string|null, body :string) => void) : void
{
	steem.api.getContent(author, permlink, function(err, post)
	{
		if(!err && post.body !== "")
		{
			// Remove html comments to preventapi invalid result causing by for example only open tag and no close tag
			let parsedBody = post.body.replace(/<!--([\s\S]+?)(-->|$)/g, '(html comment removed: $1)');

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

			var htmlified: any;
			if (parsedBody)
			{
				htmlified = prepareHTML(parsedBody);
			}

			parsedBody = prepareHTML(parsedBody);


			let options: sanitize.IOptions = 
			{
				allowedTags: sanitize.defaults.allowedTags.concat(
					'a', 'p', 'b', 'i', 'q', 'br', 'ul', 'li', 'ol', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr',
					'blockquote', 'pre', 'code', 'em', 'strong', 'center', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
					'strike', 'sup', 'sub'),
				allowedAttributes:
				{
					img: ['src', 'alt'],
					a: ['href'],
				},
			};

			parsedBody = sanitize(parsedBody, options);

			parsedBody = `<h1>${post.title}</h1>` + parsedBody;

			callback(null, parsedBody);
		}
		else
		{
			callback(err, '');
		}
	});
}