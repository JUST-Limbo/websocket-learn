const ws = require('nodejs-websocket')
const PORT = 4000
const TYPE_ENTER = 0
const TYPE_LEAVE = 1
const TYPE_MSG = 2

let count = 0
const serve = ws.createServer(connect =>{
        console.log("新的用户连接上来了");
        count++
        connect.name = `用户${count}`
        broadcast({
            type:TYPE_ENTER,
            msg:`${connect.name}进入了聊天室`,
            time:new Date().toLocaleTimeString()
        })
        
        connect.on('text',data=>{
            broadcast({
            type:TYPE_MSG,
            msg:data ,
            time:new Date().toLocaleTimeString()
            })
        })
        connect.on('close',()=>{
            console.log('连接断开了');
            count--
            broadcast({
                type:TYPE_LEAVE,
                msg:`${connect.name}离开了聊天室`,
                time:new Date().toLocaleTimeString()
                })

        })
        connect.on('error',()=>{
            console.log("用户连接异常");
            
        })
})


function broadcast(msg){
    serve.connections.forEach(item=>{
        item.send(JSON.stringify(msg))
    })
}

serve.listen(PORT,()=>{
    console.log("websocket启动成功，端口号"+PORT);
    
})