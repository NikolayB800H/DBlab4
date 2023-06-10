import {HeaderComponent} from "../../components/header/index.js";
import {LoginComponent} from "../../components/login/index.js";
import { StatusComponent } from "../../components/status/index.js";

export class HelloPage {
    constructor(parent) {
        this.parent = parent;
        this.headerComponent = new HeaderComponent(this, true)
        this.statusComponent = new StatusComponent(this, false);
        this.loginComponent = new LoginComponent(this, true, this.statusComponent)
    }

    getHTML() {
        return (
            `
            <form id="hello-page" class="container">
                <div id="page-body" class="box"></div>
            </form>
            `
        )
    }

    get root() {
        return document.getElementById('hello-page')
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
        this.loginComponent.render()
        this.statusComponent.render()
    }
}