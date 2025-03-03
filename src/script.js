
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
    constructor(issueID, issuePriority, issueName, issueLabelName,issueLabelColor, issueDueDate) {
        this.issueID = issueID;
        this.issuePriority = issuePriority;
        this.issueName = issueName;
        this.issueLabel = { issueLabelName : issueLabelName, issueLabelColor: issueLabelColor} 
        // this.issueLabelColor = issueLabelColor;
        this.issueDueDate = issueDueDate;
        syncLabels(this.issueLabel);
    }
}




// INITIALIZE //

const boardsContainer = document.querySelector('.container');
const todoBoard = document.getElementById('todo-board');
const adhocBoard = document.getElementById('adhoc-board');
const issueItems = document.querySelectorAll('.issue-item')
const kanbanBoardName = document.getElementById('board-name');
const btnCreateIssue = document.getElementById('create-issue');
const btnCreateBoard = document.getElementById('btn-addboard');
const createIssueModal = document.getElementById("createIssueModal");
const editIssueModal = document.getElementById("editIssueModal");
const btncreateIssueModalClose = document.getElementById("closeCreateIssueModalButton");
const btncreateIssueModalSubmit = document.getElementById("btnSubmitCRIssue");
const btneditIssueModalClose = document.getElementById("closeEditIssueModalButton");
const btneditIssueModalSubmit = document.getElementById("btnUpdateEDIssue");
const sortpriority = document.getElementById('sortpriority');

let boardsData = [];
let issueLabels = [];


loadLocales();
// fallback/new session
if (boardsData.length == 0) {
    const todoBoardObj = new boardObj('todo-board', 'TODO', '#1a1a1a');
    const todoBoardObjItem = new IssueObj(Math.ceil(Math.random() * 1000000),1,'Create Kanban Board', 'current-sprint', 'blueviolet',new Date().toLocaleDateString());
    const todoBoardObjItem2 = new IssueObj(Math.ceil(Math.random() * 1000000),2,'Edit and Delete Issue', 'current-sprint', 'blueviolet', new Date().toLocaleDateString())
    const todoBoardObjItem3 = new IssueObj(Math.ceil(Math.random() * 1000000), 3, 'Sync LocalStorage', 'current-sprint','blueviolet',new Date().toLocaleDateString());
    todoBoardObj.setBoardIssue(todoBoardObjItem);
    todoBoardObj.setBoardIssue(todoBoardObjItem2);
    todoBoardObj.setBoardIssue(todoBoardObjItem3);
    boardsData.push(todoBoardObj);

    const inprogressBoardObj = new boardObj('inprogress-board', 'IN-PROGRESS', '#1a1a1a');
    boardsData.push(inprogressBoardObj);

    const completedBoardObj = new boardObj('completed-board', 'COMPLETED', '#1a1a1a');
    boardsData.push(completedBoardObj);

    syncLocalStorage();
}


 renderBoardData()



/// EVENT HANDLERS ///////////

kanbanBoardName.addEventListener('input', () => {
    localStorage.setItem('board-name', kanbanBoardName.value);
})
issueItems.forEach(attachDragHandlers);

sortpriority.addEventListener('input', () => {
    sortIssuesByPriority(sortpriority.value);
})
sortpriority.addEventListener('change', () => {
    sortIssuesByPriority(sortpriority.value);
})


