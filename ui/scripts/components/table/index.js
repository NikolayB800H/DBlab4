export class TableComponent {
    constructor(parent, isDisplay, properties) {
        this.parent = parent;
        this.isDisplay = isDisplay;
        this.properties = properties;
    }

    getHTML() {
        return (
            `
            <section class="section px-0">
            <div class="box" style="margin-bottom: -50px !important;">
                <h1 style="text-align: center; font-size: 30px;">
                    <strong>${this.properties.title}</strong>
                </h1>
                <br/>
                <div class="table-responsive table-container">
                    <table id="myTable" class="table is-bordered is-fullwidth">
                        <thead>
                            <tr id="${this.properties.headerId}">
                            </tr>
                        </thead>
                        <tbody id="${this.properties.listId}">
                        </tbody>
                    </table>
                </div>
                <nav class="pagination" role="navigation" aria-label="pagination" style="margin-top: 6px;">
                    <a id="pagination-previous" class="pagination-previous">Предыдущая</a>
                    <a id="pagination-next" class="pagination-next">Следущая</a>
                    <ul id="pagination-list" class="pagination-list">
                    </ul>
                </nav>
            </div>
            </section>
            `
        )
    }

    async showContentList(properties, callback) { // omagad
        let updater = [[], []];
        let activeCol = null;
        let activeSearch = null;
        let sortWay = "";
        let activeSort = null;
        let searchBar = null;
        let searchBarParent = null;
        let contentRecords = null;
        let sorts = [];
        let searches = [];
        let cols = [];
        let searchValue = "";
        let pagesCount = 0;
        let rowsPerPage = 6; // should be in properties, but i dont want
        let pageNow = 1;
        let pageBtns = [];
        let blockChoice = false;
        let matrix = null;
        let undoChange = [];
        const recordsList = document.getElementById(properties.listId);
        const recordsHeader = document.getElementById(properties.headerId);
        const paginationList = document.getElementById('pagination-list');
        const paginationPrev = document.getElementById('pagination-previous');
        const paginationNext = document.getElementById('pagination-next');
        const bodyp = document.getElementById("page-body");
        const helper =  document.createElement('div');
        helper.id = "helper";
        bodyp.appendChild(helper);
        if (recordsList === null || recordsHeader === null || paginationList === null) {
            return null;
        }
        recordsHeader.replaceChildren();
    
        /*function delay(time) {
            return new Promise(resolve => setTimeout(resolve, time));
        }*/

        async function loadList() {
            let searchCol = (activeSearch === null || searchValue == "") ? "" : properties.fields[activeSearch];
            let sortCol = (activeSort === null) ? "" : properties.fields[activeSort];
            let recordCounter = 0;
            let recordPrevElem;
            recordsList.replaceChildren();
            for (; recordCounter < rowsPerPage; ++recordCounter) {
                const recordNode = document.createElement('tr');
                recordNode.replaceChildren();
                let counter = 0;
                let prevElemTd;
                for (let i in properties.include) {
                    const elemTd = document.createElement('td');
                    const elem = document.createElement('div');
                    elem.innerHTML = "⠀";
                    elemTd.appendChild(elem);
                    elemTd.onmouseover = login.bind(elemTd, cols[counter]);
                    elemTd.onmouseout = logout.bind(elemTd, cols[counter]);
                    if (counter == 0) {
                        recordNode.insertBefore(elemTd, recordNode.lastChild);
                    } else {
                        recordNode.insertBefore(elemTd, prevElemTd.nextSibling);
                    }
                    ++counter;
                    prevElemTd = elemTd;
                }
                if (recordCounter == 0) {
                    recordsList.insertBefore(recordNode, recordsList.lastChild);
                } else {
                    recordsList.insertBefore(recordNode, recordPrevElem.nextSibling);
                }
                recordPrevElem = recordNode;
            }
            pagesCount = await properties.counter(
                (properties.isGeneric ? searchCol : searchCol.replace(/_/, '.')),
                searchValue,
                ...properties.queryArgs
            );
            //console.log(pagesCount);
            pagesCount = Math.ceil(pagesCount / rowsPerPage);
            contentRecords = await properties.loader(
                (properties.isGeneric ? searchCol : searchCol.replace(/_/, '.')),
                searchValue,
                (properties.isGeneric ? sortCol : sortCol.replace(/_/, '.')),
                sortWay,
                rowsPerPage,
                pageNow * rowsPerPage - rowsPerPage,
                ...properties.queryArgs
            );
            //console.log(contentRecords);
            setTimeout(function() {
            if (pageNow === 1) {
                paginationPrev.classList.add("is-disabled");
            } else {
                paginationPrev.classList.remove("is-disabled");
            }
            if (pageNow >= pagesCount) {
                paginationNext.classList.add("is-disabled");
            } else {
                paginationNext.classList.remove("is-disabled");
            }
    
            recordCounter = 0;
            let recordNode = recordsList.firstChild;
            matrix = [];
            updater = [[], []];
            
            //console.log("0: ", updater)
            for (const contentRecord of contentRecords) {
                let elemTd;
                let joinedId;
                let matrixRow = new Array(properties.fields.length);
                for (let [key, val] of Object.entries(contentRecord)) {
                    if (key == `${properties.slave}_id`) joinedId = val;
                    if (properties.fields.includes(key)) {
                        let i = properties.fields.indexOf(key);
                        if (i < 2) {
                            updater[i].push(val);
                            //console.log(`${i}:`, updater)
                        }
                        elemTd = recordNode.children[i];
                        //elemTd.style.maxWidth = Math.ceil(1350/properties.fields.length) + "px";
                        if (properties.types[i] == "datetime") {
                            val = (new Date(val).toLocaleString('en-GB', {timeZone:'UTC'}));
                        }
                        const elem = elemTd.firstChild;
                        elem.innerHTML = `${val}`;
                        matrixRow[i] = elem;
                    }
                }
                matrix.push(matrixRow);
                
                if (properties.isEditable) {
                    const rowButtons = document.createElement('div');
                    rowButtons.id = `row-buttons-${recordCounter}`;
                    rowButtons.style = "visibility: hidden;";
                    
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = "✖";
                    deleteButton.title = "Удалить запись";
                    deleteButton.name = joinedId;
                    deleteButton.id = `delete-${recordCounter}`;
                    deleteButton.type = "button";
                    deleteButton.style = "margin-left: 6px";
                    deleteButton.classList.add("button");
                    deleteButton.classList.add("is-dark");
        
                    const editButton = document.createElement('button');
                    editButton.textContent = "✎";
                    editButton.title = "Изменить запись";
                    editButton.name = joinedId;
                    editButton.id = `edit-${recordCounter}`;
                    editButton.type = "button";
                    editButton.style = "margin-left: 6px";
                    editButton.classList.add("button");
                    editButton.classList.add("is-dark");
        
                    deleteButton.onclick = deleteClicked.bind(deleteButton, editButton, deleteButton);
                    editButton.onclick = logclick.bind(editButton, editButton, deleteButton);
        
                    rowButtons.insertBefore(deleteButton, rowButtons.lastChild);
                    rowButtons.insertBefore(editButton, deleteButton);
                    recordNode.insertBefore(rowButtons, recordNode.lastChild.nextSibling);
                    
                    recordNode.onmouseover = login.bind(recordNode, rowButtons);
                    recordNode.onmouseout = logout.bind(recordNode, rowButtons);
                }
                ++recordCounter;
                recordNode = recordNode.nextSibling;
            }
            setTimeout(function() {
            if (properties.isGeneric) {
                callback(updater);
            }
            }, 100);
            pageBtns = [];
            paginationList.replaceChildren();
            for (let i = 1; i <= pagesCount; i++) {
                const pageNode = document.createElement('li');
                const pageBtn = document.createElement('a');
                pageBtn.classList.add("pagination-link");
                pageBtn.classList.add("button");
                pageBtn.innerHTML = `${i}`;
                pageBtn.addEventListener("click", async function(event) {
                    if (blockChoice) return;
                    let now = Number(event.target.innerHTML);
                    pageBtns[pageNow - 1].classList.remove("is-dark");
                    pageNow = now;
                    await loadList();
                });
                pageBtns.push(pageBtn);
                pageNode.appendChild(pageBtn);
                paginationList.appendChild(pageNode);
            }
            if (pageBtns.length > 0) pageBtns[pageNow - 1].classList.add("is-dark");
            }, 100);
            //console.log("AAA",updater);
            /*delay(1000).then(() => {
                console.log(this.updater);
                this.diagramComponent.render(this.updater);
            });*/
            //return updater;
        }
    
        function exitChange(num, editBtn, deleteBtn) {
            editBtn.textContent = "✎";
            editBtn.title = "Изменить запись";
            deleteBtn.textContent = "✖";
            deleteBtn.title = "Удалить запись";
            blockChoice = false;
            matrix[num].forEach(element => {
                element.removeChild(element.lastChild);
            });
        }
    
        async function deleteClicked(editBtn, deleteBtn) {
            if (matrix === null) return;
            let num = parseInt(editBtn.id.split('-')[1]);
            if (isNaN(num)) return;
            if (matrix[num] === null) return;
            switch(deleteBtn.textContent) {
                case "✖":
                    const recordId = parseInt(deleteBtn.name);
                    await properties.remover(recordId);
                    await loadList();
                    break;
                case "🚫":
                    for (let i = 0; i < properties.types.length; ++i) {
                        matrix[num][i].firstChild.nodeValue = undoChange[i];
                    }
                    exitChange(num, editBtn, deleteBtn);
                    break;
                default:
                    console.log("Bad delete!");
            }
        }
    
        function login(num) {
            if (blockChoice) return;
            num.style.visibility = "visible";
            searchBarUpdate();
        }
    
        function logout(num) {
            if (blockChoice) return;
            if (num.id != activeCol) {
                num.style.visibility = "hidden";
                searchBarUpdate();
            }
        }
    
        function changeClick(i) {
            i.blur()
            let changeValue = properties.getters[i.name](i);
            if (changeValue === null) return;
            i.parentNode.parentNode.firstChild.nodeValue = changeValue;
        }
    
        async function saveChanges(id, values) {
            let args = [];
            for (let i = 0; i < properties.froms.length; ++i) {
                args.push(properties.froms[i](values[i]));
            }
            const changedId = await properties.changer(id, ...args);
            await loadList();
        }
    
        function logclick(editBtn, deleteBtn) {
            if (matrix === null) return;
            let num = parseInt(editBtn.id.split('-')[1]);
            if (isNaN(num)) return;
            if (matrix[num] === null) return;
            switch(editBtn.textContent) {
                case "✎":
                    editBtn.textContent = "✅";
                    editBtn.title = "Сохранить изменения";
                    deleteBtn.textContent = "🚫";
                    deleteBtn.title = "Отменить изменения";
                    blockChoice = true;
                    undoChange = [];
                    for (let i = 0; i < properties.types.length; ++i) {
                        undoChange.push(matrix[num][i].firstChild.nodeValue);
                        barShow(i, matrix[num], matrix[num], "change", changeClick);
                    }
                    break;
                case "✅":
                    let toSave = [];
                    matrix[num].forEach(element => {
                        toSave.push(element.firstChild.nodeValue);
                    });
                    saveChanges(parseInt(editBtn.name), toSave);
                    exitChange(num, editBtn, deleteBtn);
                    break;
                default:
                    console.log("Bad change!");
            }
        }
    
        async function butClick(i) {
            i.blur()
            searchValue = properties.getters[i.name](i);
            if (searchValue === null) return;
            searchValue = properties.searchers[i.name](searchValue);
            pageNow = 1;
            await loadList();
        }
    
        function barShow(num, line, inlineBtns, prefix, eventClick) {
            let i = document.createElement('div');
            i.id = `${prefix}-bar`;
            i.name = num;
            i.classList.add("card");
            i.style = "padding: 0px !important; height: 26px; width:240px";
            let bar = properties.setters[i.name](i, prefix);
            bar.style = "margin-left: 6px;";
            properties.stylers[i.name](bar);
            let but = document.createElement('button');
            but.type = "button";
            but.name = num;
            but.textContent = "➟";
            but.style = "padding: 0px !important; width: 36px; height: 24px; margin-right: 6px; display: inline; float: right; position: absolute; top: 0; right: 0px;"
            but.classList.add("button");
            but.classList.add("is-rounded");
            but.classList.add("is-dark");
            but.onclick = eventClick.bind(but, bar);
            i.appendChild(bar);
            i.appendChild(but);
            i.style.left = inlineBtns[num].offsetLeft + 'px';
            i.style.top = inlineBtns[num].offsetTop + 24 + 'px';
            line[num].appendChild(i);
            if (prefix == "search") {
                i.style.position = 'absolute';
                searchBar = i;
                searchBarParent = line[num];
            } else if (prefix == "change") {
                i.style.top = inlineBtns[num].offsetTop - 6 + 'px';
            }
        }
    
        function serchBarRemove() {
            if (searchBar === null) {
                return;
            }
            searchBarParent.removeChild(searchBar);
            searchBarParent = null;
            searchBar = null;
        }
    
        function searchBarUpdate() {
            if (searchBar === null) {
                return;
            }
            searchBar.style.left = searches[searchBar.name].offsetLeft + 'px';
            searchBar.style.top = searches[searchBar.name].offsetTop + 24 + 'px';
        }
    
        async function searchClick(num) {
            let tmp = Number(num.name);
            switch (num.textContent) {
                case "🔍":
                    let toDo = false;
                    if (activeSearch !== null & searchValue != "" & tmp !== activeSearch) {
                        searchValue = "";
                        toDo = true;
                    }
                    activeSearch = tmp;
                    if (activeSort !== null & tmp !== activeSort) {
                        activeSort = null;
                        sortWay = "";
                        toDo = true;
                    }
                    if (toDo) {
                        pageNow = 1;
                        await loadList();
                    }
                    num.textContent = "✖🔍";
                    activeCol = cols[tmp].id;
                    for (let i = 0; i < cols.length; ++i) {
                        if (i !== tmp) {
                            sorts[i].textContent = "•";
                            searches[i].textContent = "🔍";
                            cols[i].style.visibility = "hidden";
                        }
                    }
                    serchBarRemove();
                    barShow(num.name, cols, searches, "search", butClick);
                    break;
                default:
                    activeSearch = null;
                    serchBarRemove();
                    num.textContent = "🔍";
                    if (sorts[tmp].textContent == "•") {
                        activeCol = null;
                    }
                    if (searchValue != "" || sortWay != "") {
                        searchValue = "";
                        pageNow = 1;
                        await loadList();
                    }
            }
        }
    
        async function sortClick(num) {
            let tmp = Number(num.name);
            switch (num.textContent) {
                case "▼":
                    sortWay = "ASC";
                    num.textContent = "▲";
                    pageNow = 1;
                    await loadList();
                    break;
                case "▲":
                    sortWay = "";
                    activeSort = null;
                    num.textContent = "•";
                    if (searches[num.name].textContent == "🔍") {
                        activeCol = null;
                    }
                    pageNow = 1;
                    await loadList();
                    break;
                default:
                    sortWay = "DESC";
                    activeSort = tmp;
                    if (tmp !== activeSearch) {
                        activeSearch = null;
                        serchBarRemove();
                        searchValue = "";
                    }
                    num.textContent = "▼";
                    activeCol = cols[num.name].id;
                    pageNow = 1;
                    await loadList();
                    for (let i = 0; i < cols.length; ++i) {
                        if (i != num.name) {
                            sorts[i].textContent = "•";
                            searches[i].textContent = "🔍";
                            cols[i].style.visibility = "hidden";
                        }
                    }
            }
        }
    
        paginationPrev.addEventListener("click", async function (event) {
            if (blockChoice) return;
            if (pageNow === 1) return;
            blockChoice = true;
            --pageNow;
            await loadList();
            blockChoice = false;
        });
        paginationNext.addEventListener("click", async function (event) {
            if (blockChoice) return;
            if (pageNow === pagesCount) return;
            blockChoice = true;
            ++pageNow;
            await loadList();
            blockChoice = false;
        });
    
        let counterTh = 0;
        let prevElemTh;
        properties.include.forEach(element => {
            const elemTh = document.createElement('th');
            elemTh.innerHTML = element;
            const colButtons = document.createElement('div');
            colButtons.id = `col-buttons-${counterTh}`;
            colButtons.style = "display: inline; visibility: hidden;";
    
            const sortButton = document.createElement('button');
            sortButton.textContent = "•";
            sortButton.title = "Сортировка";
            sortButton.id = `sort-${properties.include[counterTh]}`;
            sortButton.name = `${counterTh}`;
            sortButton.type = "button";
            sortButton.style = "width: 36px; height: 24px; margin-left: 6px"
            sortButton.classList.add("button");
            sortButton.classList.add("is-rounded");
            sortButton.classList.add("is-dark");
            sortButton.onclick = sortClick.bind(sortButton, sortButton);
            sorts.push(sortButton);
    
            const searchButton = document.createElement('button');
            searchButton.textContent = "🔍";
            searchButton.title = "Поиск";
            searchButton.id = `search-${properties.include[counterTh]}`;
            searchButton.name = `${counterTh}`;
            searchButton.type = "button";
            searchButton.style = "width: 36px; height: 24px; margin-left: 6px"
            searchButton.classList.add("button");
            searchButton.classList.add("is-rounded");
            searchButton.classList.add("is-dark");
            searchButton.onclick = searchClick.bind(searchButton, searchButton);
            searches.push(searchButton);
    
            colButtons.insertBefore(sortButton, colButtons.lastChild);
            colButtons.insertBefore(searchButton, sortButton);
            cols.push(colButtons);
    
            elemTh.insertBefore(colButtons, elemTh.nextSibling);
    
            if (counterTh === 0) {
                recordsHeader.insertBefore(elemTh, recordsHeader.lastChild);
            } else {
                recordsHeader.insertBefore(elemTh, prevElemTh.nextSibling);
            }
            elemTh.onmouseover = login.bind(elemTh, colButtons);
            elemTh.onmouseout = logout.bind(elemTh, colButtons);
            ++counterTh;
            prevElemTh = elemTh;
        });
    
        let ret = await loadList();
        //console.log(ret)
        //console.log("AAAAAA")
        //return ret;
    }

    /*async */render(callback) {
        if (this.isDisplay) {
            const html = this.getHTML()
            this.parent.body.insertAdjacentHTML('beforeend', html)
            /*return await */this.showContentList(this.properties, callback);
        }
    }
}
