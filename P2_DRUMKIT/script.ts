interface IMusic {
    key: string,
    time: number
}
interface IMusicElement {
    element: HTMLAudioElement,
    key: string
}

class Drumkit {
    sounds: Array<HTMLAudioElement> = [];
    constructor() {
        document.querySelectorAll('audio').forEach((el) => {
            this.sounds.push(el);
        })
        /*console.log(this.sounds);*/
        new DrumkitUI(this.sounds);
    }
}

const available_channels = 4;

class DrumkitUI {
    channels: IMusic[][] = [[]];
    sounds: IMusicElement[] = [];
    soundButtons: HTMLButtonElement[] = [];
    channelsDOMElements: {
        playButton: HTMLButtonElement,
        recordButton: HTMLButtonElement,
        progressBar: HTMLSpanElement
    }[] = [];
    activeChannel: number = null;
    constructor(sounds: HTMLAudioElement[]) {
        this.sounds = sounds.map((element) => ({
            element,
            key: element.dataset.key
        }));
        document.body.addEventListener('keypress', (ev) => this.onKeyPress(ev));

        this.renderButtons(sounds);
        this.createChannels();
    }

    renderButtons(sounds: HTMLAudioElement[]) {
        const container = document.getElementById('buttons');
        sounds.forEach(element => {
            const soundButton = document.createElement('button');
            soundButton.innerText = `${element.dataset.key}`;
            soundButton.dataset.soundKey = element.dataset.key;
            soundButton.addEventListener('click', (ev) => this.onClick(element.dataset.key, ev));
            this.soundButtons.push(soundButton);
            container.appendChild(soundButton);
        });
    }

    onClick(key: string, ev: MouseEvent) {
        const time = ev.timeStamp;
        if (this.activeChannel !== null) {
            this.channels[this.activeChannel].push({
                key: key,
                time: time
            });
        }
        this.playMusic(key);
    }

    onKeyPress(ev: KeyboardEvent) {
        const key = ev.key;
        const time = ev.timeStamp;
        if (this.activeChannel !== null) {
            this.channels[this.activeChannel].push({
                key: key,
                time: time
            });
        }
        console.log(this.channels);
        this.playMusic(key);
    }

    playMusic(key: string = null) {
        if (key) {
            const btn = this.soundButtons.find((el) => el.dataset.soundKey === key);
            const element = this.sounds.find((v) => v.key === key).element;
            element.currentTime = 0;
            element.play();
            this.giveAnimation(btn);
        }
    }

    giveAnimation(btn: HTMLButtonElement) {
        const animSpan = document.createElement('span');
        btn.classList.add("playing");
        btn.appendChild(animSpan);
        setTimeout(() => {
            btn.classList.remove("playing");
        }, 100);
        animSpan.addEventListener('animationend', () => {
            animSpan.remove();
        })
    }

    createChannels() {
        const container = document.getElementById('channels');
        for (let i = 0; i < available_channels; i++) {
            const channelDiv = document.createElement('div');
            channelDiv.classList.add("channelDiv");
            // nagrywanie
            const recordButton = document.createElement('button');
            recordButton.className = `recordButton`;
            recordButton.addEventListener('click', (ev) => this.activateChannel(i, ev));
            channelDiv.appendChild(recordButton);
            // odtwarzanie 
            const playButton = document.createElement('button');
            playButton.className = `playButton`;
            playButton.disabled = true;
            const s = playButton.addEventListener('click', (ev) => this.startStop(i));
            channelDiv.appendChild(playButton);
            // pasek 
            const progressBarContainer = document.createElement('div');
            progressBarContainer.className = `progressBar`;
            const progressBar = document.createElement('span');
            progressBar.addEventListener('animationend', () => {
                progressBar.style.animation = null;
                this.channelsDOMElements[i].playButton.disabled = false;
            })
            progressBarContainer.appendChild(progressBar);
            channelDiv.appendChild(progressBarContainer);

            this.channelsDOMElements.push({
                playButton,
                recordButton,
                progressBar
            });
            container.appendChild(channelDiv);
        }
    }

    activateChannel(channelIndex: number, event: MouseEvent) {
        this.channels[channelIndex] = [{
            time: event.timeStamp,
            key: null
        }];
        this.activeChannel = channelIndex;
        this.channelsDOMElements.forEach(el => {
            el.recordButton.disabled = true;
        })
        this.channelsDOMElements[channelIndex].playButton.disabled = false;
        this.channelsDOMElements[channelIndex].playButton.classList.add('stopButton');
    }

    startStop(channelIndex: number) {
        if (this.activeChannel === channelIndex) {
            this.stopRecording(channelIndex);
        }
        else {
            const channel = this.channels[channelIndex];
            let prevTime = channel[0].time;
            this.playingReaction(channelIndex);

            channel.forEach((sound: IMusic) => {
                const time = sound.time - prevTime;
                setTimeout(() => {
                    this.playMusic(sound.key);
                }, time);
            })
        }
    }

    stopRecording(channelIndex: number) {
        this.channelsDOMElements[channelIndex].playButton.classList.remove('stopButton');
        const channel = this.channels[channelIndex];
        const recordingTime = channel[channel.length - 1].time - channel[0].time;
        this.channelsDOMElements[channelIndex].progressBar.parentElement.querySelectorAll('time').forEach(v => v.remove());
        this.channelsDOMElements.forEach(el => {
            el.recordButton.disabled = false;
        })
        if (recordingTime) {
            channel.splice(0, 1).forEach((sound: IMusic) => {
                const timeMoment = document.createElement('time');
                const percentageTime = (sound.time - channel[0].time) / recordingTime * 100;
                console.log(percentageTime)
                timeMoment.className = "timeMoment";
                timeMoment.style.left = `${percentageTime}%`;
                this.channelsDOMElements[channelIndex].progressBar.parentElement.appendChild(timeMoment);
            })
        } else {
            this.channelsDOMElements[channelIndex].playButton.disabled = true;
        }
        this.activeChannel = null;
    }

    playingReaction(channelIndex: number) {
        this.channelsDOMElements[channelIndex].playButton.disabled = true;

        const channel = this.channels[channelIndex];
        let prevTime = channel[0].time;
        const recordingTime = `${(channel[channel.length - 1].time - prevTime).toFixed()}ms`;
        this.channelsDOMElements[channelIndex].progressBar.style.animation = ``;
        this.channelsDOMElements[channelIndex].progressBar.style.animation = `progressBarAnim ${recordingTime} forwards linear`;
    }
}

const drumkit = new Drumkit();