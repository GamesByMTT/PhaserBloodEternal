import { Scene, GameObjects } from "phaser";
import { gameConfig } from "../appConfig";
import { currentGameData } from "../Globals";

export default class SettingPopup extends Phaser.GameObjects.Container {
    private soundRadio!: GameObjects.Sprite
    private musicRadio!: GameObjects.Sprite
    private turboRadio!: GameObjects.Sprite
    constructor(scene: Scene, data: any) {
        super(scene, 0, 0);
        this.createSettingBackground()
        this.soundToggle(currentGameData.soundMode)
        this.backgroudnMusicToggle(currentGameData.musicMode);
        this.turboModeToggle(currentGameData.turboMode)
        
    }
    createSettingBackground(){
        const settingBg = this.scene.add.sprite(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.5, "popupBgSprite").setScale(0.8);
        const headingBg = this.scene.add.sprite(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.5 - 280, "headingBg").setScale(0.6)
        const headingText = this.scene.add.text(headingBg.x, headingBg.y, "Game Setting", {fontFamily: "Deutsch", fontSize: "40px", color: "#ffffff"}).setOrigin(0.5)
        const outerCircle = this.scene.add.sprite(settingBg.x + settingBg.x/2 + 50, headingBg.y, "circleBg").setOrigin(0.5).setScale(0.6)
        const closeBtn = this.scene.add.sprite(outerCircle.x, outerCircle.y, "closeButton").setScale(0.6).setOrigin(0.5).setInteractive()
        closeBtn.on("pointerdown", ()=>{
            closeBtn.setScale(0.5);
            this.scene.events.emit("closePopup")
        })
        closeBtn.on("pointerup", ()=>{
            closeBtn.setScale(0.6);
        })

        const soundFxText = this.scene.add.text(gameConfig.scale.width * 0.5 - 70, gameConfig.scale.height * 0.4, "Sound Fx", {fontFamily: "Deutsch", fontSize: "40px", color: "#ffffff", align:"right"}).setOrigin(0.5)
        const backgroundMusicText = this.scene.add.text(gameConfig.scale.width * 0.5 - 70, gameConfig.scale.height * 0.5, "Background Music", {fontFamily: "Deutsch", fontSize: "40px", color: "#ffffff", align:"right"}).setOrigin(0.5)
        const turboModeText = this.scene.add.text(gameConfig.scale.width * 0.5 - 70, gameConfig.scale.height * 0.6, "Turbo Mode",{fontFamily: "Deutsch", fontSize:"40px", color: "#ffffff", align:"right"}).setOrigin(0.5)
        const soundCircle = this.scene.add.sprite(soundFxText.x + 210, soundFxText.y, "circleBg").setScale(0.4).setOrigin(0.5).setInteractive()

        soundCircle.on("pointerdown", ()=>{
            currentGameData.soundMode = !currentGameData.soundMode
            this.soundToggle(currentGameData.soundMode)
        })
        
        const bgMusicCircle = this.scene.add.sprite(backgroundMusicText.x + 210, backgroundMusicText.y, "circleBg").setScale(0.4).setOrigin(0.5).setInteractive()
        bgMusicCircle.on("pointerdown", ()=>{
            currentGameData.musicMode = !currentGameData.musicMode
            this.backgroudnMusicToggle(currentGameData.musicMode)
        })

        const turboMode = this.scene.add.sprite(turboModeText.x + 210, turboModeText.y, "circleBg").setScale(0.4).setOrigin(0.5).setInteractive()
        turboMode.on("pointerdown", ()=>{
            currentGameData.turboMode = !currentGameData.turboMode
            this.turboModeToggle(currentGameData.turboMode)
        })
        this.add([settingBg, headingBg, headingText, outerCircle, soundFxText, soundCircle, backgroundMusicText, bgMusicCircle, turboModeText, turboMode, closeBtn])
    }
    soundToggle(soundMode: boolean) {
        // Remove existing radio button if it exists
        if (this.soundRadio) {
            this.soundRadio.destroy();
        }
    
        // Create new radio button
        this.soundRadio = this.scene.add.sprite(
            gameConfig.scale.width * 0.5 + 140, // Adjust X position to match soundCircle
            gameConfig.scale.height * 0.4,      // Match Y position with soundFxText
            soundMode ? "blueCircle" : "blankCircle" // Use appropriate texture
        ).setScale(0.4).setOrigin(0.5);
    
        // Add to container
        this.add(this.soundRadio);
    }

    backgroudnMusicToggle(musicMode: boolean){
        if(this.musicRadio){
            this.musicRadio.destroy();
        }
        this.musicRadio = this.scene.add.sprite(
            gameConfig.scale.width * 0.5 + 140,
            gameConfig.scale.height * 0.5,
            musicMode ? "blueCircle" : "blankCircle"
        ).setScale(0.4).setOrigin(0.5);
        this.add(this.musicRadio);
    }

    turboModeToggle(turboMode: boolean){
        if(this.turboRadio){
            this.turboRadio.destroy()
        }
        this.turboRadio = this.scene.add.sprite(
            gameConfig.scale.width * 0.5 + 140,
            gameConfig.scale.height * 0.6,
            turboMode ? "blueCircle": "blankCircle"
        ).setScale(0.4).setOrigin(0.5)

        this.add(this.turboRadio)
    }
}