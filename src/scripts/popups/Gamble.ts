import { Scene, GameObjects } from "phaser";
import { gameConfig } from "../appConfig";
import { Globals, ResultData, currentGameData, gambleData, gambleResultData } from "../Globals";
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
    failCount!: 0
    private headsButton!: Phaser.GameObjects.Sprite;
    private tailsButton!: Phaser.GameObjects.Sprite;
    private gambleResponseHandler: any;
    
    constructor(scene: Scene, data: any){
        super(scene, 0, 0);
        this.failCount = 0
        currentGameData.gambleOpen = true;
        const bg = scene.add.sprite( scene.scale.width / 2,scene.scale.height / 2, "popupBgSprite");
        const headingBg = scene.add.sprite(gameConfig.scale.width * 0.5, bg.y - bg.height / 2 + 50, "headingBg").setScale(0.7)
        // Add content
        const title = scene.add.text(gameConfig.scale.width * 0.5, bg.y - bg.height / 2 + 50, 'Double Up', { fontFamily:"Deutsch", fontSize: '35px', color: '#ffffff', align:"center" } ).setOrigin(0.5);
        
        this.headsButton = this.scene.add.sprite(gameConfig.scale.width * 0.52, gameConfig.scale.height * 0.33, "previousButton").setInteractive().setScale(0.75)
        const headText = this.scene.add.text(this.headsButton.x, this.headsButton.y, "Heads", {fontFamily: "Deutsch", fontSize: '30px', color: '#ffffff'}).setOrigin(0.5);
        this.tailsButton = this.scene.add.sprite(gameConfig.scale.width * 0.7, gameConfig.scale.height * 0.33, "nextButton").setInteractive().setScale(0.75)
        const tailText = this.scene.add.text(this.tailsButton.x, this.tailsButton.y, "Tails", {fontFamily: "Deutsch", fontSize: '30px', color: '#ffffff'}).setOrigin(0.5)

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
        // this.gambleResponseHandler = this.handleGambleResponse.bind(this);
        this.setupCoinAnimation()
        this.addEventListeners()
        // if (!this.scene.anims.exists('coinAnimation')) {
        //     const frames = [];
        //     // Check if all textures exist before creating animation
        //     for (let i = 0; i <= 15; i++) {
        //         const textureKey = `coin${i}`;
        //         if (this.scene.textures.exists(textureKey)) {
        //             frames.push({ key: textureKey });
        //         }
        //     }
        
        //     if (frames.length > 0) {
        //         this.scene.anims.create({
        //             key: 'coinAnimation',
        //             frames: frames,
        //             frameRate: 24,
        //             repeat: -1
        //         });
        //     }
        // }
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

        // headsButton.on("pointerdown", () => {
        //     if (this.coinAnim && this.scene.anims.exists('coinAnimation')) {
        //         gambleData.selected = "HEAD";
        //         Globals.Socket.sendMessage("GAMBLERESULT", gambleData);
        //         this.playCoinAnimation();
        //     }
        // });
        
        // tailButton.on("pointerdown", () => {
        //     if (this.coinAnim && this.scene.anims.exists('coinAnimation')) {
        //         gambleData.selected = "TAIL";
        //         Globals.Socket.sendMessage("GAMBLERESULT", gambleData);
        //         this.playCoinAnimation();
        //     }
        // });

        collectButtonBg.on("pointerdown",()=>{
            this.failCount = 0
            this.scene.events.emit("gambleStateChanged", false);
            this.scene.events.emit("closePopup")
            // this.destroy()
            
        })
        this.scene.events.on("gambleSceneResult", this.handleGambleResponse, this)
        this.add([bg, headingBg, title, this.headsButton, headText, this.tailsButton, tailText, indsideRedBox, bankText,  betText, potentialWin, bankButtonBg,this.bankAmount, betButtonBg, this.betAmount, potentialButtonBg, this.winAmount, collectButtonBg, collecText, gambleAllText, gambleOuterCircle, gambleFiftyText, gambleFiftyOuterCircle,  this.fullAmountSprite, coinOuterCircle, this.coinAnim]);
    }

    private addEventListeners() {
        // Remove existing listeners first
        this.removeEventListeners();
    
        // Add button listeners
        this.headsButton.on('pointerdown', () => {
            gambleData.selected = "HEAD";
            Globals.Socket.sendMessage("GAMBLERESULT", gambleData);
            if (this.coinAnim && this.coinAnim.scene) {
                this.coinAnim.play("coinAnimation");
            }
        });
    
        this.tailsButton.on('pointerdown', () => {
            gambleData.selected = "TAIL";
            Globals.Socket.sendMessage("GAMBLERESULT", gambleData);
            if (this.coinAnim && this.coinAnim.scene) {
                this.coinAnim.play("coinAnimation");
            }
        });
    
        // Add scene event listener
        // this.scene.events.on("gambleSceneResult", this.gambleResponseHandler);
    }

    private removeEventListeners() {
        // Remove button listeners
        if (this.headsButton && this.headsButton.scene) {
            this.headsButton.removeAllListeners();
        }
        if (this.tailsButton && this.tailsButton.scene) {
            this.tailsButton.removeAllListeners();
        }
    
        // Remove scene event listener
        this.scene.events.off("gambleSceneResult", this.gambleResponseHandler);
    }

    private setupCoinAnimation() {
        // Remove existing animation if it exists
        if (this.scene.anims.exists('coinAnimation')) {
            this.scene.anims.remove('coinAnimation');
        }
    
        // Create new animation
        this.scene.anims.create({
            key: 'coinAnimation',
            frames: Array.from({ length: 16 }, (_, i) => ({ key: `coin${i}` })),
            frameRate: 24,
            repeat: -1
        });
    }

    private playCoinAnimation() {
        try {
            if (this.coinAnim && this.coinAnim.scene) {
                // Check if the texture exists before playing
                if (this.scene.textures.exists(this.coinAnim.texture.key)) {
                    this.coinAnim.play("coinAnimation");
                }
            }
        } catch (error) {
            console.error("Error playing coin animation:", error);
        }
    }

    toggleAmount(fullAmount: boolean, halfAmount: boolean){
        this.fullAmount = !this.fullAmount
        gambleData.gambleOption = "ALL"
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
         gambleData.gambleOption = "HALF"
        let newBetAmount = ResultData.playerData.currentWining/2
        newBetAmount.toFixed(3)
        let finalAmount = newBetAmount * 2
        finalAmount.toFixed(3)
        this.betAmount.updateLabelText(newBetAmount.toString())
        this.winAmount.updateLabelText(finalAmount.toString())
        this.halfAmountSprite = this.scene.add.sprite(gameConfig.scale.width * 0.75, gameConfig.scale.height * 0.59,  this.halfAmount ? "blueCircle": "blankCircle").setOrigin(0.5).setScale(0.3)
        this.add(this.halfAmountSprite)
    }
    handleGambleResponse(){
        if(!gambleResultData.gambleResponse.playerWon){
            this.failCount++
        }
        console.log(this.failCount, "this.failCount");
        
        setTimeout(() => {
            if (this.coinAnim && this.coinAnim.scene) {
                this.coinAnim.stop();
                const textureKey = gambleResultData.gambleResponse.coin === "TAIL" ? "coin0" : "coin8";
                if (this.scene.textures.exists(textureKey)) {
                    this.coinAnim.setTexture(textureKey);
                }
            }
    
            if (gambleResultData.gambleResponse.currentWinning === 0 || this.failCount > 3) {
                this.failCount = 0;
                this.scene.events.emit("gambleStateChanged", false);
                // this.destroy();
                this.scene.events.emit("closePopup");
            }
        }, 2000);

        this.bankAmount.updateLabelText((gambleResultData.gambleResponse.currentWinning).toFixed(3).toString())
        let newBet
        if(this.halfAmount){
            newBet = gambleResultData.gambleResponse.currentWinning/2
            this.betAmount.updateLabelText(newBet.toFixed(3).toString())
            this.winAmount.updateLabelText((newBet*2).toFixed(3).toString())
        }else{
            this.betAmount.updateLabelText(gambleResultData.gambleResponse.currentWinning.toFixed(3).toString())
            this.winAmount.updateLabelText((gambleResultData.gambleResponse.currentWinning * 2).toFixed(3).toString())
        }
    }

    destroy() {
        // Clean up resources
        this.removeEventListeners();
        
        // Stop any running animations
        if (this.coinAnim && this.coinAnim.scene) {
            this.coinAnim.stop();
        }
    
        // Remove the animation
        if (this.scene && this.scene.anims.exists('coinAnimation')) {
            this.scene.anims.remove('coinAnimation');
        }
    
        // Call parent's destroy method
        super.destroy();
    }
}