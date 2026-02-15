import { getPlayerGrid, setNewPlayerGrid } from "./app";
import {convertCoordinateToIndexes, updateTable} from "./Modules"

const ws = new WebSocket("ws://localhost:3000");

let grid = [];
const size = 12;
for (let countRow = 0; countRow < size; countRow++) {
    grid[countRow] = [];
    for (let countCol = 0; countCol < size; countCol++) {
        grid[countRow][countCol] = null;
    }
}

ws.addEventListener("open", ()=>{
    console.log("connected to battleship server!")
})
let serverState = ["Registrations" , "Lobby", "Game_Setup", "Gameplay"];
let stateVar = serverState[0];
let objServerMessages = {loginName : null, loginPassword: null};
ws.addEventListener("message", (event)=>{
    try{
        const data = JSON.parse(event.data);
        console.log("Server sent: ", data);

        switch(data.type){
            case "auth_success":
                const current_UserName = data.user.username;
                console.log("Logged in as:", data.user.username);
                //dom in server code this is because it wasnt moving immediately when i had to login before hand
                document.querySelectorAll(".setup-section").forEach(section => {
                    section.style.display = "none";
                });
                document.getElementById("lobby_Section").style.display = "flex";
                listPlayers();
                stateVar = serverState[0];
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
                    buttonReq.textContent = "Waiting";
                }
                stateVar = serverState[1];
                break;
            case "invite_received":
                let ul_Players_Invite = document.getElementById("InviteList");
                // Create li
                let li_players = document.createElement("li");
                li_players.classList.add("Player_li");

                // Create name span
                let spanValue = document.createElement("span");
                spanValue.textContent = data.from;

                // Create Accept button
                let buttonAccept = document.createElement("button");
                buttonAccept.textContent = "Accept";
                buttonAccept.classList.add("button_req");

                // Create Decline button
                let buttonDecline = document.createElement("button");
                buttonDecline.textContent = "Decline";
                buttonDecline.classList.add("button_req");

                // Append elements together
                li_players.appendChild(spanValue);
                li_players.appendChild(buttonAccept);
                li_players.appendChild(buttonDecline);

                ul_Players_Invite.appendChild(li_players);

                buttonAccept.addEventListener("click", ()=>{
                    ws.send(JSON.stringify({
                        type: "accept_invite",
                        inviteId: "uuid"
                    }));     
                });

                buttonDecline.addEventListener("click", () =>{
                    ws.send(JSON.stringify({
                        type: "decline_invite",
                        inviteId: "uuid"
                    })); 
                }); 
                stateVar = serverState[1];
                break;
            case "invite_error":
                alert(data.message);
                break;
            case "invite_accepted":
                document.querySelectorAll("#lobby_Section").forEach(section => {
                    section.style.display = "none";
                });
                document.getElementById("selector_Section").style.display = "flex";
                document.getElementById("game_boards").style.display = "flex";
                break;
            case "ships_accepted":
                alert("Ships have been accepted");
                break;
            case "waiting_for_opponent":
                alert("We are waiting for opponent");
                stateVar = serverState[2];
                break;
            case "game_start":
                alert("The game has started:");
                if(data.yourTurn === true){
                    alert("Fire at your openents board");
                }
                stateVar = serverState[2];
            case "shot_result":
                const EnemyTable = document.getElementById("right");
                const row = convertCoordinateToIndexes(data.coordinate).row;
                const col = convertCoordinateToIndexes(data.coordinate).col;
                if(data.hit){
                    grid[row][col] = "XX";  
                }else{
                    grid[row][col] = "O";
                }
                updateTable(grid, EnemyTable, false); 
                stateVar = serverState[3];
                break;
            case "shot_fired":
                const playerTable = document.getElementById("left");
                let playerGrid = getPlayerGrid();
                let OpponentShotRow = convertCoordinateToIndexes(data.coordinate).row;
                let OpponentShotCol = convertCoordinateToIndexes(data.coordinate).col;

                if(playerGrid[OpponentShotRow][OpponentShotCol] === "X"){
                    playerGrid[OpponentShotRow][OpponentShotCol] = "O";
                    setNewPlayerGrid(playerGrid);
                    updateTable(playerGrid,playerTable,true);
                }
                break;
            case "turn_change":
                if(current_UserName === data.currentTurn){
                    alert("It is your turn to play now");
                }else{
                    alert("it is the opponents turn now");
                }
                break;
            case "game_over":
                alert(data.winner);
                stateVar = serverState[0];
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

const sendShipPlacement = (obj) =>{
    if(ws.readyState === WebSocket.OPEN){
        const finalObj = {
            type: "place_ships",
            ships: obj
        }
        ws.send(JSON.stringify(finalObj));
    } 
}

const sendShotFire = (coordinate) =>{
    if(ws.readyState === WebSocket.OPEN){
       ws.send(JSON.stringify({type: "shoot", coordinate}));
    }
}

const getGameState = () =>{
    return stateVar;
}

export {listPlayers,getGameState, register, login, sendInvite, acceptInvite, sendShipPlacement, sendShotFire};
