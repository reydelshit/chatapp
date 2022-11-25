var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
const { response, request } = require("express");
var app = express();
const axios = require('axios');
const { resolveInclude } = require("ejs");
const { json } = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static( __dirname + "/static" ));

const port = 1313;
const server = app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});
const io = require('socket.io')(server);

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(session({
    secret: 'user',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

/** MYSQL Connection **/


/** MYSQL Connection **/
/* Socket */
io.on('connection', (socket) => {
    socket.on('got_a_new_user', (new_user) => {  
        console.log('From client:', new_user);
        // emit a new user to all client who join
        io.emit('user_joined', new_user);
    })

    socket.on('new_message', (message) => {
        console.log("Message from client",message);
        // emit this message to all client
        io.emit('msg_from_server', message);
    })
})
/* Socket */
app.get('/', (request, response) => {  
    
    response.render('index');
})

app.post('/process', (request, response) => {   
    response.json(request.body); 
})