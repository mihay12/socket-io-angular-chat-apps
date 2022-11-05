// Express ініціалізується в app як обробник функції, який можна надати HTTP-серверу
const app = require("express")();
const http = require("http").createServer(app);
// Підключення модуля jsonwebtoken для перевірки та аналізу JWT-tokena
const jwt = require("jsonwebtoken");
// Секрет, який вписується на для генерації ключа
const JWT_SECRET = "myRandomHash";

// я ініціалізую новий екземпляр у socket.io,передавши http об’єкт (сервер HTTP) і параметри cors (оновлені для socket.io v3),
// щоб дозволити нашу URL-адресу локального хостa angular
// (яку ви можете вставити в URL-адресу або свій зовнішній клієнт, у моєму випадку це було. localhost:4200)
const io = require("socket.io")(http, {
  cors: {
    origins: [
      "http://localhost:3001",
      "http://localhost:4200",
      "http://localhost:8080",
    ],
    credentials: true,
  },
});

// Ми визначаємо обробник маршруту, /який викликається, коли ми переходимо на головну сторінку нашого сайту.
app.get("/", (req, res) => {
  // в параметрах функції спочатку йде параметр запиту (req), а потім відповідні (res)
  res.send("<h1>Hey Socket.io</h1>");
});

io.use(async (socket, next) => {
  // Отримання токена з фронтенду
  const token = socket.handshake.auth.token;
  try {
    // Перевірка токену jwt, отримання даних користувача та їх виведення
    const user = await jwt.verify(token, JWT_SECRET);
    console.log("user", user);
    // Збереження данних користувача в обʼєкті сокета для подальшого користування
    socket.user = user;
    next();
  } catch (e) {
    // Якщо токен не коректний - припинити зʼєднання
    console.log("error", e.message);
    return next(new Error(e.message));
  }
});

// Прослуховую події connection та disconnection для вхідних сокетів і реєструю це на консолі.
io.on("connection", (socket) => {
  // console.log('a user connected');

  // Отримання токена з фронтенду
  // let token = socket.handshake.auth.token;
  // console.log(token);

  // Реєстрація події disconnect
  // socket.on('disconnect', () => {
  //     console.log('user disconnected');
  // })

  // Реєстрація події my message
  // socket.on('my message', (msg) => {

  // Друк в консолі сервера тексту переданого з лицевої сторони
  // console.log('message: ' + msg);

  // Передача тексту з сервера на фронт
  // io.emit('my broadcast', `server: ${msg}`);
  // });

  // приєднання користувача до кімнати
  socket.join(socket.user.id);
  socket.join("myRandomChatRoomId");

  console.log("a user connected");

  // Реєстрація події disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // Реєстрація події my message
  socket.on("my message", (msg) => {
    console.log("message: " + msg);
    // Передача тексту з сервера на фронт
    io.emit("my broadcast", `server: ${msg}`);
  });

  // Під'єднання до каналу
  socket.on("join", (roomName) => {
    console.log("join: " + roomName);
    socket.join(roomName);
  });

  socket.on("message", ({ message, roomName }, callback) => {
    console.log("message: " + message + " in " + roomName);

    // Створюємо дані для відправки отримувачам
    const outgoingMessage = {
      name: socket.user.name,
      id: socket.user.iat,
      message
    };

    // Відправити на фронтенд сокет-повідомлення 
    // всім в кімнаті, окрім відправника
    socket.to(roomName).emit("message", outgoingMessage);

    //відправка зворотнього зв'язку
    callback({
      status: "ok",
      outgoingMessage
    });

    // Відправити всім, включаючи відправника
    // io.to(roomName).emit("message", message);
  });
});

// Ми змушуємо http-сервер прослуховувати порт 3000.
http.listen(3000, () => {
  console.log("listeninghttp on *:3000");
});
