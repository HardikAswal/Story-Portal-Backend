const express = require('express');
let app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require('http');
const users = require("./routes/api/users");
const stories = require("./routes/api/stories");
const cors = require('cors');
const socketIO = require('socket.io');
const server = http.createServer(app);
let io = socketIO(server);
const path = require("path")

app.use(express.static('build'));

app.get('*', function(req, res) {
    res.sendFile('index.html', {root: path.join(__dirname, './build/')});
  });

// Connect to MongoDB
mongoose.connect('mongodb+srv://hardik_aswal:grizzlybear@cluster0.zlw0s.mongodb.net/',{dbName:"pratilipi",useNewUrlParser: true,useUnifiedTopology:true ,useCreateIndex:true,useFindAndModify:false })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

const corsOption = {
  exposedHeaders: ['Authorization','x-auth-token']
}

//Middleware
// app.use(express.static('build'));
// app.use(express.static('client/build'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors(corsOption));
app.use("/api/users", users);
app.use("/api/stories",stories);

//Socket io
// var count = 0;
// var ipsConnected = [];

io.on('connection', function (socket) {
  console.log( socket.client.conn.server.clientsCount + " users connected" );
  socket.emit('counter', {count:io.engine.clientsCount});
});

io.on('disconnect', function () {
  console.log( socket.client.conn.server.clientsCount + " users connected" );
  socket.emit('counter', {count:io.engine.clientsCount});
});

// io.on('connection', function (socket) {
//   var ipAddress = socket.handshake.address;

//   if (!ipsConnected.hasOwnProperty(ipAddress)) {
//   	ipsConnected[ipAddress] = 1;
//   	count++;
//   	socket.emit('counter', {count:count});
//   }

//   console.log("client is connected");
//   /* Disconnect socket */
//   socket.on('disconnect', function() {
//   	if (ipsConnected.hasOwnProperty(ipAddress)) {
//   		delete ipsConnected[ipAddress];
// 	    count--;
// 	    socket.emit('counter', {count:count});
//   	}
//   });
// });


const PORT = process.env.PORT;
// const port = 6000 || process.env.PORT;
// app.listen(PORT , ()=>console.log(`Server started on PORT ${PORT}`));
server.listen(PORT, ()=>console.log(`Socket server started on PORT ${PORT}`));

