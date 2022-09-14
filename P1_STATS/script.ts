class Stats {
    enteredValues: Array<number> = [];
    // ^ liczba dynamicznych inputow
    howManyInputs: number = 0;
    // ^ ilosc inputow jaka chcemy stworzyc

    constructor() {
        const mainInput: HTMLInputElement = document.querySelector('#main-input');
        mainInput.addEventListener('input', (event: Event) => {
            const target = event.target as HTMLInputElement;
            this.howManyInputs = Number(target.value);

            new App(this.howManyInputs, this.enteredValues);
        });
        new App(this.howManyInputs, this.enteredValues);
    }
}

class App {
    sum = document.getElementById('sum');
    avg = document.getElementById('avg');
    mini = document.getElementById('mini');
    maxi = document.getElementById('maxi');
    constructor(inputNum: number, values: Array<number>) {
        this.sum.innerText = "---";
        this.avg.innerText = "---";
        this.mini.innerText = "---";
        this.maxi.innerText = "---";
        if (this.wrongValue(inputNum, values)) { 
            this.fillTable(inputNum, values);
            const er = document.getElementById("error");
            er.style.visibility = "hidden";
        } else {
            const block = document.getElementById('inputs');
            block.innerHTML = null;
            this.error();
        }
    }

    wrongValue(inputNum: number, values: Array<number>): boolean {
        let wrong = false;
        console.log(inputNum);
        if (values && inputNum > 0) {
            wrong = values.every((val) => typeof val === 'number');
        }

        return wrong;
    }

    statElem(calculate: Function, values: Array<number>): HTMLDivElement {
        const value = document.createElement('b');
        value.innerText = calculate(values);
        const box = document.createElement('div');
        box.appendChild(value);

        return box;
    }
    craftInput(numOf: number, values: Array<number>): void {
        const block = document.getElementById('inputs');
        block.innerHTML = null;
        for (let i = 0; i < numOf; i++) {
            const input = new CraftedInputs(i, numOf, values).boxForEveryInputWithButton();
            block.appendChild(input);
        }
    }
    fillTable(inputNum: number, values: Array<number>): void {
        const abcd = new ReturningStats;
        const positions: Array<HTMLParagraphElement> = [];
        this.craftInput(inputNum, values);
        const val = values.slice(0, inputNum);
        positions.push(this.statElem(abcd.sum, val));
        positions.push(this.statElem(abcd.average, val));
        positions.push(this.statElem(abcd.minimum, val));
        positions.push(this.statElem(abcd.maximum, val));

        this.sum.innerText = null;
        this.sum.appendChild(positions[0]);
        this.avg.innerText = null;
        this.avg.appendChild(positions[1]);
        this.mini.innerText = null;
        this.mini.appendChild(positions[2]);
        this.maxi.innerText = null;
        this.maxi.appendChild(positions[3]);
    }

    error(): void {
        const error = document.getElementById("error");
        error.style.visibility = "visible";
        console.log("B³¹d.exe");
    }
}

class CraftedInputs {
    input: HTMLInputElement;
    button: HTMLButtonElement;
    constructor(id, numOf, values: Array<number>) {
        // INPUTY z typem NUMBER
        this.input = document.createElement('input');
        this.input.type = "number";
        this.input.value = values[id] ? String(values[id]) : '0';
        this.input.className = "inp";
        this.input.id = `input-${id}`;
        values[id] = Number(this.input.value);
        this.input.addEventListener('input', (event: Event) => {
            const target = event.target as HTMLInputElement;
            values[id] = Number(target.value);
            new App(numOf, values);
        });
        // ^^

        //                  <---!--->

        // GUZIK USUWAJ¥CY
        this.button = document.createElement('button');
        this.button.innerText = "×";
        this.button.addEventListener('click', (event: Event) => {
            const inputValue: HTMLInputElement = document.getElementById('main-input') as HTMLInputElement;
            values[id] = 0;
            values.splice(id, 1);
            numOf -= 1; //zmniejszenie wartoœci w g³ównym inpucie po usuniêciu generowanego inputa przyciskiem
            inputValue.value = numOf;
            new App(numOf, values);
        });
        // ^^

    }

    boxForEveryInputWithButton(): HTMLDivElement {
        const box = document.createElement('div');
        box.className = "every-input-box";
        box.appendChild(this.input);
        box.appendChild(this.button);

        return box;
    }
}

class ReturningStats {
    sum(values: Array<number>): number {
        const sum: number = values.reduce((a, b) => a + b, 0);
        return sum;
    }
    average(values: Array<number>): number {
        const sum: number = values.reduce((a, b) => a + b, 0);
        return Number((sum / values.length).toFixed(4));
    }
    minimum(values: Array<number>): number {
        return Math.min(...values);
    }
    maximum(values: Array<number>): number {
        return Math.max(...values);
    }
}

const stats = new Stats();