// Based on https://github.com/steemit/condenser/blob/66035f18dcbd3a67d5550e6828ea298c6df80d01/src/shared/HtmlReady.js

import {local} from './links';

export function htmlReady(html: string)
{
	try
	{
		var div = document.createElement('div');
		div.innerHTML = html.trim();

		Traverse(div);
		ProxifyImages(div);
	
		return div;
	}
	catch (error)
	{
		// Not Used, parseFromString might throw an error in the future
		console.error(error.toString());
		return null;
	}
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
			// TODO
			//else if (child.nodeName === '#text') linkifyNode(child, state);
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
			iFrameNode.parentElement.replaceChild((new DOMParser).parseFromString(`<div class="videoWrapper">${html}</div>`, "text/xml"), iFrameNode);
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
		if (url && !local().test(url))
		{
			//element.setAttribute('src', proxifyImageUrl(url, true));
		}
	}
}