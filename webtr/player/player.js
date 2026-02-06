/**
 * WebTR Library Compiled
 * Source: player.weblib
 * Date: 2026-02-06T19:46:29.365Z
 * 
 * ⚠️ Generated Content - Do not edit directly
 */
export class VideoPlayer {
    constructor(id) {
        this.id = id;
        this.videoElement = null;
        this.isPlaying = false;
    }

    mount(elementId) {
        this.videoElement = document.getElementById(elementId);
        if (!this.videoElement) {
            console.error(`Player: Element #${elementId} not found`);
            return;
        }

        this.videoElement.addEventListener('play', () => this.isPlaying = true);
        this.videoElement.addEventListener('pause', () => this.isPlaying = false);
    }

    play() {
        if (this.videoElement) this.videoElement.play();
    }

    pause() {
        if (this.videoElement) this.videoElement.pause();
    }

    toggle() {
        if (this.isPlaying) this.pause();
        else this.play();
    }
}
