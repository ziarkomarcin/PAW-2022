import app from './App';
import appStorage from './AppStorage';
import Note from './Note';
import Notes from './notes';
import './SCSS/reset.scss';
import './SCSS/main.scss';

const note = new Note();
const notes = new Notes();
const pinned: HTMLDivElement = document.querySelector("#pinnedNotes");
const notesDiv: HTMLDivElement = document.querySelector("#notes");
const inputTitle: HTMLInputElement = document.querySelector("#inputTitle");
const inputText: HTMLInputElement = document.querySelector("#inputText");
const submitButton: HTMLButtonElement = document.querySelector("#submitButton");
notes.pinnedDiv = pinned;
notes.notesDiv = notesDiv;

submitButton.addEventListener('click', () => {
    let newNote = note.saveToNote(app.counter, inputTitle.value,inputText.value, "lightgray", false);
    note.noteToArr(newNote);
    notes.notesDiv.appendChild(notes.createNote(newNote));
});

window.addEventListener('beforeunload', function() {
    appStorage.saveToLocalStorage(app.noteArr);
});

window.addEventListener('load', () => {
    app.noteLS = appStorage.getNotesFromLocalStorage();
    
    if(app.noteLS){
        app.noteLS.forEach((elem, index) => {

            app.noteArr[index] = app.noteLS[index];

            if(app.noteLS[index].isPinned){
                pinned.appendChild(notes.createNote(app.noteLS[index]));
            }else{
                notesDiv.appendChild(notes.createNote(app.noteLS[index]));
            }
        });
    }
});
