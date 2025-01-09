import { Scene } from "phaser";
import { gameConfig } from "./appConfig";
import { LineGenerator } from "./LineGenrater";
import { initData } from "./Globals";

export default class LineSymbols extends Phaser.GameObjects.Container{
    numArr: Phaser.GameObjects.Container[] = []
    lineGenrator!: LineGenerator
    numberContainers!: Phaser.GameObjects.Container
    constructor(scene: Scene, yOf: number, xOf: number, lineGenrator: LineGenerator) {
        super(scene);
        this.lineGenrator = lineGenrator
        for(let i = 1; i < initData.gameData.Lines.length + 1; i++){
            let numberText = this.createNumber(scene, i);
            this.numArr.push(numberText);
            this.add(numberText);
        }
        this.setPosition(gameConfig.scale.width / 2, gameConfig.scale.height / 7);
        // Add this Container to the scene
        scene.add.existing(this);
    }
    createNumber(scene: Phaser.Scene, index: number): Phaser.GameObjects.Container {
        const numberContainer = new Phaser.GameObjects.Container(scene);
        
        let xPosition;
        let yPosition = 0;
        
        // Determine x position based on even or odd index
        if (index % 2 === 0) {
            xPosition = gameConfig.scale.width / 2.65;
            yPosition = ((index - 1) / 2) * 50;  // Staggered downwards for each odd number
           
        } else {
            xPosition = -gameConfig.scale.width / 2.65;
            yPosition = (index / 2) * 50 ;  // Staggered downwards for each even number
        }
    
        // Add a background sprite behind the number
        let numberBg = scene.add.sprite(xPosition - 2, yPosition + 3, "coinBg")
            .setOrigin(0.5)
            .setDepth(0)
            .setScale(0.13);  // Set depth lower than the text to make it behind
    
        // Create a text object for each number
        let numberText = scene.add.text(xPosition, yPosition + 3, (index).toString(), {
            font: "30px",
            color: "#ffffff",
            align: 'Center',            
        }).setOrigin(0.5).setDepth(1);  // Text on top of the background
    
        // Add the sprite and text to the container
        numberContainer.add([numberBg, numberText]);
    
        // Enable input on the number text
        numberText.setInteractive({ useHandCursor: true });
    
        // Add hover event listeners
        numberText.on("pointerover", () => this.showLines(index));
        numberText.on("pointerout", () => this.hideLines());
    
        // Return the container which includes both the background and the number text
        return numberContainer;
    }
    
    showLines(index: number) {
        this.lineGenrator.showLines([index]); // Show only the line with the specified index
    }

    hideLines() {
        this.lineGenrator.hideLines(); // Hide all lines
    }
}