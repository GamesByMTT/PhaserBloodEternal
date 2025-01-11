import { GameObjects, Scene } from "phaser";
import { gameConfig } from "../appConfig";
import SoundManager from "../SoundManager";
import { currentGameData } from "../Globals";

export default class InfoPopup extends Phaser.GameObjects.Container {
    currentPageIndex: number = 0;
    pages: Phaser.GameObjects.Container[] = [];
    SoundManager!: SoundManager
    closeBtn!: GameObjects.Sprite
    constructor(scene: Scene, data: any) {
        super(scene, 0, 0);
        this.SoundManager = new SoundManager(scene)
        // Create popup background
        const bgLayer = scene.add.rectangle(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.5, gameConfig.scale.width, gameConfig.scale.height, 0x000000, 0.5).setOrigin(0.5).setInteractive()
        // const bg = scene.add.rectangle( scene.scale.width / 2,scene.scale.height / 2, 600, 400,0x333333);
        bgLayer.on('pointerdown', ()=>{
            this.closeInfoPopup()
        })      
        const bg = scene.add.sprite( scene.scale.width / 2,scene.scale.height / 2, "popupBgSprite");
        
        this.closeBtn = scene.add.sprite(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.82, "returnToGame").setScale(0.8);
        const closeBtnText = scene.add.text(this.closeBtn.x, this.closeBtn.y,  'Return To Game',{ fontFamily: "Deutsch", fontSize: '27px', color: '#ffffff' }).setOrigin(0.5);
        this.closeBtn.setInteractive();
        this.closeBtn.on('pointerdown', () => {
            this.closeInfoPopup()
        });
        this.closeBtn.on("pointerup", ()=>{
            this.closeBtn.setScale(0.8)
        })
        const previousButton = this.scene.add.sprite(gameConfig.scale.width * 0.24, gameConfig.scale.height * 0.75, "previousButton").setInteractive()
        const previousText = this.scene.add.text(previousButton.x, previousButton.y, "Previous", {fontFamily: "Deutsch", fontSize: '27px', color: '#ffffff'}).setOrigin(0.5);
        const nextButton = this.scene.add.sprite(gameConfig.scale.width * 0.76, gameConfig.scale.height * 0.75, "nextButton").setInteractive()
        const nextButtonText = this.scene.add.text(nextButton.x, nextButton.y, "Next", {fontFamily: "Deutsch", fontSize: '27px', color: '#ffffff'}).setOrigin(0.5)
        const headingBg = scene.add.sprite(gameConfig.scale.width * 0.5, bg.y - bg.height / 2 + 50, "headingBg").setScale(0.7)
        // Add content
        const bottomText = this.scene.add.text(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.73, "GAME PAYS LEFT TO RIGHT AND RIGHT TO LEFT HIGHEST\nWIn ONLY PER LINE DIRECTION PAYS ON A \nWIN LINE PAYS ONCE ALL LINES PAYED MULTIPLIED BY LINE BET.\nMISUSE/MALFUNCTION VOIDS ALL PAYS AND PLAYS", {fontFamily:"CinzelDecorative", fontSize:"18px", color:"#ffffff", align:"center", strokeThickness:1.2}).setOrigin(0.5)
       
        // Add your info content here

        previousButton.on("pointerdown",()=>{
            this.buttonMusic("buttonpressed")
            this.goToPreviousPage()
        })
        nextButton.on("pointerdown", ()=>{
            this.buttonMusic("buttonpressed")
            this.goToNextPage();
        })

        this.add([bgLayer, bg, this.closeBtn, closeBtnText, headingBg, previousButton, previousText, nextButton, nextButtonText, bottomText]);
        this.pages = []
        this.createPages()
    }

