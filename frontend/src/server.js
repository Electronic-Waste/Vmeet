const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http,{ cors: true })
const port = process.env.PORT || 8081


//设置允许跨域访问该服务.
app.all("*",function(req,res,next){
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Accept,Content-type");
    res.header("Access-Control-Allow-Credentials",true);
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type","application/json;charset=utf-8")
    if (req.method.toLowerCase() == 'options')
        res.sendStatus(200);  //让options尝试请求快速结束
    else
        next();
});

app.use(express.static(__dirname + "/public"));
app.use('/public',express.static('public'));

let clients = 0

app.get('/',function(req,res){
    res.sendFile(__dirname+'/public/index.html');
});


io.on('connection', function (socket) {
    console.log("connected!!!");
    socket.on("NewClient", function (data) {
        console.log(data);
        console.log("receice newclient!")
        // if (clients < 2) {
        //     if (clients == 1) {
        //         console.log("createPeer")
        //         this.emit('CreatePeer')
        //     }
        // }
        // else
        //     this.emit('SessionActive')
        // clients++;
        if(clients == 2){
            //向对端发起请求
            console.log("send req");
            this.to(data).emit("call",data);
        }
        else{
            this.to(data).emit("failed")
        }
    })
    if (clients < 2) {
        if (clients == 1) {
            console.log("room fulled")
            // socket.emit('CreatePeer')
        }
        clients++;
    }
    else
        socket.emit('SessionActive')

    socket.on('Offer', SendOffer)
    socket.on('Answer', SendAnswer)
    socket.on('disconnect', Disconnect)
    socket.on('called',Docall);
    socket.on('failed',Dofailed);
    socket.on("hangup",Dohangup);
    socket.on("ready",Ready);

    //the code used to enter the room
    socket.on("enter",enter);

    //the code used in vutbView
    socket.on("con_req",v_con);
    socket.on("answer",re_ans);
})

function v_con(data) {
    console.log(data);
    this.to("room").emit("try_con",data);
}

function re_ans(data) {
    console.log(data);
    this.to("room").emit("back_ans",data);
}

function enter(data) {
    console.log("data");
    console.log(data);
    data.forEach((row,rowidx)=>{
        console.log("room_" + row);
        this.join("room_" + row);
    })
}

function Ready(data) {
    console.log("ready");
    this.to(data).emit("CreatePeer");
}

function Dohangup(data) {
    console.log("hangup");
    this.to(data).emit("hangup");
}

function Disconnect() {
    if (clients > 0) {
        if (clients <= 2)
            this.to("room").emit("Disconnect")
        clients--
    }
}

function Dofailed(data) {
    this.to(data).emit("failed");
}

function Docall(data) {
    console.log("hit");
    this.to(data).emit("receive");
}

function SendOffer(data) {
    console.log("offer");
    this.to(data.channel).emit("BackOffer", data.data);
}

function SendAnswer(data) {
    this.to(data.channel).emit("BackAnswer", data.data);
}

http.listen(port, () => console.log(`Active on ${port} port`))



