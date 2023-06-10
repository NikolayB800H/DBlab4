import { HeaderComponent } from "../../components/header/index.js";
import { DiagramComponent } from "../../components/diagram/index.js";

export class CircleDiagramPage {
    constructor(parent) {
        this.parent = parent;
        this.headerComponent = new HeaderComponent(this, true)
        this.diagramComponent = new DiagramComponent(this, true);
    }

    getHTML() {
        return (
            `
            <form id="circle-diagram-page" class="container">
                <div id="page-body" class="box"></div>
            </form>
            `
        )
    }

    get root() {
        return document.getElementById('circle-diagram-page')
    }

    get body() {
        return document.getElementById('page-body')
    }

    unrender() {
        this.parent.removeChild(this.root)
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        this.headerComponent.render()
        this.diagramComponent.render()
    }
}