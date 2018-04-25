import * as sanitize from 'sanitize-html';
import {prepareHTML} from './vendor/prepareHTML'
declare var Remarkable:any;

steem.api.setOptions({ url: 'https://api.steemit.com' });

export function createPostHtml (author: string, permlink: string, callback: (error :string|null, result :BlogEntry) => void) : void
{
	steem.api.getContent(author, permlink, function(err, post)
	{
		let result = {} as BlogEntry;

		if(!err && post.body !== "")
		{
			// Remove html comments to preventapi invalid result causing by for example only open tag and no close tag
			let parsedBody = post.body.replace(/<!--([\s\S]+?)(-->|$)/g, '(html comment removed: $1)');

			// Don't understand why
			parsedBody = parsedBody.replace(/^\s+</gm, '<');

			var remarkable = new Remarkable(
			{
				html: true,
				breaks: true,
				linkify: false, // linkify is done in prepareHTML
				typographer: false, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
				quotes: '“”‘’',
			});

			parsedBody = remarkable.render(parsedBody);

			parsedBody = prepareHTML(parsedBody);

			let options: sanitize.IOptions = 
			{
				allowedTags: [
					'iframe', 'div',
					'a', 'p', 'b', 'i', 'q', 'br', 'ul', 'li', 'ol', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr',
					'blockquote', 'pre', 'code', 'em', 'strong', 'center', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
					'strike', 'sup', 'sub'],
				allowedAttributes:
				{
					a: ['href', 'rel', 'title'],
					img: ['src', 'alt'],
					div: ['class'],
					iframe: [
						'src',
						'width',
						'height',
						'frameborder',
						'allowfullscreen',
						'webkitallowfullscreen',
						'mozallowfullscreen',
					],
				},
				transformTags: {
					a: (tagName: string, attribs: sanitize.Attributes) => 
					{
						let title = '';
						let href = attribs.href;
						if (!href)
						{
							href = '#';
						}
						href = href.trim();
						if (!href.match(/^https:\/\/steemmakers.com/))
						{
							title = 'This link will take you away from steemmakers.com';
						}
						return {
							tagName: 'a',
							attribs: 
							{
								href: href,
								rel: 'noopener',
								title: title
							},
						};
					},
					div: (tagName: string, attribs: sanitize.Attributes) =>
					{
						return {
							tagName: 'div',
							attribs: 
							{
								class: attribs.class.indexOf('videoWrapper') !== -1 ? 'videoWrapper' : '',
							},
						};
					},
					iframe: (tagName: string, attribs: sanitize.Attributes) =>
					{
						let sourceAttribute = attribs.src;

						if(sourceAttribute)
						{
							let matches = sourceAttribute.match(/^(https?:)?\/\/www.youtube.com\/embed\/.*/i);
							if(matches)
							{
								sourceAttribute.replace(/\?.+$/, ''); // strip query string (autoplay, controls, showinfo, etc)
							}

							return {
								tagName: 'iframe',
								attribs:
								{
									frameborder: '0',
									allowfullscreen: 'allowfullscreen',
									src: sourceAttribute,
									width: '480',
									height: '270',
								},
							};
						}

						return { tagName: 'p', text: `(Unsupported iframe element)`, attribs };
					},
					img: (tagName: string, attribs: sanitize.Attributes) => 
					{
						if (!/^(https?:)?\/\//i.test(attribs.src))
						{
							return {
								tagName: 'img',
								attribs: 
								{
									src: '',
									alt: 'suspicious image',
								}
							};
						}
			
						// replace http:// with // to force https when needed
						let src = attribs.src.replace(/^http:\/\//i, '//');
						let alt = attribs.alt;
						return {
							tagName: 'img',
							attribs: 
							{
								src: src,
								alt: attribs.alt ? attribs.alt : '',
							}
						};
					},
				},
			};

			parsedBody = sanitize(parsedBody, options);
			parsedBody.replace('<code>', '<pre><code>');
			parsedBody.replace('</code>', '</code></pre>');

			result.author = post.author;
			result.body = parsedBody;
			result.created = new Date(post.created + '.000Z');
			result.title = post.title;
			result.url = post.url;

			callback(null, result);
		}
		else
		{
			callback(err, result);
		}
	});
}