import { TrueHelloPage } from "../../pages/true-hello/index.js";
import { main } from "../../main.js";
import { rightAfterMain, PageProperties } from "../../pages-properties.js";

export class HeaderComponent {
    constructor(parent, isDisplay) {
        this.parent = parent;
        this.isDisplay = isDisplay;
    }

    async signoutEvent() {
        main.updateActiveNowWith(new TrueHelloPage(main.activeNow.parent));
        main.updateUserWith(null, null, null, null, null);
    }

    async onClick() {
        main.updateActiveNowWith(new this(main.activeNow.parent));
    }

    getHTML() {
        return (
            `
            <section id="header-section" class="section pb-0 mb-0">
            <nav class="navbar is-dark is-fixed-top" role="navigation" aria-label="main navigation">
                <div class="navbar-brand" style="display: flex !important; justify-content: left !important; align-items: left !important;">
                    <a id="goto-true-hello-1" class="navbar-item">
                        <img src="img/logo.png" width="30" height="30">
                    </a>
                    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" style="margin-left: 0 !important;">
                        <span aria-hidden="true"></span>
                    </a>
                </div>
                <div id="navbarBasicExample" class="navbar-menu" style="margin-left: 0 !important;">
                    <div id="navbar-start" class="navbar-start">
                        <a id="goto-applications" class="navbar-item">
                            <strong>Заявления</strong>
                        </a>
                        <a id="goto-circle-diagram" class="navbar-item">
                            <strong>Активность 1</strong>
                        </a>
                        <a id="goto-circle-diagram-sec" class="navbar-item">
                            <strong>Активность 2</strong>
                        </a>
                        <a id="goto-project" class="navbar-item">
                            <strong>Проект</strong>
                        </a>
                    </div>
                    <div class="navbar-end">
                        <div class="navbar-item">
                            <div id="navbar-end" class="buttons">
                                <a id="goto-true-hello-2" class="button is-light">
                                    <strong>Выход</strong>
                                </a>
                                <a id="goto-registration" class="button is-light">
                                    <strong>Регистрация</strong>
                                </a>
                                <a id="goto-hello" class="button is-light">
                                    <strong>Вход</strong>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            </section>
            `
        )
    }
    
    render() {
        if (this.isDisplay) {
            rightAfterMain();
            const html = this.getHTML();
            this.parent.root.insertAdjacentHTML('afterbegin', html);
            const startList = document.getElementById("navbar-start");
            startList.replaceChildren();
            const endList = document.getElementById("navbar-end");
            endList.replaceChildren();
            let buttons = [];
            let control = [];
            PageProperties.allPagesProperties.forEach(element => {
                const newBtn =  document.createElement('a');
                newBtn.id = `goto-${element.name}`;
                newBtn.innerHTML = `<strong>${element.btnLabel}</strong>`;
                if (element.buttonIsNavStart) {
                    buttons.push(newBtn);
                    newBtn.classList.add("navbar-item");
                    startList.appendChild(newBtn);
                } else {
                    control.push(newBtn);
                    newBtn.classList.add("button");
                    newBtn.classList.add("is-light");
                    endList.appendChild(newBtn);
                }
                if (this.parent.constructor === element.constructor & element.id != "true-hello-page") {
                    if (element.buttonIsNavStart) {
                        newBtn.classList.add("is-active");
                    } else {
                        newBtn.classList.add("is-hidden");
                    }
                } else {
                    if (element.id == "true-hello-page") {
                        newBtn.onclick = this.signoutEvent.bind(newBtn);
                    } else {
                        newBtn.onclick = this.onClick.bind(element.constructor);
                    }
                }
                if (main.user === null) {   // all
                    if (!element.isForAll) {
                        newBtn.classList.add("is-hidden");
                    }
                } else {
                    if (main.isWorker) {    // worker
                        if (!element.isForWorker) {
                            newBtn.classList.add("is-hidden");
                        }
                    } else {                // client
                        if (!element.isForClient) {
                            newBtn.classList.add("is-hidden");
                        }
                    }
                }
            });
            this.gotoTrueHello1 = document.getElementById('goto-true-hello-1');
            if (main.user === null) {
                control[2].classList.add("is-hidden");
            } else {
                control[1].classList.add("is-hidden");
                control[0].classList.add("is-hidden");
            }
            if (this.parent.constructor === TrueHelloPage) {
                this.gotoTrueHello1.classList.add("is-active");
            } else {
                this.gotoTrueHello1.onclick = this.onClick.bind(TrueHelloPage);
            }
        }
    }
}
