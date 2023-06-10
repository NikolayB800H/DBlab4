import { HeaderComponent } from "../../components/header/index.js";
import { HelloSomebodyComponent } from "../../components/hello-somebody/index.js";

export class TrueHelloPage {
    constructor(parent) {
        this.parent = parent;
        this.headerComponent = new HeaderComponent(this, true)
        this.helloSomebodyComponent = new HelloSomebodyComponent(this, true);
    }

    getHTML() {
        return (
            `
            <form id="true-hello-page" class="container">
                <div id="page-body" class="box"></div>
            </form>
            `
        )
    }

    get root() {
        return document.getElementById('true-hello-page')
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
        this.helloSomebodyComponent.render()
    }
}