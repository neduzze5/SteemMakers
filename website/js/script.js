function fillBlogEntries(username)
{
    steem.api.getDiscussionsByBlog({tag: username, limit: 20}, function(err, blog) 
        {
          console.log(blog);
            var blogContainer = $('#blog');
            for (var i = 0; i < blog.length; i++) 
            {
                blogContainer.append('<div><a target="_blank" href="https://steemit.com' + 
                    blog[i].url + '">'+ blog[i].created + ' ' + blog[i].title  + '</div></a>');
            }
        });
}

function generatePreview(article, post)
{
  const jsonMetadata = JSON.parse(post.json_metadata);
  let imagePath = '';
  bodyText = '';

  if (jsonMetadata.image && jsonMetadata.image[0])
  {
    imagePath = getProxyImageURL(jsonMetadata.image[0], 'preview');
  }
  else
  {
    const bodyImg = post.body.match(image());
    if (bodyImg && bodyImg.length)
    {
      imagePath = getProxyImageURL(bodyImg[0], 'preview');
    }
  }

  bodyText = post.body.replace(/(!\[.*?\]\()(.+?)(\))/g, '');
  bodyText= bodyText.replace(/<\/?[^>]+(>|$)/g, '');
  bodyText= bodyText.replace(/\[([^\]]+)\][^\)]+\)/g, '$1')

  const preview =
  {
    image: () => `<div class="blog-image col-md-2">
                    <img src="`+ imagePath + `">
                  </div>`,
    text: () => `<div class="col-md-10">
                    <h5 class="font-weight-bold" style="margin-top:5px;">` + post.title + `</h5>
                    <div class="multiline-ellipsis">
                      <p>` + bodyText + `</p>
                    </div>
                    <a href="https://steemit.com` + post.url + `" target="_blank"><img class="media-button" src="img/steemit.png"></a>
                    <a href="https://busy.org` + post.url + `" target="_blank"><img class="media-button" src="img/busy.png"></a>
                  </div>`,
  };

  const bodyData = [];

  bodyData.push(preview.image());
  bodyData.push(preview.text());

  result = getHtml(post.body, {}, 'text')

  $("#spinner" + article).hide();
  $("#article" + article).append(bodyData);
}

function storyPreview ( article, author, permlink )
{
    var test = steem.api.getContent(author, permlink, function(err, post)
    {
       var result = generatePreview(article, post);
    });

    return test;
}

fillBlogEntries('jefpatat');