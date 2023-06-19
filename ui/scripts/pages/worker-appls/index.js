import { HeaderComponent } from "../../components/header/index.js";
import { TableComponent } from "../../components/table/index.js";
import { workerApplicationsTable } from "../../tables-poperties.js";
import { main } from "../../main.js";

export class WorkerApplicationsPage {
    constructor(parent) {
        this.parent = parent;
        this.id = "worker-appls-page";
        this.properties = workerApplicationsTable;
        this.headerComponent = new HeaderComponent(this, true);
        this.tableComponent = new TableComponent(this, true, this.properties);
    }

    getHTML() {
        return (
            `
            <form id="${this.id}" class="container is-fluid">
                <div id="page-body" class="box"></div>
            </form>
            `
        )
    }

    get root() {
        return document.getElementById(this.id);
    }

    get body() {
        return document.getElementById('page-body');
    }

    unrender() {
        this.parent.removeChild(this.root);
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        this.headerComponent.render();
        this.properties.queryArgs[0] = main.activeService;
        this.tableComponent.render();
    }
}