    createPages(){
        //Page One start
        this.pages[1] = this.scene.add.container(0, 0);
        const title = this.scene.add.text(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.185, 'VAMPIRE FREE\nSPIN', { fontFamily:"CinzelDecorative", fontSize: '35px', color: '#ffffff', align:"center" } ).setOrigin(0.5);
        const wildText = this.scene.add.text(960, 300, "WIN 8 FREE SPINS WHEN A VIMPRE FINDS ITS VICTIM\nIF A VAMPIRE SYMBOL ENDS NEXT TO A HUMAN THEN FREE SPINS ARE TRIGGERED", {fontFamily:"CinzelDecorative", align:"center", fontSize:"22px", color: "#ffffff", strokeThickness: 1.5, wordWrap:{ width: 1100, useAdvancedWrap: true }}).setOrigin(0.5)
        const vampHeadingOne = this.scene.add.text(gameConfig.scale.width * 0.27, 400, "VAMPIRE SYMBOLS\nONLY APPEAR ON REELS 2 and 5", {fontFamily: "CinzelDecorative", fontSize: '18px', color: '#ffffff', align:"center", strokeThickness: 1.4 } ).setOrigin(0.5)
        const vampMan = this.scene.add.sprite(gameConfig.scale.width * 0.23, vampHeadingOne.y + 100, "slots11_0").setScale(0.7).setOrigin(0.5)
        const vampWoman = this.scene.add.sprite(gameConfig.scale.width * 0.31, vampHeadingOne.y + 100, "slots12_0").setScale(0.7).setOrigin(0.5)
        const vampMannWomanText = this.scene.add.text(vampHeadingOne.x, vampWoman.y + 130, "IF THE SECOND VAMPIRE/HUMAN PAIR\nLANDS NEXT TO EACH OTHER DURING\nFREE SPINS THEN FURTHER 8 FREE SPINS\nARE AWARDED", {fontFamily: "CinzelDecorative", color: "#ffffff", fontSize: '18px', strokeThickness:1.3} ).setOrigin(0.5)
        const vampireHeadingTwo = this.scene.add.text(gameConfig.scale.width * 0.5, 400, "IF A VAMPIRE LANDS NEXT TO A\nHUMAN SYMBOL & FREE SPIN ARE\nTRIGGERED AND THE TRIGERRING\nSYMBOLS ARE HELD IN PLACE AS WILDS.", {fontFamily:"CinzelDecorative", align:"center", strokeThickness: 1.1, fontSize:"18px", color: "#ffffff"}).setOrigin(0.5)
        const redVamp = this.scene.add.sprite(gameConfig.scale.width * 0.5, vampireHeadingTwo.y + 130, "redVampire").setOrigin(0.5).setScale(0.6)
        const redVampText = this.scene.add.text(gameConfig.scale.width * 0.5, redVamp.y + 130, "EACH VAMPIRE/HUMAN\nPAIR WILL GENERATE WILDS\nEVERY FREE SPIN.", {fontFamily: "CinzelDecorative", color: "#ffffff", fontSize: '18px', strokeThickness:1.3} ).setOrigin(0.5)
        const vampireHeadingThree = this.scene.add.text(gameConfig.scale.width * 0.72, 400, "HUMAN SYMBOL\nONLY APPEAR ON REELS 3 AND 4", {fontFamily: "CinzelDecorative", fontSize:"18px", strokeThickness:1.2, color:"#ffffff", align:"center"}).setOrigin(0.5)
        const blueMan = this.scene.add.sprite(gameConfig.scale.width * 0.68, vampireHeadingThree.y + 100, "slots13_0").setScale(0.7).setOrigin(0.5)
        const redWoman = this.scene.add.sprite(gameConfig.scale.width * 0.76, vampireHeadingThree.y + 100, "slots14_0").setScale(0.7).setOrigin(0.5)
        const blueManText = this.scene.add.text(gameConfig.scale.width * 0.72, redWoman.y + 130, "DURING FREE SPIN TRIGGERING\nSYMBOLS WILL PRODUCE WILD BLOOD \nSCATTER THAT WILL TURN OTHER SYMBOLS \nWILD EVERY FREE SPIN", {fontFamily: "CinzelDecorative", color: "#ffffff", fontSize: '18px', strokeThickness:1.3} ).setOrigin(0.5)
        this.pages[1].add([title, wildText, vampHeadingOne, vampMan, vampWoman, vampMannWomanText, vampireHeadingTwo, redVamp, redVampText, vampireHeadingThree, blueMan, redWoman, blueManText])
        this.add(this.pages[1])

        //page two start
        this.pages[2] = this.scene.add.container();
        const titleTwo = this.scene.add.text(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.185, 'DOUBLE BEATS', { fontFamily:"CinzelDecorative", fontSize: '35px', color: '#ffffff', align:"center", strokeThickness:1.5 } ).setOrigin(0.5);
        const BatHeading = this.scene.add.text(960, 370, "THERE IS A BAT SYMBOL AND X2 BA SYMBOL\nBOTH CONTRIBUTES TO BAT WIN", {fontFamily:"CinzelDecorative", align:"center", fontSize:"22px", color: "#ffffff", strokeThickness: 1.7, wordWrap:{ width: 900, useAdvancedWrap: true }}).setOrigin(0.5)
        const smallBat = this.scene.add.sprite(gameConfig.scale.width * 0.28, BatHeading.y, "slots9_0").setScale(0.8).setOrigin(0.5)
        const doubleBat = this.scene.add.sprite(gameConfig.scale.width * 0.72, BatHeading.y, "slots10_0").setScale(0.8).setOrigin(0.5)
        const payOutText = this.scene.add.text(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.47, "THE X2 BAT SYMBOL ACT AS 2 NORMAL BAT SYMBOLS. SO A LINE OF 5 BAT SYMBOLS WHERE TWO OF THEM ARE X2 BAT SYMBOLS WILL ACTUALLY BE A WIN OF X7 BATS.", {fontFamily:"CinzelDecorative", align:"center", fontSize:"22px", color: "#ffffff", strokeThickness: 1.7, wordWrap:{ width: 900, useAdvancedWrap: true }}).setOrigin(0.5)
        const payoutHeading = this.scene.add.text(gameConfig.scale.width * 0.5, 580, "PAYOUT", { fontFamily:"CinzelDecorative", fontSize: '28px', color: '#ffffff', align:"center", strokeThickness:1.5 } ).setOrigin(0.5);

        const payOutfirst = this.scene.add.text(gameConfig.scale.width * 0.28, gameConfig.scale.height * 0.59, "X13", {fontFamily:"CinzelDecorative", fontSize:"36px", color:"#ffffff", align:"center"}).setOrigin(0.5)
        const payOutSecond = this.scene.add.text(gameConfig.scale.width * 0.33, gameConfig.scale.height * 0.59, "X12", {fontFamily:"CinzelDecorative", fontSize:"36px", color:"#ffffff", align:"center"}).setOrigin(0.5)
        const payOutThird = this.scene.add.text(gameConfig.scale.width * 0.38, gameConfig.scale.height * 0.59, "X11", {fontFamily:"CinzelDecorative", fontSize:"36px", color:"#ffffff", align:"center"}).setOrigin(0.5)
        const payOutFourth = this.scene.add.text(gameConfig.scale.width * 0.43, gameConfig.scale.height * 0.59, "X10", {fontFamily:"CinzelDecorative", fontSize:"36px", color:"#ffffff", align:"center"}).setOrigin(0.5)
        const payOutFifth = this.scene.add.text(gameConfig.scale.width * 0.48, gameConfig.scale.height * 0.59, "X9", {fontFamily:"CinzelDecorative", fontSize:"36px", color:"#ffffff", align:"center"}).setOrigin(0.5)
        const payOutSixth = this.scene.add.text(gameConfig.scale.width * 0.53, gameConfig.scale.height * 0.59, "X8", {fontFamily:"CinzelDecorative", fontSize:"36px", color:"#ffffff", align:"center"}).setOrigin(0.5)
        const payOutSeventh = this.scene.add.text(gameConfig.scale.width * 0.58, gameConfig.scale.height * 0.59, "X7", {fontFamily:"CinzelDecorative", fontSize:"36px", color:"#ffffff", align:"center"}).setOrigin(0.5)
        const payOutEight = this.scene.add.text(gameConfig.scale.width * 0.63, gameConfig.scale.height * 0.59, "X6", {fontFamily:"CinzelDecorative", fontSize:"36px", color:"#ffffff", align:"center"}).setOrigin(0.5)
        const payOutNinth = this.scene.add.text(gameConfig.scale.width * 0.68, gameConfig.scale.height * 0.59, "X5", {fontFamily:"CinzelDecorative", fontSize:"36px", color:"#ffffff", align:"center"}).setOrigin(0.5)
        const payOutTenth = this.scene.add.text(gameConfig.scale.width * 0.73, gameConfig.scale.height * 0.59, "X4", {fontFamily:"CinzelDecorative", fontSize:"36px", color:"#ffffff", align:"center"}).setOrigin(0.5)

        const payoutFirstAmount = this.scene.add.text(gameConfig.scale.width * 0.28, gameConfig.scale.height * 0.64, "300", {fontFamily:"CinzelDecorative", fontSize:"36px", color:"#ffffff", align:"center"}).setOrigin(0.5)
        const payoutSecondAmount = this.scene.add.text(gameConfig.scale.width * 0.33, gameConfig.scale.height * 0.64, "150", {fontFamily:"CinzelDecorative", fontSize:"36px", color:"#ffffff", align:"center"}).setOrigin(0.5)
        const payoutThirdAmount = this.scene.add.text(gameConfig.scale.width * 0.38, gameConfig.scale.height * 0.64, "90", {fontFamily:"CinzelDecorative", fontSize:"36px", color:"#ffffff", align:"center"}).setOrigin(0.5)
        const payoutFourthAmount = this.scene.add.text(gameConfig.scale.width * 0.43, gameConfig.scale.height * 0.64, "45", {fontFamily:"CinzelDecorative", fontSize:"36px", color:"#ffffff", align:"center"}).setOrigin(0.5)
        const payoutFifthAmount = this.scene.add.text(gameConfig.scale.width * 0.48, gameConfig.scale.height * 0.64, "24", {fontFamily:"CinzelDecorative", fontSize:"36px", color:"#ffffff", align:"center"}).setOrigin(0.5)
        const payoutSixthAmount = this.scene.add.text(gameConfig.scale.width * 0.53, gameConfig.scale.height * 0.64, "15", {fontFamily:"CinzelDecorative", fontSize:"36px", color:"#ffffff", align:"center"}).setOrigin(0.5)
        const payoutSeventhAmount = this.scene.add.text(gameConfig.scale.width * 0.58, gameConfig.scale.height * 0.64, "6", {fontFamily:"CinzelDecorative", fontSize:"36px", color:"#ffffff", align:"center"}).setOrigin(0.5)
        const payoutEighthAmount = this.scene.add.text(gameConfig.scale.width * 0.63, gameConfig.scale.height * 0.64, "3", {fontFamily:"CinzelDecorative", fontSize:"36px", color:"#ffffff", align:"center"}).setOrigin(0.5)
        const payoutNinthAmount = this.scene.add.text(gameConfig.scale.width * 0.68, gameConfig.scale.height * 0.64, "1.5", {fontFamily:"CinzelDecorative", fontSize:"36px", color:"#ffffff", align:"center"}).setOrigin(0.5)
        const payoutTenthAmount = this.scene.add.text(gameConfig.scale.width * 0.73, gameConfig.scale.height * 0.64, "1.2", {fontFamily:"CinzelDecorative", fontSize:"36px", color:"#ffffff", align:"center"}).setOrigin(0.5)


        this.pages[2].add([titleTwo, BatHeading, smallBat, doubleBat, payOutText, payoutHeading, payOutfirst, payOutSecond, payOutThird,payOutFourth, payOutFifth, payOutSixth, payOutSeventh, payOutEight, payOutNinth, payOutTenth, payoutFirstAmount, 
            payoutSecondAmount, payoutThirdAmount, payoutFourthAmount, payoutFifthAmount, payoutSixthAmount, payoutSeventhAmount, payoutEighthAmount, payoutNinthAmount, payoutTenthAmount])
        this.add(this.pages[2]);

        //page three start
        this.pages[3] = this.scene.add.container();
        
        const titleThree = this.scene.add.text(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.185, 'PAYOUTS', { fontFamily:"CinzelDecorative", fontSize: '35px', color: '#ffffff', align:"center", strokeThickness:1.5 } ).setOrigin(0.5);
        
        const wildSymbols = this.scene.add.sprite(gameConfig.scale.width * 0.36, gameConfig.scale.height * 0.32, "slots15_0").setOrigin(0.5).setScale(0.8)
        const wildFirstText = this.scene.add.text(gameConfig.scale.width * 0.43, gameConfig.scale.height * 0.28, "3X - 5", {fontFamily: "CinzelDecorative", fontSize: '22px', color: "#ffffff", strokeThickness:1.8}).setOrigin(0.5)
        const wildSecondText = this.scene.add.text(gameConfig.scale.width * 0.43, gameConfig.scale.height * 0.31, "4X - 15", {fontFamily: "CinzelDecorative", fontSize: '22px', color: "#ffffff", strokeThickness:1.8}).setOrigin(0.5)
        const wildThirdText = this.scene.add.text(gameConfig.scale.width * 0.43, gameConfig.scale.height * 0.34, "5X - 30", {fontFamily: "CinzelDecorative", fontSize: '22px', color: "#ffffff", strokeThickness:1.8}).setOrigin(0.5)
        const wildFourthText = this.scene.add.text(gameConfig.scale.width * 0.43, gameConfig.scale.height * 0.37, "6X - 50", {fontFamily: "CinzelDecorative", fontSize: '22px', color: "#ffffff", strokeThickness:1.8}).setOrigin(0.5)
        const wildDescription = this.scene.add.text(gameConfig.scale.width * 0.6, gameConfig.scale.height * 0.32, "SUBSTITUTE FOR ALL SYMBOLS.\nEXCEPT THE FREE SPINS SYMBOLS\n(VAMPIRE AND HUMANS).\nWHEN SUISTING FOR BATS. WILD \nONLY ACTS AS A SINGLE BAT", { fontFamily:"CinzelDecorative", fontSize: '22px', color: '#ffffff', align:"left", strokeThickness:1.5, } ).setOrigin(0.5);
        
        const greenCastle = this.scene.add.sprite(gameConfig.scale.width * 0.23, gameConfig.scale.height * 0.46, "slots4_0").setOrigin(0.5).setScale(0.6)
        const greenCastleFirstText = this.scene.add.text(gameConfig.scale.width * 0.29, gameConfig.scale.height * 0.41, "6X - 100", {fontFamily: "CinzelDecorative", fontSize: "25px", color: "#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const greenCastleSecondText = this.scene.add.text(gameConfig.scale.width * 0.29, gameConfig.scale.height * 0.44, "5X - 80", {fontFamily: "CinzelDecorative", fontSize: "25px", color: "#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const greenCastleThirdText = this.scene.add.text(gameConfig.scale.width * 0.29, gameConfig.scale.height * 0.47, "4X - 40", {fontFamily: "CinzelDecorative", fontSize: "25px", color: "#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const greenCastleFourthText = this.scene.add.text(gameConfig.scale.width * 0.29, gameConfig.scale.height * 0.5, "3X - 20", {fontFamily: "CinzelDecorative", fontSize: "25px", color: "#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        

        const blueGragoyale = this.scene.add.sprite(gameConfig.scale.width * 0.7, gameConfig.scale.height * 0.46, "slots5_0").setScale(0.6).setOrigin(0.5)
        const blueGragoyaleFirstText = this.scene.add.text(gameConfig.scale.width * 0.77, gameConfig.scale.height * 0.41, "6X - 100", {fontFamily: "CinzelDecorative", fontSize: "25px", color: "#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const blueGragoyaleSecondText = this.scene.add.text(gameConfig.scale.width * 0.77, gameConfig.scale.height * 0.44, "5X - 80", {fontFamily: "CinzelDecorative", fontSize: "25px", color: "#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const blueGragoyaleThirdText = this.scene.add.text(gameConfig.scale.width * 0.77, gameConfig.scale.height * 0.47, "4X - 40", {fontFamily: "CinzelDecorative", fontSize: "25px", color: "#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const blueGragoyaleFourthText = this.scene.add.text(gameConfig.scale.width * 0.77, gameConfig.scale.height * 0.5, "3X - 20", {fontFamily: "CinzelDecorative", fontSize: "25px", color: "#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        
        const highValueText = this.scene.add.text(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.46, "HIGH VALUE SYMBOL", {fontFamily:"CinzelDecorative", fontSize:"50px", align:"center", color:"#ffffff", strokeThickness:2}).setOrigin(0.5)
        const slot6 = this.scene.add.sprite(gameConfig.scale.width * 0.3, gameConfig.scale.height * 0.6, "slots6_0").setScale(0.8).setOrigin(0.5)
        const slot7 = this.scene.add.sprite(gameConfig.scale.width * 0.47, gameConfig.scale.height * 0.6, "slots7_0").setScale(0.8).setOrigin(0.5)
        const slots8 = this.scene.add.sprite(gameConfig.scale.width * 0.66, gameConfig.scale.height * 0.6, "slots8_0").setOrigin(0.5).setScale(0.8)
        const slots6FirstText = this.scene.add.text(gameConfig.scale.width * 0.365, gameConfig.scale.height * 0.55, "6X - 100", {fontFamily:"CinzelDecorative", fontSize:"25px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const slots6SecondText = this.scene.add.text(gameConfig.scale.width * 0.365, gameConfig.scale.height * 0.58, "5X - 80", {fontFamily:"CinzelDecorative", fontSize:"25px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const slots6ThirdText = this.scene.add.text(gameConfig.scale.width * 0.365, gameConfig.scale.height * 0.61, "4X - 40", {fontFamily:"CinzelDecorative", fontSize:"25px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const slots6FourthText = this.scene.add.text(gameConfig.scale.width * 0.365, gameConfig.scale.height * 0.64, "3X - 20", {fontFamily:"CinzelDecorative", fontSize:"25px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        
        const slots7FirstText = this.scene.add.text(gameConfig.scale.width * 0.535, gameConfig.scale.height * 0.55, "6X - 100", {fontFamily:"CinzelDecorative", fontSize:"25px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const slots7SecondText = this.scene.add.text(gameConfig.scale.width * 0.535, gameConfig.scale.height * 0.58, "4X - 80", {fontFamily:"CinzelDecorative", fontSize:"25px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const slots7ThirdText = this.scene.add.text(gameConfig.scale.width * 0.535, gameConfig.scale.height * 0.61, "4X - 40", {fontFamily:"CinzelDecorative", fontSize:"25px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const slots7FourthText = this.scene.add.text(gameConfig.scale.width * 0.535, gameConfig.scale.height * 0.64, "3X - 20", {fontFamily:"CinzelDecorative", fontSize:"25px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)

        const slots8FirstText = this.scene.add.text(gameConfig.scale.width * 0.725, gameConfig.scale.height * 0.55, "6X - 100", {fontFamily:"CinzelDecorative", fontSize:"25px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const slots8SecondText = this.scene.add.text(gameConfig.scale.width * 0.725, gameConfig.scale.height * 0.58, "4X - 80", {fontFamily:"CinzelDecorative", fontSize:"25px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const slots8ThirdText = this.scene.add.text(gameConfig.scale.width * 0.725, gameConfig.scale.height * 0.61, "4X - 40", {fontFamily:"CinzelDecorative", fontSize:"25px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const slots8FourthText = this.scene.add.text(gameConfig.scale.width * 0.725, gameConfig.scale.height * 0.64, "3X - 20", {fontFamily:"CinzelDecorative", fontSize:"25px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)

        this.pages[3].add([titleThree, wildSymbols, wildFirstText, wildSecondText, wildThirdText, wildFourthText, wildDescription, greenCastle, greenCastleFirstText, greenCastleSecondText, greenCastleThirdText, greenCastleFourthText, blueGragoyale,
            blueGragoyaleFirstText, blueGragoyaleSecondText, blueGragoyaleThirdText, blueGragoyaleFourthText, highValueText, slot6, slot7, slots8, slots6FirstText, slots6SecondText, slots6ThirdText, slots6FourthText, 
            slots7FirstText, slots7SecondText, slots7ThirdText, slots7FourthText, slots8FirstText, slots8SecondText, slots8ThirdText, slots8FourthText
        ])
        this.add(this.pages[3]);

        //page four start
        this.pages[4] = this.scene.add.container()
        const titlefour = this.scene.add.text(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.185, "PAYOUTS",  { fontFamily:"CinzelDecorative", fontSize: '35px', color: '#ffffff', align:"center", strokeThickness:1.5 } ).setOrigin(0.5);
        const pageHeading = this.scene.add.text(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.27, "STANDARD SYMBOLS!", {fontFamily:"CinzelDecorative", fontSize:"27px", align: "center", color:"#ffffff", strokeThickness: 2}).setOrigin(0.5)
        const slots0 = this.scene.add.sprite(gameConfig.scale.width * 0.38, gameConfig.scale.height * 0.36, "slots0_0").setScale(0.6).setOrigin(0.5)
        const slots0FirstText = this.scene.add.text(gameConfig.scale.width * 0.43, gameConfig.scale.height * 0.31, "6X - 70", {fontFamily:"CinzelDecorative", fontSize:"23px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const slots0SecondText = this.scene.add.text(gameConfig.scale.width * 0.43, gameConfig.scale.height * 0.34, "5X - 50", {fontFamily:"CinzelDecorative", fontSize:"23px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const slots0ThirdText = this.scene.add.text(gameConfig.scale.width * 0.43, gameConfig.scale.height * 0.37, "4X - 30", {fontFamily:"CinzelDecorative", fontSize:"23px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const slots0FourthText = this.scene.add.text(gameConfig.scale.width * 0.43, gameConfig.scale.height * 0.4, "3X - 15", {fontFamily:"CinzelDecorative", fontSize:"23px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        
        
        
        const slots1 = this.scene.add.sprite(gameConfig.scale.width * 0.55, gameConfig.scale.height * 0.36, "slots1_0").setScale(0.6).setOrigin(0.5)
        const slots1FirstText = this.scene.add.text(gameConfig.scale.width * 0.6, gameConfig.scale.height * 0.31, "6X - 70", {fontFamily:"CinzelDecorative", fontSize:"23px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const slots1SecondText = this.scene.add.text(gameConfig.scale.width * 0.6, gameConfig.scale.height * 0.34, "5X - 50", {fontFamily:"CinzelDecorative", fontSize:"23px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const slots1ThirdText = this.scene.add.text(gameConfig.scale.width * 0.6, gameConfig.scale.height * 0.37, "4X - 30", {fontFamily:"CinzelDecorative", fontSize:"23px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const slots1FourthText = this.scene.add.text(gameConfig.scale.width * 0.6, gameConfig.scale.height * 0.4, "3X - 15", {fontFamily:"CinzelDecorative", fontSize:"23px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)

        const slots2 = this.scene.add.sprite(gameConfig.scale.width * 0.38, gameConfig.scale.height * 0.5, "slots2_0").setScale(0.6).setOrigin(0.5)
        const slots2FirstText = this.scene.add.text(gameConfig.scale.width * 0.43, gameConfig.scale.height * 0.45, "6X - 70", {fontFamily:"CinzelDecorative", fontSize:"23px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const slots2SecondText = this.scene.add.text(gameConfig.scale.width * 0.43, gameConfig.scale.height * 0.48, "5X - 50", {fontFamily:"CinzelDecorative", fontSize:"23px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const slots2ThirdText = this.scene.add.text(gameConfig.scale.width * 0.43, gameConfig.scale.height * 0.51, "4X - 30", {fontFamily:"CinzelDecorative", fontSize:"23px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const slots2FourthText = this.scene.add.text(gameConfig.scale.width * 0.43, gameConfig.scale.height * 0.54, "3X - 15", {fontFamily:"CinzelDecorative", fontSize:"23px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)

        const slots3 = this.scene.add.sprite(gameConfig.scale.width * 0.55, gameConfig.scale.height * 0.5, "slots3_0").setScale(0.6).setOrigin(0.5)
        const slots3FirstText = this.scene.add.text(gameConfig.scale.width * 0.6, gameConfig.scale.height * 0.45, "6X - 70", {fontFamily:"CinzelDecorative", fontSize:"23px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const slots3SecondText = this.scene.add.text(gameConfig.scale.width * 0.6, gameConfig.scale.height * 0.48, "5X - 50", {fontFamily:"CinzelDecorative", fontSize:"23px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const slots3ThirdText = this.scene.add.text(gameConfig.scale.width * 0.6, gameConfig.scale.height * 0.51, "4X - 30", {fontFamily:"CinzelDecorative", fontSize:"23px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const slots3FourthText = this.scene.add.text(gameConfig.scale.width * 0.6, gameConfig.scale.height * 0.54, "3X - 15", {fontFamily:"CinzelDecorative", fontSize:"23px", align: "center", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const payLineHeading = this.scene.add.text(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.57, "WIN LINES", {fontFamily: "CinzelDecorative", fontSize: "25px", color: "#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const winPayLine = this.scene.add.sprite(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.64, "payLine").setOrigin(0.5).setScale(0.8)

        this.pages[4].add([titlefour, pageHeading, slots0, slots1, slots2, slots3, winPayLine, slots0FirstText, slots0SecondText, slots0ThirdText, slots0FourthText, slots1FirstText, slots1SecondText, slots1ThirdText, slots1FourthText, 
            slots2FirstText, slots2SecondText, slots2ThirdText, slots2FourthText, slots3FirstText, slots3SecondText, slots3ThirdText, slots3FourthText, payLineHeading
        ])
        this.add(this.pages[4]);

        this.pages[5] = this.scene.add.container();
        const titlefive = this.scene.add.text(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.185, "DOUBLE GAME",  { fontFamily:"CinzelDecorative", fontSize: '35px', color: '#ffffff', align:"center", strokeThickness:1.5 } ).setOrigin(0.5);
        const coin = this.scene.add.sprite(gameConfig.scale.width * 0.35, gameConfig.scale.height * 0.36, "coin0").setScale(0.4).setOrigin(0.5)
        const outerCircle = this.scene.add.sprite(gameConfig.scale.width * 0.65, gameConfig.scale.height * 0.36, "circleBg").setScale(1.1).setOrigin(0.5)
        const doubleCoin = this.scene.add.sprite(gameConfig.scale.width * 0.65, gameConfig.scale.height * 0.365, "blueCircle").setScale(0.5).setScale(1.4)
        const doubleText = this.scene.add.text(gameConfig.scale.width * 0.65, gameConfig.scale.height * 0.36, "Double\nUp", {fontFamily: "Deutsch", fontSize:"30px", color:"#ffffff", align:"center"}).setOrigin(0.5)
        const doubleHeading = this.scene.add.text(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.36, "DOUBLE UP GAME", {fontFamily:"CinzelDecorative", fontSize: "38px", color:"#ffffff", strokeThickness: 1.8}).setOrigin(0.5)
        const doubleGameText = this.scene.add.text(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.57, "PRESS THE DOUBLE UP BUTTON AFTER ANY STANDARD WINS TO GAMBLE YOUR WINNINGS.\nDOUBLE UP IS UNAVAILABLE AFTER FREE SPINS FEATURE.\nGAMBLE 50% OR ALL YOUR WINNINGS.\nSELECT GAMBLE ALL OR GAMBLE 50% AND THEN BET BY PRESSINS HEADS OR TAILS. THE COIN WILL SPIN AND IF YOUR GUESS WAS CORRECT YOU WILL DOUBLE YOUR STAKE. PRESS COLLECT TO COLLECT YOUR WINNINGS AND RETURN TO THE GAME",{fontFamily:"CinzelDecorative", fontSize:"23px", color: "#ffffff", align:"center",strokeThickness: 1.8,wordWrap:{ width: 1100, useAdvancedWrap: true}}).setOrigin(0.5)
        this.pages[5].add([titlefive, coin, outerCircle, doubleCoin, doubleText, doubleHeading, doubleGameText]);

        this.add(this.pages[5])

        this.pages = [this.pages[1], this.pages[2], this.pages[3], this.pages[4], this.pages[5]];
        this.currentPageIndex = 0;
        
        // Set initial visibility 
        this.pages.forEach((page, index) => {
            page.setVisible(index === this.currentPageIndex);
        });
    }

    closeInfoPopup(){
        this.buttonMusic("buttonpressed")
        this.closeBtn.setScale(0.7)
        this.scene.events.emit('closePopup');
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
    buttonMusic(key: string){
        if(currentGameData.globalSound){
            this.SoundManager.playSound(key)
        }
    }
}