import { Scene, GameObjects } from "phaser";
import { TextStyle as globalTextStyle} from './Globals'

export class TextLabel extends GameObjects.Text{
    defaultColor: string
    constructor(scene: Scene, x: number, y: number, text: string, size: number, defaultColor: string = "#ffffff", font: string = "CinzelDecorative"){
        const style = {
            ...globalTextStyle,
            fontFamily: `{font}`,
            align: "center",
            fontSize: `{size}px`
        }
        super(scene, x, y, text, style)
        this.defaultColor = defaultColor

        // anchor set
        this.setOrigin(0.5, 0.5)

        //add object to scene
        scene.add.existing(this)
    }
    // Update Text
    updateLabelText(text: string) {
        this.setText(text)
    }
}