import { Scene } from "phaser";
import { gameConfig } from "../appConfig";
import { Globals } from "../Globals";


export default class Disconnection extends Phaser.GameObjects.Container{

    constructor(scene: Scene, data: any){
        super(scene, 0, 0)

        const backgrounImage = this.scene.add.sprite(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.5, "popupBgSprite").setScale(0.7)
        const headingBg = this.scene.add.sprite(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.29, "headingBg").setOrigin(0.5).setScale(0.6)
        const headingText = this.scene.add.text(gameConfig.scale.width * 0.5, headingBg.y, "Disconnect", { fontFamily:"Deutsch", fontSize: 50, color: "#ffffff" }).setOrigin(0.5)
        const bodyText = this.scene.add.text(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.5, "SERVER DISCONNECTED", {fontFamily: "Deutsch", fontSize: "50px", color: "#ffffff", align: "center"}).setOrigin(0.5)
        const  yesButton = this.scene.add.sprite(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.65, "nextButton").setScale(0.9).setOrigin(0.5).setInteractive()
        const yesButtonText = this.scene.add.text(yesButton.x, yesButton.y, "OK", {fontFamily: "Deutsch", fontSize: "40px", color: "#ffffff", align: "center"}).setOrigin(0.5)
            yesButton.on("pointerdown", ()=>{
                window.parent.postMessage("onExit", "*");   
                Globals.Socket?.socket.emit("EXIT", {});
                scene.events.emit("closePopup")
            })
        
        
        
        
        this.add([backgrounImage, headingBg, headingText, bodyText, yesButton, yesButtonText,])
    }
}