
const boards = document.querySelectorAll('.board');
const todoBoard = document.getElementById('todo-board');
const issueItems = document.querySelectorAll('.issue-item')
const kanbanBoardName = document.getElementById('board-name');
const btnCreateIssue = document.getElementById('create-issue');

loadLocales();


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

function loadLocales() {
    const boardname = localStorage.getItem('board-name');
    if (boardname) {
        kanbanBoardName.value = boardname;
    }
}