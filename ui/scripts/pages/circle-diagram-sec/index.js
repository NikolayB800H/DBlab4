import { HeaderComponent } from "../../components/header/index.js";
import { DiagramComponent } from "../../components/diagram/index.js";
import { TableComponent } from "../../components/table/index.js";
import { circleDiagramSecTable } from "../../tables-poperties.js";

export class CircleDiagramSecPage {
    constructor(parent) {
        this.parent = parent;
        this.id = "diagram-sec-page";
        this.properties = circleDiagramSecTable;
        this.headerComponent = new HeaderComponent(this, true);
        this.diagramComponent = new DiagramComponent(this, true);
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

    async render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        this.headerComponent.render();
        this.tableComponent.render(this.diagramComponent.render)
    }
}