import Phaser from "phaser";
import { Globals, ResultData, initData } from "./Globals";
import { gameConfig } from "./appConfig";
import UiContainer from "./UiContainer"
import SoundManager from "./SoundManager";

export default class Slots extends Phaser.GameObjects.Container{
    slotMask!: Phaser.GameObjects.Graphics;
    uiContainer: UiContainer;
    SoundManager: SoundManager
    resultCallBack: ()=> void;
    slotSymbols: any [][] = []
    winningFrames: any [] = []
    moveSlots = false;
    private symbolKeys: string[];
    private maskWidth: number;
    private maskHeight: number;
    private symbolWidth: number;
    private symbolHeight: number;
    private spacingX: number;
    private spacingY: number;
    private symbolsContainer: Phaser.GameObjects.Container
    private reelContainers: Phaser.GameObjects.Container[]= []
    private reelTween: Phaser.Tweens.Tween[]= []
    private isSpinning: boolean = false;
    private completedAnimations: number = 0;
    private totalAnimations: number = 0;
    private hasEmittedSmoke: boolean = false;

    constructor(scene: Phaser.Scene, uiContainer: UiContainer, callback: ()=> void, SoundManager: SoundManager){
        super(scene)
        // Create containers for smoke and win text that will be above the mask

        this.resultCallBack = callback;
        this.SoundManager = SoundManager;
        this.uiContainer = uiContainer;
        this.symbolsContainer = new Phaser.GameObjects.Container(scene)
        this.symbolsContainer.setDepth(2);
        this.add(this.symbolsContainer);
        this.slotMask = new Phaser.GameObjects.Graphics(scene)
        this.maskWidth = gameConfig.scale.width
        this.maskHeight = gameConfig.scale.height * 0.64
        this.slotMask.fillRoundedRect(0, 0, this.maskWidth, this.maskHeight, 20);
        this.slotMask.setPosition(gameConfig.scale.width * 0.1, gameConfig.scale.height * 0.15);
        this.symbolKeys = this.getFilteredSymbolKeys()

        const symbolSprite =  new Phaser.GameObjects.Sprite(scene, 0, 0, this.getRandomSymbolsKey());
        this.symbolWidth = symbolSprite.displayWidth;
        this.symbolHeight = symbolSprite.displayHeight;
        this.spacingX = this.symbolWidth * 1.13
        
        this.spacingY = this.symbolHeight * 1.3
        const startPos = {
            x: gameConfig.scale.width * 0.21,
            y: gameConfig.scale.height * 0.25
        }
        const totalSymbol = 12
        const visibleSymbol = 3
        const startIndex = 1
        const totalSymbolsPerReel = 16; 
               
        const initialYOffset = (totalSymbol - startIndex - visibleSymbol) * this.spacingY;
        for (let i = 0; i < 6; i++) { 
            const reelContainer = new Phaser.GameObjects.Container(this.scene);
            this.reelContainers.push(reelContainer); // Store the container for future use
            this.slotSymbols[i] = [];
            for (let j = 0; j < totalSymbolsPerReel; j++) { // 3 rows
                let symbolKey = this.getRandomSymbolsKey(); // Get a random symbol key
                // console.log(symbolKey);
                let slot = new Symbols(scene, symbolKey, { x: i, y: j }, reelContainer);
                slot.symbol.setMask(new Phaser.Display.Masks.GeometryMask(scene, this.slotMask));
                slot.symbol.setPosition(
                    startPos.x + i * this.spacingX,
                    startPos.y + j * this.spacingY 
                );
                slot.startX = slot.symbol.x;
                slot.startY = slot.symbol.y;
                this.slotSymbols[i].push(slot);
                reelContainer.add(slot.symbol)
            }
            reelContainer.height = this.slotSymbols[i].length * this.spacingY;
            reelContainer.setPosition(reelContainer.x, -initialYOffset);
            this.symbolsContainer.add(reelContainer);
            // this.add(reelContainer); 
        }
    }
    getFilteredSymbolKeys(): string[] {
        const allSprites = Globals.resources;
            const filteredSprites = Object.keys(allSprites).filter(spriteName => {
                // Updated regex to match slots<number>_<number> pattern
                const regex = /^slots(\d+)_(\d+)$/;
                if (regex.test(spriteName)) {
                    const matches = spriteName.match(regex);
                    if (matches) {
                        const firstNumber = parseInt(matches[1], 10);
                        const secondNumber = parseInt(matches[2], 10);
                        // Adjust the range check according to your needs
                        return firstNumber >= 0 && firstNumber <= 15 && 
                            secondNumber >= 0 && secondNumber <= 15;
                    }
                }
                return false;
            });
        return filteredSprites;
    }

