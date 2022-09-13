var Stats = /** @class */ (function () {
    // ^ ilosc inputow jaka chcemy stworzyc
    function Stats() {
        var _this = this;
        this.enteredValues = [];
        // ^ liczba dynamicznych inputow
        this.howManyInputs = 0;
        var mainInput = document.querySelector('#main-input');
        mainInput.addEventListener('input', function (event) {
            //console.log("Coś tam działa");
            var target = event.target;
            // ^ event.target -> returns a reference to the item to which the event was originally sent
            _this.howManyInputs = Number(target.value);
            new App(_this.howManyInputs, _this.enteredValues);
        });
        new App(this.howManyInputs, this.enteredValues);
    }
    return Stats;
}());
var App = /** @class */ (function () {
    function App(inputNum, values) {
        this.sum = document.getElementById('sum');
        this.avg = document.getElementById('avg');
        this.mini = document.getElementById('mini');
        this.maxi = document.getElementById('maxi');
        this.sum.innerText = "---";
        this.avg.innerText = "---";
        this.mini.innerText = "---";
        this.maxi.innerText = "---";
        if (this.wrongValue(inputNum, values)) {
            this.fillTable(inputNum, values);
            var er = document.getElementById("error");
            er.style.visibility = "hidden";
        }
        else {
            var block = document.getElementById('inputs');
            block.innerHTML = null;
            this.error();
        }
    }
    App.prototype.wrongValue = function (inputNum, values) {
        var wrong = false;
        console.log(inputNum);
        if (values && inputNum > 0) {
            wrong = values.every(function (val) { return typeof val === 'number'; });
        }
        return wrong;
    };
    App.prototype.statElem = function (calculate, values) {
        var value = document.createElement('b');
        value.innerText = calculate(values);
        var box = document.createElement('div');
        box.appendChild(value);
        return box;
    };
    App.prototype.craftInput = function (numOf, values) {
        var block = document.getElementById('inputs');
        block.innerHTML = null;
        for (var i = 0; i < numOf; i++) {
            var input = new CraftedInputs(i, numOf, values).boxForEveryInputWithButton();
            block.appendChild(input);
        }
    };
    App.prototype.fillTable = function (inputNum, values) {
        var abcd = new ReturningStats;
        var positions = [];
        this.craftInput(inputNum, values);
        var val = values.slice(0, inputNum);
        positions.push(this.statElem(abcd.sum, val));
        positions.push(this.statElem(abcd.average, val));
        positions.push(this.statElem(abcd.minimum, val));
        positions.push(this.statElem(abcd.maximum, val));
        // console.log("Przelicza!");
        // unprofessional, but it works
        this.sum.innerText = null;
        this.sum.appendChild(positions[0]);
        this.avg.innerText = null;
        this.avg.appendChild(positions[1]);
        this.mini.innerText = null;
        this.mini.appendChild(positions[2]);
        this.maxi.innerText = null;
        this.maxi.appendChild(positions[3]);
        // ^^
    };
    App.prototype.error = function () {
        var error = document.getElementById("error");
        error.style.visibility = "visible";
        console.log("Błąd.exe");
    };
    return App;
}());
var CraftedInputs = /** @class */ (function () {
    function CraftedInputs(id, numOf, values) {
        // START BOX ---> crafting input with number type
        this.input = document.createElement('input');
        this.input.type = "number";
        this.input.value = values[id] ? String(values[id]) : '0';
        this.input.className = "inp";
        this.input.id = "input-" + id;
        values[id] = Number(this.input.value);
        this.input.addEventListener('input', function (event) {
            var target = event.target;
            values[id] = Number(target.value);
            new App(numOf, values);
        });
        // END BOX ^^
        //                  <---!--->
        // START BOX ---> crafting delete button
        this.button = document.createElement('button');
        this.button.innerText = "×";
        this.button.addEventListener('click', function (event) {
            var inputValue = document.getElementById('main-input');
            values[id] = 0;
            values.splice(id, 1);
            numOf -= 1;
            inputValue.value = numOf;
            // ^ when You delete one crafted input, value in main-input decreases by 1
            new App(numOf, values);
        });
        // END BOX ^^
    }
    // crafting a "box" div for input + close button
    CraftedInputs.prototype.boxForEveryInputWithButton = function () {
        var box = document.createElement('div');
        box.className = "every-input-box";
        box.appendChild(this.input);
        box.appendChild(this.button);
        return box;
    };
    return CraftedInputs;
}());
var ReturningStats = /** @class */ (function () {
    function ReturningStats() {
    }
    ReturningStats.prototype.sum = function (values) {
        var sum = values.reduce(function (a, b) { return a + b; }, 0);
        return sum;
    };
    ReturningStats.prototype.average = function (values) {
        var sum = values.reduce(function (a, b) { return a + b; }, 0);
        return Number((sum / values.length).toFixed(4));
        // ^ toFixed() -> formats a number using fixed-point notation
    };
    ReturningStats.prototype.minimum = function (values) {
        return Math.min.apply(Math, values);
    };
    ReturningStats.prototype.maximum = function (values) {
        return Math.max.apply(Math, values);
    };
    return ReturningStats;
}());
var stats = new Stats();
//# sourceMappingURL=script.js.map