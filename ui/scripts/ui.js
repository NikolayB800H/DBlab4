import { getClientApplications, removeApplication, getClientApplicationsCount } from "./application.js";
import { boolType } from "./tables-poperties.js";

export function setElementVisible(element, visible) {
    for (let i = 0; i < element.length; i++) {
        element[i].isDisplay = visible[i]
    }
    element[0].parent.unrender()
    element[0].parent.render()
}

export async function showApplicationsList(clientId, exclude, include, types, fields) {
    let activeCol = null;
    let activeSearch = null;
    let sortWay = "";
    let activeSort = null;
    let searchBar = null;
    let searchBarParent = null;
    let applications = null;
    let sorts = [];
    let searches = [];
    let cols = [];
    let searchValue = "";
    let pagesCount = 0;
    let rowsPerPage = 6;
    let pageNow = 1;
    let pageBtns = [];
    const applicationsList = document.getElementById('applicationsList');
    const applicationsHeader = document.getElementById('applicationsHeader');
    const paginationList = document.getElementById('pagination-list');
    const paginationPrev = document.getElementById('pagination-previous');
    const paginationNext = document.getElementById('pagination-next');
    if (applicationsList === null || applicationsHeader === null || paginationList === null) {
        return;
    }
    applicationsHeader.replaceChildren();
    
    /*async function checkboxChanged(e) {
        const applicationId = parseInt(e.target.name);

        await setApplicationDone(applicationId, e.target.checked);
        await showApplicationsList(clientId, exclude, include, types);
    }*/
    async function loadList() {
        let searchCol = (activeSearch === null || searchValue == "") ? "" : fields[activeSearch];
        let sortCol = (activeSort === null) ? "" : fields[activeSort];
        let recordCounter = 0;
        let recordPrevElem;
        applicationsList.replaceChildren();
        for (; recordCounter < rowsPerPage; ++recordCounter) {
            const applicationNode = document.createElement('tr');
            let counter = 0;
            let prevElemTd;
            for (let i in include) {
                const elemTd = document.createElement('td');
                const elem = document.createElement('div');
                elem.innerHTML = "⠀";
                elemTd.appendChild(elem);
                elemTd.onmouseover = login.bind(elemTd, cols[counter]);
                elemTd.onmouseout = logout.bind(elemTd, cols[counter]);
                if (counter == 0) {
                    applicationNode.insertBefore(elemTd, applicationNode.lastChild);
                } else {
                    applicationNode.insertBefore(elemTd, prevElemTd.nextSibling);
                }
                ++counter;
                prevElemTd = elemTd;
            }
            if (recordCounter == 0) {
                applicationsList.insertBefore(applicationNode, applicationsList.lastChild);
            } else {
                applicationsList.insertBefore(applicationNode, recordPrevElem.nextSibling);
            }
            recordPrevElem = applicationNode;
        }
        //applicationsList.focus();
        pagesCount = await getClientApplicationsCount(
            clientId,
            searchCol,
            searchValue
        );
        //applicationsList.focus();
        pagesCount = Math.ceil(pagesCount / rowsPerPage);
        applications = await getClientApplications(
            clientId,
            searchCol,
            searchValue,
            sortCol,
            sortWay,
            rowsPerPage,
            pageNow * rowsPerPage - rowsPerPage
        );
        //applicationsList.focus();
        setTimeout(function() {
        if (pageNow === 1) {
            paginationPrev.classList.add("is-disabled");
        } else {
            paginationPrev.classList.remove("is-disabled");
        }
        if (pageNow === pagesCount) {
            paginationNext.classList.add("is-disabled");
        } else {
            paginationNext.classList.remove("is-disabled");
        }

        recordCounter = 0;
        let applicationNode = applicationsList.firstChild;
        for (const application of applications) {
            //console.log(application);
            let elemTd = applicationNode.firstChild;
            let counter = 0;
            for (let [key, val] of Object.entries(application)) {
                if (!exclude.includes(key)) {
                    if (types[counter] == "datetime") {
                        val = (new Date(val).toLocaleString('en-GB', {timeZone:'UTC'}));
                    }
                    const elem = elemTd.firstChild;
                    elem.innerHTML = `${val}`;
                    /*let updater = document.createElement('a');
                    updater.innerHTML = "⠀";
                    elem.appendChild(updater);
                    elem.removeChild(updater);*/
                    elemTd = elemTd.nextSibling;
                    ++counter;
                }
            }
            
            const rowButtons = document.createElement('div');
            rowButtons.id = `row-buttons-${recordCounter}`;
            rowButtons.style = "visibility: hidden;";
            //rowButtons.classList.add("is-hidden");
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = "✖";
            deleteButton.title = "Удалить запись";
            deleteButton.name = application.id;
            deleteButton.id = `delete-${recordCounter}`;
            deleteButton.type = "button";
            deleteButton.style = "margin-left: 6px";
            deleteButton.classList.add("button");
            deleteButton.classList.add("is-dark");
            deleteButton.onclick = deleteClicked

            const editButton = document.createElement('button');
            editButton.textContent = "✎";
            editButton.title = "Изменить запись";
            editButton.id = "delete-" + recordCounter;
            editButton.type = "button";
            editButton.style = "margin-left: 6px";
            editButton.classList.add("button");
            editButton.classList.add("is-dark");
            editButton.onclick = logclick.bind(editButton, `edit-${recordCounter}`);

            rowButtons.insertBefore(deleteButton, rowButtons.lastChild);
            rowButtons.insertBefore(editButton, deleteButton);

            applicationNode.insertBefore(rowButtons, applicationNode.lastChild.nextSibling);
            
            applicationNode.onmouseover = login.bind(applicationNode, rowButtons);
            applicationNode.onmouseout = logout.bind(applicationNode, rowButtons);
            /*if (recordCounter == 0) {
                applicationsList.insertBefore(applicationNode, applicationsList.lastChild);
            } else {
                applicationsList.insertBefore(applicationNode, recordPrevElem.nextSibling);
            }*/
            ++recordCounter;
            //recordPrevElem = applicationNode;
            applicationNode = applicationNode.nextSibling;
        }
        //applicationsList.classList.add("is-hidden");
        //applicationsList.classList.remove("is-hidden");
        pageBtns = [];
        paginationList.replaceChildren();
        for (let i = 1; i <= pagesCount; i++) {
            const pageNode = document.createElement('li');
            const pageBtn = document.createElement('a');
            pageBtn.classList.add("pagination-link");
            pageBtn.classList.add("button");
            pageBtn.innerHTML = `${i}`;
            pageBtn.addEventListener("click", async function(event) {
                let now = Number(event.target.innerHTML);
                pageBtns[pageNow - 1].classList.remove("is-dark");
                pageNow = now;
                await loadList();
                //pageBtns[0].classList.add("is-dark");
            });
            pageBtns.push(pageBtn);
            pageNode.appendChild(pageBtn);
            paginationList.appendChild(pageNode);
        }
        pageBtns[pageNow - 1].classList.add("is-dark");
        //console.log("done");
        }, 50);
    }

    async function deleteClicked(e) {
        const applicationId = parseInt(e.target.name);
        await removeApplication(applicationId);
        await loadList();
        //await showApplicationsList(clientId, exclude, include, types, fields);
    }

    function login(num) {
        //num.classList.remove("is-hidden");
        num.style.visibility = "visible";
        searchBarUpdate();
    }

    function logout(num) {
        if (num.id != activeCol) {
            //num.classList.add("is-hidden");
            num.style.visibility = "hidden";
            searchBarUpdate();
        }
    }

    function logclick(num) {
        console.log(num)
    }

    async function butClick(i) {
        i.blur()
        switch(types[i.name]) {
            case "string":
                searchValue = "LIKE '"+i.value+"%'";
                break;
            case "bool":
                //searchValue = "= "+i.value.toUpperCase()+"";
                let valu = document.querySelector('input[name="bar-choice"]:checked');
                if (valu === null) {
                    searchValue = "";
                } else {
                    searchValue = `= ${valu.value.toUpperCase()}`;
                }
                break;
            default:
                searchValue = "";
        }
        pageNow = 1;
        await loadList();
    }

    function serchBarShow(num) {
        let i = document.createElement('div');
        i.id = "search-bar";
        i.name = num;
        i.classList.add("card");
        i.style = "padding: 0px !important; height: 26px; width:240px";
        let bar;
        switch(types[i.name]) {
            case "string":
                i.style.width = "225px";
                bar = document.createElement('input');
                bar.type = "text";
                bar.name = num;
                bar.style = "margin-left: 6px; padding: 0px !important; height: 26px; display: inline-block;";
                break;
            case "bool":
                bar = document.createElement('div');
                bar.name = num;
                bar.style = "margin-left: 6px;";

                let len = 0;
                boolType.forEach(element => {
                    len += element.length + 1.8;

                    let varBut = document.createElement('input');
                    varBut.type = "radio";
                    varBut.id = `radio-${num}-${element}`;
                    varBut.name = "bar-choice";
                    varBut.value = element;
                    bar.appendChild(varBut);

                    let varButLabel = document.createElement('label');
                    varButLabel.for = "bar-choice";
                    varButLabel.textContent = element;
                    bar.appendChild(varButLabel);
                });
                i.style.width = 48 + 8 * len + "px";
                /*
                let trueBut = document.createElement('input');
                trueBut.type = "radio";
                trueBut.id = `radio-${num.name}-true`;
                trueBut.name = "bar-choice";
                trueBut.value = "true";
                bar.appendChild(trueBut);

                let trueButLabel = document.createElement('label');
                trueButLabel.for = "bar-choice";
                trueButLabel.textContent = "true";
                bar.appendChild(trueButLabel);

                let falseBut = document.createElement('input');
                falseBut.type = "radio";
                falseBut.id = `radio-${num.name}-false`;
                falseBut.name = "bar-choice";
                falseBut.value = "false";
                bar.appendChild(falseBut);

                let falseButLabel = document.createElement('label');
                falseButLabel.for = "bar-choice";
                falseButLabel.textContent = "false";
                bar.appendChild(falseButLabel);*/
                break;
            default:
                console.log("Bad type!");
        }
        let but = document.createElement('button');
        but.type = "button";
        but.name = num;
        but.textContent = "➟";
        but.style = "padding: 0px !important; width: 36px; height: 24px; margin-right: 6px; display: inline; float: right; position: absolute; top: 0; right: 0px;"
        but.classList.add("button");
        but.classList.add("is-rounded");
        but.classList.add("is-dark");
        but.onclick = butClick.bind(but, bar);
        i.appendChild(bar);
        i.appendChild(but);

        i.style.position = 'absolute';
        i.style.left = searches[num].offsetLeft + 'px';
        i.style.top = searches[num].offsetTop + 24 + 'px';
        
        cols[num].appendChild(i);
        searchBar = i;
        searchBarParent = cols[num];
        /*i.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                //console.log("search"+i.value)
                i.blur()
                switch(types[i.name]) {
                    case "string":
                        searchValue = "LIKE '"+i.value+"%'";
                        break;
                    case "bool":
                        searchValue = "= "+i.value.toUpperCase()+"";
                        break;
                    default:
                        searchValue = "";
                }
                loadList();
            }
        })*/
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
                    activeSearch = null;
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
                        //cols[i].classList.add("is-hidden");
                        cols[i].style.visibility = "hidden";
                    }
                }
                serchBarRemove();
                serchBarShow(num.name);
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
        //console.log(`do search by${activeSearch} with sort by${activeSort} ${sortWay}`);
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
                    /*if (searchValue != "") {
                        await loadList();
                    }*/
                }
                num.textContent = "▼";
                activeCol = cols[num.name].id;
                pageNow = 1;
                await loadList();
                for (let i = 0; i < cols.length; ++i) {
                    if (i != num.name) {
                        sorts[i].textContent = "•";
                        searches[i].textContent = "🔍";
                        //cols[i].classList.add("is-hidden");
                        cols[i].style.visibility = "hidden";
                    }
                }
        }
        //console.log(`do search by${activeSearch} with sort by${activeSort} ${sortWay}`);
    }

    paginationPrev.addEventListener("click", async function (event) {
        if (pageNow === 1) return;
        --pageNow;
        await loadList();
    });
    paginationNext.addEventListener("click", async function (event) {
        if (pageNow === pagesCount) return;
        ++pageNow;
        await loadList();
    });

    let counterTh = 0;
    let prevElemTh;
    include.forEach(element => {
        const elemTh = document.createElement('th');
        elemTh.innerHTML = element;
        const colButtons = document.createElement('div');
        colButtons.id = `col-buttons-${counterTh}`;
        colButtons.style = "display: inline; visibility: hidden;";
        //colButtons.classList.add("is-hidden");

        const sortButton = document.createElement('button');
        sortButton.textContent = "•";
        sortButton.title = "Сортировка";
        sortButton.id = `sort-${include[counterTh]}`;
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
        searchButton.id = `search-${include[counterTh]}`;
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
            applicationsHeader.insertBefore(elemTh, applicationsHeader.lastChild);
        } else {
            applicationsHeader.insertBefore(elemTh, prevElemTh.nextSibling);
        }
        elemTh.onmouseover = login.bind(elemTh, colButtons);
        elemTh.onmouseout = logout.bind(elemTh, colButtons);
        ++counterTh;
        prevElemTh = elemTh;
    });

    await loadList();
}
