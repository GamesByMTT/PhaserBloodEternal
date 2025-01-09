import Phaser from "phaser";
import { Globals, ResultData, currentGameData, initData } from "./Globals";
import { gameConfig } from "./appConfig";
import UiContainer from "./UiContainer"
import SoundManager from "./SoundManager";
import MainScene from "../view/MainScene";
import { LineGenerator } from "./LineGenrater";

export default class Slots extends Phaser.GameObjects.Container{
    slotMask!: Phaser.GameObjects.Graphics;
    uiContainer: UiContainer;
    SoundManager: SoundManager
    lineGenrator!: LineGenerator;
    resultCallBack: ()=> void;
    slotSymbols: any [][] = []
    winningFrames: any [] = []
    moveSlots = false;
    private symbolKeys: string[];
    private maskWidth: number;
    private maskHeight: number;
    public symbolWidth: number;
    private symbolHeight: number;
    private spacingX: number;
    private spacingY: number;
    private symbolsContainer: Phaser.GameObjects.Container
    public reelContainers: Phaser.GameObjects.Container[]= []
    public reelTween: Phaser.Tweens.Tween[]= []
    private isSpinning: boolean = false;
    private completedAnimations: number = 0;
    private totalAnimations: number = 0;
    private hasEmittedSmoke: boolean = false;
    private backgroundAnimSprites: Phaser.GameObjects.Sprite[][] = [];
    private vampireSprites: Phaser.GameObjects.Sprite[] = [];
    private activeVampireSprites: Set<Phaser.GameObjects.Sprite> = new Set();

