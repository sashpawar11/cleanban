
// CLASS DEFINITIONS
class boardObj {

    constructor(ID,boardName,boardColor) {
        this.boardID = ID;
        this.boardName = boardName;
        this.boardColor = boardColor;
        this.boardIssues = [];
    }

    setBoardIssue(issueObj) {
        this.boardIssues.push(issueObj);
    }
}


class IssueObj {
    constructor(issuePriority, issueName, issueLabel, issueDueDate) {
        this.issuePriority = issuePriority;
        this.issueName = issueName;
        this.issueLabel = issueLabel;
        this.issueDueDate = issueDueDate;
    }
}


// PRORTOTYPES


// INITIALIZE //

const boardsContainer = document.querySelector('.container');
const todoBoard = document.getElementById('todo-board');
const adhocBoard = document.getElementById('adhoc-board');
const issueItems = document.querySelectorAll('.issue-item')
const kanbanBoardName = document.getElementById('board-name');
const btnCreateIssue = document.getElementById('create-issue');
const btnCreateBoard = document.getElementById('btn-addboard');
const createIssueModal = document.getElementById("createIssueModal");
const btncreateIssueModalClose = document.getElementById("closeCreateIssueModalButton");
const btncreateIssueModalSubmit = document.getElementById("btnSubmitCRIssue");
const todoItems = document.getElementById('todo-items');


let boardsData = []

loadLocales();


// fallback/new session
if (boardsData.length == 0) {
    const todoBoardObj = new boardObj('todo-board', 'TODO', 'black');
    const todoBoardObjItem = new IssueObj('P1','Create Kanban Board', 'current-sprint', '03/05/2025');
    const todoBoardObjItem2 = new IssueObj('P2','Edit and Delete Issue', 'current-sprint', '03/05/2025')
    const todoBoardObjItem3 = new IssueObj('P3','Sync LocalStorage', 'current-sprint', '03/05/2025');
    todoBoardObj.setBoardIssue(todoBoardObjItem);
    todoBoardObj.setBoardIssue(todoBoardObjItem2);
    todoBoardObj.setBoardIssue(todoBoardObjItem3);
    boardsData.push(todoBoardObj);

    const inprogressBoardObj = new boardObj('inprogress-board', 'IN-PROGRESS', 'black');
    boardsData.push(inprogressBoardObj);

    const completedBoardObj = new boardObj('completed-board', 'COMPLETED', 'black');
    boardsData.push(completedBoardObj);

    syncLocalStorage();
}

renderBoardData()



/// EVENT HANDLERS ///////////

kanbanBoardName.addEventListener('input', () => {
    localStorage.setItem('board-name', kanbanBoardName.value);
})
issueItems.forEach(attachDragHandlers);

const boards = document.querySelectorAll('.board');
boards.forEach((board) => {
    board.addEventListener('dragover', () => {
        console.log('Something Dragged');
        const issueItem = document.querySelector('.flying');
        board.appendChild(issueItem);
    })
    board.addEventListener('dragenter', () => {
        board.classList.add('board-drag-active');
    })
    board.addEventListener('dragleave', () => {
        board.classList.remove('board-drag-active');
    })
})

const colorPickerBoard = document.querySelectorAll('.board-color-picker');
colorPickerBoard.forEach((picker) => {
    picker.addEventListener('input', updateBoardColor);
    // picker.addEventListener('input', () => {
    //     console.log('inputted');
    // });

    picker.addEventListener('change', updateBoardColor);

    // picker.addEventListener('change', () => {
    //     console.log('changed');
    // });

})


btnCreateBoard.addEventListener('click', () => {
    createNewBoard();
})

// When the user clicks on the button, open the modal
btnCreateIssue.onclick = function() {
    createIssueModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
btncreateIssueModalClose.onclick = function() {
    createIssueModal.style.display = "none";
}

btncreateIssueModalSubmit.onclick = function() {
    createNewIssue();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == createIssueModal) {
        modal.style.display = "none";
    }
}


/// FUNCTIONS ///////////

function attachDragHandlers(target) {
    target.addEventListener('dragstart', () => {
        target.classList.add('flying');
    });
    
    target.addEventListener('dragend', () => {
        target.classList.remove('flying');
    });

}

function createNewIssue() {

    // Inputs
    const crIssueName = document.getElementById('cr-issue-name').value;
    const crIssueP1 = document.getElementById('p1radio').checked;
    const crIssueP2 = document.getElementById('p1radio').checked;
    const crIssueP3 = document.getElementById('p1radio').checked;
    const crIssueDate = document.getElementById('cr-issue-date').value;
    // let crIssueDateFormatted = new Date(crIssueDate);
    // crIssueDateFormatted = crIssueDateFormatted.toLocaleDateString;

    const crIssueLabels = document.getElementById('cr-issue-labels').value;

    if (!crIssueName || !crIssueDate || !crIssueLabels) return;

    let selectedPriority = "p1";
    if (crIssueP1) {
        selectedPriority = "p1";
    }
    else if (crIssueP2) {
        selectedPriority = "p2";
    }
    else if (crIssueP3) {
        selectedPriority = "p3";
    }

    const issueDiv = document.createElement('div');
    issueDiv.className = 'issue-item';
    issueDiv.setAttribute('draggable', true);

 
    const prioritySpan = document.createElement('span')
    prioritySpan.className = `priority ${selectedPriority}`

    const issueContent = document.createElement('p')
    issueContent.className = 'issue-content'

    const issueLabelSpan = document.createElement('span')
    issueLabelSpan.className = 'issue-label';
    issueLabelSpan.innerText = crIssueLabels;

    const issueNameSpan = document.createElement('span')
    issueNameSpan.className = 'issue-title';
    issueNameSpan.innerText = crIssueName;

    const dueDateSpan = document.createElement('span')
    dueDateSpan.className = 'issue-date';
    dueDateSpan.innerText = `Due Date : ${crIssueDate}`;
    
    issueContent.appendChild(issueLabelSpan);
    issueContent.appendChild(issueNameSpan);
    issueContent.appendChild(dueDateSpan);

    issueDiv.appendChild(prioritySpan);
    issueDiv.appendChild(issueContent);
    attachDragHandlers(issueDiv);
    
    todoItems.appendChild(issueDiv)
    btncreateIssueModalClose.click();
    alert('Issue Created Successfully!');
}


