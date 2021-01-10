const listWrapper = document.getElementById("list-row");
const addListBtn = document.getElementById("add-list-button");

addListBtn.addEventListener("click", showAddListModal);

window.onload = function () {
    const initalData = [{
        title: "Teams",
        id: getId(),
        cardColor: getCardColor(),
        cards: [{ id: getId(), cardTitle: "Product", cardDesc: "3 pending tasks to be picked by Raj" }, { id: getId(), cardTitle: "Sales", cardDesc: "Send proposals to Punnet for sales prices." }]
    }, {
        title: "Products",
        id: getId(),
        cardColor: getCardColor(),
        cards: [{ id: getId(), cardTitle: "UAT Testing", cardDesc: "Ask engg. to setup testing infrastructure" }]
    }]
    console.log("I had came here")
    let lists = window.localStorage.getItem('lists');

    if (!lists) {
        window.localStorage.setItem("lists", JSON.stringify(initalData));
        lists = window.localStorage
    }
    createInitalListsAndCards(JSON.parse(lists));
};

window.addEventListener("keyup", function (event) {
    const addListModal = document.getElementById("add-list-modal");
    const addCardModal = document.getElementById("add-card-modal");
    if (event.key === "Escape") {
        event.preventDefault();
        if (addListModal) addListModal.remove();
        if (addCardModal) addCardModal.remove();
    }
})

// function to show the Modal to Add List
function showAddListModal() {
    // create a div for Modal and all input fields to it
    // then append it to content-body/list-row div as the child
    const addListModal = document.createElement("div");
    addListModal.className = "modal-wrapper";
    addListModal.id = "add-list-modal";
    const innerHtml = `<img class="modal-close" height="40%" src="./assets/close.svg" /><div id="field-label">List Name</div><input type="text" class="field-input" id="list-name-input" name="list-name" /><div id="create-list-btn-wrapper"><button id="create-list-btn" class="create-btn" type="submit">Create List</button></div><div class="modal-footer-note">Press Esc key to close this modal</div>`;
    addListModal.innerHTML = innerHtml;
    document.body.appendChild(addListModal);
    const createListBtn = document.getElementById("create-list-btn");
    createListBtn.addEventListener("click", function (event) {
        event.preventDefault();
        const newTitle = document.getElementById("list-name-input").value;
        insertList(newTitle);
        createList(newTitle);
        addListModal.remove();
    });
    // Pressing enter will submit the title and create a new list
    const listNameInput = document.getElementById("list-name-input");
    listNameInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            createListBtn.click();
        }
    });
    const modalCloseBtn = document.getElementsByClassName("modal-close");
    modalCloseBtn[0].addEventListener("click", function () {
        addListModal.remove();
    });
}

// function to create a list
function createList(title) {
    const newList = document.createElement("div");
    const innerHtml = `<div class="list-header"><div id="list-title">${title}</div><img class="list-close" id="list-close-${title}" height="50%" src="./assets/close.svg" /></div><div id="list-body-${title}" class="list-body"></div><div class="list-footer"><div type="submit" class="add-card" id="add-card-${title}">+</div></div>`;
    newList.innerHTML = innerHtml;
    newList.id = `${title}-list`;
    newList.className = "list";
    newList.setAttribute("ondragover", "allowDrop(event)");
    newList.setAttribute("ondrop", "drop(event)");
    listWrapper.appendChild(newList);
    const closeIcon = document.getElementById(`list-close-${title}`);
    closeIcon.addEventListener("click", function (event) {
        event.preventDefault();
        this.parentNode.parentNode.remove();
    });
    const addCardBtn = document.getElementById(`add-card-${title}`);
    addCardBtn.addEventListener("click", function (event) {
        event.preventDefault();
        showAddCardModal.call(this, title);
    });
}

