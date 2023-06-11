import { HeaderComponent } from "../../components/header/index.js";
import { TableComponent } from "../../components/table/index.js";
import { AddApplicationComponent } from "../../components/add-application/index.js";
import { applicationTable } from "../../tables-poperties.js";

export class ApplicationsPage {
    constructor(parent) {
        this.parent = parent;
        this.properties = applicationTable;
        this.headerComponent = new HeaderComponent(this, true)
        this.addApplicationComponent = new AddApplicationComponent(this, true, this.properties);
        this.tableComponent = new TableComponent(this, true, this.properties);
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
        this.tableComponent.render();
    }
}