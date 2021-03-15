export function home(req, res) {
  const data = {
    layout: 'layout.html',
    title: 'Home page',
  };

  res.render('pages/home.html', data);
}
