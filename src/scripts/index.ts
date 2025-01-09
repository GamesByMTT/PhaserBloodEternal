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
        socketUrl: "http://localhost:5001",
        authToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDg1MjhmYTI3YmY5MDI0NDNlYmExZiIsInVzZXJuYW1lIjoiYXJwaXQiLCJyb2xlIjoicGxheWVyIiwiaWF0IjoxNzM2Mzk3OTc2LCJleHAiOjE3MzcwMDI3NzZ9.Em5XZ2jAnNhcn9L9wNNv9FHPDV8HvbkNTjqw3axCvIE" 
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