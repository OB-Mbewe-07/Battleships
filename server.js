const ws = new WebSocket("ws://localhost:3000");

ws.addEventListener("open", ()=>{
    console.log("connected to battleship server!")
})

let objServerMessages = {loginName : null, loginPassword: null};
ws.addEventListener("message", (event)=>{
    try{
        const data = JSON.parse(event.data);
        console.log("Server sent: ", data);

        switch(data.type){
            case "auth_success":
                console.log("Logged in as:", data.user.username);
                //dom in server code this is because it wasnt moving immediately when i had to login before hand
                document.querySelectorAll(".setup-section").forEach(section => {
                    section.style.display = "none";
                });
                document.getElementById("lobby_Section").style.display = "flex";
                listPlayers();
                break; 
            case "auth_error":
                console.log("Error in the system: " , data.message);
                login(objServerMessages.loginName, objServerMessages.loginPassword);
                break; 
            case "player_list":
                console.log("Available players: ",data.players); 
                let ul_Players = document.getElementById("playerList");
                
                for(let player of data.players){
                    let li_players = document.createElement("li");
                    li_players.classList.add("Player_li");

                    let spanValue = document.createElement("span");
                    spanValue.textContent = player.username;

                    let buttonReq = document.createElement("Button");
                    buttonReq.textContent = "Request Match";
                    buttonReq.classList.add("button_req");
                    
                    buttonReq.addEventListener("click", () =>{
                        console.log("Request sent to: ",player.username);
                        ws.send(JSON.stringify({
                            type: "send_invite",
                            targetUsername: player.username
                        }));
                    });

                    li_players.appendChild(spanValue);
                    li_players.appendChild(buttonReq);
                    ul_Players.appendChild(li_players);
                }
                break; 
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
    objServerMessages.loginName = username;
    objServerMessages.loginPassword = password;

    if(ws.readyState === WebSocket.OPEN){
        ws.send(JSON.stringify({
            type: "register",
            username,
            password
        }));
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
