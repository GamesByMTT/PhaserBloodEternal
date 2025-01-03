import Phaser from "phaser";
import { SocketManager } from "../socket";
import { Globals } from "./Globals";
import { SceneHandler } from "./SceneHandler";
import { gameConfig } from "./appConfig";

window.postMessage("authToken", "*")

if(!IS_DEV){    
    window.addEventListener("message", function(event:MessageEvent){
        if(event.data.type == "authToken"){
            const data = {
                socketUrl: event.data.socketURL,
                authToken: event.data.cookie,
            }
            Globals.Socket = new SocketManager()
            Globals.Socket.onToken(data)
        }
    })
} else{ 
    const data = {
        socketUrl: "https://game-crm-rtp-backend.onrender.com/",
        authToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDg1MjhmYTI3YmY5MDI0NDNlYmExZiIsInVzZXJuYW1lIjoiYXJwaXQiLCJyb2xlIjoicGxheWVyIiwiaWF0IjoxNzM1ODkzMDI0LCJleHAiOjE3MzY0OTc4MjR9.zgZ4nRzjElY5vUEGCENf1QKUzk5Cbpp0BQjhzmVcIco" 
    }
    Globals.Socket = new SocketManager();
    Globals.Socket.onToken(data);
}
 function loadGame(){
    Globals.PhaserInstance = new Phaser.Game(gameConfig)
    const sceneHandler = new SceneHandler(Globals.PhaserInstance);
    Globals.SceneHandler = sceneHandler
}

if (typeof console !== 'undefined') {
    console.warn = () => {};
    console.info = () => {};
    // console.debug = () => {};
  }

loadGame()