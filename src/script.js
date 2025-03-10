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
const btnExportBoard = document.getElementById('export-board');
const btnImportBoard = document.getElementById('import-board');
const inputJSON = document.getElementById('importJSON');
const btnCreateBoard = document.getElementById('btn-addboard');
const createIssueModal = document.getElementById("createIssueModal");
const editIssueModal = document.getElementById("editIssueModal");
const btncreateIssueModalClose = document.getElementById("closeCreateIssueModalButton");
const btncreateIssueModalSubmit = document.getElementById("btnSubmitCRIssue");
const btneditIssueModalClose = document.getElementById("closeEditIssueModalButton");
const btneditIssueModalSubmit = document.getElementById("btnUpdateEDIssue");
const sortpriority = document.getElementById('sortpriority');
const allLabelFilter = document.getElementById('main-all-label');
const btnDarkModeToggle = document.getElementById('darkmode-toggle');

let boardsData = [];
let issueLabels = [];
let isDarkMode = false;

loadLocales();
// fallback/new session
if (boardsData.length == 0) {
    const todoBoardObj = new boardObj('todo-board', 'TODO', '#000000');
    const todoBoardObjItem = new IssueObj(Math.ceil(Math.random() * 1000000),1,'Create Kanban Board', 'current-sprint', '#8a2be2',new Date().toLocaleDateString());
    const todoBoardObjItem2 = new IssueObj(Math.ceil(Math.random() * 1000000),2,'Edit and Delete Issue', 'current-sprint', '#8a2be2', new Date().toLocaleDateString())
    const todoBoardObjItem3 = new IssueObj(Math.ceil(Math.random() * 1000000), 3, 'Sync LocalStorage', 'current-sprint','#8a2be2',new Date().toLocaleDateString());
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
renderIssueLabelChips("Main");

toggleDarkModeOnLoad();


/// EVENT HANDLERS ///////////
allLabelFilter.addEventListener('click', () => {
    parent.location.reload();
})
kanbanBoardName.addEventListener('input', () => {
    localStorage.setItem('board-name', kanbanBoardName.value);
})
issueItems.forEach(attachDragHandlers);

sortpriority.addEventListener('change', () => {
    sortIssuesByPriority(sortpriority.value);
})

const boards = document.querySelectorAll('.board');
boards.forEach((board) => {
    board.addEventListener('dragover', () => {

        const issueItem = document.querySelector('.flying');
        const boardBottomControl = board.querySelector('.boardbottomcontrol');

        board.removeChild(boardBottomControl); // reposition delbutton
        board.appendChild(issueItem);
        board.appendChild(boardBottomControl); // reposition delbutton


        // SYNC LOCALSTORAGE
        for (let i = 0; i < boardsData.length; i++){
                for (let j = 0; j < boardsData[i].boardIssues.length; j++){
                    if (boardsData[i].boardIssues[j].issueID == issueItem.id) {
                        if (boardsData[i].boardID == board.id) return;
                        moveIssueToBoard(i,j,board.id)
                    }
            }
        }
    })
    board.addEventListener('dragenter', () => {
        //console.log(board);
        board.classList.add('board-drag-active');
    })
    board.addEventListener('dragleave', () => {
        board.classList.remove('board-drag-active');
    })
})

const colorPickerBoard = document.querySelectorAll('.vBoard');
colorPickerBoard.forEach((picker) => {
    picker.addEventListener('input', updateBoardColor);
    picker.addEventListener('change', updateBoardColor);

})




btnCreateBoard.addEventListener('click', () => {
    createNewBoard();
})




btncreateIssueModalSubmit.onclick = function() {
    createNewIssue();
}


const itemCrudBtns = document.querySelectorAll('.issue-buttons')
itemCrudBtns.forEach(item => {
    item.addEventListener('click',execIssueCrud)
})

btneditIssueModalClose.onclick = function() {
    editIssueModal.style.display = "none";
    parent.location.reload();
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

btnCreateIssue.onclick = function() {
    createIssueModal.style.display = "block";
    renderIssueLabelChips("Create");
}

btnExportBoard.onclick = function() {
    ExportBoardBackupJSON();
}
btnImportBoard.onclick = function () {
    inputJSON.click();
}

btnDarkModeToggle.onclick = function () {
    toggleDarkMode()
}

inputJSON.addEventListener('change', (event) => {
    
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            Object.entries(JSON.parse(e.target.result)).forEach(([k, v]) => localStorage.setItem(k, v))
            alert("Board Imported successfully!");
            parent.location.reload();
        } catch (error) {
            alert(`Board Import Failed! Error : ${error}`);
        }
    }
    reader.readAsText(file);
})
   

