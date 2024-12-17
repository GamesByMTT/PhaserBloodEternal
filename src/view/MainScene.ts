import { Scene, GameObjects, Scale, } from "phaser";
import { Globals, ResultData, currentGameData, initData } from "../scripts/Globals";
import UiContainer from "../scripts/UiContainer";

export default class MainScene extends Scene {
    Background!: GameObjects.Sprite
    candles!: GameObjects.Sprite
    logo!: GameObjects.Sprite
    candleOne!: GameObjects.Sprite
    candleTwo!: GameObjects.Sprite
    candleThree!: GameObjects.Sprite
    candleFour!: GameObjects.Sprite
    candleFive!: GameObjects.Sprite
    reelBg!: GameObjects.Sprite
    UIContainer!: UiContainer
    private mainContainer!: Phaser.GameObjects.Container
    constructor() {
        super({key: 'MainScene'})
    }
    create(){
        const {width, height} = this.cameras.main;
        this.mainContainer = this.add.container()
        this.Background = new Phaser.GameObjects.Sprite(this, width/2, height/2, "Background");
        this.logo = new Phaser.GameObjects.Sprite(this, width/2, height * 0.1, "bloodEternal").setOrigin(0.5).setScale(0.82);
        this.candles = new Phaser.GameObjects.Sprite(this, width * 0.95, height * 0.82, "candles").setOrigin(0.5).setScale(0.7);
        this.reelBg = new GameObjects.Sprite(this, width * 0.5, height * 0.471, "reelBg").setOrigin(0.5)

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
        this.UIContainer = new UiContainer(this)
        this.mainContainer.add([this.Background, this.candles, this.logo,this.reelBg, this.candleOne, this.candleTwo, this.candleThree, this.candleFour, this.candleFive,  this.UIContainer]);
    }
}