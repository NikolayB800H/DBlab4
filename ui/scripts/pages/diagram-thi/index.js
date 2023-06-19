import { HeaderComponent } from "../../components/header/index.js";
import { GraphComponent } from "../../components/graph/index.js";
import { TableComponent } from "../../components/table/index.js";
import { diagramThiTable } from "../../tables-poperties.js";

export class DiagramThiPage {
    constructor(parent) {
        this.parent = parent;
        this.id = "diagram-thi-page";
        this.properties = diagramThiTable;
        this.headerComponent = new HeaderComponent(this, true);
        this.graphComponent = new GraphComponent(this, true);
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
        this.tableComponent.render(this.graphComponent.render);
        /*
        const bodyp = document.getElementById("page-body");
        const helper =  document.createElement('div');
        helper.id = "helper";
        bodyp.appendChild(helper);
        this.graphComponent.render([["a", "b", "c"], [1.2, 1.1, 4.2]]); */
    }
}
