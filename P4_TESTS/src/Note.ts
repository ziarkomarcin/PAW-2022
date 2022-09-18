import app from './App';

export class Note{

    saveToNote(noteId: string, noteTitle: string, noteText: string, noteBgColor: string, isNotePinned: boolean){
        let newDate = new Date();
        try{
            if(noteTitle == '') throw new Error("Title can`t be empty");
            let note: INote = {
                id: noteId,
                title: noteTitle,
                text: noteText,
                bgColor: noteBgColor,
                isPinned: isNotePinned,
                date: newDate.toISOString().split('T')[0]
            }
            return note;
        }
        catch(error){
           throw error;
        }
    }
}
export default Note;
