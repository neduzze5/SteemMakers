const IMG_PROXY = 'https://steemitimages.com/0x0/';
const IMG_PROXY_PREVIEW = 'https://steemitimages.com/600x800/';

//export const MAXIMUM_UPLOAD_SIZE = 52428800;
//export const MAXIMUM_UPLOAD_SIZE_HUMAN = filesize(MAXIMUM_UPLOAD_SIZE);

function getProxyImageURL(url, type)
{
  if (type === 'preview')
  {
    return `${IMG_PROXY_PREVIEW}${url}`;
  }
  
  return `${IMG_PROXY}${url}`;
};