    getRandomSymbolsKey(): string{
        const randomIndex = Phaser.Math.Between(0, this.symbolKeys.length -1)
        return this.symbolKeys[randomIndex]
    }
    moveReel(){
        this.completedAnimations = 0;
        this.hasEmittedSmoke = false;
        // console.log("moveReel Called");
        const initialYOffset = (this.slotSymbols[0][0].totalSymbol - this.slotSymbols[0][0].visibleSymbol - this.slotSymbols[0][0].startIndex) * this.spacingY;
        setTimeout(() => {
            for (let i = 0; i < this.reelContainers.length; i++) {
                this.reelContainers[i].setPosition(this.reelContainers[i].x, -initialYOffset // Set the reel's position back to the calculated start position
                );
            }    
        }, 50);
        setTimeout(() => {
            for (let i = 0; i < this.reelContainers.length; i++) {
                this.startReelSpin(i);
            }
        }, 100);
    }

    startReelSpin(reelIndex: number) {    
        if (this.reelTween[reelIndex]) {
            this.reelTween[reelIndex].stop(); 
        }    
        const reel = this.reelContainers[reelIndex];
        const spinDistance = this.spacingY * 4;
        let delayCall = reelIndex * 1
        // const spinDistance = this.spacingY * this.slotSymbols[reelIndex].length; // Use full length of symbols
        //ease Back.easin is used when the reel is moving up
        this.reelTween[reelIndex] = this.scene.tweens.add({
            targets: reel,
            delay: delayCall,
            y: `+=${spinDistance}`,
            duration: 200,
            dealy: this.reelContainers[reelIndex],
            ease: 'Back.easeIn',
            repeat: 0,
            onComplete: () => {
                const spinDistance = this.spacingY * 8;
                // this.updateReelSymbols(reelIndex)
                this.reelTween[reelIndex] = this.scene.tweens.add({
                    targets: reel,
                    y: `+=${spinDistance}`,
                    duration: 400,
                    ease: 'Linear',
                    repeat: -1,
                    onComplete:() =>{

                    }
                })
            },
        });
    }

    stopTween(){        
        for(let i = 0; i < this.reelContainers.length; i++){ 
            const reel = this.reelContainers[i];
            const reelDelay = 100 * i;
            // Calculate target Y (ensure it's a multiple of symbolHeight)
            const targetY = 0;             
            this.scene.tweens.add({
                targets: reel,
                y: targetY, // Animate relative to the current position
                duration: 600,
                ease: 'Cubic.easeOut',
                onComplete: () => {
                    if (this.reelTween[i]) {                        
                        this.reelTween[i].stop(); 
                    }
                    if (i === this.reelContainers.length - 1) {
                        this.playWinAnimations();
                        this.moveSlots = false;
                    }
                },
                delay: reelDelay
            });
            
            for (let j = 0; j < this.slotSymbols[i].length; j++) {
                this.slotSymbols[i][j].endTween();
            }
        }
    }

