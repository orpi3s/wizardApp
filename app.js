const express = require("express");
const app = express();
const postBank = require("./postBank");
const morgan = require("morgan");

app.use(express.static('public'))


app.get("/", (req, res) => {
  const posts = postBank.list();

  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts.map(post => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span><a href="/posts/${post.id}">${post.title}</a>
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
      ).join('')}
    </div>
  </body>
</html>`;

  res.send(html);
});
//Literally just routes for user clicks
app.get('/posts/:id', (req, res, next) => {
  let id = req.params.id;
  let post = postBank.find(id);

  if (!post.id) {
    let error = new Error('No such post');
    console.log(error);
    next(error);
  }
  
  let html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
        <div class='news-item'>
          <p>
            ${post.title}
            <small>(by ${post.name})</small>
          </p>
          <p>
            ${post.content}
          </p>
        </div>
    </div>
  </body>
</html>`;

res.send(html);
});

app.use(function (err, req, res, next) {
  if (err.message === 'No such post') {
    res.status(404).send('No such post!');
  }
  res.status(500).send('Error Unknown');
});
app.use(morgan('dev'));
const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
