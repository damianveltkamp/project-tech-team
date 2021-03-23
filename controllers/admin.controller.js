export function dashboard(req, res) {
  const data = {
    layout: 'layout.html',
    title: 'Admin page',
  };

  // TODO fetch all socket rooms and display in frontend
  res.render('pages/admin-dashboard', data);
}
