import { HeaderComponent } from "../../components/header/index.js";
import { TableApplicationsComponent } from "../../components/table-applications/index.js";
import { AddApplicationComponent } from "../../components/add-application/index.js";
import { main } from "../../main.js";
import { showContentList } from "../../ui.js";
import { applicationTable } from "../../tables-poperties.js";

export class ApplicationsPage {
    constructor(parent) {
        this.parent = parent;
        this.headerComponent = new HeaderComponent(this, true)
        this.addApplicationComponent = new AddApplicationComponent(this, true, applicationTable);
        this.tableApplicationsComponent = new TableApplicationsComponent(this, true);
    }

    getHTML() {
        return (
            `
            <form id="applications-page" class="container">
                <div id="page-body" class="box"></div>
            </form>
            `
        )
    }

    get root() {
        return document.getElementById('applications-page')
    }

    get body() {
        return document.getElementById('page-body')
    }

    unrender() {
        this.parent.removeChild(this.root)
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        this.headerComponent.render();
        this.addApplicationComponent.render();
        this.tableApplicationsComponent.render();
        showContentList(main.user, applicationTable);
    }
}