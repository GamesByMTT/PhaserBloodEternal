import { io } from "socket.io-client";
import { Globals, ResultData, initData } from "./scripts/Globals";
import { PopupManager } from "./scripts/PopupManager";


export class SocketManager  {
    public socket: any;
    public authToken: string = "";
    public SocketUrl: string = "";
    public socketLoaded : boolean = false

    constructor() { 
   
    }

onToken(data: {socketUrl: string, authToken: string}){
    console.error("console.error", data);
    
    try{
        this.SocketUrl = data.socketUrl;
        this.authToken = data.authToken;
        this.socketLoaded = true;
        this.setupSocket()
    }
    catch(error){
        console.log("Got an Error:", error);
    }
}
setupSocket(){
    this.socket = io(this.SocketUrl,{
        auth:{
            token: this.authToken,
            gameId: "SL-BE"
        }
    })
    this.setupEventListeners();
}

    private setupEventListeners(){
        this.socket.on("connecr-error", (error:Error)=>{
            console.error("not able to connect");
            
        })

        this.socket.on("connect",()=>{
            console.log("connected");
            
                this.socket.on("message", (message: any)=>{
                    const data = JSON.parse(message);
                    
                    if(data.id=="InitData"){
                        if(initData.gameData.Bets.length != 0){

                        }else{
                            initData.gameData = data.message.GameData;
                            initData.playerData = data.message.PlayerData;
                            ResultData.playerData.Balance = data.message.PlayerData.Balance
                            // initData.UIData.symbols = data.message.UIData.payline.symbols;
                            console.log(data, "socketInitData")
                        }
                    }
                    if(data.id=="ResultData"){
                        ResultData.gameData = data.message.GameData;
                        ResultData.playerData = data.message.PlayerData;
                        Globals.emitter?.Call("ResultData");
                        console.error(ResultData.gameData, "ResultData") 
                    }
                })
            })
        this.socket.on("internalError", (errorMessage: string) => {
            console.log(errorMessage);
        });

        this.socket.on("disconnect", (reason: string) => {
            console.log("Disconnected from the server. Reason:", reason);
            setTimeout(() => {
            // Globals.SceneHandler?.addScene("Disconnection", Disconnection, true)
            }, 1000);
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