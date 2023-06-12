import { HeaderComponent } from "../../components/header/index.js";
import { TableComponent } from "../../components/table/index.js";
import { AddRecordComponent } from "../../components/add-record/index.js";
import { applicationTable } from "../../tables-poperties.js";

export class ApplicationsPage {
    constructor(parent) {
        this.parent = parent;
        this.id = "applications-page";
        this.properties = applicationTable;
        this.headerComponent = new HeaderComponent(this, true)
        this.addRecordComponent = new AddRecordComponent(this, true, this.properties);
        this.tableComponent = new TableComponent(this, true, this.properties);
    }

    getHTML() {
        return (
            `
            <form id="${this.id}" class="container">
                <div id="page-body" class="box"></div>
            </form>
            `
        )
    }

    get root() {
        return document.getElementById(this.id)
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
        this.addRecordComponent.render();
        this.tableComponent.render();
    }
}