btncreateIssueModalClose.onclick = function() {
    createIssueModal.style.display = "none";
    parent.location.reload();
}

function execIssueCrud(event) {
    //console.log('triggered issuecrud')
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
    editIssueModal.style.display = "block";
    renderIssueLabelChips("Edit");

    let issueObj = {
    }
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
    const edIssueLabelName = document.getElementById('ed-issue-labels')
    const edIssueLabelColor = document.getElementById('ed-color-picker')

    // let crIssueDateFormatted = new Date(crIssueDate);
    // crIssueDateFormatted = crIssueDateFormatted.toLocaleDateString;


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
   
    //console.log(issueObj);
    edIssueLabelName.value = issueObj.issueLabel.issueLabelName;
    edIssueLabelColor.value = issueObj.issueLabel.issueLabelColor;

    btneditIssueModalSubmit.onclick = function() {
        issueObj.issueName = edIssueName.value;
        
       if(edIssueP1.checked) issueObj.issuePriority = parseInt(edIssueP1.value);
       if(edIssueP2.checked) issueObj.issuePriority = parseInt(edIssueP2.value);
       if(edIssueP3.checked) issueObj.issuePriority = parseInt(edIssueP3.value);
        
        issueObj.issueDueDate = edIssueDate.value;
        issueObj.issueLabel.issueLabelName = edIssueLabelName.value;
        issueObj.issueLabel.issueLabelColor = edIssueLabelColor.value;
        syncLabels(issueObj.issueLabel);
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
    // Inputs
    const crIssueName = document.getElementById('cr-issue-name').value;
    const crIssueP1 = document.getElementById('p1radio').checked;
    const crIssueP2 = document.getElementById('p2radio').checked;
    const crIssueP3 = document.getElementById('p3radio').checked;
    const crIssueDate = document.getElementById('cr-issue-date').value;
    // let crIssueDateFormatted = new Date(crIssueDate);
    // crIssueDateFormatted = crIssueDateFormatted.toLocaleDateString;

    const crIssueLabelName = document.getElementById('cr-issue-labels').value;
    const crIssueLabelColor = document.getElementById('cr-color-picker').value;
    

    if (!crIssueName || !crIssueDate || !crIssueLabelName) { alert('All fields are required!'); return; };

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
    crIssueLabelName, crIssueLabelColor,crIssueDate);
    ////console.log(newIssue);
    boardsData[0].boardIssues.push(newIssue);
    syncLocalStorage();
    btncreateIssueModalClose.click();
    parent.location.reload();
}


function createNewBoard() {
    const randBoardID = Math.ceil(Math.random() * 1000000);

    // create mockBoard and sync
    const tempBoardObj = new boardObj(randBoardID, 'Your Board', 'black');
    boardsData.push(tempBoardObj);
    syncLocalStorage();
    parent.location.reload();
}




