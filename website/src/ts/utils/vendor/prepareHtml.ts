// Based on condenser/src/shared/HtmlReady.js

import {GetLocalURLRegExp, GetAnyURLRegExp, GetImageRegExp} from './links';
import {proxyfyImageURL} from './image'

let domParser = new DOMParser();

export function prepareHTML(html: string) : string
{
	var div = document.createElement('div');
	div.innerHTML = html.trim();

	Traverse(div);
	ProxifyImages(div);

	return div.innerHTML;
}

function Traverse(node: Node)
{	
	if(node instanceof Element)
	{
		var element = node as Element;
		var tag = element.tagName ? element.tagName.toLowerCase() : null;
		if (tag)
		{
			if (tag === 'img') UpdateImage(element);
			else if (tag === 'iframe') UpdateIframe(element);
			else if (tag === 'a') UpdateLink(element);
		}
	}
	else if (node.nodeName === '#text')
	{
		LinkifyNode(node);
	}

	if(node.firstChild)
	{
		for(var i in node.childNodes)
		{
			Traverse(node.childNodes[i]);
		}
	}
}

function UpdateImage(imageElement: Element)
{
	const url = imageElement.getAttribute('src');
	if (url)
	{
		let url2 = url;
		if (/^\/\//.test(url2))
		{
			// Change relative protocol imgs to https
			url2 = 'https:' + url2;
		}
		if (url2 !== url)
		{
			imageElement.setAttribute('src', url2);
		}
	}
}

// wrap iframes in div.videoWrapper to control size/aspect ratio
function UpdateIframe(iFrameNode: Element)
{
	const url = iFrameNode.getAttribute('src');

	if(iFrameNode.parentElement)
	{
		var tag = iFrameNode.parentElement.tagName ? iFrameNode.parentElement.tagName.toLowerCase() : iFrameNode.parentElement.tagName;
	
		if (tag === 'div' && iFrameNode.parentElement.getAttribute('class') === 'videoWrapper')
		{
			return;
		}
		else
		{
			var html = (new XMLSerializer()).serializeToString(iFrameNode);
			iFrameNode.parentElement.replaceChild(domParser.parseFromString(`<div class="videoWrapper">${html}</div>`, "text/html"), iFrameNode);
		}
	}
}

function UpdateLink(linkElement: Element)
{
	const url = linkElement.getAttribute('href');
	if (url)
	{
		// If this link is not relative, http or https -- add https.
		if (!/^\/(?!\/)|(https?:)?\/\//.test(url))
		{
			linkElement.setAttribute('href', 'https://' + url);
		}
	}
}

// For all img elements with non-local URLs, prepend the proxy URL (e.g. `https://img0.steemit.com/0x0/`)
function ProxifyImages(element: Element)
{
	var imageElements = element.getElementsByTagName('img');
	for (var i = 0; i < imageElements.length; i++)
	{
		const url = imageElements[i].getAttribute('src');
		if (url && !GetLocalURLRegExp().test(url))
		{
			imageElements[i].setAttribute('src', proxyfyImageURL(url));
		}
	}
}

function LinkifyNode(node: Node)
{
	if(node)
	{
		if(node.nodeValue)
		{
			let newContents = node.nodeValue.replace(GetAnyURLRegExp(), link =>
			{
				if (GetImageRegExp().test(link))
				{
					return `<img src="${link}" />`;
				}
				else
				{
					return '';
				}
			});

			if(newContents !== node.nodeValue && node.parentNode)
			{
				let doc = domParser.parseFromString(`<span>${newContents}</span>`, "text/html");
				node.parentNode.replaceChild(doc.body.childNodes[0], node);
			}
		}
	}
}