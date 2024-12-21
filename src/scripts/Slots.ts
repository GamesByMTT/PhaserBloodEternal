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

    constructor(scene: Phaser.Scene, uiContainer: UiContainer, callback: ()=> void, SoundManager: SoundManager){
        super(scene)
        
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
        const totalSymbol = 4
        const visibleSymbol = 3
        const startIndex = 1
        const initialOffset = (totalSymbol - startIndex - visibleSymbol) * this.spacingY;
        for(let i = 0; i < 6; i++){
            const reelContainer = new Phaser.GameObjects.Container(scene);
            this.reelContainers.push(reelContainer)
            this.slotSymbols[i] = []
            for(let j = 0; j < 50; j++){
                let symbolKey = this.getRandomSymbolsKey();
                let slot = new Symbols(scene, symbolKey, {x: i, y: j}, reelContainer);
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
            reelContainer.setPosition(reelContainer.x, -initialOffset );
            this.add(reelContainer); 
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

}

class Symbols{
    symbol: Phaser.GameObjects.Sprite;
    startY: number = 0;
    startX: number = 0;
    startMoving: boolean = false;
    index: {x:number, y: number}
    totalSymbol : number = 50;
    visibleSymbol: number = 3;
    startIndex: number = 1;
    spacingY : number = 204;
    initialYOffset : number = 0;
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
        this.scene.anims.create({
            key: `${symbolKey}`,
            frames: textures.map((texture)=>({key: texture})),
            frameRate: 20,
            repeat: -1
        })
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
}