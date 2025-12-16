const model = {
    notes: [],
    addNote(title, description, color){
        const note ={
            id:new Date().getTime(),
            title: title,
            description: description,
            isFavorite: false,
            color: color
        }
        this.notes.push(note)
        view.renderNotes(this.notes);
    },
    deleteNote(noteId) {
        this.notes = this.notes.filter(note => note.id !== noteId)
        view.renderNotes(this.notes);
    },
    addToFavorite(noteId) {
        this.notes = this.notes.map(note => {
            if(note.id === noteId){
                note.isFavorite = !note.isFavorite
            }
            return note;
        })
        view.renderNotes(this.notes);
    },
}

const view = {
  init() {
    this.renderNotes(model.notes);
    const form = document.querySelector(".note-form");
    const titleInput = document.querySelector("#note-title");
    const textareaInput = document.querySelector("#note-description");
    const notesList = document.querySelector(".notes-list");
    const favoriteCheckbox = document.querySelector(".only-favorites");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const colorItem = document.querySelector(".color-item:checked");
      const title = titleInput.value;
      const description = textareaInput.value;
      const color = colorItem.value;
      controller.addNote(title, description, color);
      titleInput.value = "";
      textareaInput.value = "";
    });

    notesList.addEventListener("click", (event) => {
      if (event.target.classList.contains("note_btn_delete")) {
        const noteId = +event.target.closest("li").id;
        controller.deleteNote(noteId);
      }

      if (event.target.classList.contains("note_btn_like")) {
        const noteId = +event.target.closest("li").id;
        controller.addToFavorite(noteId);
      }
    });

    favoriteCheckbox.addEventListener("click", event => {
        const isFavorite = favoriteCheckbox.checked;
        controller.toggleFavorite(isFavorite)
    })
  },
  renderNotes(notes) {
    const notesList = document.querySelector(".notes-list");
    const countNumber = document.querySelector(".count-number strong");
    const favoriteCheckbox = document.querySelector(".only-favorites");
    countNumber.textContent = notes.length;
    let notesHTML = "";

    if (notes.length === 0) {
      notesList.innerHTML = `
            <p class="empty-message">
                У вас нет еще ни одной заметки<br>
                Заполните поля выше и создайте свою первую заметку!
            </p>
        `;
        favoriteCheckbox.style.display = "none";
      return;
    }
    favoriteCheckbox.style.display = "flex";
    notes.forEach((note) => {
      notesHTML += `
        <li id= "${note.id}" class="${note.isFavorite ? "favorite" : ""} note">
        <header class="note_header ${note.color}">
            <h3 class="note_title">${note.title}</h3>
            <div class="note_actions">
                <button class="note_btn note_btn_like" type="button">❤</button>
                <button class="note_btn note_btn_delete" type="button">🗑️</button>
            </div>
        </header>
        <p class="note_text">
        ${note.description}
        </p>
        </li>
        `;
    });

    notesList.innerHTML = notesHTML;
  },
};

const controller = {
    addNote(title, description, color){
        if(title.trim() !=='' && description.trim() !== '' && color){
            model.addNote(title, description, color)
        }
    },
    deleteNote(noteId){
        model.deleteNote(noteId)
    },
    addToFavorite(noteId){
        model.addToFavorite(noteId)
    },
    toggleFavorite(isFavorite){
        
    }
}

view.init();