function updateBoardColor(event) {
    const colorSelected = event.target.value;
    const board = event.target.parentNode.parentNode;
    const boardID = board.id;
    const boardTitle = board.querySelector('.board-title');
    boardTitle.style.color = colorSelected;
    //board.style.borderColor = colorSelected;
    //console.log('Insired updateBoardColor', boardsData);
    boardsData.forEach((board) => {
        if (board.boardID == boardID) {
            board.boardColor = colorSelected;
            //console.log('boardsData Updated!');
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

    let fetchDarkMode = localStorage.getItem('isDarkMode');
    if (fetchDarkMode == 'true') {
        isDarkMode = true
    }
    else {
        isDarkMode = false;
    }

    loadBoardsDataFromStorage()


}

function loadBoardsDataFromStorage() {
    let loadedBoardData = [];
    if (localStorage.getItem('boardsData')) {
        retrievedData = JSON.parse(localStorage.getItem('boardsData')); 
        boardsData = retrievedData;
        // boardsData = [...loadedBoardData];
        //console.log('Data Loaded Successfully!',boardsData);
    };
}

function syncLocalStorage() {
    
    //SYNC BOARD DATA
    if (boardsData.length > 0) localStorage.setItem('boardsData', JSON.stringify(boardsData));

    //SYNC BOARD FILTERS
    if (sortpriority.value.length > 0 ) localStorage.setItem('sort-priority', sortpriority.value);

    localStorage.setItem('isDarkMode', isDarkMode);
    //console.log(issueLabels);
    const parsedLabels = JSON.stringify(issueLabels);
    if (issueLabels.length > 0) {
        localStorage.setItem('issue-labels', parsedLabels);
    }
    //console.log('Synced Data! ', JSON.parse(localStorage.getItem('boardsData')));
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

function repositionBottomControl(board,control) {
    board.removeChild(control);
    board.appendChild(control);
}

function DOMCreateBoardElement(board) {

    //console.log('insidedomcreateboardelement');

    // boardElement
    let boardDiv = document.createElement('div');
    boardDiv.id = board.boardID;
    boardDiv.className = "board"
    //boardDiv.style.borderColor =  board.boardColor;

    const boardHeader = document.createElement('div');
    boardHeader.className = "board-header";
    // const boardTitleSpan = document.createElement('span');
    // boardTitleSpan.innerHTML = board.boardName
    // boardTitleSpan.className = 'board-title';
    // boardTitleSpan.style.color = board.boardColor;

    const boardTitleInput = document.createElement('input');
    boardTitleInput.value = board.boardName
    boardTitleInput.name = 'board-title';
    boardTitleInput.className = 'board-title';
    boardTitleInput.width = 100;
    boardTitleInput.style.color = board.boardColor;


    boardTitleInput.addEventListener('change', () => {
        board.boardName = boardTitleInput.value;
        const boardIndex = boardsData.indexOf(board);
        boardsData[boardIndex] = board;
        syncLocalStorage()
    })
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.name = 'board-color-picker'
    colorPicker.className = 'c vBoard'
    colorPicker.value = board.boardColor;

    const totalIssuesSpan = document.createElement('span')
    totalIssuesSpan.id = `${board.boardID}-totalIssueCount`
    totalIssuesSpan.className = 'totalIssueCount'

    totalIssuesSpan.innerText = `Total Issues : ${board.boardIssues.length}`

    //boardHeader.appendChild(boardTitleSpan);
    boardHeader.appendChild(boardTitleInput);

    boardHeader.appendChild(colorPicker);
    boardHeader.appendChild(totalIssuesSpan);

    boardDiv.appendChild(boardHeader);
    //console.log(boardDiv);
    boardDiv = DOMCreateIssuesElement(boardDiv,board.boardIssues)

    const boardBottomControlDiv = document.createElement('div');
    boardBottomControlDiv.className = 'boardbottomcontrol'

    const deleteBoardBtn = document.createElement('button');
    deleteBoardBtn.className = 'btnboardDelete'
    deleteBoardBtn.innerHTML = '-DELETE BOARD-'
    boardBottomControlDiv.append(deleteBoardBtn);

    deleteBoardBtn.addEventListener('click', () => {
        
        const delBoardIdx = boardsData.indexOf(board);

        let isItems = false;
        if (boardsData[delBoardIdx].boardIssues.length > 0) {
            isItems = confirm('The board has items on it, are you sure you want to delete it?')
        }
        if (isItems || boardsData[delBoardIdx].boardIssues.length == 0) {
            boardsData.splice(delBoardIdx, 1)
            syncLocalStorage();
            parent.location.reload();
        }

    })
    boardDiv.appendChild(boardBottomControlDiv);
    return boardDiv

}

function DOMCreateIssuesElement(boardDiv, issues) {
    
const itemsContainer = document.createElement('div');
itemsContainer.className = 'board-items';
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


    //console.log('FinalBoard',boardDiv);
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
        else {
            return;
        }
       
    })

    syncLocalStorage();
    parent.location.reload();
}


function filterLabels(labelName) {
    

    let issues = document.querySelectorAll('.issue-item');
    
    issues.forEach((issue) => {
        issue.style.display = 'flex';
        let tempLabel = issue.querySelector('.issue-label')
        if (tempLabel.innerHTML !== labelName) {
            issue.style.display = 'none';
        }
    })

}


function syncLabels(labelObj) {
    //console.log(labelObj);

    if (issueLabels.length == 0) {
        issueLabels.push(labelObj); 
        return;
    } 
    let foundExistingLabel = false;
    issueLabels.forEach(issue => {
        if (issue.issueLabelName == labelObj.issueLabelName) {
            foundExistingLabel = true;
        }
    })

    if(!foundExistingLabel){
        issueLabels.push(labelObj);
    }
    //console.log(`Issue labels ${issueLabels.toString()}`);
    syncLocalStorage();

}

function moveIssueToBoard(idxSourceBoard, idxSourceIssue, targetBoardID) {
    
    const sourceBoardID = boardsData[idxSourceBoard].boardID;
    const sourceBoardTotalIssues = boardsData[idxSourceBoard].boardIssues.length;
    
    boardsData.forEach(board => {
        
        if (board.boardID == targetBoardID) {
            
            board.boardIssues.push(boardsData[idxSourceBoard].boardIssues[idxSourceIssue]);
            boardsData[idxSourceBoard].boardIssues.splice(idxSourceIssue, 1)

            
            updateTotalIssueCount(sourceBoardID,sourceBoardTotalIssues,board.boardID, board.boardIssues.length);
            syncLocalStorage();
            return;
        }

    })

  
}

function renderIssueLabelChips(mode) {
    const crsuggestedLabelsContainer = document.querySelector('.cr-suggested-labels');
    const edsuggestedLabelsContainer = document.querySelector('.ed-suggested-labels');
    const mainsuggestedLabelsContainer = document.querySelector('.main-suggested-labels');



    issueLabels.forEach(label=> {
        const labelSpan = document.createElement('span');
        labelSpan.className = 'issue-label sg';
        labelSpan.innerText = label.issueLabelName;
        labelSpan.style.backgroundColor = label.issueLabelColor;
        if ((mode == "Edit")) {
            edsuggestedLabelsContainer.appendChild(labelSpan);
        }
        else if(mode == "Create"){
            crsuggestedLabelsContainer.appendChild(labelSpan);
        }
        else if(mode == "Main"){
            mainsuggestedLabelsContainer.appendChild(labelSpan);
        }
        labelSpan.addEventListener('click', () => {
            const temp = document.querySelectorAll('.labelSelected');
            temp.forEach(item => {
                item.classList.remove('labelSelected');
            })
            labelSpan.classList.add('labelSelected');
            if (isDarkMode) {
                labelSpan.classList.add('dark');
            }
     

            let crIssueLabelName = document.getElementById('cr-issue-labels');
            let crIssueLabelColor = document.getElementById('cr-color-picker');
            
            let edIssueLabelName = document.getElementById('ed-issue-labels');
            let edIssueLabelColor = document.getElementById('ed-color-picker');
            
            if (mode == "Edit") {
                edIssueLabelName.value = label.issueLabelName;
                edIssueLabelColor.value = label.issueLabelColor;
            }
            else if(mode == "Create") {
                crIssueLabelName.value = label.issueLabelName;
                crIssueLabelColor.value = label.issueLabelColor;
            }
            else if (mode == "Main") {
                filterLabels(label.issueLabelName);
            }



        })

    })


}

function toggleDarkMode() {
    
    const boards = document.querySelectorAll('.board');
    let tempflag = false;


    if (!isDarkMode) {
        //change body:
        btnDarkModeToggle.querySelector('.fa-moon').classList.replace('fa-moon', 'fa-sun');
            
        document.body.style.backgroundColor = '#0a0a0a';
        document.querySelector('.boardControls').style.color = '#e4e4e4';
        adhocBoard.style.backgroundColor = '#0c0c0c'
        adhocBoard.style.borderColor = '#222222';
        adhocBoard.style.boxShadow = 'none';
        btnCreateBoard.style.color = '#e4e4e4'
        btnCreateBoard.onmouseover = function () {
              btnCreateBoard.style.color = 'blueviolet'
        }
        btnCreateBoard.onmouseleave = function () {
            btnCreateBoard.style.color = '#e4e4e4'
      }

        //boardStyling
        boards.forEach((board) => {
            board.style.backgroundColor = '#0c0c0c';
            board.style.borderColor = '#222222';
            board.style.boxShadow = 'none';
            
            if (board.querySelector('.board-title').style.color == 'rgb(0, 0, 0)') {
                board.querySelector('.board-title').style.color = 'rgb(255, 255, 255)';
            }


            board.querySelector(`.totalIssueCount`).style.color = '#8b8b8b';

            board.querySelectorAll('.issue-item').forEach(item => {
                item.style.backgroundColor = '#1f1f1f';
                item.style.borderColor = '#6d6d6d';
                item.style.color = '#e4e4e4';
            })
        })
        document.querySelectorAll('.modal-content').forEach(modal => { modal.style.backgroundColor = '#313131'; modal.style.color = '#e4e4e4' });
        isDarkMode = true;
        syncLocalStorage();
        //loadLocales();
    }
    else {
        btnDarkModeToggle.querySelector('.fa-sun').classList.replace('fa-sun', 'fa-moon');
        isDarkMode = false;
        syncLocalStorage();
        parent.location.reload();
    }
}

function toggleDarkModeOnLoad() {
    
    const boards = document.querySelectorAll('.board');
    if (isDarkMode) {
        //change body:
        btnDarkModeToggle.querySelector('.fa-moon').classList.replace('fa-moon', 'fa-sun');
        document.body.style.backgroundColor = '#0a0a0a';
        document.querySelector('.boardControls').style.color = '#e4e4e4';
        adhocBoard.style.backgroundColor = '#0c0c0c'
        adhocBoard.style.borderColor = '#222222';
        adhocBoard.style.boxShadow = 'none';
        btnCreateBoard.style.color = '#e4e4e4'
        btnCreateBoard.onmouseover = function () {
              btnCreateBoard.style.color = 'blueviolet'
        }
        btnCreateBoard.onmouseleave = function () {
            btnCreateBoard.style.color = '#e4e4e4'
      }

        //boardStyling
        boards.forEach((board) => {
            board.style.backgroundColor = '#0c0c0c';
            board.style.borderColor = '#222222';
            board.style.boxShadow = 'none';

  
            if (board.querySelector('.board-title').style.color == 'rgb(0, 0, 0)') {
                board.querySelector('.board-title').style.color = 'rgb(255, 255, 255)';
            }

            board.querySelector(`.totalIssueCount`).style.color = '#8b8b8b';

            board.querySelectorAll('.issue-item').forEach(item => {
                item.style.backgroundColor = '#1f1f1f';
                item.style.borderColor = '#6d6d6d';
                item.style.color = '#e4e4e4';
            })
        })
        document.querySelectorAll('.modal-content').forEach(modal => { modal.style.backgroundColor = '#313131'; modal.style.color = '#e4e4e4' });
        isDarkMode = true;
        syncLocalStorage();
        //loadLocales();
    }
    else {
        return;
    }
}
// UTILTIY FUNCTIONS


function clearLocalStorage() {
    localStorage.clear();
}

function updateTotalIssueCount(sourceBoardID, sourceBoardIssueCount, targetBoardID, targetBoadissueCount) {
    
    let updatedSourceCount = sourceBoardIssueCount - 1;
    const targettotalIssueCountElement = document.getElementById(`${targetBoardID}-totalIssueCount`)
    targettotalIssueCountElement.innerText = `Total Issues - ${targetBoadissueCount}`

    const sourceBoardTotalIssueCountElement = document.getElementById(`${sourceBoardID}-totalIssueCount`)
    sourceBoardTotalIssueCountElement.innerText = `Total Issues - ${updatedSourceCount}`

}

function ExportBoardBackupJSON(){

    const filename = 'boardbackup';
    const blob = new Blob([JSON.stringify(localStorage)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
    // copy(`Object.entries(${JSON.stringify(localStorage)})
    // .forEach(([k,v])=>localStorage.setItem(k,v))`)
};

function ImportBoardBackup(){

    const filename = 'boardbackup';
    const blob = new Blob([JSON.stringify(localStorage)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);

};
