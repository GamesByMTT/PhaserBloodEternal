import Phaser from "phaser";
import { Globals, ResultData, currentGameData, initData } from "./Globals";
import { Scene, GameObjects } from "phaser";
import { gameConfig } from "./appConfig";
import SoundManager from "./SoundManager";

export default class UiContainer extends GameObjects.Container {

    Soundmanager!: SoundManager
    betPlus!: InteractiveBtn
    betMinus!: InteractiveBtn
    totalBetPlus!: InteractiveBtn
    totalBetMinus!: InteractiveBtn

    constructor(scene: Scene){
        super(scene);
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
        container.add([betPanel, plusCircle, minusCircle, this.betPlus, this.betMinus])

    }
    //Total Bet UI with plus and minus button
    totalBetUI(){
        const container = this.scene.add.container(gameConfig.scale.width * 0.37, gameConfig.scale.height * 0.95)
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
        container.add([totalBetPanel, plusCircle, minusCircle, this.totalBetPlus, this.totalBetMinus])
    }
    //Win UI with win amount
    winUI(){
        const container = this.scene.add.container(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.95)
        

    }
    //Max Bet Button to increase maximum bet
    maxBetUI(){

    }
    //Spin button
    spinUI(){

    }
    //doubleupUI
    doubleupUI(){

    }
    //Auto Play Button UI
    autoPlayUI(){

    }
    //Settiing Button UI
    settingUI(){

    }
    //Sound Button UI
    soundUI(){

    }
    //Info Icon UI
    infoiconUI(){

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
            // this.setFrame(1);
            this.setScale(0.35)
            callback();
        });
        this.on('pointerup', () => {
            this.setTexture(this.defaultTexture.key)
            this.setScale(0.4)
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