class AppStorage{

    constructor(){}
    
    saveToLocalStorage(noteArr: INote[]){
        localStorage.setItem("noteLS", JSON.stringify(noteArr));
    }

    getNotesFromLocalStorage(){
        const notes = localStorage.getItem("noteLS");
        if (notes) {
            return JSON.parse(notes);
        } 
        else 
        {
            return;
        }
    }
}
const appStorage = new AppStorage();

export default  appStorage;
