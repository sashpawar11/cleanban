
// INITIALIZE //

const boardsContainer = document.querySelector('.container');
const boards = document.querySelectorAll('.board');
const todoBoard = document.getElementById('todo-board');
const adhocBoard = document.getElementById('adhoc-board');
const issueItems = document.querySelectorAll('.issue-item')
const kanbanBoardName = document.getElementById('board-name');
const btnCreateIssue = document.getElementById('create-issue');
const btnCreateBoard = document.getElementById('btn-addboard');


loadLocales();


/// EVENT HANDLERS ///////////

btnCreateIssue.addEventListener('click', () => {
    const issueName = prompt("Enter Issue Name:");
    createNewIssue(issueName);
})
kanbanBoardName.addEventListener('input', () => {
    localStorage.setItem('board-name', kanbanBoardName.value);
})
issueItems.forEach(attachDragHandlers);

boards.forEach((board) => {
    board.addEventListener('dragover', () => {
        console.log('Something Dragged');
        const issueItem = document.querySelector('.flying');
        board.appendChild(issueItem);
    })
})


btnCreateBoard.addEventListener('click', () => {
    createNewBoard();
})

/// FUNCTIONS ///////////

function attachDragHandlers(target) {
    target.addEventListener('dragstart', () => {
        target.classList.add('flying');
    });
    
    target.addEventListener('dragend', () => {
        target.classList.remove('flying');
    });

}

function createNewIssue(issueName) {
    const issueDiv = document.createElement('div');
    issueDiv.className = 'issue-item';
    issueDiv.setAttribute('draggable', true);

    const prioritySpan = document.createElement('span')
    prioritySpan.innerText = 'P1'
    const issueNameSpan = document.createElement('span')
    issueNameSpan.innerText = issueName
    const dueDateSpan = document.createElement('span')
    dueDateSpan.innerText = 'Due Date : '
    
    issueDiv.appendChild(prioritySpan);
    issueDiv.appendChild(issueNameSpan);
    issueDiv.appendChild(dueDateSpan);
    attachDragHandlers(issueDiv);
    todoBoard.appendChild(issueDiv)
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

    boardsContainer.removeChild(adhocBoard);
    boardsContainer.appendChild(boardDiv);
    boardsContainer.appendChild(adhocBoard);
}
function loadLocales() {
    const boardname = localStorage.getItem('board-name');
    if (boardname) {
        kanbanBoardName.value = boardname;
    }
}