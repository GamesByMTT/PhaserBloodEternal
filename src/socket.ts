import { io } from "socket.io-client";
import { Globals, ResultData, initData, currentGameData } from "./scripts/Globals";
import MainLoader from "./view/MainLoader";

// const socketUrl = process.env.SOCKET_URL || ""
export class SocketManager {
  public socket : any;
  public authToken : string = "";
  public SocketUrl : string= "";
  public socketLoaded : boolean = false;

  constructor() { 
   
  }
  onToken(data : {socketUrl : string, authToken : string}){
    try { 
      this.SocketUrl = data.socketUrl;
      this.authToken = data.authToken;
      this.socketLoaded = true;
      this.setupSocket();
    }
    catch(error){
      console.error("Got Error In Auth Token : ",error);
    }
  }
  
  setupSocket(){
   this.socket = io(this.SocketUrl, {
      auth: {
        token: this.authToken,
        gameId: "SL-BE",
      },
    //   reconnectionAttempts: 5,
    //   reconnectionDelay: 10000, // Initial delay between reconnection attempts (in ms)
    //   reconnectionDelayMax: 15000,
    });
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.socket.on("connect_error", (error: Error) => {
      // console.error("Connection Error:", error.message);
    });

    this.socket.on("connect", () => {
      // console.log("Connected to the server");
      this.socket.on("message", (message : any) => {
        const data = JSON.parse(message);
        if(data.id == "InitData" ) {
          if(initData.gameData.Bets.length != 0){
            if(Globals.SceneHandler?.getScene("Disconnection")){
                Globals.SceneHandler.removeScene("Disconnection");
            }
            initData.UIData.symbols = data.message.UIData.paylines.symbol
          }
          else{
            initData.gameData = data.message.GameData;
            initData.playerData = data.message.PlayerData;
            initData.UIData.symbols = data.message.UIData.paylines.symbols
            ResultData.playerData.Balance = data.message.PlayerData.Balance
            currentGameData.currentBalance = data.message.PlayerData.Balance
            console.log(data, "initData on Socket File");
          }
        }
        if(data.id == "ResultData"){
            ResultData.gameData = data.message.GameData;
            ResultData.playerData = data.message.PlayerData;
            Globals.emitter?.Call("ResultData");
            console.log(data, "ResultData")  
        }
      });
    });

    this.socket.on("internalError", (errorMessage: string) => {
      console.log(errorMessage);
    });

    this.socket.on("disconnect", (reason: string) => {
      console.log("Disconnected from the server. Reason:", reason);
    //   setTimeout(() => {
    //     Globals.SceneHandler?.addScene("Disconnection", Disconnection, true)
    //   }, 1000);
    });
    this.socket.on("reconnect_attempt", (attemptNumber: number) => {
      console.log(`Reconnection attempt #${attemptNumber}`);
    });
  
    this.socket.on("reconnect", (attemptNumber: number) => {
      console.log(`Reconnected to the server on attempt #${attemptNumber}`);
    });
  
    this.socket.on("reconnect_failed", () => {
      console.error("Reconnection failed.");
    });
  }
  sendMessage(id : string, message: any) {
    this.socket.emit(
      "message",
      JSON.stringify({ id: id, data: message })
    );
  }
}