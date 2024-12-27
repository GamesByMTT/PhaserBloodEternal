import { Scene, GameObjects } from "phaser";
import { gameConfig } from "../appConfig";
import { Globals, ResultData, currentGameData } from "../Globals";
import { TextLabel } from "../TextLabel";


export default class GamblePopup extends Phaser.GameObjects.Container{
    bankAmount!: TextLabel
    betAmount!: TextLabel
    winAmount!: TextLabel
    fullAmount: boolean = true
    halfAmount: boolean = false
    fullAmountSprite!: GameObjects.Sprite
    halfAmountSprite!: GameObjects.Sprite
    coinAnim!: GameObjects.Sprite
    
    constructor(scene: Scene, data: any){
        super(scene, 0, 0);
        
        const bg = scene.add.sprite( scene.scale.width / 2,scene.scale.height / 2, "popupBgSprite");
        const headingBg = scene.add.sprite(gameConfig.scale.width * 0.5, bg.y - bg.height / 2 + 50, "headingBg").setScale(0.7)
        // Add content
        const title = scene.add.text(gameConfig.scale.width * 0.5, bg.y - bg.height / 2 + 50, 'Double Up', { fontFamily:"Deutsch", fontSize: '35px', color: '#ffffff', align:"center" } ).setOrigin(0.5);
        
        const headsButton = this.scene.add.sprite(gameConfig.scale.width * 0.52, gameConfig.scale.height * 0.33, "previousButton").setInteractive().setScale(0.75)
        const headText = this.scene.add.text(headsButton.x, headsButton.y, "Heads", {fontFamily: "Deutsch", fontSize: '30px', color: '#ffffff'}).setOrigin(0.5);
        const tailButton = this.scene.add.sprite(gameConfig.scale.width * 0.7, gameConfig.scale.height * 0.33, "nextButton").setInteractive().setScale(0.75)
        const tailText = this.scene.add.text(tailButton.x, tailButton.y, "Tails", {fontFamily: "Deutsch", fontSize: '30px', color: '#ffffff'}).setOrigin(0.5)

        const indsideRedBox = this.scene.add.sprite(gameConfig.scale.width * 0.62, gameConfig.scale.height * 0.6, "insideGamble").setOrigin(0.5).setScale(1.1)

        const bankText = this.scene.add.text(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.42, "Bank", {fontFamily: "Deutsch", fontSize: "27px", color:"#c6c6c6"}).setOrigin(0.5)
        const betText = this.scene.add.text(gameConfig.scale.width * 0.62, gameConfig.scale.height * 0.42, "Bet", {fontFamily: "Deutsch", fontSize: "27px", color:"#c6c6c6"}).setOrigin(0.5)
        const potentialWin = this.scene.add.text(gameConfig.scale.width * 0.74, gameConfig.scale.height * 0.42, "Potential\nWin", {fontFamily: "Deutsch", fontSize: "27px", color:"#c6c6c6", align:"center"}).setOrigin(0.5)
        const bankButtonBg = this.scene.add.sprite(bankText.x,  gameConfig.scale.height * 0.48, "nextButton").setScale(0.75)
        const betButtonBg = this.scene.add.sprite(betText.x, gameConfig.scale.height * 0.48, "nextButton").setScale(0.75)
        const potentialButtonBg = this.scene.add.sprite(potentialWin.x, gameConfig.scale.height * 0.48, "nextButton").setScale(0.75)
        this.bankAmount = new TextLabel(this.scene, bankButtonBg.x, bankButtonBg.y, ResultData.playerData.currentWining.toFixed(3), 30, "#ffffff", "Deutsch").setOrigin(0.5)
        this.betAmount = new TextLabel(this.scene, betButtonBg.x, betButtonBg.y, ResultData.playerData.currentWining.toFixed(3), 30, "#ffffff", "Deutsch").setOrigin(0.5)
        this.winAmount = new TextLabel(this.scene, potentialButtonBg.x, potentialButtonBg.y, (ResultData.playerData.currentWining * 2).toFixed(3), 30, "#ffffff", "Deutsch").setOrigin(0.5)
        const collectButtonBg = this.scene.add.sprite(gameConfig.scale.width * 0.62, gameConfig.scale.height * 0.71, "nextButton").setScale(0.9).setInteractive().setOrigin(0.5)
        const collecText = this.scene.add.text(collectButtonBg.x, collectButtonBg.y, "Collect", {fontFamily: "Deutsch", fontSize: '30px', color: '#ffffff'}).setOrigin(0.5)
        const gambleAllText = this.scene.add.text(gameConfig.scale.width * 0.52, gameConfig.scale.height * 0.59, "Gamble All", {fontFamily: "Deutsch", fontSize: '27px', color: '#ffffff'}).setOrigin(0.5)
        const gambleOuterCircle = this.scene.add.sprite(gameConfig.scale.width * 0.57, gameConfig.scale.height * 0.59, "circleBg").setScale(0.3).setOrigin(0.5).setInteractive()
        const gambleFiftyText = this.scene.add.text(gameConfig.scale.width * 0.7, gameConfig.scale.height * 0.59, "Gamble 50%", {fontFamily: "Deutsch", fontSize: '27px', color: '#ffffff'}).setOrigin(0.5)
        const gambleFiftyOuterCircle = this.scene.add.sprite(gameConfig.scale.width * 0.75, gameConfig.scale.height * 0.59, "circleBg").setScale(0.3).setOrigin(0.5).setInteractive()
        this.fullAmountSprite = this.scene.add.sprite(gameConfig.scale.width * 0.57, gameConfig.scale.height * 0.59, 
            this.fullAmount ? "blueCircle" : "blankCircle").setScale(0.3).setOrigin(0.5)

        const coinOuterCircle = this.scene.add.sprite(gameConfig.scale.width * 0.3, gameConfig.scale.height * 0.5, "coinBg").setOrigin(0.5).setScale(1.1)
        this.coinAnim = this.scene.add.sprite(coinOuterCircle.x, coinOuterCircle.y, "coin0").setScale(0.9)

       this.scene.anims.create({
        key: 'coinAnimation',
        frames:[
            {key: "coin0"},
            {key: "coin1"},
            {key: "coin2"},
            {key: "coin3"},
            {key: "coin4"},
            {key: "coin5"},
            {key: "coin6"},
            {key: "coin7"},
            {key: "coin8"},
            {key: "coin9"},
            {key: "coin10"},
            {key: "coin11"},
            {key: "coin12"},
            {key: "coin13"},
            {key: "coin14"},
            {key: "coin15"},
        ],
        frameRate: 24,
        repeat: -1
       })
        // this.toggleAmount(this.fullAmount, this.halfAmount)
        gambleOuterCircle.on("pointerdown", ()=>{
            this.toggleAmount(this.fullAmount, this.halfAmount)
            gambleOuterCircle.disableInteractive()
            gambleFiftyOuterCircle.setInteractive()
        })

        gambleFiftyOuterCircle.on("pointerdown", ()=>{
            this.toggleFiftyAmount(this.fullAmount, this.halfAmount)
            gambleOuterCircle.setInteractive()
            gambleFiftyOuterCircle.disableInteractive()
        })

        headsButton.on("pointerdown", ()=>{
          this.coinAnim.play("coinAnimation")
          setTimeout(() => {
            this.coinAnim.stop();
            this.coinAnim.setTexture("coin8");
        }, 2000); // Adjust time as needed
        })

        tailButton.on("pointerdown",()=>{
            this.coinAnim.play("coinAnimation")
            setTimeout(() => {
              this.coinAnim.stop();
              this.coinAnim.setTexture("coin0");
          }, 2000); // Adjust time as needed
        })

        collectButtonBg.on("pointerdown",()=>{
            this.scene.events.emit("closePopup")
        })

        this.add([bg, headingBg, title, headsButton, headText, tailButton, tailText, indsideRedBox, bankText,  betText, potentialWin, bankButtonBg,this.bankAmount, betButtonBg, this.betAmount, potentialButtonBg, this.winAmount, collectButtonBg, collecText, gambleAllText, gambleOuterCircle, gambleFiftyText, gambleFiftyOuterCircle,  this.fullAmountSprite, coinOuterCircle, this.coinAnim]);
    }