function createNewBoard() {
    const boardDiv = document.createElement('div');
    boardDiv.className = 'board';
    const boardName = document.createElement('h1');
    boardName.innerHTML = 'Your Board';
    boardDiv.appendChild(boardName);
    boardDiv.addEventListener('dragover', () => {
        console.log('Something Dragged');
        const issueItem = document.querySelector('.flying');
        boardDiv.appendChild(issueItem);
    })
    boardsContainer.appendChild(boardDiv);
    repositionAdHocBoard();


}




function updateBoardColor(event) {
    const colorSelected = event.target.value;
    const board = event.target.parentNode.parentNode;
    const boardTitle = board.querySelector('.board-title');
    console.log(event.target, event.target.parentNode);

    boardTitle.style.color = colorSelected;
    board.style.borderColor = colorSelected;
    return;
}

function loadLocales() {
    
    const boardname = localStorage.getItem('board-name');
    if (boardname) {
        kanbanBoardName.value = boardname;
    }

    loadBoardsDataFromStorage()


}

function loadBoardsDataFromStorage() {
    let loadedBoardData = [];
    if (localStorage.getItem('boardsData')) {
        retrievedData = JSON.parse(localStorage.getItem('boardsData')); 
        boardsData = retrievedData;
        // boardsData = [...loadedBoardData];
        console.log('Data Loaded Successfully!',boardsData);
    };
}

function syncLocalStorage() {
    
    if (boardsData.length > 0) localStorage.setItem('boardsData', JSON.stringify(boardsData));

    console.log('Synced Data! ', JSON.parse(localStorage.getItem('boardsData')));
}

function renderBoardData() {

 
    boardsData.forEach((board) => {

        //boardsContainer
        if (typeof(board) === 'object') {
            const tempboard = DOMCreateBoardElement(board)
            boardsContainer.append(tempboard);
        }
       
    })

    repositionAdHocBoard();
}

function repositionAdHocBoard() {
    boardsContainer.removeChild(adhocBoard);
    boardsContainer.appendChild(adhocBoard);
}

function DOMCreateBoardElement(board) {

    console.log('insidedomcreateboardelement');

    // boardElement
    let boardDiv = document.createElement('div');
    boardDiv.id = board.boardID;
    boardDiv.className = "board"
    const boardHeader = document.createElement('div');
    boardHeader.className = "board-header";
    const boardTitleSpan = document.createElement('span');
    boardTitleSpan.innerHTML = board.boardName
    boardTitleSpan.className = 'board-title';
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.name = 'board-color-picker'
    colorPicker.className = 'board-color-picker'
    boardHeader.appendChild(boardTitleSpan);
    boardHeader.appendChild(colorPicker);
    boardDiv.appendChild(boardHeader);
    console.log(boardDiv);
    boardDiv = DOMCreateIssuesElement(boardDiv,board.boardIssues)

    return boardDiv

}

function DOMCreateIssuesElement(boardDiv, issues) {
    
const itemsContainer = document.createElement('div');
itemsContainer.class = 'items';
if (boardDiv.id == 'todo-board') itemsContainer.id = 'todo-items';

    issues.forEach((issue) => {

  
        const issueItemDiv = document.createElement('div');
        issueItemDiv.draggable = 'true';
        issueItemDiv.className = 'issue-item';
        attachDragHandlers(issueItemDiv);

        const prioritySpan = document.createElement('span');
        prioritySpan.className = 'priority';
        switch (issue.issuePriority) {
            case "P1": prioritySpan.classList.add('p1');
                         break;
            case "P2": prioritySpan.classList.add('p2');
                break;
                case "P3": prioritySpan.classList.add('p3');
                break;
            default : prioritySpan.classList.add('p3')
        }

        issueItemDiv.appendChild(prioritySpan);

        const p = document.createElement('span');
        p.className = 'issue-content';

        const labelSpan = document.createElement('span');
        labelSpan.innerText = issue.issueLabel;
        labelSpan.className = 'issue-label';
        p.appendChild(labelSpan);
        const titleSpan = document.createElement('span');
        titleSpan.innerText = issue.issueName;
        titleSpan.className = 'issue-title';
        p.appendChild(titleSpan);
        const dateSpan = document.createElement('span');
        dateSpan.innerText = issue.issueDueDate;
        dateSpan.className = 'issue-date';
        p.appendChild(dateSpan);
        attachDragHandlers(p);
        issueItemDiv.appendChild(p);
        itemsContainer.appendChild(issueItemDiv);
    })

    boardDiv.appendChild(itemsContainer);
    console.log('FinalBoard',boardDiv);
    return boardDiv;

}



// // boardObj
// board {
//     boardName:
//     items: [{
//         issueName:
//         priority :
//         estdDueDate:
//         label:
//     }, {}, {}]
// }