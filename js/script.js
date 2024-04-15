let placeholder = document.getElementById("placeholder");
let notesContainer = document.getElementById("notes-container");
let modal = document.getElementById("modal");
let createButton = document.getElementById("create-button")
let saveButton = document.getElementById("save-button");
let notesArray;
let modalTitle = document.getElementById("modal-title");
let modalText = document.getElementById("modal-text");
// notes -> col -> card
placeholder.style.display = "none";
let color = "rgb(230, 238, 251)";
// console.log()

if(modal){
    modal.addEventListener('show.bs.modal', event =>{ //acionado quando o modal for mostrado
        modalTitle.value = '';
        modalText.value = '';
        let action = event.relatedTarget.getAttribute('data-bs-whatever') //recebe o tipo de modal desejado
        if(action == "create"){
            createButton.style.display = "inline-block";
            saveButton.style.display = "none";
            createButton.addEventListener('click', createNote);
        }
        else if(action == "edit"){
            createButton.style.display = "none";
            saveButton.style.display = "inline-block";
            saveButton.addEventListener('click', evt=>{
                saveNote(event.relatedTarget.dataset.id)
            })
        }

    });

    let colorButtons = document.querySelectorAll(".color");
    colorButtons.forEach(button =>{
        button.addEventListener('click', event=>{ // acionado quando as cores forem clicadas
            for(i=0; i<colorButtons.length; i++){
                colorButtons[i].style.backgroundColor = "";
            }
            color = button.style.color;
            button.style.backgroundColor = "rgba(13, 110, 253, 0.25)";
        })
    })
    
    
    
    
}

function retrieveNotes(){
    if(!localStorage.getItem("notes")){
        console.log("nao achei o array, vou criar");
        notesArray = [];
    }
    else{
        notesArray = localStorage.getItem("notes");
        notesArray = JSON.parse(notesArray);
        showNotes();
    }
    console.log(notesArray);

}

function showNotes(){
    notesContainer.innerHTML = "";
    notesArray.forEach((note,i)=>{
        let col = document.createElement('div');
        col.classList.add('col', 'pb-3');
        notesContainer.appendChild(col);

        let card = document.createElement('div');
        card.classList.add('card');
        card.style.backgroundColor = note.color;
        col.appendChild(card);

        let cardBody1 = document.createElement('div');
        cardBody1.classList.add('card-body');
        card.appendChild(cardBody1);

        let cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.innerHTML = note.title;
        cardBody1.appendChild(cardTitle);

        let cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.innerHTML = note.text;
        cardBody1.appendChild(cardText);

        let cardBody2 = document.createElement('div');
        cardBody2.classList.add('card-body','p-0');
        card.appendChild(cardBody2);

        let cardTime = document.createElement('p');
        cardTime.innerHTML = "Última edição: " + new Date(note.time).toLocaleDateString('pt-BR');
        cardTime.classList.add('border', 'm-0', 'px-3', 'py-2', 'border-second-subtle');
        cardBody2.appendChild(cardTime);

        let cardBody3 = document.createElement('div');
        cardBody3.classList.add('card-body', 'd-flex', 'justify-content-between', 'px-3', 'pt-0', 'pb-3');
        card.appendChild(cardBody3);

        let deleteButton = document.createElement('a');
        deleteButton.classList.add('card-link', 'link-dark', 'icon-link', 'icon-link-hover');
        deleteButton.type = 'button';
        cardBody3.appendChild(deleteButton);
        deleteButton.addEventListener('click',evt=>{
            deleteNote(i);
        });

        let deleteIcon = document.createElement('i');
        deleteIcon.classList.add('bi', 'bi-trash3-fill', 'fs-3');
        deleteButton.appendChild(deleteIcon);


        let editButton = document.createElement('a');
        editButton.classList.add('card-link', 'link-dark', 'icon-link', 'icon-link-hover');
        editButton.type = 'button';
        editButton.setAttribute('data-bs-whatever','edit');
        editButton.setAttribute('data-bs-toggle','modal');
        editButton.setAttribute('data-bs-target','#modal');
        editButton.dataset.id = i;
        cardBody3.appendChild(editButton);
        editButton.addEventListener('click',evt =>{
            editNote(i);
        });
        
        let editIcon = document.createElement('i');
        editIcon.classList.add('bi', 'bi-pencil-square', 'fs-3');
        editButton.appendChild(editIcon);
    })
}

function createNote(){
    
    let newNote = {
        title:modalTitle.value,
        text:modalText.value,
        color:color,
        time:new Date().getTime()
    }
    
    notesArray.push(newNote);
    let storageNotes = JSON.stringify(notesArray);
    localStorage.setItem('notes',storageNotes);
    retrieveNotes();
}

function editNote(index){
    let note = notesArray[index];
    modalTitle.value = note.title;
    modalText.value = note.text;
    color = note.color;
}

function saveNote(index){
    let note = notesArray[index];
    note.title = modalTitle.value;
    note.text = modalText.value;
    note.time = new Date().getTime();
    note.color = color;
    let storageNotes = JSON.stringify(notesArray);
    localStorage.setItem('notes',storageNotes);
    retrieveNotes();
}

function deleteNote(index){
    notesArray.splice(index,1);
    let storageNotes = JSON.stringify(notesArray);
    localStorage.setItem('notes',storageNotes);
    retrieveNotes();
}

retrieveNotes()