    toggleAmount(fullAmount: boolean, halfAmount: boolean){
        this.fullAmount = !this.fullAmount
        let betAmountNumber = ResultData.playerData.currentWining
        betAmountNumber.toFixed(3)
        let finalAmount =  ResultData.playerData.currentWining * 2 
        finalAmount.toFixed(3)
        if(this.fullAmountSprite){
            this.fullAmountSprite.destroy()
        }
        if(this.halfAmountSprite){
            this.halfAmountSprite.destroy()
        }
        this.betAmount.updateLabelText(betAmountNumber.toString())
        this.winAmount.updateLabelText(finalAmount.toString())
        this.fullAmountSprite = this.scene.add.sprite(gameConfig.scale.width * 0.57, gameConfig.scale.height * 0.59, 
            this.fullAmount ? "blueCircle" : "blankCircle").setScale(0.3).setOrigin(0.5)
       
        this.add([this.fullAmountSprite])   
    }

    toggleFiftyAmount(fullAmount: boolean, halfAmount: boolean){
        this.halfAmount = !this.halfAmount
        if(this.fullAmountSprite){
            this.fullAmountSprite.destroy()
        }
        if(this.halfAmountSprite){
            this.halfAmountSprite.destroy()
        }
        let newBetAmount = ResultData.playerData.currentWining/2
        newBetAmount.toFixed(3)
        let finalAmount = newBetAmount * 2
        finalAmount.toFixed(3)
        this.betAmount.updateLabelText(newBetAmount.toString())
        this.winAmount.updateLabelText(finalAmount.toString())
        this.halfAmountSprite = this.scene.add.sprite(gameConfig.scale.width * 0.75, gameConfig.scale.height * 0.59,  this.halfAmount ? "blueCircle": "blankCircle").setOrigin(0.5).setScale(0.3)
        this.add(this.halfAmountSprite)
    }
}