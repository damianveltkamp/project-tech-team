export function home(req, res) {
  const data = {
    layout: 'layout.html',
    title: 'Home page',
  }

  res.render('pages/home.html', data);
}

export function results(req, res) {
  const data = {
    layout: 'layout.html',
    title: 'results page',
    searchSubject: (req.body.subject),
    searchResults: [
      {
        title: 'title1',
        image: 'test.png'
      },
      {
        title: 'title2',
        image: 'test.png'
      },
      {
        title: 'title1',
        image: 'test.png'
      }
    ],
    resultQuantity: Array.length,

  };

  res.render('pages/results.html', data);
}
