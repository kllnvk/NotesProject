const model = {
  notes: [],
  isShowOnlyFavorite: false,

  toggleShowOnlyFavorite(isShowOnlyFavorite) {
    this.isShowOnlyFavorite = isShowOnlyFavorite
    this.updateNotesView()
  },

  updateNotesView() {
    let notesToRender;
    if(this.isShowOnlyFavorite){
      notesToRender = this.notes.filter(note => note.isFavorite)
    } else 
      {notesToRender = this.notes}

    view.renderNotes(notesToRender);
    view.renderNotesCount(notesToRender);
  },

  addNote(title, description, color) {
    const note = {
      id: new Date().getTime(),
      title: title,
      description: description,
      isFavorite: false,
      color: color,
    };
    this.notes.unshift(note);
    this.updateNotesView();
  },
  deleteNote(noteId) {
    this.notes = this.notes.filter((note) => note.id !== noteId);
    this.updateNotesView();
  },
  addToFavorite(noteId) {
    this.notes = this.notes.map((note) => {
      if (note.id === noteId) {
        note.isFavorite = !note.isFavorite;
      }
      return note;
    });
    this.updateNotesView();
  },
};

const view = {
  init() {
    this.renderNotesCount(model.notes)
    this.renderNotes(model.notes);
    const form = document.querySelector(".note-form");
    const titleInput = document.querySelector("#note-title");
    const textareaInput = document.querySelector("#note-description");
    const notesList = document.querySelector(".notes-list");
    const favoriteCheckbox = document.querySelector("#myCheckbox");

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
      const likeBtn = event.target.closest(".note_btn_like")
      const deleteBtn = event.target.closest(".note_btn_delete")

      if (deleteBtn) {
        const noteId = +deleteBtn.closest("li").id;
        controller.deleteNote(noteId);
      }

      if (likeBtn) {
        const noteId = +likeBtn.closest("li").id;
        controller.addToFavorite(noteId);
      }
    });

    favoriteCheckbox.addEventListener("click", event => {
        const isFavorite = favoriteCheckbox.checked;
        controller.toggleShowOnlyFavorite(isFavorite)
        
    })
  },
  renderNotes(notes) {
    const notesList = document.querySelector(".notes-list");
    const favoriteCheckboxBlock = document.querySelector(".only-favorites");
    let notesHTML = "";

    if (model.notes.length === 0) {
      notesList.innerHTML = getEmptyMessageHtml()
        favoriteCheckboxBlock.style.display = "none";
      return;
    }

    favoriteCheckboxBlock.style.display = "flex";

    if (notes.length === 0) {
      notesList.innerHTML = getEmptyMessageWithFavoriteHtml();

      return;
    }

    notes.forEach((note) => {
      notesHTML += getNoteHtml(note)
    });

    notesList.innerHTML = notesHTML;
  },
  renderNotesCount(notes){
    const countText = document.querySelector(".count-text");
    const countNumber = document.querySelector(".count-number strong");
    countText.textContent = model.isShowOnlyFavorite ? 'Избранных заметок:' : 'Всего заметок:'
    countNumber.textContent = notes.length;
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
    toggleShowOnlyFavorite(isFavorite){
      model.toggleShowOnlyFavorite(isFavorite);
    },
}

view.init();

function getNoteHtml(note) {
  return `
        <li id= "${note.id}" class="${note.isFavorite ? "favorite" : ""} note">
        <header class="note_header ${note.color}">
            <h3 class="note_title">${note.title}</h3>
            <div class="note_actions">
                <button class="note_btn note_btn_like" type="button">
                <img src="./assets/${note.isFavorite ? "FavoriteIcon.svg" : "NotFavoriteIcon.svg"}" alt="favorite">
                </button>
                <button class="note_btn note_btn_delete" type="button">
                <img src="./assets/trash.svg" alt="delete">
                </button>
            </div>
        </header>
        <p class="note_text">
        ${note.description}
        </p>
        </li>
        `;
}

function getEmptyMessageHtml(){
  return `
            <p class="empty-message">
                У вас нет еще ни одной заметки<br>
                Заполните поля выше и создайте свою первую заметку!
            </p>
        `;
}

function getEmptyMessageWithFavoriteHtml(){
  return `
      <p class="empty-message">
        Нет избранных заметок
      </p>
        `;
}