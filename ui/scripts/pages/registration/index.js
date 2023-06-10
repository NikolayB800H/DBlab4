import { HeaderComponent } from "../../components/header/index.js";
import { RegisterComponent } from "../../components/register/index.js";
import { StatusComponent } from "../../components/status/index.js";

export class RegistrationPage {
    constructor(parent) {
        this.parent = parent;
        this.headerComponent = new HeaderComponent(this, true);
        this.statusComponent = new StatusComponent(this, false);
        this.registerComponent = new RegisterComponent(this, true, this.statusComponent);
    }

    getHTML() {
        return (
            `
            <form id="registration-page" class="container">
                <div id="page-body" class="box"></div>
            </form>
            `
        )
    }

    get root() {
        return document.getElementById('registration-page')
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
        this.registerComponent.render()
        this.statusComponent.render()
    }
}