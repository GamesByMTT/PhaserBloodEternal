import { Scene } from "phaser";
import { gameConfig } from "../appConfig";
import { Globals, ResultData, currentGameData } from "../Globals";


export default class GamblePopup extends Phaser.GameObjects.Container{
    constructor(scene: Scene, data: any){
        super(scene, 0, 0);
        const bg = scene.add.sprite( scene.scale.width / 2,scene.scale.height / 2, "popupBgSprite");
        const headingBg = scene.add.sprite(gameConfig.scale.width * 0.5, bg.y - bg.height / 2 + 50, "headingBg").setScale(0.7)
        // Add content
        const title = scene.add.text(gameConfig.scale.width * 0.5, bg.y - bg.height / 2 + 50, 'Double Up', { fontFamily:"Deutsch", fontSize: '35px', color: '#ffffff', align:"center" } ).setOrigin(0.5);
        
        const headsButton = this.scene.add.sprite(gameConfig.scale.width * 0.52, gameConfig.scale.height * 0.35, "previousButton").setInteractive().setScale(0.75)
        const headText = this.scene.add.text(headsButton.x, headsButton.y, "Heads", {fontFamily: "Deutsch", fontSize: '30px', color: '#ffffff'}).setOrigin(0.5);
        const tailButton = this.scene.add.sprite(gameConfig.scale.width * 0.7, gameConfig.scale.height * 0.35, "nextButton").setInteractive().setScale(0.75)
        const tailText = this.scene.add.text(tailButton.x, tailButton.y, "Tails", {fontFamily: "Deutsch", fontSize: '30px', color: '#ffffff'}).setOrigin(0.5)

        const indsideRedBox = this.scene.add.sprite(gameConfig.scale.width * 0.62, gameConfig.scale.height * 0.6, "insideGamble").setOrigin(0.5)

        this.add([bg, headingBg, title, headsButton, headText, tailButton, tailText, indsideRedBox]);
    }
}