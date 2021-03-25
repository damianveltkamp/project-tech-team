const socket = require('socket.io');

// const port = process.env.PORT || 3000;


// const io = socket(server);
// io.on('connection', (socket) => {
//     console.log('a user connected');
// })


export function socketTest(req, res) {
    const data = {
        layout: 'layout.html',
        title: 'Chat page',
    };


    res.render('pages/chat.html', data);
}