    constructor(scene: Phaser.Scene, uiContainer: UiContainer, callback: ()=> void, SoundManager: SoundManager){
        super(scene)
        this.scene.events.on("destroyWinRing5", this.destroyWinningSprites, this)
        // Create containers for smoke and win text that will be above the mask
        this.lineGenrator = new LineGenerator(scene, 0, 0)
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
        // Bind the methods to maintain proper 'this' context
        this.hideWiningLines = this.hideWiningLines.bind(this);
        this.clearVampireSprites = this.clearVampireSprites.bind(this);
        //Hide Wining Line on FreeSpin/AUtoSpin on every New Spin
        this.scene.events.on("hideWiningLine", this.hideWiningLines, this)
        this.scene.events.on("increamentDone", this.startRectangleEmit, this)
        // Clear vampire Animation after freeSpin count is 0
        this.scene.events.on("clearVampireAnimation", this.clearVampireSprites, this)
       
        
        this.spacingY = this.symbolHeight * 1.3
        const startPos = {
            x: gameConfig.scale.width * 0.21,
            y: gameConfig.scale.height * 0.25
        }
        const totalSymbol = 12
        const visibleSymbol = 3
        const startIndex = 1
        const totalSymbolsPerReel = 16; 
        for (let i = 0; i < 3; i++) {
            this.winningFrames.push({ key: `newWinRing${i}` });
        }
               
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
    resetReelAnimations() {
        const mainScene = this.scene as MainScene;
        mainScene.hideLines()
        mainScene.redReelSpite.setVisible(false);
        mainScene.purpleReelSprite.setVisible(false);
    }
     //destroy winning SPrite winRing5 image
     destroyWinningSprites() {
        // First, destroy any existing winning sprites
        this.reelContainers.forEach((reelContainer, i) => {
            reelContainer.getAll().forEach((gameObject) => {
                if (gameObject.name && gameObject.name.startsWith('winRing_')) {
                    gameObject.destroy();
                }
            });
        });
       
        // Also clear the references in slotSymbols
        this.slotSymbols.forEach(reel => {           
            reel.forEach(symbol => {
                if (symbol.winningSprite) {
                    symbol.winningSprite.destroy();
                    symbol.winningSprite = null;
                }
            });
        });
    }

    stopTween() {
        const mainScene = this.scene as MainScene;
        const { redPosition, purplePosition } = this.checkSpecialSymbols();
        const { vampireFemalePositions, vampireMalePositions } = this.checkVampireCombinations();
        console.log(vampireFemalePositions, vampireMalePositions, "VampirePosition");
        
        for (let i = 0; i < this.reelContainers.length; i++) {
            this.scene.events.emit("destroyWinRing5");
            const reel = this.reelContainers[i];
            let reelDelay = 200 * i;
            const targetY = 0;
            const baseStopDuration = 3000; // Base duration for reel stop animation
            // Calculate delays for special symbols            
            if (redPosition >= 0 && i > redPosition) {
                const additionalDelay = 6000;
                reelDelay += additionalDelay;
       
                if (i === redPosition + 1) {
                    // Schedule red reel animation to play after previous reel stops
                    this.scene.time.delayedCall(reelDelay - additionalDelay + baseStopDuration, () => {
                        mainScene.redReelSpite.setVisible(true);
                        mainScene.redReelSpite.setPosition(
                            this.slotSymbols[i][0].symbol.x,
                            this.scene.cameras.main.height * 0.455
                        );
                        mainScene.redReelSpite.play('red');
       
                        // Hide red animation after it completes
                        this.scene.time.delayedCall(3000, () => {
                            mainScene.redReelSpite.setVisible(false);
                        });
                    });
                }
            }
       
            if (purplePosition >= 0 && i > purplePosition) {
                const additionalDelay = 6000;
                reelDelay += additionalDelay;
       
                if (i === purplePosition + 1) {
                    // Schedule purple reel animation to play after previous reel stops
                    this.scene.time.delayedCall(reelDelay - additionalDelay + baseStopDuration, () => {
                        mainScene.purpleReelSprite.setVisible(true);
                        mainScene.purpleReelSprite.setPosition(
                            this.slotSymbols[i][0].symbol.x,
                            this.scene.cameras.main.height * 0.455
                        );
                        mainScene.purpleReelSprite.play('purple');
       
                        // Hide purple animation after it completes
                        this.scene.time.delayedCall(3000, () => {
                            mainScene.purpleReelSprite.setVisible(false);
                        });
                    });
                }
            }
       
            this.scene.tweens.add({
                targets: reel,
                y: targetY,
                duration: baseStopDuration,
                ease: 'Cubic.easeOut',
                delay: reelDelay,
                onComplete: () => {
                    this.SoundManager.stopSound("onSpin");
                    if (this.reelTween[i]) {
                        this.reelTween[i].stop();
                    }
                    // Add delay before showing background animations
                    this.scene.time.delayedCall(500, () => {
                        this.createBackgroundAnimations(i);
                    });
       
                    if (i === this.reelContainers.length - 1) {
                        this.scene.time.delayedCall(1000, () => {
                            this.playWinAnimations();
                            const newSprites = this.playVampireAnimations(vampireFemalePositions, vampireMalePositions);
                            this.vampireSprites = [...newSprites]; // or just assign directly
                            this.moveSlots = false;
                        });
                    }
                }
            });
       
            for (let j = 0; j < this.slotSymbols[i].length; j++) {
                this.slotSymbols[i][j].endTween();
            }
        }
        this.isSpinning = false;
    }

    moveReel(){
        // this.clearVampireSprites();
        this.vampireSprites = [];
        const mainScene = this.scene as MainScene;
        mainScene.hideLines(); // Call hideLines directly here
        this.destroyWinningSprites();
        this.isSpinning = true;
        this.completedAnimations = 0;
        this.hasEmittedSmoke = false;
        this.backgroundAnimSprites.forEach(row => 
            row?.forEach(sprite => sprite?.destroy()));
        this.backgroundAnimSprites = [];
        this.resetReelAnimations()
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
        const spinDistance = this.spacingY * 8;
        //ease Back.easin is used when the reel is moving up
        this.reelTween[reelIndex] = this.scene.tweens.add({
            targets: reel,
            y: `+=${spinDistance}`,
            duration: 400,
            ease: 'Linear',
            repeat: -1,
            onComplete:() =>{

            },
        });
    }

    checkSpecialSymbols() {
        let redPosition = -1;
        let purplePosition = -1;
        // Check first 5 positions (excluding last reel) for special symbols
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 3; j++) {
                const elementId = ResultData.gameData.ResultReel[j][i];
                if (elementId === 11) redPosition = i;
                if (elementId === 13) purplePosition = i;
            }
        }
        return { redPosition, purplePosition };
    }

    // playVampireAnimations(vampireFemalePositions: { x: number, y: number }[], vampireMalePositions: { x: number, y: number }[]) {
    //     const mainScene = this.scene as MainScene;
    //     const offsetX = 100; // Adjust this value to move animations right (increase for more right movement)
    //     const OffsetY = 20
    //     // Handle female vampire animations
    //     vampireFemalePositions.forEach((pos, index) => {
    //         if (index % 2 === 0) { // Only create animation for first position of each pair
    //             const symbol = this.slotSymbols[pos.x][pos.y];
    //             mainScene.vampireFemale.setVisible(true);
    //             mainScene.vampireFemale.setPosition(
    //                 symbol.symbol.x + offsetX, // Add offsetX here
    //                 symbol.symbol.y - OffsetY
    //             );
    //             mainScene.vampireFemale.play('womanVampire');
    //         }
    //     });
        
    //     // Handle male vampire animations
    //     vampireMalePositions.forEach((pos, index) => {
    //         if (index % 2 === 0) { // Only create animation for first position of each pair
    //             const symbol = this.slotSymbols[pos.x][pos.y];
    //             mainScene.vampireMale.setPosition(
    //                 symbol.symbol.x + offsetX, // Add offsetX here
    //                 symbol.symbol.y - OffsetY
    //             );
    //             mainScene.vampireMale.setVisible(true);
    //             mainScene.vampireMale.play('maleVampire');
    //         }
    //     });
    // }

    playVampireAnimations(vampireFemalePositions: { x: number, y: number }[], vampireMalePositions: { x: number, y: number }[]): Phaser.GameObjects.Sprite[] {
        const mainScene = this.scene as MainScene;
        const offsetX = 100;
        const offsetY = 20
        const newVampireSprites: Phaser.GameObjects.Sprite[] = [];

        // Handle female vampire animations
        vampireFemalePositions.forEach((pos, index) => {
            if (index % 2 === 0) {
                const symbol = this.slotSymbols[pos.x][pos.y];
                const vampireFemaleSprite = this.scene.add.sprite(
                    symbol.symbol.x + offsetX,
                    symbol.symbol.y - offsetY,
                    'womanVampire0'
                ).setDepth(12);
        
                vampireFemaleSprite.play('womanVampire');
                newVampireSprites.push(vampireFemaleSprite);
                this.activeVampireSprites.add(vampireFemaleSprite);
        
                // vampireFemaleSprite.on('animationcomplete', () => {
                //     this.activeVampireSprites.delete(vampireFemaleSprite);
                //     vampireFemaleSprite.destroy();
                // });
            }
        });
        
        // Handle male vampire animations
        vampireMalePositions.forEach((pos, index) => {
            if (index % 2 === 0) {
                const symbol = this.slotSymbols[pos.x][pos.y];
                const vampireMaleSprite = this.scene.add.sprite(
                    symbol.symbol.x + offsetX,
                    symbol.symbol.y - offsetY,
                    'maleVampire0'
                ).setDepth(12);
        
                vampireMaleSprite.play('maleVampire');
                newVampireSprites.push(vampireMaleSprite);
                this.activeVampireSprites.add(vampireMaleSprite);
        
                // vampireMaleSprite.on('animationcomplete', () => {
                //     this.activeVampireSprites.delete(vampireMaleSprite);
                //     vampireMaleSprite.destroy();
                // });
            }
        });
        
        return newVampireSprites;
    }

    checkVampireCombinations() {
        let vampireFemalePositions: { x: number, y: number }[] = [];
        let vampireMalePositions: { x: number, y: number }[] = [];
        
        // Check ResultReel for all vampire combinations
        for (let i = 0; i < ResultData.gameData.ResultReel.length; i++) {
            for (let j = 0; j < ResultData.gameData.ResultReel[i].length - 1; j++) {
                const currentSymbol = ResultData.gameData.ResultReel[i][j];
                const nextSymbol = ResultData.gameData.ResultReel[i][j + 1];
        
                // Check for female vampire combination (13 and 12)
                if (currentSymbol === 13 && nextSymbol === 12) {
                    vampireFemalePositions.push({ x: j, y: i });
                    vampireFemalePositions.push({ x: j, y: i });
                }
                // Check for male vampire combination (11 and 14)
                else if (currentSymbol === 11 && nextSymbol === 14) {
                    vampireMalePositions.push({ x: j, y: i });
                    vampireMalePositions.push({ x: j, y: i });
                }
            }
        }
        
        return { vampireFemalePositions, vampireMalePositions };
    }
        
    createBackgroundAnimations(reelIndex?: number) {
        if (reelIndex !== undefined) {
            // Handle single reel
            for (let y = 0; y < ResultData.gameData.ResultReel.length; y++) {
                if (!this.backgroundAnimSprites[y]) {
                    this.backgroundAnimSprites[y] = [];
                }
                const elementId = ResultData.gameData.ResultReel[y][reelIndex];
                if (elementId === 12 || elementId === 13) {
                    const symbol = this.slotSymbols[reelIndex][y];
                    if (this.backgroundAnimSprites[y][reelIndex]) {
                        this.backgroundAnimSprites[y][reelIndex].destroy();
                    }
                    const bgSprite = this.scene.add.sprite(
                        symbol.symbol.x + 5,
                        symbol.symbol.y,
                        'purpleSymbol0'
                    );
                    
                    bgSprite.play('purpleSymbol');
                    bgSprite.setDepth(1);
                    this.backgroundAnimSprites[y][reelIndex] = bgSprite;
                    
                    const mainScene = this.scene as MainScene;
                    mainScene.backgroundAnimContainer.add(bgSprite);
                }
            }
        } else {
            // Clear existing background animations
            this.backgroundAnimSprites.forEach(row => 
                row?.forEach(sprite => sprite?.destroy()));
            this.backgroundAnimSprites = [];
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
        if(ResultData.playerData.currentWining > 0 && ResultData.gameData.symbolsToEmit.length == 0){
            this.scene.events.emit("redSmokeAnimation")
        }
        // if(ResultData.gameData.isFreeSpin || currentGameData.isAutoSpin){
        //     this.scene.events.emit("freeSpin")
        // }
       
        this.scene.events.emit("updateWin")
    }

    playWinningOverlayAnimation(x: number, y: number, elementId: number) {
        const winAnimX = this.slotSymbols[y][x].symbol.x;
        const winAnimY = this.slotSymbols[y][x].symbol.y;
        // Create animations
        if (!this.scene.anims.exists(`newWinRing${elementId}`)) {
            this.scene.anims.create({
                key: `newWinRing${elementId}`,
                frames: this.winningFrames,
                frameRate: 15,
                repeat: 0
            });
        }
        const targetContainer = this.slotSymbols[y][x].symbol.parentContainer;
        // Create winning sprite on the symbol
        const winningSprite = this.scene.add.sprite(winAnimX, winAnimY, 'newWinRing0')
            .setDepth(12)
            .setName(`newWinRing_${x}_${y}`);
            targetContainer.add(winningSprite);
            this.slotSymbols[y][x].winningSprite = winningSprite;
            winningSprite.play(`newWinRing${elementId}`);
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
    
    startRectangleEmit() {
        let currentArrayIndex = 0;
        let lineBlink = 0
        let blinkCount = 0; // Counter for the number of blinks
        const mainScene = this.scene as MainScene;
        const blinkNextArray = () => {
            if (this.isSpinning) {
                return;
            }
            let rowArray = ResultData.gameData.symbolsToEmit[currentArrayIndex];
            currentArrayIndex = (currentArrayIndex + 1) % ResultData.gameData.symbolsToEmit.length; // Cycle through arrays
            let lineNumber: any = []
            lineNumber.push(ResultData.gameData.linesToEmit[lineBlink]);
            mainScene.hideLines()
            mainScene.linesToShow(lineNumber)
            if (rowArray) {
                this.blinkSymbols(rowArray, 'winRing5', () => {
                    if (this.isSpinning) {
                        return;
                    }
                    lineBlink++
                    blinkCount++;
                    if ((ResultData.gameData.symbolsToEmit.length < 3) ? blinkCount < 4 : blinkCount < ResultData.gameData.symbolsToEmit.length) { // Blink 3 times in total
                        blinkNextArray();
                    } else {
                        // Show the sprite on all symbols after 3 blinks
                        this.showAllWinSprites();
                        if(ResultData.gameData.count === 0){
                            this.uiContainer.isSpinning = false
                            console.log("clearing Vampire Sprites");
                            this.scene.events.emit("clearVampireAnimation")
                            // this.clearVampireSprites()
                        }
                        mainScene.linesToShow(ResultData.gameData.linesToEmit)
                        
                    }
                });
            }
        };
        blinkNextArray();;
    }
    blinkSymbols(symbolIndices: string[], imageKey: string, onCompleteCallback?: () => void) {
            const blinkDuration = 1000;
            const numBlinks = 1;
            
            let currentBlink = 0;
            const winningSprites: Phaser.GameObjects.Sprite[] = [];
            
            symbolIndices.forEach((row) => {
                const [y, x] = row.split(",").map(Number);
            
                if (this.slotSymbols[y] && this.slotSymbols[y][x]) {
                    const { x: winAnimX, y: winAnimY } = this.slotSymbols[y][x].symbol;
            
                    const winningSprite = this.scene.add.sprite(winAnimX, winAnimY, imageKey)
                        .setDepth(12)
                        .setName(`winRing_${x}_${y}`)
                        .setVisible(false);
            
                    this.slotSymbols[y][x].symbol.parentContainer.add(winningSprite);
                    winningSprites.push(winningSprite);
                }
        });
        const blink = () => {
            if (this.isSpinning) { // Check if spinning has started
                winningSprites.forEach(sprite => sprite.destroy()); // Destroy sprites immediately
                if (onCompleteCallback) onCompleteCallback();
                return; // Stop the blinking process
            }
            winningSprites.forEach(sprite => sprite.setVisible(!sprite.visible));
                currentBlink++;
                if (currentBlink < numBlinks * 2) {
                    this.scene.time.delayedCall(blinkDuration, blink);
                } else {
                    winningSprites.forEach(sprite => sprite.destroy());
                    if (onCompleteCallback) {
                        onCompleteCallback(); // Call the callback if provided
                    }
                }
            };
        blink();
    }
    showAllWinSprites() {
        this.destroyWinningSprites();
        ResultData.gameData.symbolsToEmit.forEach((rowArray: any) => {
            rowArray.forEach((row: any) => {
                const [y, x] = row.split(",").map(Number);
                if (this.slotSymbols[y] && this.slotSymbols[y][x]) {
                    // Create or show the winning sprite (if it was previously hidden)
                        const { x: winAnimX, y: winAnimY } = this.slotSymbols[y][x].symbol;
                        const winningSprite = this.scene.add.sprite(winAnimX, winAnimY, 'winRing5')
                            .setDepth(12)
                            .setName(`winRing_${x}_${y}`);
                        this.slotSymbols[y][x].symbol.parentContainer.add(winningSprite);
                        this.slotSymbols[y][x].winningSprite = winningSprite;
                    
                }
            });
        });
        if(ResultData.gameData.count > 0 || currentGameData.isAutoSpin){
            this.scene.events.emit("hideWiningLine")
            this.scene.time.delayedCall(1000, ()=>{
                this.scene.events.emit("freeSpin");
            })
        }
    }

    hideWiningLines(){
        const firstScene = this.scene as MainScene
        firstScene.hideLines()
    }

    //clear Vampire Symbol
    clearVampireSprites() {
        console.log("inside clear VampireSprite");
        
        // Clear all existing vampire sprites
        this.vampireSprites.forEach(sprite => {
            if (sprite) {
                console.log("inside Vampire Sprites");
                this.activeVampireSprites.delete(sprite);
                sprite.destroy();
            }
        });
        this.vampireSprites = [];
        this.activeVampireSprites.clear();
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