import WebSocket from "ws";
const ws = new WebSocket("ws://localhost:3000");

ws.on("open", () => {
    console.log("Connection has been established");
})

ws.on("message", (message)=>{
    const data = JSON.parse(message.toString());
    console.log("Recieved: ", data);
})

const socketLoginUser = (str_name,str_password) =>{
    ws.send(JSON.stringify({
        type: "login",
        username: str_name,
        password: str_password
    }));    
}

const socketRegisterUser = (str_name,str_password) =>{
    ws.send(JSON.stringify({
        type: "register",
        username: str_name,
        password: str_password
    })); 
}

const seeAvailablePlayers = () =>{
    ws.send(JSON.stringify({ type: "list_players"}));
}

