const ws = new WebSocket("ws://localhost:3000");

ws.addEventListener("open", ()=>{
    console.log("connected to battleship server!")
})

let objServerMessages = {loginName : null, error: null, players : null , dataType : null}; //Stores the latest message per message group
ws.addEventListener("message", (event)=>{
    try{
        const data = JSON.parse(event.data);
        console.log("Server sent: ", data);

        if(data.type === "auth_success"){
            console.log("Logged in as:", data.user.username);
            objServerMessages.loginName = data.user.username;
            objServerMessages.dataType = data.type;
        }else if(data.type === "auth_error"){
            console.log("Error in the system: " , data.message);
            objServerMessages.error = data.message;
            objServerMessages.dataType = data.type;
        }else if(data.type === "player_list"){
            console.log("Available players: ",data.players)
            objServerMessages.players = data.players;
        }
    } catch(err){
        console.error("error parsing server message:", err);
    }
})

ws.addEventListener("close", () =>{
    console.log("Disconnected from the server");
});

ws.addEventListener("error", (err)=>{
    console.error("websocket error:", err);
})

const login = (username,password) =>{
    if(ws.readyState === WebSocket.OPEN){
        ws.send(JSON.stringify({
            type: "login",
            username,
            password
        }));
    }else{
        console.warn("Socket is not ready yet")
    }
}

const register = (username,password) =>{
    if(ws.readyState === WebSocket.OPEN){
        ws.send(JSON.stringify({
            type: "register",
            username,
            password
        }));

        return objServerMessages.dataType;
    }else{
        console.warn("Socket is not ready yet")
    }
}

const listPlayers = () =>{
    if(ws.readyState === WebSocket.OPEN){
        ws.send(JSON.stringify({type: "list_players"}));
        return objServerMessages.players;
    }
}

const sendInvite = (username) =>{
    if(ws.readyState === WebSocket.OPEN){
        ws.send(JSON.stringify({type: "send_invite", username}));
    }
}

const acceptInvite = (inviteId) =>{
    if(ws.readyState === WebSocket.OPEN){
        ws.send(JSON.stringify({type: "accept_invite", inviteId}));
    }
}

export {listPlayers, register, login, sendInvite,acceptInvite};
