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
const path = require("path");

//Middleware
app.use(express.static('build'));


// Connect to MongoDB
// mongoose.connect('mongodb+srv://hardik_aswal:grizzlybear@cluster0.zlw0s.mongodb.net/',{dbName:"pratilipi",useNewUrlParser: true,useUnifiedTopology:true ,useCreateIndex:true,useFindAndModify:false })
mongoose.connect('mongodb://localhost:27017/Pratilipi',{useNewUrlParser: true,useUnifiedTopology:false ,useCreateIndex:true,useFindAndModify:false })  
.then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));


//Middleware
// app.use(express.static('build'));
// app.use(express.static('client/build'));
const corsOption = {
  exposedHeaders: ['Authorization','x-auth-token']
}
app.use(cors(corsOption));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use("/api/users", users);
app.use("/api/stories",stories);

app.get('*', function(req, res) {
    res.sendFile('index.html', {root: path.join(__dirname, './build/')});
  });

//Socket io
// var count = 0;
// var ipsConnected = [];

// io.on('connection', function (socket) {
//   console.log( socket.client.conn.server.clientsCount + " users connected" );
//   socket.emit('counter', {count:io.engine.clientsCount});
// });

// io.on('disconnect', function () {
//   console.log( socket.client.conn.server.clientsCount + " users connected" );
//   socket.emit('counter', {count:io.engine.clientsCount});
// });

io.on('connection', function(socket) {
  console.log(io.engine.clientsCount);
  socket.emit("counter",{count: io.engine.clientsCount})
  socket.on('disconnect', function() {
    console.log(io.engine.clientsCount);
    socket.emit("counter",{count: io.engine.clientsCount})

  });
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


const PORT = 5000 || process.env.PORT;
// const port = 6000 || process.env.PORT;
// app.listen(PORT , ()=>console.log(`Server started on PORT ${PORT}`));
server.listen(PORT, ()=>console.log(`Socket server started on PORT ${PORT}`));

