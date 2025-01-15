import { Scene, GameObjects, Scale, } from "phaser";
import { Globals, ResultData, currentGameData, initData } from "../scripts/Globals";
import UiContainer from "../scripts/UiContainer";
import { PopupManager } from "../scripts/PopupManager";
import Slots from "../scripts/Slots";
import SoundManager from "../scripts/SoundManager";
import { gameConfig } from "../scripts/appConfig";
import { LineGenerator } from "../scripts/LineGenrater";
import LineSymbols from "../scripts/LineSymbols";

export default class MainScene extends Scene {
    Background!: GameObjects.Sprite
    slots!: Slots
    soundManager!: SoundManager
    candles!: GameObjects.Sprite
    logo!: GameObjects.Sprite
    candleOne!: GameObjects.Sprite
    candleTwo!: GameObjects.Sprite
    candleThree!: GameObjects.Sprite
    candleFour!: GameObjects.Sprite
    candleFive!: GameObjects.Sprite
    reelBg!: GameObjects.Sprite
    lineGenrator!: LineGenerator
    lineSymbols!: LineSymbols
    uiContainer!: UiContainer
    private mainContainer!: Phaser.GameObjects.Container
    popupManager!: PopupManager
    redReelAnim: Phaser.Types.Animations.AnimationFrame[] = []
    purpleReelAnim: Phaser.Types.Animations.AnimationFrame[] = []
    redReelSpite!: GameObjects.Sprite
    purpleReelSprite!: GameObjects.Sprite
    purplesymbolAnim: Phaser.Types.Animations.AnimationFrame[] = []
    public backgroundAnimContainer!: Phaser.GameObjects.Container;
    purpleSymbol!:GameObjects.Sprite
    mVampire: Phaser.Types.Animations.AnimationFrame[] = []
    wVampire: Phaser.Types.Animations.AnimationFrame[] = []
    vampireMale!: Phaser.GameObjects.Sprite;
    vampireFemale!: Phaser.GameObjects.Sprite;
    constructor() {
        super({key: 'MainScene'})
    }
    create(){
        this.backgroundAnimContainer = this.add.container();
        this.popupManager = new PopupManager(this)
        this.soundManager = new SoundManager(this)
        const {width, height} = this.cameras.main;
        this.mainContainer = this.add.container()
        this.Background = new Phaser.GameObjects.Sprite(this, width/2, height/2, "Background");
        this.logo = new Phaser.GameObjects.Sprite(this, width/2, height * 0.1, "bloodEternal").setOrigin(0.5).setScale(0.82);
        this.candles = new Phaser.GameObjects.Sprite(this, width * 0.95, height * 0.82, "candles").setOrigin(0.5).setScale(0.7);
        this.reelBg = new GameObjects.Sprite(this, width * 0.5, height * 0.471, "reelBg").setOrigin(0.5)
        this.soundManager.playSound("backgroundMusic");
        this.setupFocusBlurEvents()
        const falmeAnim: Phaser.Types.Animations.AnimationFrame[] = []
        for (let i = 0; i < 64; i++) {
            falmeAnim.push({key: `flame${i}`})
        }
        this.anims.create({
            key: 'flame',
            frames: falmeAnim,
            frameRate: 30,
            repeat: -1
        })

        this.candleOne = new Phaser.GameObjects.Sprite(this, width * 0.898, height * 0.82, "flame0").setOrigin(0.5)
        this.candleTwo = new Phaser.GameObjects.Sprite(this, width * 0.927, height * 0.92, "flame0").setOrigin(0.5).setScale(0.7).setAngle(-25);
        this.candleThree = new Phaser.GameObjects.Sprite(this, width * 0.919, height * 0.63, "flame0").setOrigin(0.5).setAngle(-25)
        this.candleFour = new GameObjects.Sprite(this, width * 0.97, height * 0.815, "flame0").setOrigin(0.5).setAngle(-25).setScale(0.9)
        this.candleFive = new GameObjects.Sprite(this, width * 0.973, height * 0.71, "flame0").setOrigin(0.5).setAngle(-25)
        this.candleOne.play("flame")
        this.candleTwo.play("flame")
        this.candleThree.play("flame")
        this.candleFour.play("flame")
        this.candleFive.play("flame")
        this.redReelSpite = new Phaser.GameObjects.Sprite(this, this.cameras.main.width * 0.21, this.cameras.main.height * 0.455, "redReel0").setOrigin(0.5).setScale(0.9, 1).setVisible(false)
        this.purpleReelSprite = new Phaser.GameObjects.Sprite(this, this.cameras.main.width * 0.5, this.cameras.main.height * 0.45, "purpleReel0").setOrigin(0.5).setVisible(false).setScale(0.9, 1)
       
        this.uiContainer = new UiContainer(this, () => this.onSpinCallBack(), this.soundManager)

        for(let i = 0; i < 18; i++){
            this.redReelAnim.push({key: `redReel${i}`})
            this.purpleReelAnim.push({key: `purpleReel${i}`})
        }
        this.anims.create({
            key: 'red',
            frames: this.redReelAnim,
            frameRate: 20,
            repeat: -1
        })
        this.anims.create({
            key: 'purple',
            frames: this.purpleReelAnim,
            frameRate: 20,
            repeat: -1
        })

        for(let j = 0; j < 36; j++){
            this.purplesymbolAnim.push({key: `purpleSymbol${j}`})
        }
        this.anims.create({
            key: 'purpleSymbol',
            frames: this.purplesymbolAnim,
            frameRate: 20,
            repeat: -1
        })
        this.mainContainer.add([this.Background, this.candles, this.logo,this.reelBg, this.backgroundAnimContainer, this.redReelSpite, this.purpleReelSprite, this.candleOne, this.candleTwo, this.candleThree, this.candleFour, this.candleFive,  this.uiContainer]);
        
        for(let p = 0; p < 14; p++){
            this.mVampire.push({key: `maleVampire${p}`});
            this.wVampire.push({key: `womanVampire${p}`});
        }

        this.anims.create({
            key: 'maleVampire',
            frames: this.mVampire,
            frameRate: 25,
            repeat: 0
        })

        this.anims.create({
            key: 'womanVampire',
            frames: this.wVampire,
            frameRate: 25,
            repeat: 0
        })
        this.vampireMale = new Phaser.GameObjects.Sprite(this, gameConfig.scale.width * 0.38, gameConfig.scale.height * 0.24, 'maleVampire0').setOrigin(0.5).setScale(0.95).setVisible(false);
        this.vampireMale.play('maleVampire');
        // this.
        this.vampireFemale = new Phaser.GameObjects.Sprite(this, gameConfig.scale.width * 0.38, gameConfig.scale.height * 0.24, 'womanVampire0').setOrigin(0.5).setScale(0.95).setVisible(false);
        this.vampireFemale.play('womanVampire')

        this.slots = new Slots(this, this.uiContainer, ()=> this.onResultCallBack(), this.soundManager)
        this.lineGenrator = new LineGenerator(this, this.slots.slotSymbols[0][0].symbol.height, this.slots.slotSymbols[0][0].symbol.width + 10);
        this.lineSymbols = new LineSymbols(this, this.slots.slotSymbols[0][0].symbol.height, this.slots.slotSymbols[0][0].symbol.width + 10, this.lineGenrator);
        this.mainContainer.add([this.lineGenrator, this.slots, this.vampireMale,  this.vampireFemale])
        this.redReelCotainer()
    }

