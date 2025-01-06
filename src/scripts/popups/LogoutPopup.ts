import { Scene } from "phaser";
import { gameConfig } from "../appConfig";
import { currentGameData, Globals } from "../Globals";
import SoundManager from "../SoundManager";

export default class LogoutPopup extends Phaser.GameObjects.Container{
    SoundManager: SoundManager
    constructor(scene: Scene, data: any){
        super(scene, 0, 0)
         this.SoundManager = new SoundManager(scene)

        const background = this.scene.add.image(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.5, 'popupBgSprite').setScale(0.7)
        const headingBg = this.scene.add.sprite(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.29, "headingBg").setOrigin(0.5).setScale(0.6)
        const headingText = this.scene.add.text(gameConfig.scale.width * 0.5, headingBg.y, "Quit Game", { fontFamily:"Deutsch", fontSize: 50, color: "#ffffff" }).setOrigin(0.5)
        const bodyText = this.scene.add.text(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.5, "DO YOU REALLY WANT TO\nQUIT", {fontFamily: "Deutsch", fontSize: "50px", color: "#ffffff", align: "center"}).setOrigin(0.5)
        const  yesButton = this.scene.add.sprite(gameConfig.scale.width * 0.5 - 150, gameConfig.scale.height * 0.65, "nextButton").setScale(0.9).setOrigin(0.5).setInteractive()
        const yesButtonText = this.scene.add.text(yesButton.x, yesButton.y, "OK", {fontFamily: "Deutsch", fontSize: "40px", color: "#ffffff", align: "center"}).setOrigin(0.5)
        yesButton.on("pointerdown", ()=>{
            this.buttonMusic("buttonpressed")
            window.parent.postMessage("onExit", "*");   
            Globals.Socket?.socket.emit("EXIT", {});
            scene.events.emit("closePopup")
        })

        const cancelButton = this.scene.add.sprite(gameConfig.scale.width * 0.6, yesButton.y, "previousButton").setScale(0.9).setOrigin(0.5).setInteractive()
        const cancelText = this.scene.add.text(cancelButton.x, cancelButton.y, "Cancel", {fontFamily: "Deutsch", fontSize: "40px", color: "#ffffff", align:"center"}).setOrigin(0.5)
        cancelButton.on("pointerdown", ()=>{
            this.buttonMusic("buttonpressed")
            scene.events.emit("closePopup")
        })


        this.add([background, headingBg, headingText, bodyText, yesButton, yesButtonText, cancelButton, cancelText])
    }
    buttonMusic(key: string){
        if(currentGameData.globalSound){
            this.SoundManager.playSound(key)
        }
    }
}