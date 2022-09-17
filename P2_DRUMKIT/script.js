var DrumAll = /** @class */ (function () {
    function DrumAll() {
        var _this = this;
        this.sounds = [];
        document.querySelectorAll('audio').forEach(function (el) {
            _this.sounds.push(el);
        });
        console.log(this.sounds);
        new DrumAllUI(this.sounds);
    }
    return DrumAll;
}());
var CHANELS_COUNT = 4;
var DrumAllUI = /** @class */ (function () {
    function DrumAllUI(sounds) {
        var _this = this;
        this.statsSection = document.getElementById('UI-section');
        this.chanels = [[]];
        this.sounds = [];
        this.soundButtons = [];
        this.chanelsDOMElements = [];
        this.activeChanel = null;
        this.sounds = sounds.map(function (element) { return ({
            element: element,
            key: element.dataset.key
        }); });
        document.body.addEventListener('keypress', function (ev) { return _this.onKeyDown(ev); });
        this.createButtons(sounds);
        this.createChanels();
    }
    DrumAllUI.prototype.createButtons = function (sounds) {
        var _this = this;
        var container = document.getElementById('buttons');
        // tworzenie przyciskow
        sounds.forEach(function (element) {
            var soundBtn = document.createElement('button');
            soundBtn.innerText = "".concat(element.dataset.key);
            // przypisanie klucza do przycisku aby rozpozna� kt�ry jest kt�ry
            soundBtn.dataset.soundKey = element.dataset.key;
            // osobne zdarzenia dla przycisku
            soundBtn.addEventListener('click', function (ev) { return _this.onClick(element.dataset.key, ev); });
            // zapisywanie przycisku w klasie
            _this.soundButtons.push(soundBtn);
            container.appendChild(soundBtn);
        });
    };
    DrumAllUI.prototype.onKeyDown = function (ev) {
        var key = ev.key;
        var time = ev.timeStamp;
        if (this.activeChanel !== null) {
            this.chanels[this.activeChanel].push({
                key: key,
                time: time
            });
        }
        console.log(this.chanels);
        this.playDrum(key);
    };
    DrumAllUI.prototype.onClick = function (key, ev) {
        var time = ev.timeStamp;
        if (this.activeChanel !== null) {
            this.chanels[this.activeChanel].push({
                key: key,
                time: time
            });
        }
        this.playDrum(key);
    };
    DrumAllUI.prototype.playDrum = function (key) {
        if (key === void 0) { key = null; }
        if (key) {
            var btn = this.soundButtons.find(function (el) { return el.dataset.soundKey === key; });
            var element = this.sounds.find(function (v) { return v.key === key; }).element;
            element.currentTime = 0;
            element.play();
        }
    };
    DrumAllUI.prototype.createChanels = function () {
        var _this = this;
        var container = document.getElementById('chanels');
        var _loop_1 = function (i) {
            var chanelContainer = document.createElement('div');
            chanelContainer.classList.add("chanelContainer");
            // przycisk 
            var recordBtn = document.createElement('button');
            recordBtn.className = "recordBtn";
            recordBtn.addEventListener('click', function (ev) { return _this.activateChanel(i, ev); });
            chanelContainer.appendChild(recordBtn);
            //przycisk
            var playBtn = document.createElement('button');
            playBtn.className = "playBtn";
            playBtn.disabled = true;
            var s = playBtn.addEventListener('click', function (ev) { return _this.onPlayStopChanel(i); });
            chanelContainer.appendChild(playBtn);
            // pasek nagrywania
            var progressBarContainer = document.createElement('div');
            progressBarContainer.className = "progressBar";
            var progressBar = document.createElement('span');
            progressBar.addEventListener('animationend', function () {
                progressBar.style.animation = null;
                _this.chanelsDOMElements[i].playBtn.disabled = false;
            });
            progressBarContainer.appendChild(progressBar);
            chanelContainer.appendChild(progressBarContainer);
            this_1.chanelsDOMElements.push({
                playBtn: playBtn,
                recordBtn: recordBtn,
                progressBar: progressBar
            });
            container.appendChild(chanelContainer);
        };
        var this_1 = this;
        for (var i = 0; i < CHANELS_COUNT; i++) {
            _loop_1(i);
        }
    };
    DrumAllUI.prototype.activateChanel = function (chanelIndex, event) {
        // to zdarzenie klikni�cia okre�la czas nagrywania
        this.chanels[chanelIndex] = [{
                time: event.timeStamp,
                key: null
            }];
        this.activeChanel = chanelIndex;
        this.chanelsDOMElements.forEach(function (el) {
            el.recordBtn.disabled = true;
        });
        this.chanelsDOMElements[chanelIndex].playBtn.disabled = false;
        this.chanelsDOMElements[chanelIndex].playBtn.classList.add('stopBtn');
    };
    DrumAllUI.prototype.onPlayStopChanel = function (chanelIndex) {
        var _this = this;
        if (this.activeChanel === chanelIndex) {
            this.stopRecording(chanelIndex);
        }
        else {
            var chanel = this.chanels[chanelIndex];
            var prevTime_1 = chanel[0].time;
            this.initPlayingBehavior(chanelIndex);
            chanel.forEach(function (sound) {
                var time = sound.time - prevTime_1;
                setTimeout(function () {
                    _this.playDrum(sound.key);
                }, time);
            });
        }
    };
    DrumAllUI.prototype.initPlayingBehavior = function (chanelIndex) {
        this.chanelsDOMElements[chanelIndex].playBtn.disabled = true;
        var chanel = this.chanels[chanelIndex];
        var prevTime = chanel[0].time;
        var recordingTime = "".concat((chanel[chanel.length - 1].time - prevTime).toFixed(), "ms");
    };
    DrumAllUI.prototype.stopRecording = function (chanelIndex) {
        this.chanelsDOMElements[chanelIndex].playBtn.classList.remove('stopBtn');
        var chanel = this.chanels[chanelIndex];
        var recordingTime = chanel[chanel.length - 1].time - chanel[0].time;
        this.chanelsDOMElements[chanelIndex].progressBar.parentElement.querySelectorAll('time').forEach(function (v) { return v.remove(); });
        this.chanelsDOMElements.forEach(function (el) {
            el.recordBtn.disabled = false;
        });
        this.activeChanel = null;
    };
    return DrumAllUI;
}());
var drumkit = new DrumAll();
