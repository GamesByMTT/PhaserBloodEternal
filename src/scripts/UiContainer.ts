import Phaser from "phaser";
import { Globals, ResultData, currentGameData, initData } from "./Globals";
import { Scene, GameObjects } from "phaser";
import { gameConfig } from "./appConfig";
import { PopupManager } from "./PopupManager";
import SoundManager from "./SoundManager";
import { TextLabel } from "./TextLabel";

export default class UiContainer extends GameObjects.Container {

    Soundmanager: SoundManager
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
    currentBet!: TextLabel
    totalBetAmount!: TextLabel
    currentWin!: TextLabel
    currentBalance!: TextLabel
    totalLine!: TextLabel
    spinText!: TextLabel
    public isSpinning: boolean = false;

    constructor(scene: Scene, spinCallBack: () => void, soundManager: SoundManager){
        super(scene);
        this.popupManager = new PopupManager(scene)
        scene.add.existing(this)
        this.Soundmanager = soundManager
        this.isSpinning = false
        this.betPerLineUI();
        this.totalBetUI();
        this.winUI();
        this.maxBetUI();
        this.spinUI(spinCallBack);
        this.doubleupUI();
        this.autoPlayUI(spinCallBack);
        this.settingUI();
        this.soundUI();
        this.infoiconUI();
        this.logout();
        this.bottomPanel()
        this.scene.events.on("updateWin", this.updateData, this)
        this.scene.events.on("redSmokeAnimation", this.redSmokeAnimation, this)
        this.scene.events.on("freeSpin", () => this.freeSpinStart(spinCallBack), this)
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
            if (!this.isSpinning) {
                this.increaseBet()
            }
        }, 0, true)
        this.betPlus.setPosition(80, 0).setScale(0.4)
        const minusButton = [
            this.scene.textures.get("minusButton"),
            this.scene.textures.get("minusButton")
        ]
        this.betMinus = new InteractiveBtn(this.scene, minusButton, ()=>{
            this.decreaseBet()
        }, 1, true)
        this.betMinus.setPosition(-80, 0).setScale(0.4)
        this.currentBet = new TextLabel(this.scene, 0, -20, initData.gameData.Bets[currentGameData.currentBetIndex], 30, "#ffffff").setOrigin(0.5)
        const betPerLineText = this.scene.add.text(0, 20, "Bet/Lines", { fontFamily: "Deutsch", fontSize: "25px", color: "#fff" }).setOrigin(0.5)
        container.add([betPanel, plusCircle, minusCircle, this.currentBet, betPerLineText, this.betPlus, this.betMinus])

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
            if (!this.isSpinning) {
                this.increaseBet()
            }
        },2, true)
        this.totalBetPlus.setPosition(80, 0).setScale(0.4)
        const minusButton = [
            this.scene.textures.get("minusButton"),
            this.scene.textures.get("minusButton")
        ]
        this.totalBetMinus = new InteractiveBtn(this.scene, minusButton, ()=>{
            if (!this.isSpinning) {
                this.decreaseBet()
            }
        }, 3, true)
        this.totalBetMinus.setPosition(-80, 0).setScale(0.4)
        this.totalBetAmount = new TextLabel(this.scene, 0, -20, (initData.gameData.Bets[currentGameData.currentBetIndex] * initData.gameData.Lines.length).toString(), 30, "#ffffff").setOrigin(0.5)
        const totalBetText = this.scene.add.text(0, 20, "Total Bet", { fontFamily: "Deutsch", fontSize: "25px", color: "#fff" }).setOrigin(0.5)
        container.add([totalBetPanel, plusCircle, minusCircle, this.totalBetAmount, totalBetText, this.totalBetPlus, this.totalBetMinus])
    }
    //Win UI with win amount
    winUI(){
        const container = this.scene.add.container(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.95)
        const winPanel = this.scene.add.sprite(0, -5, "winPanel").setScale(0.95);

        const winText = this.scene.add.text(0, 20, "Win", { fontFamily: "Deutsch", fontSize: "27px", color: "#fff" }).setOrigin(0.5)
        this.currentWin = new TextLabel(this.scene, 0, -25, ResultData.playerData.currentWining, 30, "#ffffff").setOrigin(0.5)
        container.add([winPanel, this.currentWin, winText])

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
            if(!this.isSpinning){
                this.buttonMusic("buttonpressed")
                currentGameData.currentBetIndex = initData.gameData.Bets.length - 1;
                const currentBet = initData.gameData.Bets[currentGameData.currentBetIndex];
                const betAmount = initData.gameData.Bets[currentGameData.currentBetIndex] * initData.gameData.Lines.length
                this.currentBet.updateLabelText(currentBet)
                this.totalBetAmount.updateLabelText(betAmount.toString())
            }
            
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
    spinUI(spinCallBack: () => void){
        currentGameData.gambleOpen = false
        const container = this.scene.add.container(gameConfig.scale.width * 0.67, gameConfig.scale.height * 0.94)
        const redCircle = this.scene.add.sprite(0, 0, "circleBg").setScale(0.78)
        const spinText = this.scene.add.text(0, 0, "Spin",{fontFamily: "Deutsch", fontSize: "35px", color:"#ffffff",}).setOrigin(0.5)
        const spinTexture = [
            this.scene.textures.get("redCircle"),
            this.scene.textures.get("redCircle")
        ]
        this.spinButton = new InteractiveBtn(this.scene, spinTexture, ()=>{
            console.log(this.isSpinning);
            if (this.isSpinning) return;
            this.buttonMusic("spinButton")
            this.startSpining(spinCallBack)
        }, 5, true)
        this.spinButton.setScale(0.75)
        container.add([redCircle, this.spinButton, spinText])
    }

    startSpining(spinCallBack: () => void){
        this.isSpinning = true;
        this.spinText.updateLabelText("");
        this.onSpin(true)
        Globals.Socket?.sendMessage("SPIN", { 
                currentBet: currentGameData.currentBetIndex, 
                currentLines: initData.gameData.Lines.length, 
                spins: 1 
        });
        spinCallBack();
        // Reset the flag after some time or when spin completes
        setTimeout(() => {
            this.isSpinning = false;
        }, 1200); // Adjust timeout as needed
    }

    freeSpinStart(spinCallBack: () => void){
        currentGameData.gambleOpen = false
        this.isSpinning = true;
        this.spinText.updateLabelText("");
        this.onSpin(true)
        Globals.Socket?.sendMessage("SPIN", { 
            currentBet: currentGameData.currentBetIndex, 
            currentLines: initData.gameData.Lines.length, 
            spins: 1 
        });
        spinCallBack();
            // Reset the flag after some time or when spin completes
        // setTimeout(() => {
        //     this.isSpinning = false;
        // }, 1200); // Adjust timeout as needed
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
            this.buttonMusic("buttonpressed")
            console.log(currentGameData.gambleOpen, "currentGameData.gambleOpen");
            if(ResultData.playerData.currentWining > 0 && !currentGameData.gambleOpen){
                Globals.Socket?.sendMessage("GAMBLEINIT", { id: "GAMBLEINIT" });
                this.popupManager.showGamblePopup({})
            }
            
        }, 6, true).disableInteractive()
        const doubleUPText = this.scene.add.text(0, 0, "Double\nUp", {fontFamily: "Deutsch", fontSize: "28px", color:"#ffffff", align:"center"}).setOrigin(0.5)
        // this.doubleUPButton.on("pointerdown", ()=>{
        //     doubleUPText.setScale(0.8)
        // })
        // this.doubleUPButton.on("pointerup", ()=>{
        //     doubleUPText.setScale(1);
        // })
        this.doubleUPButton.setScale(0.7)
        container.add([outerCircle, this.doubleUPButton, doubleUPText])
    }
    //Auto Play Button UI
    autoPlayUI(spinCallBack: () => void){
        const container = this.scene.add.container(gameConfig.scale.width * 0.81, gameConfig.scale.height * 0.94)
        const outerCircle = this.scene.add.sprite(0, 0, "circleBg").setScale(0.75)
        const autoPlay = [
            this.scene.textures.get("blueCircle"),
            this.scene.textures.get("blueCircle")
        ]
        this.autoPlayButton = new InteractiveBtn(this.scene, autoPlay, ()=>{
            if(this.isSpinning){
                this.isSpinning = false
                currentGameData.isAutoSpin = !currentGameData.isAutoSpin
                return
            }else{
                this.buttonMusic("buttonpressed")
                currentGameData.isAutoSpin = !currentGameData.isAutoSpin
                this.freeSpinStart(spinCallBack)
            }
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
            this.buttonMusic("buttonpressed")
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
            this.buttonMusic("buttonpressed")
            currentGameData.speakerVolume = !currentGameData.speakerVolume
            currentGameData.globalSound = !currentGameData.globalSound
            this.Soundmanager.toggleAllSounds(currentGameData.globalSound);
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
            this.buttonMusic("buttonpressed")
            this.popupManager.showInfoPopup({})
        }, 8, true)
        this.infoIconButton.setScale(0.4)
        container.add([outerCircle, this.infoIconButton])

    }

    bottomPanel(){
        const container = this.scene.add.container(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.85)
        const spritePanel = this.scene.add.sprite(0, 0, "borderBottom").setScale(1.1)
        const balanceText = this.scene.add.text(gameConfig.scale.width * 0.2, gameConfig.scale.height * 0.84, "Balance", {fontFamily: "Deutsch", fontSize: "30px", color: "#ffffff"})
        this.currentBalance = new TextLabel(this.scene, gameConfig.scale.width * 0.31, gameConfig.scale.height * 0.86, ResultData.playerData.Balance.toFixed(2), 35, "#ffffff", "Deutsch")
        this.spinText = new TextLabel(this.scene, gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.855, "Press Spin To Play", 35, "#ffffff", "CinzelDecorative")
        const lineText = this.scene.add.text(gameConfig.scale.width * 0.68, gameConfig.scale.height * 0.84, "Lines", {fontFamily: "Deutsch", fontSize: "35px", color: "#ffffff"})
        this.totalLine = new TextLabel(this.scene, gameConfig.scale.width * 0.8, gameConfig.scale.height * 0.86, initData.gameData.Lines.length, 35, "#ffffff", "Deutsch")
        container.add([spritePanel])
        // this.add(this.currentBalance)
    }

    logout(){
        const conatiner = this.scene.add.container(gameConfig.scale.width * 0.92, gameConfig.scale.height * 0.17)
        const outerCircle = this.scene.add.sprite(0, 0, "circleBg").setScale(0.45)
        const logoutButton = this.scene.add.sprite(0, 0, "closeButton").setScale(0.43).setInteractive()
        logoutButton.on("pointerdown",()=>{
            this.buttonMusic("buttonpressed")
            logoutButton.setScale(0.4)
            this.popupManager.showLogoutPopup({})
        })
        logoutButton.on("pointerup", ()=>{
            logoutButton.setScale(0.43)
        })

        conatiner.add([outerCircle, logoutButton])
    }
    onSpin(spin: boolean){
        if(spin){
            this.betPlus.disableInteractive()
            this.betMinus.disableInteractive()
            this.spinButton.disableInteractive();
            this.totalBetPlus.disableInteractive();
            this.totalBetMinus.disableInteractive();
            this.maxbetButton.disableInteractive()
            this.doubleUPButton.disableInteractive();
            this.infoIconButton.disableInteractive();
            // this.autoPlayButton.disableInteractive();
            this.settingButton.disableInteractive();
            this.doubleUPButton.setTexture("greyCircle")
        }else{
            if(ResultData.playerData.currentWining > 0){
                this.doubleUPButton.setTexture("blueCircle")
                this.doubleUPButton.setInteractive()
            }
            this.betPlus.setInteractive()
            this.betMinus.setInteractive()
            this.spinButton.setInteractive();
            this.totalBetPlus.setInteractive();
            this.totalBetMinus.setInteractive();
            this.maxbetButton.setInteractive()
            this.infoIconButton.setInteractive();
            // this.autoPlayButton.setInteractive()
            this.settingButton.setInteractive();
        }
    }
    increaseBet(){
        this.buttonMusic("buttonpressed")
        currentGameData.currentBetIndex++;
        if (currentGameData.currentBetIndex >= initData.gameData.Bets.length) {
            currentGameData.currentBetIndex = initData.gameData.Bets.length - 1;
        }
        const currentBet = initData.gameData.Bets[currentGameData.currentBetIndex];
        const betAmount = initData.gameData.Bets[currentGameData.currentBetIndex] * initData.gameData.Lines.length
        this.currentBet.updateLabelText(currentBet)
        this.totalBetAmount.updateLabelText(betAmount.toString())

    }
    decreaseBet(){
        this.buttonMusic("buttonpressed")
        if (!this.isSpinning) {
            currentGameData.currentBetIndex--;
            if (currentGameData.currentBetIndex < 0) {
                currentGameData.currentBetIndex = 0;
            }
            const currrentBet = initData.gameData.Bets[currentGameData.currentBetIndex];
            const betAmount = initData.gameData.Bets[currentGameData.currentBetIndex] * initData.gameData.Lines.length;
            this.currentBet.updateLabelText(currrentBet);
            this.totalBetAmount.updateLabelText(betAmount.toString());
        }
    }
    updateData(){
        this.currentWin.updateLabelText(ResultData.playerData.currentWining.toFixed(3).toString())
        this.currentBalance.updateLabelText(ResultData.playerData.Balance.toFixed(2))
        if(ResultData.playerData.currentWining > 0){
            this.spinText.updateLabelText(`You Won ${ResultData.playerData.currentWining.toFixed(3)}!`)
        }else{
            this.spinText.updateLabelText("Better Luck Next Time")
            if(ResultData.gameData.isFreeSpin || currentGameData.isAutoSpin){
                this.scene.events.emit("freeSpin")
            }
        }
    }

    redSmokeAnimation() {
        this.Soundmanager.playSound("winMusic")
        currentGameData.gambleOpen = false
        // Add dark overlay background
        const overlay = this.scene.add.graphics();
        overlay.setDepth(9); // Make sure it's behind the smoke and text
        
        // Fill with semi-transparent black
        overlay.fillStyle(0x000000, 0.9); // Color: black, Alpha: 0.7 (adjust alpha for transparency)
        overlay.fillRect(0, 0, gameConfig.scale.width, gameConfig.scale.height);
       
        
        // Create smoke screen animation frames
        const smokeScreen = [];
        for(let j = 0; j < 27; j++){
            smokeScreen.push({key: `RedSmoke${j}`});
        }
        if (!this.scene.anims.exists('RedSmokeScreen')) {
            this.scene.anims.create({
                key: 'RedSmokeScreen',
                frames: smokeScreen,
                frameRate: 20,
                repeat: 0,
                duration: 1400
            });
        }
        const targetAmount = ResultData.playerData.currentWining;
        const smokeContainer = this.scene.add.container(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.5)
        smokeContainer.setDepth(15);

        const smokeSprite = this.scene.add.sprite(0, 0, 'RedSmoke0')
            .setScale(2)
            .setVisible(false);

        // Create winning amount text centered on the mask
        const winText = this.scene.add.text(0, 0, '0', {
            fontSize: '64px',
            color: '#FFD700',
            fontFamily: 'Deutsch',
            align: "center"
        }).setOrigin(0.5);

        smokeSprite.setVisible(true);

        // Fade in overlay
        this.scene.tweens.add({
            targets: overlay,
            alpha: { from: 0, to: 0.7 },
            duration: 300,
            ease: 'Linear',
            onComplete: () => {
                smokeSprite.play('RedSmokeScreen');
            }
        });

        // Format number function
        const formatNumber = (num: number) => {
            // Handle different decimal places based on the number size
            if (num < 0.01) {
                return num.toFixed(6); // Show more decimals for very small numbers
            } else if (num < 1) {
                return num.toFixed(3); // Show 3 decimals for numbers less than 1
            } else {
                return num.toFixed(2); // Show 2 decimals for numbers >= 1
            }
        };

        // Calculate appropriate step size based on target amount
        const steps = 50; // Number of steps for the animation
        const stepSize = targetAmount / steps;
        let currentValue = 0;

        // Create a custom counter
        const counter = this.scene.time.addEvent({
            delay: 1000 / steps, // Distribute steps over 1 second
            callback: () => {
                currentValue += stepSize;
                if (currentValue >= targetAmount) {
                    currentValue = targetAmount;
                    counter.remove();
                }
                winText.setText(formatNumber(currentValue));
            },
            repeat: steps - 1
        });

        smokeContainer.add([smokeSprite, winText]);

        // Clean up after smoke animation
        smokeSprite.on('animationcomplete', () => {
            this.scene.tweens.add({
                targets: overlay,
                alpha: 0,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {
                    overlay.destroy();
                    smokeSprite.destroy();
                    startMovementAnimation();
                    // winText.destroy();
                     // Create a more complex animation timeline
                    smokeContainer.destroy();
                    // this.scene.events.emit("increamentDone")
                }
            });
        });

        const startMovementAnimation = () => {
            // Remove text from container and add it directly to the scene
            smokeContainer.remove(winText);
            this.scene.add.existing(winText);
       
            // Calculate global position
            const globalPos = smokeContainer.getWorldTransformMatrix().transformPoint(0, 0);
            winText.setPosition(globalPos.x, globalPos.y);
       
            // Create movement animation
            this.scene.tweens.add({
                targets: winText,
                x: gameConfig.scale.width * 0.5,
                y: gameConfig.scale.height * 0.95 - 25,
                scale: { from: 1, to: 0.3 },
                alpha: { from: 1, to: 0 },
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                    winText.destroy();
                    this.scene.events.emit("increamentDone");
                    this.onSpin(false)
                }
            });
       
            // Fade out overlay and cleanup
            this.scene.tweens.add({
                targets: overlay,
                alpha: 0,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {
                    overlay.destroy();
                    smokeSprite.destroy();
                    smokeContainer.destroy();
                }
            });
        };
       
    }
    buttonMusic(key: string){
        this.Soundmanager.playSound("buttonpressed")
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
                this.setScale(0.7)
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
            }else if(textures[0].key == "settingButton"){
                this.setScale(0.7)
            }
            else{
                this.setScale(0.4)
            }
        });
        this.on('pointerover', () => {
            this.setTexture(this.hoverTexture.key)
            if(textures[0].key == "redCircle"){
                this.setScale(0.75)
            }else if(textures[0].key == "blueCircle"){
                this.setScale(0.75)
            }else if(textures[0].key == "greyCircle"){
                this.setScale(0.65)
            }else if(textures[0].key == "settingButton"){
                this.setScale(0.65)
            }else{
                this.setScale(0.35)
            }
        })
        this.on('pointerout', () => {
            this.setTexture(this.defaultTexture.key)
            this.setTexture(this.defaultTexture.key)
            if(textures[0].key == "redCircle"){
                this.setScale(0.78)
            }else if(textures[0].key == "blueCircle"){
                this.setScale(0.9)
            }else if(textures[0].key == "greyCircle"){
                this.setScale(0.7)
            }else if(textures[0].key == "settingButton"){
                this.setScale(0.7)
            }
            else{
                this.setScale(0.4)
            }
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