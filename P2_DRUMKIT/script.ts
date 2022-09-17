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
        this.createchannels();
    }

    renderButtons(sounds: HTMLAudioElement[]) {
        const container = document.getElementById('buttons');
        // tworzenie przyciskow
        sounds.forEach(element => {
            const soundButton = document.createElement('button');
            soundButton.innerText = `${element.dataset.key}`;
            // klucz dzwieku opisuje przycisk
            soundButton.dataset.soundKey = element.dataset.key;
            // i przypisujemy dzwiek do data key z przycisku
            soundButton.addEventListener('click', (ev) => this.onClick(element.dataset.key, ev));
            // nastepnie zapisujemy w klasie
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
        this.playSound(key);
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
        this.playSound(key);
    }

    playSound(key: string = null) {
        if (key) {
            const element = this.sounds.find((v) => v.key === key).element;
            element.currentTime = 0;
            element.play();
        }
    }

    createchannels() {
        const container = document.getElementById('channels');
        for (let i = 0; i < available_channels; i++) {
            const channelDiv = document.createElement('div');
            channelDiv.classList.add("channelDiv");
            // przycisk nagrywania
            const recordButton = document.createElement('button');
            recordButton.className = `recordButton`;
            recordButton.addEventListener('click', (ev) => this.activateChannel(i, ev));
            channelDiv.appendChild(recordButton);
            // przycisk odtwarzania
            const playButton = document.createElement('button');
            playButton.className = `playButton`;
            playButton.disabled = true;
            channelDiv.appendChild(playButton);
            // pasek progresu 
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
        // ustawienie timeStampa
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
            this.initPlayingBehavior(channelIndex);

            channel.forEach((sound: IMusic) => {
                const time = sound.time - prevTime;
                setTimeout(() => {
                    this.playSound(sound.key);
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

    initPlayingBehavior(channelIndex: number) {
        this.channelsDOMElements[channelIndex].playButton.disabled = true;

        // animacja paska
        const channel = this.channels[channelIndex];
        let prevTime = channel[0].time;
        // zapisanie czasu nagrywania
        const recordingTime = `${(channel[channel.length - 1].time - prevTime).toFixed()}ms`;
        this.channelsDOMElements[channelIndex].progressBar.style.animation = ``;
        this.channelsDOMElements[channelIndex].progressBar.style.animation = `progressBarAnim ${recordingTime} forwards linear`;
    }
}

const drumkit = new Drumkit();