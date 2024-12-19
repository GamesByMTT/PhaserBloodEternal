import { Scene } from "phaser";
import { gameConfig } from "../appConfig";

export default class InfoPopup extends Phaser.GameObjects.Container {
constructor(scene: Scene, data: any) {
    super(scene, 0, 0);

    // Create popup background
    // const bg = scene.add.rectangle( scene.scale.width / 2,scene.scale.height / 2, 600, 400,0x333333);
    const bg = scene.add.sprite( scene.scale.width / 2,scene.scale.height / 2, "popupBgSprite");
    // const closeBtn = scene.add.text(bg.x + bg.width / 2 - 30, bg.y - bg.height / 2 + 20,  'X',{ fontSize: '24px', color: '#ffffff' });
    const outerCircle = this.scene.add.sprite(bg.x + bg.width / 2 - 30, bg.y - bg.height / 2 + 20, "circleBg").setScale(0.7)
    const closeBtn = scene.add.sprite(bg.x + bg.width / 2 - 30, bg.y - bg.height / 2 + 20, "closeButton").setScale(0.8);
    // const closeBtn = scene.add.text(bg.x + bg.width / 2 - 30, bg.y - bg.height / 2 + 20,  'X',{ fontSize: '24px', color: '#ffffff' });
    closeBtn.setInteractive();
    closeBtn.on('pointerdown', () => {
        closeBtn.setScale(0.7)
        scene.events.emit('closePopup');
        // scene.game.events.emit('closePopup');
    });
    closeBtn.on("pointerup", ()=>{
        closeBtn.setScale(0.8)
    })

    const headingBg = scene.add.sprite(gameConfig.scale.width * 0.5, bg.y - bg.height / 2 + 50, "headingBg").setScale(0.7)
    // Add content
    const title = scene.add.text(gameConfig.scale.width * 0.5, bg.y - bg.height / 2 + 50, 'VAMPIRE FREE\nSPIN', { fontFamily:"CinzelDecorative", fontSize: '35px', color: '#ffffff', align:"center" } ).setOrigin(0.5);

    // Add your info content here
    const content = scene.add.text( bg.x, bg.y, data.content || 'Default information text', { fontSize: '24px', color: '#ffffff', align: 'center' }).setOrigin(0.5);

    this.add([bg, outerCircle, closeBtn, headingBg, title, content]);
}
}