const boards = document.querySelectorAll('.board');
boards.forEach((board) => {
    board.addEventListener('dragover', () => {
        
        //console.log('Something Dragged');
        const issueItem = document.querySelector('.flying');
        board.appendChild(issueItem);
        
        let foundItem;

        // SYNC DATA
        // iterate over all boardsData
        boardsData.forEach(boardObj => {
             //console.log('boardissues ',boardObj.boardIssues);
            boardObj.boardIssues.forEach(issue => {
                //console.log('Issue ID',issueItem.id);
                if (issue.issueID == issueItem.id) {
                    // found the item
                    console.log('found item');
                    foundItem = issue;
                }

            })
        })

        boardsData.forEach(boardObj => {
            console.log('board id ', boardObj.boardID);
            console.log('boards id ',board.id);
            

            if (boardObj.boardID == board.id) {
               // boardObj.boardIssues.push(foundItem);
            }
        })
        
        syncLocalStorage();


    })
    board.addEventListener('dragenter', () => {
        console.log(board);
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
// window.onclick = function (event) {
//     if (event.target == createIssueModal) {
//         modal.style.display = "none";
//     }
// }

const itemCrudBtns = document.querySelectorAll('.issue-buttons')
itemCrudBtns.forEach(item => {
    item.addEventListener('click',execIssueCrud)
})

btneditIssueModalClose.onclick = function() {
    editIssueModal.style.display = "none";
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
// When the user clicks on the button, open the modal
btnCreateIssue.onclick = function() {
    createIssueModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
btncreateIssueModalClose.onclick = function() {
    createIssueModal.style.display = "none";
}

function execIssueCrud(event) {
    console.log('triggered issuecrud')
    const currBoard = event.target.parentNode.parentNode.parentNode.parentElement;
    // while (currBoardID.className != 'board') {
    //     currBoardID.parentNode;
    // }
    const currBoardID = currBoard.id;

    const currIssue = event.target.parentNode.parentNode;
    // while (currIssueID.className != 'issue-item') {
    //     currIssueID.parentNode;
    // }
    const currIssueID = currIssue.id;

    if (event.target.id == "edit-issue") {
            
            editIssueMode(currBoardID,currIssueID)
    }
    else if (event.target.id == "delete-issue") {
            deleteIssue(currBoardID,currIssueID)
    }
}

function editIssueMode(editBoardID, editIssueID) {
    let issueObj = {
    }
    editIssueModal.style.display = "block";
    boardsData.forEach(board => {
        if (board.boardID == editBoardID) {

            board.boardIssues.forEach(issueItem => {
                if (issueItem.issueID == editIssueID) {
                    issueObj = issueItem;
                }
            })
        }
       
    })

   

    const edIssueName = document.getElementById('ed-issue-name');
    const edIssueP1 = document.getElementById('edp1radio')
    const edIssueP2 = document.getElementById('edp2radio')
    const edIssueP3 = document.getElementById('edp3radio')
    const edIssueDate = document.getElementById('ed-issue-date')
    // let crIssueDateFormatted = new Date(crIssueDate);
    // crIssueDateFormatted = crIssueDateFormatted.toLocaleDateString;

    const edIssueLabelName = document.getElementById('ed-issue-labels');

    edIssueName.value = issueObj.issueName;
    switch (issueObj.issuePriority) {
        case 1: edIssueP1.checked = true;
            break;
        case 2: edIssueP2.checked = true;
            break;
        case 3: edIssueP3.checked = true;
            break;
    }
    let tempDate = new Date(issueObj.issueDueDate);
    let formattedDate = tempDate.toISOString().split('T')[0];
    edIssueDate.value = formattedDate
   
    console.log(issueObj);
    edIssueLabelName.value = issueObj.issueLabel.issueLabelName;

    btneditIssueModalSubmit.onclick = function() {
        issueObj.issueName = edIssueName.value;
        
       if(edIssueP1.checked) issueObj.issuePriority = parseInt(edIssueP1.value);
       if(edIssueP2.checked) issueObj.issuePriority = parseInt(edIssueP2.value);
       if(edIssueP3.checked) issueObj.issuePriority = parseInt(edIssueP3.value);
        
        issueObj.issueDueDate = edIssueDate.value;
        issueObj.issueLabel.issueLabelName = edIssueLabelName.value;

        boardsData.forEach(board => {
            if (board.boardID == editBoardID) {
    
                board.boardIssues.forEach(issueItem => {
                    if (issueItem.issueID == editIssueID) {
                        issueItem = issueObj;
                    }
                })
            }
            
            delete issueObj;
           
        })
        syncLocalStorage();
        btneditIssueModalClose.click();
        parent.location.reload();
    }

    




}

function deleteIssue(delBoardID, delIssueID) {
    
    boardsData.forEach(board => {
        if(board.boardID == delBoardID){
            board.boardIssues.forEach((issueItem,idx,arr)=> {
                if (issueItem.issueID == delIssueID) {
                    arr.splice(idx,1)
                    }
                })
        }
    })

    syncLocalStorage();
    parent.location.reload();
    

}
function createNewIssue() {
    const todoItems = document.getElementById('todo-items');
    // Inputs
    const crIssueName = document.getElementById('cr-issue-name').value;
    const crIssueP1 = document.getElementById('p1radio').checked;
    const crIssueP2 = document.getElementById('p2radio').checked;
    const crIssueP3 = document.getElementById('p3radio').checked;
    const crIssueDate = document.getElementById('cr-issue-date').value;
    // let crIssueDateFormatted = new Date(crIssueDate);
    // crIssueDateFormatted = crIssueDateFormatted.toLocaleDateString;

    const crIssueLabelName = document.getElementById('cr-issue-labels').value;

    if (!crIssueName || !crIssueDate || !crIssueLabelName) return;

    let selectedPriority = 1;
    if (crIssueP1) {
        selectedPriority = 1;
    }
    else if (crIssueP2) {
        selectedPriority = 2;
    }
    else if (crIssueP3) {
        selectedPriority = 3;
    }
    
    const newIssue = new IssueObj(Math.ceil(Math.random() * 1000000), selectedPriority, crIssueName, 
    crIssueLabelName, 'green',crIssueDate);
    //console.log(newIssue);
    boardsData[0].boardIssues.push(newIssue);
    syncLocalStorage();
   

    // const issueDiv = document.createElement('div');
    // issueDiv.className = 'issue-item';
    // issueDiv.setAttribute('draggable', true);

 
    // const prioritySpan = document.createElement('span')
    // prioritySpan.className = `priority ${selectedPriority}`

    // const issueContent = document.createElement('p')
    // issueContent.className = 'issue-content'

    // const issueLabelSpan = document.createElement('span')
    // issueLabelSpan.className = 'issue-label';
    // issueLabelSpan.innerText = crIssueLabels;

    // const issueNameSpan = document.createElement('span')
    // issueNameSpan.className = 'issue-title';
    // issueNameSpan.innerText = crIssueName;

    // const dueDateSpan = document.createElement('span')
    // dueDateSpan.className = 'issue-date';
    // dueDateSpan.innerText = `Due Date : ${crIssueDate}`;
    
    // issueContent.appendChild(issueLabelSpan);
    // issueContent.appendChild(issueNameSpan);
    // issueContent.appendChild(dueDateSpan);

    // issueDiv.appendChild(prioritySpan);
    // issueDiv.appendChild(issueContent);
    // attachDragHandlers(issueDiv);
    
    // todoItems.appendChild(issueDiv)
    btncreateIssueModalClose.click();
    parent.location.reload();
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
    const boardID = board.id;
    const boardTitle = board.querySelector('.board-title');
    boardTitle.style.color = colorSelected;
    board.style.borderColor = colorSelected;
    console.log('Insired updateBoardColor', boardsData);
    boardsData.forEach((board) => {
        if (board.boardID == boardID) {
            board.boardColor = colorSelected;
            console.log('boardsData Updated!');
        }
    })

    syncLocalStorage();
    return;
}

function loadLocales() {
    
    const boardname = localStorage.getItem('board-name');
    if (boardname) {
        kanbanBoardName.value = boardname;
    }

    const sortP = localStorage.getItem('sort-priority');
    if (sortP) {
        sortpriority.value = sortP;
    }

    let labelsFetch = localStorage.getItem('issue-labels');
    if (labelsFetch) {
        issueLabels = JSON.parse(labelsFetch)
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
    
    //SYNC BOARD DATA
    if (boardsData.length > 0) localStorage.setItem('boardsData', JSON.stringify(boardsData));

    //SYNC BOARD FILTERS
    if (sortpriority.value.length > 0 ) localStorage.setItem('sort-priority', sortpriority.value);

    console.log(issueLabels);
    const parsedLabels = JSON.stringify(issueLabels);
    if (issueLabels.length > 0) {
        localStorage.setItem('issue-labels', parsedLabels);
    }
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
    boardDiv.style.borderColor =  board.boardColor;

    const boardHeader = document.createElement('div');
    boardHeader.className = "board-header";
    const boardTitleSpan = document.createElement('span');
    boardTitleSpan.innerHTML = board.boardName
    boardTitleSpan.className = 'board-title';
    boardTitleSpan.style.color = board.boardColor;
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.name = 'board-color-picker'
    colorPicker.className = 'board-color-picker'
    colorPicker.value = board.boardColor;
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
        issueItemDiv.id = issue.issueID;
        issueItemDiv.className = 'issue-item';
        issueItemDiv.draggable = 'true';
        attachDragHandlers(issueItemDiv);

        const prioritySpan = document.createElement('span');
        prioritySpan.className = 'priority';
        switch (issue.issuePriority) {
            case 1: prioritySpan.classList.add('p1');
                         break;
            case 2: prioritySpan.classList.add('p2');
                break;
            case 3: prioritySpan.classList.add('p3');
                break;
            default : prioritySpan.classList.add('p3')
        }

        issueItemDiv.appendChild(prioritySpan);

        const p = document.createElement('span');
        p.className = 'issue-content';

        const labelSpan = document.createElement('span');
        labelSpan.innerText = issue.issueLabel.issueLabelName;
        labelSpan.style.backgroundColor = issue.issueLabel.issueLabelColor;
        labelSpan.className = 'issue-label';
        p.appendChild(labelSpan);

        const titleSpan = document.createElement('span');
        titleSpan.innerText = issue.issueName;
        titleSpan.className = 'issue-title';
        p.appendChild(titleSpan);
        const dateSpan = document.createElement('span');
        const dueDate = new Date(issue.issueDueDate);
        dateSpan.innerText = `Due : ${dueDate.toLocaleDateString()}`;
        dateSpan.className = 'issue-date';
        p.appendChild(dateSpan);
        attachDragHandlers(p);

        const issueButtons = document.createElement('div');
        issueButtons.className = 'issue-buttons';

        const editbtn = document.createElement('i');
        editbtn.id='edit-issue'
        editbtn.className = 'fa-solid fa-pen-to-square issue-crud';

        const delbtn = document.createElement('i');
        delbtn.id='delete-issue'
        delbtn.className = 'fa-solid fa-trash issue-crud';

        issueButtons.appendChild(editbtn);
        issueButtons.appendChild(delbtn);
        issueItemDiv.appendChild(p);
        issueItemDiv.appendChild(issueButtons);
        itemsContainer.appendChild(issueItemDiv);
    })

    boardDiv.appendChild(itemsContainer);
    console.log('FinalBoard',boardDiv);
    return boardDiv;

}

function sortIssuesByPriority(order) {
    
    boardsData.forEach(board => {
        if (order == "HTL") {
            board.boardIssues.sort((a, b) => a.issuePriority - b.issuePriority);
        }
        if (order == "LTH") {
            board.boardIssues.sort((a, b) => b.issuePriority - a.issuePriority);
        }
       
    })
    syncLocalStorage();
    parent.location.reload();
}

function syncLabels(labelObj) {
    console.log(labelObj);

    if (issueLabels.length == 0) {
        issueLabels.push(labelObj); 
        return;
    } 
    
    issueLabels.forEach(issue => {
        if (issue.issueLabelName == labelObj.issueLabelName) {
            return
        }
        else {
            issueLabels.push(labelObj);
        }
    })

    console.log(`Issue labels ${issueLabels.toString()}`);
    syncLocalStorage();

}

function clearLocalStorage() {
    localStorage.clear();
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