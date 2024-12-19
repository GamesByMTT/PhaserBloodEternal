import Phaser from "phaser";
import { Globals, ResultData, currentGameData, initData } from "./Globals";
import { Scene, GameObjects } from "phaser";
import { gameConfig } from "./appConfig";
import { PopupManager } from "./PopupManager";
import SoundManager from "./SoundManager";

export default class UiContainer extends GameObjects.Container {

    Soundmanager!: SoundManager
    betPlus!: InteractiveBtn
    betMinus!: InteractiveBtn
    totalBetPlus!: InteractiveBtn
    totalBetMinus!: InteractiveBtn
    maxbetButton!: InteractiveBtn
    spinButton!: InteractiveBtn
    doubleUPButton!: InteractiveBtn
    autoPlayButton!: InteractiveBtn
    infoIconButton!: InteractiveBtn
    settingButton!: InteractiveBtn
    speakerButton!: GameObjects.Sprite
    private popupManager: PopupManager

    constructor(scene: Scene){
        super(scene);
        this.popupManager = new PopupManager(scene)
        scene.add.existing(this)

        this.betPerLineUI();
        this.totalBetUI();
        this.winUI();
        this.maxBetUI();
        this.spinUI();
        this.doubleupUI();
        this.autoPlayUI();
        this.settingUI();
        this.soundUI();
        this.infoiconUI();
    }
    //Bet Panel with plus and minus Buttton 
    betPerLineUI(){
        const container = this.scene.add.container(gameConfig.scale.width * 0.25, gameConfig.scale.height * 0.95)
        const betPanel = this.scene.add.sprite(0, 0, "buttonBg").setScale(0.8).setOrigin(0.5)
        const plusCircle = this.scene.add.sprite(80, 0, "circleBg").setScale(0.4)
        const minusCircle = this.scene.add.sprite(-80, 0, "circleBg").setScale(0.4)
        const plusButton = [
            this.scene.textures.get("plusButton"),
            this.scene.textures.get("plusButton")
        ]
        this.betPlus = new InteractiveBtn(this.scene, plusButton, ()=>{

        }, 0, true)
        this.betPlus.setPosition(80, 0).setScale(0.4)
        const minusButton = [
            this.scene.textures.get("minusButton"),
            this.scene.textures.get("minusButton")
        ]
        this.betMinus = new InteractiveBtn(this.scene, minusButton, ()=>{

        }, 1, true)
        this.betMinus.setPosition(-80, 0).setScale(0.4)
        const betPerLineText = this.scene.add.text(0, 20, "Bet/Lines", { fontFamily: "Deutsch", fontSize: "25px", color: "#fff" }).setOrigin(0.5)
        container.add([betPanel, plusCircle, minusCircle, betPerLineText, this.betPlus, this.betMinus])

    }
    //Total Bet UI with plus and minus button
    totalBetUI(){
        const container = this.scene.add.container(gameConfig.scale.width * 0.38, gameConfig.scale.height * 0.95)
        const totalBetPanel = this.scene.add.sprite(0, 0, "buttonBg").setScale(0.8). setOrigin(0.5)
        const plusCircle = this.scene.add.sprite(80, 0, "circleBg").setScale(0.4)
        const minusCircle = this.scene.add.sprite(-80, 0, "circleBg").setScale(0.4)
        const plusButton = [
            this.scene.textures.get("plusButton"),
            this.scene.textures.get("plusButton")
        ]
        this.totalBetPlus = new InteractiveBtn(this.scene, plusButton, ()=>{

        },2, true)
        this.totalBetPlus.setPosition(80, 0).setScale(0.4)
        const minusButton = [
            this.scene.textures.get("minusButton"),
            this.scene.textures.get("minusButton")
        ]
        this.totalBetMinus = new InteractiveBtn(this.scene, minusButton, ()=>{

        }, 3, true)
        this.totalBetMinus.setPosition(-80, 0).setScale(0.4)
        const totalBetText = this.scene.add.text(0, 20, "Total Bet", { fontFamily: "Deutsch", fontSize: "25px", color: "#fff" }).setOrigin(0.5)
        container.add([totalBetPanel, plusCircle, minusCircle, totalBetText, this.totalBetPlus, this.totalBetMinus])
    }
    //Win UI with win amount
    winUI(){
        const container = this.scene.add.container(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.95)
        const winPanel = this.scene.add.sprite(0, -5, "winPanel").setScale(0.95);

        const winText = this.scene.add.text(0, 20, "Win", { fontFamily: "Deutsch", fontSize: "27px", color: "#fff" }).setOrigin(0.5)

        container.add([winPanel, winText])

    }
    //Max Bet Button to increase maximum bet
    maxBetUI(){
        const container = this.scene.add.container(gameConfig.scale.width * 0.6, gameConfig.scale.height * 0.94);
        const buttongBg = this.scene.add.sprite(0, 0, "circleBg").setScale(0.75)
        const maxbetText = this.scene.add.text(10, 2, "Max \nBet", {fontFamily: "Deutsch", fontSize: "30px", color:"#ffffff",}).setOrigin(0.5)
        const maxbetButton = [
            this.scene.textures.get("blueCircle"),
            this.scene.textures.get("blueCircle")
        ]
        this.maxbetButton = new InteractiveBtn(this.scene, maxbetButton, ()=>{
            console.log("fgbfgbfgbfg");
            
        }, 4, true)
        // Add pointerup event to reset text scale
        this.maxbetButton.on('pointerdown', () => {
            maxbetText.setScale(0.9);
        });

        // Add pointerout event to reset text scale
        this.maxbetButton.on('pointerup', () => {
            maxbetText.setScale(1);
        });
        this.maxbetButton.setScale(0.9)
        container.add([buttongBg, this.maxbetButton, maxbetText])
    }
    //Spin button
    spinUI(){
        const container = this.scene.add.container(gameConfig.scale.width * 0.67, gameConfig.scale.height * 0.94)
        const redCircle = this.scene.add.sprite(0, 0, "circleBg").setScale(0.78)
        const spinText = this.scene.add.text(0, 0, "Spin",{fontFamily: "Deutsch", fontSize: "35px", color:"#ffffff",}).setOrigin(0.5)
        const spinTexture = [
            this.scene.textures.get("redCircle"),
            this.scene.textures.get("redCircle")
        ]
        this.spinButton = new InteractiveBtn(this.scene, spinTexture, ()=>{

        }, 5, true)
        this.spinButton.on("pointerdown", ()=>{
            spinText.setScale(0.8)
        })
        this.spinButton.on("pointerup", ()=>{
            spinText.setScale(1);
        })
        // this.spinButton.setPosition()
        this.spinButton.setScale(0.75)
        container.add([redCircle, this.spinButton, spinText])
    }
    //doubleupUI
    doubleupUI(){
        const container = this.scene.add.container(gameConfig.scale.width * 0.74, gameConfig.scale.height * 0.94)
        const outerCircle = this.scene.add.sprite(0, 0, "circleBg").setScale(0.75)
        const doubleUp = [
            this.scene.textures.get("greyCircle"),
            this.scene.textures.get("greyCircle")
        ]
        this.doubleUPButton = new InteractiveBtn(this.scene, doubleUp, ()=>{

        }, 6, true)
        const doubleUPText = this.scene.add.text(0, 0, "Double\nUp", {fontFamily: "Deutsch", fontSize: "28px", color:"#ffffff", align:"center"}).setOrigin(0.5)
        this.doubleUPButton.on("pointerdown", ()=>{
            doubleUPText.setScale(0.8)
        })
        this.doubleUPButton.on("pointerup", ()=>{
            doubleUPText.setScale(1);
        })
        this.doubleUPButton.setScale(0.7)
        container.add([outerCircle, this.doubleUPButton, doubleUPText])
    }
    //Auto Play Button UI
    autoPlayUI(){
        const container = this.scene.add.container(gameConfig.scale.width * 0.81, gameConfig.scale.height * 0.94)
        const outerCircle = this.scene.add.sprite(0, 0, "circleBg").setScale(0.75)
        const autoPlay = [
            this.scene.textures.get("blueCircle"),
            this.scene.textures.get("blueCircle")
        ]
        this.autoPlayButton = new InteractiveBtn(this.scene, autoPlay, ()=>{

        }, 7, true);
        const autoPlayText = this.scene.add.text(0, 0, "Auto\nPlay",{fontFamily: "Deutsch", fontSize: "28px", color:"#ffffff", align:"center"}).setOrigin(0.5)
        this.autoPlayButton.setScale(0.9)

        this.autoPlayButton.on("pointerdown", ()=>{
            autoPlayText.setScale(0.8)
        })

        this.autoPlayButton.on("pointerup", ()=>{
            autoPlayText.setScale(1);
        })

        container.add([outerCircle, this.autoPlayButton, autoPlayText]);

    }
    //Settiing Button UI
    settingUI(){
        const container = this.scene.add.container(gameConfig.scale.width * 0.15, gameConfig.scale.height * 0.94)
        const outerCircle = this.scene.add.sprite(0, 0, "circleBg").setScale(0.75)
        const settingSprite = [
            this.scene.textures.get("settingButton"),
            this.scene.textures.get("settingButton"),
        ]
        this.settingButton = new InteractiveBtn(this.scene, settingSprite, ()=>{
            this.popupManager.showSettingPopup({})
        }, 9, true)
        this.settingButton.setScale(0.7)
        container.add([outerCircle, this.settingButton])
    }
    //Sound Button UI
    soundUI(){
        const container = this.scene.add.container(gameConfig.scale.width * 0.08, gameConfig.scale.height * 0.95)
        const outerCircle = this.scene.add.sprite(0, 0, "circleBg").setScale(0.42)
        const speakerSprite = currentGameData.speakerVolume ? this.scene.textures.get("soundOn"): this.scene.textures.get("soundOff")
        
        this.speakerButton = this.scene.add.sprite(0, 0, speakerSprite).setInteractive().setScale(0.4)
        this.speakerButton.on("pointerdown", ()=>{
            currentGameData.speakerVolume = !currentGameData.speakerVolume
            this.speakerButton.setScale(0.35)
            
        })
        this.speakerButton.on("pointerup", ()=>{
            if(currentGameData.speakerVolume){
                this.speakerButton.setTexture("soundOn")
            }else{
                this.speakerButton.setTexture("soundOff")
            }
            this.speakerButton.setScale(0.4)
        })
       
        container.add([outerCircle, this.speakerButton])
    }
    //Info Icon UI
    infoiconUI(){
        const container = this.scene.add.container(gameConfig.scale.width * 0.88, gameConfig.scale.height * 0.95)
        const outerCircle = this.scene.add.sprite(0, 0, "circleBg").setScale(0.42)
        const infoIconSprite = [
            this.scene.textures.get("infoIcon"),
            this.scene.textures.get("infoIcon"),
        ]
        this.infoIconButton = new InteractiveBtn(this.scene, infoIconSprite, ()=>{
            this.popupManager.showInfoPopup({})
        }, 8, true)
        this.infoIconButton.setScale(0.4)
        container.add([outerCircle, this.infoIconButton])

    }
}

