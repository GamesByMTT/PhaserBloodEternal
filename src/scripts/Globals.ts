import Phaser from "phaser";
import Stats from "stats.js";
import { Howl } from "howler";
import MyEmitter from "./MyEmitter";
import { SceneHandler } from "./SceneHandler";

type globalDataType = {
    resources: {[key: string]: Phaser.Textures.Texture},
    emitter: MyEmitter | undefined,
    fpsStats: Stats,
    soundResources: {[key: string]: Howl & {userVolume?: number}}
    SceneHandler: SceneHandler | undefined,
    Socket: any
    PhaserInstance : Phaser.Game | undefined,
    masetrVolume: number
}
export const Globals: globalDataType = {
    emitter: undefined,
    resources: {},
    SceneHandler: undefined,
    fpsStats: new Stats(),
    Socket: undefined,
    soundResources: {},
    PhaserInstance: undefined,
    masetrVolume: 1
}

interface SymbolType{
    ID: number,
    Name: string,
    multiplier: [number, number][],
    defaultAmount: object,
    symbolsCount: object
    description: string
}

export const currentGameData = {
    currentBetIndex: 0,
    won: 0,
    currentBalance: 0,
    currentLines: 0,
    AutoPlay: 0,
    isMoving: false,
    soundMode: true,
    musicMode: true,
    speakerVolume: true,
    turboMode: false,
    isAutoSpin: false,
    globalSound: true,
    gambleOpen: false
}

export const gambleData = {
    selected: "HEAD",
    gambleOption: "ALL",
    id: "GAMBLERESULT"
}

export const gambleResultData = {
    gambleResponse:{
        coin: "",
        currentWinning: 0,
        playerWon: false
    }
}


export const initData = {
    gameData: {
        Reel: [[]],
        BonusData: [],
        Bets: [],
        Lines: [[]],
        autoSpin: [],
        LinesCount: []
    },
    playerData:{
        Balance: 0,
        haveWon: 0,
        currentWining: 0,
        currentBet: 0
    },
    UIData:{
        symbols:[
            {
                ID: 0,
                Name: "0",
                multiplier: [[5, 0], [4, 0], [2, 0]],
                defaultAmount: {},
                symbolsCount: {},  // Replace with actual data
              },
            {
                ID: 1,
                Name: "1",
                multiplier: [[5,0], [4, 0], [3,0]],
                defaultAmount: {},
                symbolsCount: {}
            }
        ] as SymbolType[],
        spclSymbolTxt: []
    }
}

export const ResultData = {
    gameData:{
        ResultReel: [[]],
        batPayout: [],
        winAmount: 0,
        count: 0,
        linesToEmit:[],
        symbolsToEmit : [], 
        batPositions: [],
        bloodSplash: [],
        isBonus: false,
        isFreeSpin:  false,
        vampHuman:[]
    },
    playerData:{
        Balance: 0,
        haveWon: 0,
        currentWining: 0,
        currentBet: 0,
    }
}

export const TextStyle = {
    dropShadow: true,
    dropShadowAngle: 1.8,
    dropShadowColor: "#ffffff",
    dropShadowDistance: 1,
    fill: "#ffffff",
    fillGradientStops: [0.4],
    fontSize: 32,
    fontWeight: "bolder",
    lineJoin: "round",
    miterLimit: 0,
    stroke: "#4f3130",
    strokeThickness: 1.5,
  };