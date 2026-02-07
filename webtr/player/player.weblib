/**
 * WebTR Video Player Class
 * Provides a unified logic controller for video players
 */
export class WebTRPlayer {
    constructor(videoElementId, options = {}) {
        this.videoElementId = videoElementId;
        this.video = null;
        this.options = options;

        // Internal state
        this.state = {
            isPlaying: false,
            progress: "0.00",
            duration: 0,
            currentTime: 0,
            isMuted: false,
            volume: 1
        };
    }

    mount() {
        this.video = document.getElementById(this.videoElementId);
        if (!this.video) {
            console.error(`WebTRPlayer: Element #${this.videoElementId} not found`);
            return;
        }

        // Attach listeners
        this.video.addEventListener('play', () => this.updateState({ isPlaying: true }));
        this.video.addEventListener('pause', () => this.updateState({ isPlaying: false }));
        this.video.addEventListener('timeupdate', () => this.handleProgress());
        this.video.addEventListener('volumechange', () => this.updateState({
            isMuted: this.video.muted,
            volume: this.video.volume
        }));
        this.video.addEventListener('loadedmetadata', () => this.updateState({ duration: this.video.duration }));

        // Initial state
        this.updateState({
            isMuted: this.video.muted,
            volume: this.video.volume,
            duration: this.video.duration || 0
        });

        return this;
    }

    updateState(newState) {
        Object.assign(this.state, newState);

        // Sync with global WebTR state if available
        if (typeof WebTR !== 'undefined' && WebTR.state) {
            // Only update keys that exist in WebTR.state to avoid pollution
            for (const key in newState) {
                if (key in WebTR.state) {
                    WebTR.state[key] = newState[key];
                }
            }
        }
    }

    handleProgress() {
        if (!this.video) return;
        const current = this.video.currentTime;
        const duration = this.video.duration || 1; // avoid div/0
        const percent = (current / duration) * 100;

        this.updateState({
            currentTime: current,
            progress: percent.toFixed(2)
        });
    }

    togglePlay() {
        if (!this.video) return;
        if (this.video.paused) {
            this.video.play();
        } else {
            this.video.pause();
        }
    }

    toggleMute() {
        if (!this.video) return;
        this.video.muted = !this.video.muted;
    }

    seek(percent) {
        if (!this.video) return;
        const duration = this.video.duration || 0;
        this.video.currentTime = (percent / 100) * duration;
    }

    seekFromEvent(e) {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const percent = (x / width) * 100;
        this.seek(percent);
    }

    toggleFullscreen() {
        if (!this.video) return;
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else if (this.video.requestFullscreen) {
            this.video.requestFullscreen();
        } else if (this.video.webkitRequestFullscreen) {
            this.video.webkitRequestFullscreen();
        }
    }
}
