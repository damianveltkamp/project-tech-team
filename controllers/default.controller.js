export function home(req, res) {
  const data = {
    layout: 'layout.html',
    title: 'Home page',
  };

  res.render('pages/home.html', data);
}

export function notFound(req, res) {
  res.send('page not found');
}
