import { Scene } from "phaser";
import InfoPopup from "./popups/InfoPopup";
import SettingPopup from "./popups/SettingPopup";

export class PopupManager {
    private scene: Scene;
    private popupContainer: Phaser.GameObjects.Container;
    private overlay: Phaser.GameObjects.Rectangle;
    private currentPopup: InfoPopup | SettingPopup | null = null;

    constructor(scene: Scene) {
        this.scene = scene;
        
        // Create main container for popups
        this.popupContainer = scene.add.container(0, 0);
        this.popupContainer.setDepth(1000);

        // Create dark overlay
        this.overlay = scene.add.rectangle(0, 0, scene.scale.width,  scene.scale.height, 0x000000, 0.7);
        this.overlay.setOrigin(0);
        this.overlay.setInteractive();
        this.popupContainer.add(this.overlay);
        // Initially hide the container
        this.popupContainer.setVisible(false);
        this.scene.events.on('closePopup', this.closeCurrentPopup, this);
    }

    showInfoPopup(data: any) {
        this.closeCurrentPopup();
        this.currentPopup = new InfoPopup(this.scene, data);
        this.popupContainer.add(this.currentPopup);
        this.popupContainer.setVisible(true);
    }

    showSettingPopup(data: any) {
        this.closeCurrentPopup();
        this.currentPopup = new SettingPopup(this.scene, data);
        this.popupContainer.add(this.currentPopup);
        this.popupContainer.setVisible(true);
    }

    closeCurrentPopup() {
        if (this.currentPopup) {
            this.currentPopup.destroy();
            this.currentPopup = null;
        }
        this.popupContainer.setVisible(false);
    }
    // Add cleanup method
    destroy() {
        this.scene.events.off('closePopup', this.closeCurrentPopup, this);
        this.popupContainer.destroy();
    }
}