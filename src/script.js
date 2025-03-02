
// INITIALIZE //

const boardsContainer = document.querySelector('.container');
const boards = document.querySelectorAll('.board');
const todoBoard = document.getElementById('todo-board');
const adhocBoard = document.getElementById('adhoc-board');
const issueItems = document.querySelectorAll('.issue-item')
const kanbanBoardName = document.getElementById('board-name');
const btnCreateIssue = document.getElementById('create-issue');
const btnCreateBoard = document.getElementById('btn-addboard');
const createIssueModal = document.getElementById("createIssueModal");
const btncreateIssueModalClose = document.getElementById("closeCreateIssueModalButton");


loadLocales();


/// EVENT HANDLERS ///////////

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
    board.addEventListener('dragenter', () => {
        board.classList.add('board-drag-active');
    })
    board.addEventListener('dragleave', () => {
        board.classList.remove('board-drag-active');
    })
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