class InteractiveBtn extends Phaser.GameObjects.Sprite {
    moveToPosition: number = -1;
    defaultTexture!: Phaser.Textures.Texture;
    hoverTexture!: Phaser.Textures.Texture

    constructor(scene: Phaser.Scene, textures: Phaser.Textures.Texture[], callback: () => void, endPos: number, visible: boolean) {
        super(scene, 0, 0, textures[0].key); // Use texture key
        this.defaultTexture = textures[0];
        this.hoverTexture = textures[1];        
        this.setOrigin(0.5);
        this.setInteractive();
        this.setVisible(visible);
        this.moveToPosition = endPos;
        this.on('pointerdown', () => {
            this.setTexture(this.hoverTexture.key)
            if(textures[0].key == "redCircle"){
                this.setScale(0.7)
            }else if(textures[0].key == "blueCircle"){
                this.setScale(0.7)
            }else if(textures[0].key == "greyCircle"){
                this.setScale(0.6)
            }else if(textures[0].key == "settingButton"){
                this.setScale(0.6)
            }else{
                this.setScale(0.35)
            }
            // this.setFrame(1);
            
            callback();
        });
        this.on('pointerup', () => {
            this.setTexture(this.defaultTexture.key)
            if(textures[0].key == "redCircle"){
                this.setScale(0.78)
            }else if(textures[0].key == "blueCircle"){
                this.setScale(0.9)
            }else if(textures[0].key == "greyCircle"){
                this.setScale(0.7)
            }
            else if(textures[0].key == "settingButton"){
                this.setScale(0.7)
            }
            else{
                this.setScale(0.4)
            }
        });
        this.on('pointerout', () => {
            
            this.setTexture(this.defaultTexture.key)
        });
        // Set up animations if necessary
        this.anims.create({
            key: 'hover',
            frames: this.anims.generateFrameNumbers(textures[1].key),
            frameRate: 10,
            repeat: -1
        });
    }
}