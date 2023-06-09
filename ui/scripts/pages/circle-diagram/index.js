import { HeaderComponent } from "../../components/header/index.js";
import { DiagramComponent } from "../../components/diagram/index.js";
import { TableComponent } from "../../components/table/index.js";
import { circleDiagramTable } from "../../tables-poperties.js";
import { main } from "../../main.js";

export class CircleDiagramPage {
    constructor(parent) {
        this.parent = parent;
        this.id = "diagram-page";
        this.properties = circleDiagramTable;
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
        /*this.updater = */this.tableComponent.render(this.diagramComponent.render)
        /*function delay(time) {
            return new Promise(resolve => setTimeout(resolve, time));
        }*/
        /*this.diagramComponent.render(this.updater);*/
        /*delay(1000).then(() => {
            console.log(this.updater);
            
        });*/
        //console.log(this.updater)
        //this.updater = [['Клиент:1', 'Клиент:2', 'Клиент:3', 'Клиент:4', 'Клиент:5'], [1, 2, 3, 1, 1]]
        //this.tableComponent.render();
        /*this.diagUpdater([{
            series: main.ys,
            labels: main.xs
        }]);*/
    }
}