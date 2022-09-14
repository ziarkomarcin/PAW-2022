interface ISound {
    key: string,
    time: number
}
interface ISoundEl {
    element: HTMLAudioElement,
    key: string
}

const available_channels = 4;

class Drumkit {
    sounds: Array<HTMLAudioElement> = [];
    constructor() {
        document.querySelectorAll('audio').forEach((audio) => {
            this.sounds.push(audio);
        })
        console.log(this.sounds);
        // new DrumkitUI(this.sounds);
    }
}

class DrumkitUI {
    statsSection = document.getElementById('UI-section');
    chanels: ISound[][] = [[]];
    sounds: ISoundEl[] = [];
    soundButtons: HTMLButtonElement[] = [];
    chanelsDOMElements: {
        playBtn: HTMLButtonElement,
        recordBtn: HTMLButtonElement,
        progressBar: HTMLSpanElement
    }[] = [];
    activeChanel: number = null;
    constructor(sounds: HTMLAudioElement[]) {
        this.sounds = sounds.map((element) => ({
            element,
            key: element.dataset.key
        }));
        // document.body.addEventListener('keypress', (ev) => this.onKeyDown(ev));

        // this.renderButtons(sounds);
        // this.createChanels();
    }

    renderButtons(sounds: HTMLAudioElement[]) {
        const container = document.getElementById('buttons');
        // tworzenie button�w
        sounds.forEach(element => {
            const soundBtn = document.createElement('button');
            soundBtn.innerText = `${element.dataset.key}`;
            // klucz przypisany do buttona
            soundBtn.dataset.soundKey = element.dataset.key;
            // ka�dy button obs�uguje event
            // soundBtn.addEventListener('click', (ev) => this.clicked(element.dataset.key, ev));
            this.soundButtons.push(soundBtn);
            container.appendChild(soundBtn);
        });
    }

    clicked(key: string, ev: MouseEvent) {
        const time = ev.timeStamp;
        if (this.activeChanel !== null) {
            this.chanels[this.activeChanel].push({
                key: key,
                time: time
            });
        }
        this.playSound(key);
    }

    playSound(key: string = null) {
        // if there's no sound, do nothing
        // see this.activateChanel for example
        if (key) {
            const btn = this.soundButtons.find((el) => el.dataset.soundKey === key);
            const element = this.sounds.find((v) => v.key === key).element;
            element.currentTime = 0;
            element.play();
            this.giveAnimation(btn);
        }
    }

    createChanels() {
        const container = document.getElementById('chanels');
        for (let i = 0; i < available_channels; i++) {
            const chanelContainer = document.createElement('div');
            chanelContainer.classList.add("chanelContainer");
            // record button
            const recordBtn = document.createElement('button');
            recordBtn.className = `recordBtn`;
            recordBtn.addEventListener('click', (ev) => this.activateChanel(i, ev));
            chanelContainer.appendChild(recordBtn);
            // play button 
            const playBtn = document.createElement('button');
            playBtn.className = `playBtn`;
            playBtn.disabled = true;
            const s = playBtn.addEventListener('click', (ev) => this.onPlayStopChanel(i));
            chanelContainer.appendChild(playBtn);
            // progress bar 
            const progressBarContainer = document.createElement('div');
            progressBarContainer.className = `progressBar`;
            const progressBar = document.createElement('span');
            progressBar.addEventListener('animationend', () => {
                progressBar.style.animation = null;
                this.chanelsDOMElements[i].playBtn.disabled = false;
            })
            progressBarContainer.appendChild(progressBar);
            chanelContainer.appendChild(progressBarContainer);

            this.chanelsDOMElements.push({
                playBtn,
                recordBtn,
                progressBar
            });
            container.appendChild(chanelContainer);
        }
    }

    activateChanel(chanelIndex: number, event: MouseEvent) {
        // this click event determintaes recording time
        this.chanels[chanelIndex] = [{
            time: event.timeStamp,
            key: null
        }];
        this.activeChanel = chanelIndex;
        this.chanelsDOMElements.forEach(el => {
            el.recordBtn.disabled = true;
        })
        this.chanelsDOMElements[chanelIndex].playBtn.disabled = false;
        this.chanelsDOMElements[chanelIndex].playBtn.classList.add('stopBtn');
    }

    onPlayStopChanel(chanelIndex: number) {
        if (this.activeChanel === chanelIndex) {
            this.stopRecording(chanelIndex);
        }
        else {
            // play
            const chanel = this.chanels[chanelIndex];
            let prevTime = chanel[0].time;
            this.initPlayingBehavior(chanelIndex);

            chanel.forEach((sound: ISound) => {
                const time = sound.time - prevTime;
                setTimeout(() => {
                    this.playSound(sound.key);
                }, time);
            })
        }
    }

    stopRecording(chanelIndex: number) {
        this.chanelsDOMElements[chanelIndex].playBtn.classList.remove('stopBtn');
        const chanel = this.chanels[chanelIndex];
        const recordingTime = chanel[chanel.length - 1].time - chanel[0].time;
        this.chanelsDOMElements[chanelIndex].progressBar.parentElement.querySelectorAll('time').forEach(v => v.remove());
        this.chanelsDOMElements.forEach(el => {
            el.recordBtn.disabled = false;
        })
        if (recordingTime) {
            chanel.splice(0, 1).forEach((sound: ISound) => {
                const timeMoment = document.createElement('time');
                const percentageTime = (sound.time - chanel[0].time) / recordingTime * 100;
                console.log(percentageTime)
                timeMoment.className = "timeMoment";
                timeMoment.style.left = `${percentageTime}%`;
                this.chanelsDOMElements[chanelIndex].progressBar.parentElement.appendChild(timeMoment);
            })
        } else {
            this.chanelsDOMElements[chanelIndex].playBtn.disabled = true;
        }
        this.activeChanel = null;
    }

    initPlayingBehavior(chanelIndex: number) {
        this.chanelsDOMElements[chanelIndex].playBtn.disabled = true;

        // animate progress bar
        const chanel = this.chanels[chanelIndex];
        let prevTime = chanel[0].time;
        const recordingTime = `${(chanel[chanel.length - 1].time - prevTime).toFixed()}ms`;
        this.chanelsDOMElements[chanelIndex].progressBar.style.animation = ``;
        this.chanelsDOMElements[chanelIndex].progressBar.style.animation = `progressBarAnim ${recordingTime} forwards linear`;
    }
}

const drumkit = new Drumkit();