// function to show the Modal to add Add Card
function showAddCardModal(listTitle) {
    const addCardModal = document.createElement("div");
    addCardModal.className = "modal-wrapper";
    addCardModal.id = "add-card-modal";
    const innerHtml = `<img class="modal-close" height="40%" src="./assets/close.svg" /><div id="field-label">Card Title</div><input class="field-input" type="text" id="card-title-input"/><div id="field-label">Card Description</div><textarea class="field-input-area" type="text-area" id="card-desc-text-area"></textarea><div id="create-card-btn-wrapper"><button class="create-btn" id="create-card-btn" type="submit">Create Card</button></div><div class="modal-footer-note">Press Esc key to close this modal</div>`;
    addCardModal.innerHTML = innerHtml;
    document.body.appendChild(addCardModal);
    const createCardBtn = document.getElementById("create-card-btn");
    createCardBtn.addEventListener("click", function (event) {
        event.preventDefault();
        const newCardTitle = document.getElementById("card-title-input").value;
        const newCardDesc = document.getElementById("card-desc-text-area").value;
        insertCard(listTitle, newCardTitle, newCardDesc);
        const cardColor = findList(listTitle).cardColor;
        createCard(listTitle, newCardTitle, newCardDesc, cardColor);
        addCardModal.remove();
    });
    const cardDescTxtArea = document.getElementById("card-desc-text-area");
    cardDescTxtArea.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            createCardBtn.click();
        }
    });
    const modalCloseBtn = document.getElementsByClassName("modal-close");
    modalCloseBtn[0].addEventListener("click", function () {
        addCardModal.remove();
    });
}

// function to create a card
function createCard(listTitle, cardTitle, cardDesc, cardColor) {
    console.log("cardColor - ", cardColor);
    const newCard = document.createElement("div");
    newCard.className = "list-card";
    newCard.id = `${cardTitle}-card`;
    newCard.style.backgroundColor = cardColor;
    newCard.setAttribute("draggable", true);
    newCard.setAttribute("ondragstart", "drag(event)");
    const innerHtml = `<div class="card-header"><div class="card-header-content">${cardTitle}</div><img class="card-close" id="card-close-${cardTitle}" height="40%" src="./assets/close.svg" /></div><div class="card-body">${cardDesc}</div>`;
    newCard.innerHTML = innerHtml;
    const parentNode = document.getElementById(`list-body-${listTitle}`);
    parentNode.appendChild(newCard);
    const closeIcon = document.getElementById(`card-close-${cardTitle}`);
    closeIcon.addEventListener("click", function (event) {
        event.preventDefault();
        this.parentNode.parentNode.remove();
    });
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    if (event.target.className !== "list-body") return;
    const data = event.dataTransfer.getData("text");
    event.target.prepend(document.getElementById(data));
}

function getCardColor() {
    const colorArr = ["lightsalmon", "cornflowerblue", "greenyellow", "lightpink", "palevioletred", "#FED000", "violet", "orange"];
    const index = Math.floor(Math.random() * Math.floor(colorArr.length - 1));
    return colorArr[index];
}

function getId() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function createInitalListsAndCards(lists) {
    for (let i = 0; i < lists.length; i++) {
        const listTitle = lists[i].title;
        const cardColor = lists[i].cardColor;
        createList(listTitle);
        for (let j = 0; j < lists[i].cards.length; j++) {
            const currCard = lists[i].cards[j];
            createCard(listTitle, currCard.cardTitle, currCard.cardDesc, cardColor);
        }
    }
}

function findList(id){
    const reqList = JSON.parse(localStorage.getItem("lists")).filter(list=> list.title === id)[0];
    return reqList;
}

function findCard(listId, cardId){
    const reqCard = findList(listId).cards.filter(card => card.id === cardId);
    return reqCard;
}

function insertList(newTitle) {
    const currLists = JSON.parse(localStorage.getItem("lists"));
    const newList = {
        id: getId(),
        title: newTitle,
        cardColor: getCardColor(),
        cards: []
    }
    currLists.push(newList);
    localStorage.setItem("lists", JSON.stringify(currLists));
}

function insertCard(listId, cardTitle, cardDesc){
    const currLists = JSON.parse(localStorage.getItem("lists"));
    const newCard = {
        id: getId(),
        cardTitle,
        cardDesc
    }
    currLists.forEach(list => {
        // change list.title to list.id later when id logic is implemented
        if(list.title === listId){
            list.cards.push(newCard);
        }
    });
    localStorage.setItem("lists", JSON.stringify(currLists));
}