export function dashboard(req, res) {
  const io = req.app.get('io');

  const rooms = Object.keys(io.sockets.adapter.rooms).reduce(
    (accumulator, currentKey) => {
      if (currentKey.includes('custom:')) {
        const roomString = currentKey.replace('custom:', '');
        accumulator.push(roomString);
      }
      return accumulator;
    },
    [],
  );

  const data = {
    layout: 'layout.html',
    title: 'Admin page',
    rooms,
  };

  res.render('pages/admin-dashboard', data);
}
