// Based on condenser/src/shared/HtmlReady.js

import {GetLocalURLRegExp, GetAnyURLRegExp, GetAnyImageURLRegExp, GetAnyYouTubeURLRegExp} from './links';
import {proxyfyImageURL} from './image'

let domParser = new DOMParser();

export function prepareHTML(html: string) : string
{
	var div = document.createElement('div');
	div.innerHTML = html.trim();

	Traverse(div);
	
	var imageElements = div.getElementsByTagName('img');
	for (var i = 0; i < imageElements.length; i++)
	{
		const url = imageElements[i].getAttribute('src');
		if (url && !GetLocalURLRegExp().test(url))
		{
			imageElements[i].setAttribute('src', proxyfyImageURL(url));
		}
	}

	return div.innerHTML;
}

function Traverse(node: Node)
{	
	if(node instanceof Element)
	{
		var element = node as Element;
		var tag = element.tagName ? element.tagName.toLowerCase() : null;
		switch (tag)
		{
			case 'img':
				{
					let url = element.getAttribute('src');
					if (url)
					{
						if (/^\/\//.test(url))
						{
							// Change relative protocol imgs to https
							url = 'https:' + url;
							element.setAttribute('src', url);
						}
					}
				}
				break;
			case 'iframe':
				{
					let url = element.getAttribute('src');

					if(element.parentElement)
					{
						let tag = element.parentElement.tagName ? element.parentElement.tagName.toLowerCase() : element.parentElement.tagName;
					
						if (tag === 'div' && element.parentElement.getAttribute('class') === 'videoWrapper')
						{
							return;
						}
						else
						{
							var html = (new XMLSerializer()).serializeToString(element);
							let doc = domParser.parseFromString(`<div class="videoWrapper">${html}</div>`, "text/html");
							element.parentElement.replaceChild(doc.body.childNodes[0], element);
						}
					}
				}
				break;
			case 'a':
				{
					let url = element.getAttribute('href');
					if (url)
					{
						// If this link is not http or https -- add https.
						if (!/(https?:)?\/\//.test(url))
						{
							element.setAttribute('href', 'https://' + url);
						}
					}
				}
				break;
		}
	}
	else if (node.nodeName === '#text' && node.parentNode && node.nodeValue)
	{
		let interpretedContent = node.nodeValue;
		interpretedContent = interpretedContent.replace(GetAnyImageURLRegExp(), link =>
		{
			return `<img src="${link}" />`;
		});

		interpretedContent = interpretedContent.replace(GetAnyURLRegExp(), link =>
		{
			let videoID = link.match(/(?:(?:youtube.com\/watch\?v=)|(?:youtu.be\/)|(?:youtube.com\/embed\/))([A-Za-z0-9\_\-]+)/i);
			if(videoID && videoID.length >= 2)
			{
				return `<div class="videoWrapper"><iframe class="videoWrapper" src="https://www.youtube.com/embed/${videoID[1]}"></iframe></div>`;
			}
			else
			{
				return link;
			}
		});

		if(interpretedContent !== node.nodeValue)
		{
			try
			{
				let doc = domParser.parseFromString(`<span>${interpretedContent}</span>`, "text/html");
				node.parentNode.replaceChild(doc.body.childNodes[0], node);
			}
			catch(err)
			{
				console.log(err);
			}
		}
	}

	if(node.firstChild)
	{
		for(var i in node.childNodes)
		{
			Traverse(node.childNodes[i]);
		}
	}
}