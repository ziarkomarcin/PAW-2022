var Drumkit = /** @class */ (function () {
    function Drumkit() {
        var _this = this;
        this.sounds = [];
        document.querySelectorAll('audio').forEach(function (el) {
            _this.sounds.push(el);
        });
        /*console.log(this.sounds);*/
        new DrumkitUI(this.sounds);
    }
    return Drumkit;
}());
var available_channels = 4;
var DrumkitUI = /** @class */ (function () {
    function DrumkitUI(sounds) {
        var _this = this;
        this.channels = [[]];
        this.sounds = [];
        this.soundButtons = [];
        this.channelsDOMElements = [];
        this.activeChannel = null;
        this.sounds = sounds.map(function (element) { return ({
            element: element,
            key: element.dataset.key
        }); });
        document.body.addEventListener('keypress', function (ev) { return _this.onKeyPress(ev); });
        this.renderButtons(sounds);
        this.createChannels();
    }
    DrumkitUI.prototype.renderButtons = function (sounds) {
        var _this = this;
        var container = document.getElementById('buttons');
        sounds.forEach(function (element) {
            var soundButton = document.createElement('button');
            soundButton.innerText = "".concat(element.dataset.key);
            soundButton.dataset.soundKey = element.dataset.key;
            soundButton.addEventListener('click', function (ev) { return _this.onClick(element.dataset.key, ev); });
            _this.soundButtons.push(soundButton);
            container.appendChild(soundButton);
        });
    };
    DrumkitUI.prototype.onClick = function (key, ev) {
        var time = ev.timeStamp;
        if (this.activeChannel !== null) {
            this.channels[this.activeChannel].push({
                key: key,
                time: time
            });
        }
        this.playMusic(key);
    };
    DrumkitUI.prototype.onKeyPress = function (ev) {
        var key = ev.key;
        var time = ev.timeStamp;
        if (this.activeChannel !== null) {
            this.channels[this.activeChannel].push({
                key: key,
                time: time
            });
        }
        console.log(this.channels);
        this.playMusic(key);
    };
    DrumkitUI.prototype.playMusic = function (key) {
        if (key === void 0) { key = null; }
        if (key) {
            var btn = this.soundButtons.find(function (el) { return el.dataset.soundKey === key; });
            var element = this.sounds.find(function (v) { return v.key === key; }).element;
            element.currentTime = 0;
            element.play();
            this.giveAnimation(btn);
        }
    };
    DrumkitUI.prototype.giveAnimation = function (btn) {
        var animSpan = document.createElement('span');
        btn.classList.add("playing");
        btn.appendChild(animSpan);
        setTimeout(function () {
            btn.classList.remove("playing");
        }, 100);
        animSpan.addEventListener('animationend', function () {
            animSpan.remove();
        });
    };
    DrumkitUI.prototype.createChannels = function () {
        var _this = this;
        var container = document.getElementById('channels');
        var _loop_1 = function (i) {
            var channelDiv = document.createElement('div');
            channelDiv.classList.add("channelDiv");
            // nagrywanie
            var recordButton = document.createElement('button');
            recordButton.className = "recordButton";
            recordButton.addEventListener('click', function (ev) { return _this.activateChannel(i, ev); });
            channelDiv.appendChild(recordButton);
            // odtwarzanie 
            var playButton = document.createElement('button');
            playButton.className = "playButton";
            playButton.disabled = true;
            var s = playButton.addEventListener('click', function (ev) { return _this.startStop(i); });
            channelDiv.appendChild(playButton);
            // pasek 
            var progressBarContainer = document.createElement('div');
            progressBarContainer.className = "progressBar";
            var progressBar = document.createElement('span');
            progressBar.addEventListener('animationend', function () {
                progressBar.style.animation = null;
                _this.channelsDOMElements[i].playButton.disabled = false;
            });
            progressBarContainer.appendChild(progressBar);
            channelDiv.appendChild(progressBarContainer);
            this_1.channelsDOMElements.push({
                playButton: playButton,
                recordButton: recordButton,
                progressBar: progressBar
            });
            container.appendChild(channelDiv);
        };
        var this_1 = this;
        for (var i = 0; i < available_channels; i++) {
            _loop_1(i);
        }
    };
    DrumkitUI.prototype.activateChannel = function (channelIndex, event) {
        this.channels[channelIndex] = [{
                time: event.timeStamp,
                key: null
            }];
        this.activeChannel = channelIndex;
        this.channelsDOMElements.forEach(function (el) {
            el.recordButton.disabled = true;
        });
        this.channelsDOMElements[channelIndex].playButton.disabled = false;
        this.channelsDOMElements[channelIndex].playButton.classList.add('stopButton');
    };
    DrumkitUI.prototype.startStop = function (channelIndex) {
        var _this = this;
        if (this.activeChannel === channelIndex) {
            this.stopRecording(channelIndex);
        }
        else {
            var channel = this.channels[channelIndex];
            var prevTime_1 = channel[0].time;
            this.playingReaction(channelIndex);
            channel.forEach(function (sound) {
                var time = sound.time - prevTime_1;
                setTimeout(function () {
                    _this.playMusic(sound.key);
                }, time);
            });
        }
    };
    DrumkitUI.prototype.stopRecording = function (channelIndex) {
        var _this = this;
        this.channelsDOMElements[channelIndex].playButton.classList.remove('stopButton');
        var channel = this.channels[channelIndex];
        var recordingTime = channel[channel.length - 1].time - channel[0].time;
        this.channelsDOMElements[channelIndex].progressBar.parentElement.querySelectorAll('time').forEach(function (v) { return v.remove(); });
        this.channelsDOMElements.forEach(function (el) {
            el.recordButton.disabled = false;
        });
        if (recordingTime) {
            channel.splice(0, 1).forEach(function (sound) {
                var timeMoment = document.createElement('time');
                var percentageTime = (sound.time - channel[0].time) / recordingTime * 100;
                console.log(percentageTime);
                timeMoment.className = "timeMoment";
                timeMoment.style.left = "".concat(percentageTime, "%");
                _this.channelsDOMElements[channelIndex].progressBar.parentElement.appendChild(timeMoment);
            });
        }
        else {
            this.channelsDOMElements[channelIndex].playButton.disabled = true;
        }
        this.activeChannel = null;
    };
    DrumkitUI.prototype.playingReaction = function (channelIndex) {
        this.channelsDOMElements[channelIndex].playButton.disabled = true;
        var channel = this.channels[channelIndex];
        var prevTime = channel[0].time;
        var recordingTime = "".concat((channel[channel.length - 1].time - prevTime).toFixed(), "ms");
        this.channelsDOMElements[channelIndex].progressBar.style.animation = "";
        this.channelsDOMElements[channelIndex].progressBar.style.animation = "progressBarAnim ".concat(recordingTime, " forwards linear");
    };
    return DrumkitUI;
}());
var drumkit = new Drumkit();
