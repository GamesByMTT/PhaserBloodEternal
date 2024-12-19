import { Scene, GameObjects } from "phaser";
import { gameConfig } from "../appConfig";

export default class SettingPopup extends Phaser.GameObjects.Container {

    constructor(scene: Scene, data: any) {
        super(scene, 0, 0);
        this.createSettingBackground()
       
    }
    createSettingBackground(){
        const settingBg = this.scene.add.container(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.5);
    }
}