const listWrapper = document.getElementById("list-row");
const addListBtn = document.getElementById("add-list-button");

addListBtn.addEventListener("click", showAddListModal); 

// function to show Add List Modal
function showAddListModal() {
    // create a div for Modal and all input fileds to it
    // then append it to content-body/list-row div as the child
    const AddListModal = document.createElement("div");
    AddListModal.className = "modal-wrapper";
    AddListModal.id="add-list-modal";
    const innerHtml = `<div id="field-label">List Name</div><input type="text" class="field-input" id="list-name-input" name="list-name" /><div id="create-list-btn-wrapper"><button id="create-list-btn" class="create-btn" type="submit">Create List</button></div>`;
    AddListModal.innerHTML = innerHtml;
    document.body.appendChild(AddListModal);
    const createListBtn = document.getElementById("create-list-btn");
    createListBtn.addEventListener("click", function (event) {
        event.preventDefault();
        const newTitle = document.getElementById("list-name-input").value;
        createList(newTitle);
        AddListModal.remove();
    });
    // Pressing enter will submit the title and create a new list
    const listNameInput = document.getElementById("list-name-input");
    listNameInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            createListBtn.click();
        }
    });
}

// function to create a list
function createList(title) {
    const newList = document.createElement("div");
    const innerHtml = `<div class="list-header"><div id="list-title">${title}</div><img id="list-close" height="40%" src="./assets/close.svg" /></div><div id="list-body-${title}" class="list-body"></div><div class="list-footer"><div type="submit" id="add-card">+</div></div>`;
    newList.innerHTML = innerHtml;
    newList.id = `${title}-list`;
    newList.className = "list";
    newList.setAttribute("ondragover", "allowDrop(event)");
    newList.setAttribute("ondrop", "drop(event)");
    listWrapper.appendChild(newList);
    const closeIcon = document.getElementById("list-close");
    closeIcon.addEventListener("click", function (event) {
        event.preventDefault();
        // console.log(this, event);
        deleteList(title);
    });
    const listBody = document.getElementById(`list-body-${title}`);
    const addCardBtn = document.getElementById("add-card");
    addCardBtn.addEventListener("click", function (event) {
        event.preventDefault();
        console.log(this);
        // createCard(this.parentNode);
        showAddCardModal.call(this, listBody);
    });
}

function showAddCardModal(parentNode) {
    console.log("this is showAddCardModal");
    const addCardModal = document.createElement("div");
    addCardModal.className = "modal-wrapper";
    addCardModal.id="add-card-modal";
    const innerHtml = `<div id="field-label">Card Title</div><input class="field-input" type="text" id="card-title-input"/><div id="field-label">Card Description</div><textarea class="field-input-area" type="text-area" id="card-desc-text-area"></textarea><div id="create-card-btn-wrapper"><button class="create-btn" id="create-card-btn" type="submit">Create Card</button></div>`;
    addCardModal.innerHTML = innerHtml;
    document.body.appendChild(addCardModal);
    const createCardBtn = document.getElementById("create-card-btn");
    createCardBtn.addEventListener("click", function(event){
        event.preventDefault();
        const newCardTitle = document.getElementById("card-title-input").value;
        const newCardDesc = document.getElementById("card-desc-text-area").value;
        createCard(parentNode, newCardTitle, newCardDesc);
        addCardModal.remove();
    });
    const cardDescTxtArea = document.getElementById("card-desc-text-area");
    cardDescTxtArea.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            createCardBtn.click();
        }
    });

}

// function to create a card
function createCard(parentNode, cardTitle, cardDesc) {
    // console.log("Inside createCard");
    const newCard = document.createElement("div");
    newCard.className = "list-card";
    newCard.id = `${cardTitle}-card`;
    newCard.setAttribute("draggable", true);
    newCard.setAttribute("ondragstart", "drag(event)");
    const innerHtml = `<div class="card-header"><div>${cardTitle}</div><img id="card-close" height="40%" src="./assets/close.svg" /></div><div class="card-body">${cardDesc}</div>`;
    newCard.innerHTML = innerHtml;
    parentNode.appendChild(newCard);
    const closeIcon = document.getElementById("card-close");
    closeIcon.addEventListener("click", function (event) {
        event.preventDefault();
        // console.log(this, event);
        deleteCard(cardTitle);
    });
}


// function to delete a card
function deleteCard(cardTitle) {
    const card = document.getElementById(`${cardTitle}-card`);
    card.remove();
}

function deleteList(listTitle) {
    const list = document.getElementById(`${listTitle}-list`);
    list.remove();
    console.log("delete this list", listTitle);
}


// function makeInput(event) {
//     event.innerHTML = `<input id=${event.target.id} value=${event.innerText}>`;
// }

// function makeDiv(event) {
//     event.innerHTML - `<div id=${event.taget.id}>${event.innerText}</div>`;
// }

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    event.target.appendChild(document.getElementById(data));
}