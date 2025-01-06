import Phaser from "phaser";
import { currentGameData, Globals } from "./Globals";

export default class SoundManager{
    private scene : Phaser.Scene;
    public sounds: {[key: string]: Phaser.Sound.BaseSound} = {};
    private soundEnabled: boolean = true;
    private musicEnabled : boolean = true;
    private masterVolume: number = 1; // New property for master volume

    constructor(scene: Phaser.Scene){
        this.scene = scene
    }

    public addSound(key: string, url: string){
        if(this.scene.sound.get(key)){
            this.sounds[key] = this.scene.sound.get(key)
        }else{
            this.sounds[key] = this.scene.sound.add(key, {volume: 0.5})
        }
    }

    public playSound(key: string, volume?: number){
        if(this.soundEnabled){
            const sound = Globals.soundResources[key];
            if(sound){
                if(volume !== undefined){
                    sound.userVolume = Phaser.Math.Clamp(volume, 0, 0.2)
                    this.applyVolumeToSound(sound)
                }
                if(key === "winMusic"){
                    sound.rate(1.5)
                }
                if(key === "backgroundMusic" || key === "onSpin"){
                    sound.loop(true)
                }else{
                    sound.loop(false)
                }
                sound.play();
            }
        }
    }

    public pauseSound(key: string){
        Globals.soundResources[key].stop()
    }
    public resumeMusic(key: string){
        Globals.soundResources[key].play()
    }

    public stopSound(key: string){
        if(Globals.soundResources[key]){
            Globals.soundResources[key].stop()
        }
    }

    public toggleAllSounds(enable: boolean) {
        this.soundEnabled = enable;
        this.musicEnabled = enable;
        if (!enable) {
            // Stop all sounds
            Object.entries(Globals.soundResources).forEach(([key, sound]) => {
                sound.stop();
            });
        } else {
            // if(enable === currentGameData.globalSound) return
            // Resume background music if it was playing before
            this.playSound("backgroundMusic");
        }
    }

    public setSoundEnabled(enable: boolean){
        this.soundEnabled = enable
        console.log("enable", enable);
        if(!enable){
            Object.values(this.sounds).forEach(sounds => sounds.stop());
        }
    }
    public setMusicEnabled(enable: boolean){
        this.musicEnabled = enable
        if(currentGameData.globalSound === enable){
            return
        }
        if(!enable){
            this.stopSound("backgroundMusic")
        }else{
            this.playSound("backgroundMusic")
        }
    }

    public setMasterVolume(volume: number) {
        Globals.masetrVolume = Phaser.Math.Clamp(volume, 0, 1);
        Object.entries(Globals.soundResources).forEach(([key, sound]) => {
            if (key == 'backgroundMusic') {
                this.applyVolumeToSound(sound);
            }
        });
    }
    
    public setVolume(key: string, volume: number) {
        Globals.masetrVolume = Phaser.Math.Clamp(volume, 0, 1);
        Object.entries(Globals.soundResources).forEach(([key, sound]) => {
            if (key !== 'backgroundMusic') {
                this.applyVolumeToSound(sound);
            }
        });
    }

    public applyVolumeToSound(sound: Howl & {userVolume?: number}){
        const finalVolume = Globals.masetrVolume * (sound.userVolume || 1)
        sound.volume(finalVolume)
    }
    public getSound(key: string): Phaser.Sound.BaseSound | undefined {
        return this.sounds[key];
    }
    
    public getMasterVolume(): number {
        return this.masterVolume;
    }
    
    public getSoundVolume(key: string): number {
        const sound = Globals.soundResources[key];
        return sound ? (sound.userVolume || 1) : 1;
    }
}