    playWinAnimations() {
        this.resultCallBack();
        this.completedAnimations = 0;
        this.hasEmittedSmoke = false;
        ResultData.gameData.symbolsToEmit.forEach((rowArray: any) => {
            rowArray.forEach((row: any) => {
                if (typeof row === "string") {
                    const [y, x]: number[] = row.split(",").map((value) => parseInt(value));
                    const elementId = ResultData.gameData.ResultReel[x][y];
                    if (this.slotSymbols[y] && this.slotSymbols[y][x]) {
                        // Add winning animation overlay
                        this.playWinningOverlayAnimation(x, y, elementId); 
                    }
                }
            });
        });
        this.scene.events.emit("updateWin")
    }

    playWinningOverlayAnimation(x: number, y: number, elementId: number) {
        const winAnimX = this.slotSymbols[y][x].symbol.x;
        const winAnimY = this.slotSymbols[y][x].symbol.y;
        // Create winning ring animation
        for (let i = 0; i < 14; i++) {
            this.winningFrames.push({ key: `winRing${i}` });
        }
        // Create animations
        if (!this.scene.anims.exists(`winningAnim_${elementId}`)) {
            this.scene.anims.create({
                key: `winningAnim_${elementId}`,
                frames: this.winningFrames,
                frameRate: 30,
                repeat: 0
            });
        }
    
        const targetContainer = this.slotSymbols[y][x].symbol.parentContainer;
        // Create winning sprite on the symbol
        const winningSprite = this.scene.add.sprite(winAnimX, winAnimY, 'winRing0')
            .setDepth(12)
            .setName(`winningSprite_${x}_${y}`);
            targetContainer.add(winningSprite);
            this.slotSymbols[y][x].winningSprite = winningSprite;
            winningSprite.play(`winningAnim_${elementId}`);
    
            // When winning animation completes, play smoke animation and start counter
            winningSprite.on('animationcomplete', () => {
                winningSprite.setVisible(false);
                this.completedAnimations++;
                // this.redSmokeAnimation();
                if (this.completedAnimations >= this.totalAnimations && !this.hasEmittedSmoke) {
                    this.hasEmittedSmoke = true;
                    this.scene.events.emit("redSmokeAnimation");
                }
            })
    }    
}

class Symbols{
    symbol: Phaser.GameObjects.Sprite;
    startY: number = 0;
    startX: number = 0;
    startMoving: boolean = false;
    index: {x:number, y: number}
    totalSymbol : number = 16;
    visibleSymbol: number = 3;
    startIndex: number = 1;
    scene: Phaser.Scene;
    reelContainer: Phaser.GameObjects.Container

    constructor(scene: Phaser.Scene, symbolKey: string, index: {x: number, y: number}, reelContainer: Phaser.GameObjects.Container){      
        this.scene = scene;
        this.index = index
        this.reelContainer = reelContainer
        const updatedSymbolKey = this.updateKeyToZero(symbolKey)
        this.symbol = new Phaser.GameObjects.Sprite(scene, 0,0, updatedSymbolKey)
        this.symbol.setOrigin(0.5);
        const textures: string[] = []      
        textures.push(symbolKey)
    }

    updateKeyToZero(symbolKey: string): string {
        const match = symbolKey.match(/^slots(\d+)_\d+$/);
        if (match) {
            const xValue = match[1];
            return `slots${xValue}_0`;
        } else {
            return symbolKey; // Return the original key if format is incorrect
        }
    }


    endTween() {
        if (this.index.y < 3) {
            let textureKeys: string[] = [];
            // Retrieve the elementId based on index
            const elementId = ResultData.gameData.ResultReel[this.index.y][this.index.x];
            const textureKey = `slots${elementId}_0`;
            if (this.scene.textures.exists(textureKey)) {
                textureKeys.push(textureKey);                        
            } 
            // Check if we have texture keys to set
            if (textureKeys.length > 0) {
            // Set the texture to the first key and start the animation
                this.symbol.setTexture(textureKeys[0]);           
            }
        }
        // Stop moving and start tweening the sprite's position
        this.startMoving = false; 
    }
}