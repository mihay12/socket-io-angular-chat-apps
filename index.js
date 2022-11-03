// Express ініціалізується в app як обробник функції, який можна надати HTTP-серверу 
const app = require('express')();
const http = require('http').createServer(app);

// я ініціалізую новий екземпляр у socket.io,передавши http об’єкт (сервер HTTP) і параметри cors (оновлені для socket.io v3), 
// щоб дозволити нашу URL-адресу локального хостa angular 
// (яку ви можете вставити в URL-адресу або свій зовнішній клієнт, у моєму випадку це було. localhost:4200)
const io = require('socket.io')(http, {
    cors: {
        origins: ['http://localhost:4200']
    }
});

// Ми визначаємо обробник маршруту, /який викликається, коли ми переходимо на головну сторінку нашого сайту.
app.get('/', (req, res) => { // в параметрах функції спочатку йде параметр запиту (req), а потім відповідні (res)
    res.send('<h1>Hey Socket.io</h1>');
  });

// Прослуховую події connection та disconnection для вхідних сокетів і реєструю це на консолі.
io.on('connection', (socket) => {
    console.log('a user connected');

    // Отримання токена з фронтенду
    let token = socket.handshake.auth.token;
    console.log(token);

    // Реєстрація події disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected');
    })

    // Реєстрація події my message
    socket.on('my message', (msg) => {
        
        // Друк в консолі сервера тексту переданого з лицевої сторони
        console.log('message: ' + msg);
        
        // Передача тексту з сервера на фронт
        io.emit('my broadcast', `server: ${msg}`);
    });
})

// Ми змушуємо http-сервер прослуховувати порт 3000.
http.listen(3000, () => {
    console.log('listeninghttp on *:3000');
})