    redReelCotainer(){        
        this.redReelSpite.setPosition(this.slots.slotMask.x + (this.slots.symbolWidth * 2) + 44, this.cameras.main.height * 0.455)
        this.redReelSpite.play("red")
        this.purpleReelSprite.setPosition(this.slots.slotMask.x + (this.slots.symbolWidth * 2) + 44, this.cameras.main.height * 0.455)
        this.purpleReelSprite.play("purple")
    }
    onSpinCallBack(){
        this.soundManager.playSound("onSpin")
        this.slots.moveReel();
        this.lineGenrator.hideLines();
    }
    onResultCallBack(){
        if(ResultData.playerData.currentWining == 0){
            this.uiContainer.onSpin(false);
        }
        // this.lineGenrator.showLines(ResultData.gameData.linesToEmit)
    }

    linesToShow(index: number[]){
        this.lineGenrator.showLines(index)
    }
    hideLines(){
        this.lineGenrator.hideLines()
    }

    shutdown() {
        if (this.popupManager) {
            this.popupManager.destroy();
        }
    }

    /**
     * @method recievedMessage called from MyEmitter
     * @param msgType ResultData
     * @param msgParams any
     * @description this method is used to update the value of textlabels like Balance, winAmount freeSpin which we are reciving after every spin
     */
    recievedMessage(msgType: string, msgParams: any) {        
        if(msgType == "ResultData"){
            setTimeout(() => {
                this.slots.stopTween();
            }, currentGameData.turboMode ? 500 : 1000);
            
        }
        if(msgType == "gambleResponse"){
            this.events.emit("gambleSceneResult")
        }
    }

    private setupFocusBlurEvents() {
        window.addEventListener('blur', () => {
                this.soundManager.stopSound('backgroundMusic');
        });

        window.addEventListener('focus', () => {
            if(currentGameData.musicMode){
                this.soundManager.playSound('backgroundMusic');
            }
        });
    }
    
}