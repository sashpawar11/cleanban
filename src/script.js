
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
const btncreateIssueModalSubmit = document.getElementById("btnSubmitCRIssue");
const todoItems = document.getElementById('todo-items');
const colorPickerBoard = document.querySelectorAll('.board-color-picker');

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

    boardsContainer.removeChild(adhocBoard);
    boardsContainer.appendChild(boardDiv);
    boardsContainer.appendChild(adhocBoard);
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