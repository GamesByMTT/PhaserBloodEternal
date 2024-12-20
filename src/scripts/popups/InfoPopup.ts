import { Scene } from "phaser";
import { gameConfig } from "../appConfig";

export default class InfoPopup extends Phaser.GameObjects.Container {
    currentPageIndex: number = 0;
    pages: Phaser.GameObjects.Container[] = [];
    constructor(scene: Scene, data: any) {
        super(scene, 0, 0);

        // Create popup background
        // const bg = scene.add.rectangle( scene.scale.width / 2,scene.scale.height / 2, 600, 400,0x333333);
        const bg = scene.add.sprite( scene.scale.width / 2,scene.scale.height / 2, "popupBgSprite");
        
        const closeBtn = scene.add.sprite(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.82, "returnToGame").setScale(0.8);
        const closeBtnText = scene.add.text(closeBtn.x, closeBtn.y,  'Return To Game',{ fontFamily: "Deutsch", fontSize: '27px', color: '#ffffff' }).setOrigin(0.5);
        closeBtn.setInteractive();
        closeBtn.on('pointerdown', () => {
            closeBtn.setScale(0.7)
            scene.events.emit('closePopup');
            // scene.game.events.emit('closePopup');
        });
        closeBtn.on("pointerup", ()=>{
            closeBtn.setScale(0.8)
        })
        const previousButton = this.scene.add.sprite(gameConfig.scale.width * 0.24, gameConfig.scale.height * 0.75, "previousButton").setInteractive()
        const previousText = this.scene.add.text(previousButton.x, previousButton.y, "Previous", {fontFamily: "Deutsch", fontSize: '27px', color: '#ffffff'}).setOrigin(0.5);
        const nextButton = this.scene.add.sprite(gameConfig.scale.width * 0.76, gameConfig.scale.height * 0.75, "nextButton").setInteractive()
        const nextButtonText = this.scene.add.text(nextButton.x, nextButton.y, "Next", {fontFamily: "Deutsch", fontSize: '27px', color: '#ffffff'}).setOrigin(0.5)
        const headingBg = scene.add.sprite(gameConfig.scale.width * 0.5, bg.y - bg.height / 2 + 50, "headingBg").setScale(0.7)
        // Add content
        
        const title = scene.add.text(gameConfig.scale.width * 0.5, bg.y - bg.height / 2 + 50, 'VAMPIRE FREE\nSPIN', { fontFamily:"CinzelDecorative", fontSize: '35px', color: '#ffffff', align:"center" } ).setOrigin(0.5);
        // Add your info content here

        previousButton.on("pointerdown",()=>{
            this.goToPreviousPage()
        })
        nextButton.on("pointerdown", ()=>{
            this.goToNextPage();
        })

        this.add([bg, closeBtn, closeBtnText, headingBg, title, previousButton, previousText, nextButton, nextButtonText]);
        this.pages = []
        this.createPages()
    }
    createPages(){
        this.pages[1] = this.scene.add.container(0, 0);
        const wildText = this.scene.add.text(1000, 400, "Page 1", {fontFamily:"Deutsch", fontSize:"30px", color: "#ffffff", wordWrap:{ width: 300, useAdvancedWrap: true }}).setOrigin(0.5)
        this.pages[1].add([wildText])
        this.add(this.pages[1])

        this.pages[2] = this.scene.add.container();

        const pageTwoHeading = this.scene.add.text(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.5, "Page 2"
        )

        this.pages[2].add(pageTwoHeading)
        this.add(this.pages[2]);

        this.pages = [this.pages[1], this.pages[2]];
        this.currentPageIndex = 0;
        
        // Set initial visibility 
        this.pages.forEach((page, index) => {
            page.setVisible(index === this.currentPageIndex);
        });
    }

    goToNextPage() {
        if (this.currentPageIndex < this.pages.length - 1) {
            this.pages[this.currentPageIndex].setVisible(false);
            this.currentPageIndex++;
            this.pages[this.currentPageIndex].setVisible(true);
        }
    }

    goToPreviousPage() {
        if (this.currentPageIndex > 0) {
            this.pages[this.currentPageIndex].setVisible(false);
            this.currentPageIndex--;
            this.pages[this.currentPageIndex].setVisible(true);
        }
    }
}