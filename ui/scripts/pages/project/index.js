import {HeaderComponent} from "../../components/header/index.js";
import {MadeByComponent} from "../../components/made-by/index.js";

export class ProjectPage {
    constructor(parent) {
        this.parent = parent;
        this.headerComponent = new HeaderComponent(this, true)
        this.madeByComponent = new MadeByComponent(this, true);
    }

    getHTML() {
        return (
            `
            <form id="project-page" class="container">
                <div id="page-body" class="box"></div>
            </form>
            `
        )
    }

    get root() {
        return document.getElementById('project-page')
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
        this.madeByComponent.render()
    }
}