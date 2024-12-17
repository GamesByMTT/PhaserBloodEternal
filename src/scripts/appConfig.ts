import Phaser from "phaser";
import BBCodeTextPlugin from "phaser3-rex-plugins/plugins/bbcodetext-plugin";
import MainLoader from "../view/MainLoader";
// import Background from "../view/BackGround";
const BASE_WIDTH = 1920
const BASE_HEIGHT = 1080;
const ASPECT_RATIO = BASE_WIDTH / BASE_HEIGHT;

export const gameConfig = {
  type: Phaser.AUTO,
  scene: [MainLoader],
  scale: {
    scaleFactor: 0.9,
    minScaleFactor: 1,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
    get topY() {
      return (window.innerHeight - this.height * this.scaleFactor) / 2 + 20; 
    },
    get bottomY() {
      return window.innerHeight - this.topY + 20; 
    },
    get leftX() {
      return (window.innerWidth - this.width * this.scaleFactor) / 2;
    },
    get rightX() {
      return window.innerWidth - this.leftX;
    },
    get minTopY(): number {
      return (window.innerHeight - (this.width * this.minScaleFactor)) / 2;
    },
    get minBottomY(): number {
      return window.innerHeight - this.minTopY;
    },
    get minLeftX(): number {
      return (window.innerWidth - (this.width* this.minScaleFactor)) / 2;
    },
    get minRightX(): number {
      return window.innerWidth - this.leftX;
    }
  },
  physics: { 
    default: "arcade",
    arcade: {
      debug: false,
    },
  },

  plugins: {
    global: [
      {
        key: "rexBBCodeTextPlugin",
        plugin: BBCodeTextPlugin,
        start: true,
      },
    ],
  }
};

export const calculateScaleFactor = () => {
  const { width, height } = gameConfig.scale;
  const maxScaleFactor = Math.max(
    window.innerWidth / width,
    window.innerHeight / height
  );

  const minScaleFactor = Math.min(
    window.innerWidth / width,
    window.innerHeight / height
  );

  gameConfig.scale.scaleFactor = maxScaleFactor;
  gameConfig.scale.minScaleFactor = minScaleFactor;

  const canvas = document.querySelector("canvas");
  if (canvas) {
    canvas.style.marginTop = "20px"; 
    canvas.style.marginBottom = "20px"; 
  }
};

export const getMaxScaleFactor = () => {
  const { width, height } = gameConfig.scale;
  return Math.max(
    window.innerWidth / width,
    window.innerHeight / height
  );
};

export const getMinScaleFactor = () => {
  const { width, height } = gameConfig.scale;
  return Math.min(
    window.innerWidth / width,
    window.innerHeight / height
  );
};