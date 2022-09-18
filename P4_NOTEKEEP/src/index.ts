import app from './App';
import Note from './Note';
import Notes from './notes';
import './SCSS/reset.scss';
import './SCSS/main.scss';
import appFireStorage from './AppFirebaseStorage'

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

    let newNote = note.saveToNote('', inputTitle.value,inputText.value, "lightgray", false);
    notes.notesDiv.appendChild(notes.createNote(newNote));
    appFireStorage.addNote(newNote).then(res => {
        newNote.id = res;
    });
});

window.addEventListener('load', () => {
    appFireStorage.getFromStorage().then(function(data){
        data.forEach(ele => {
            let note = ele as INote;

            if(note.isPinned){
                pinned.appendChild(notes.createNote(note));
            }else{
                notesDiv.appendChild(notes.createNote(note));
            }
        });
    });
});