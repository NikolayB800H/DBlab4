import { HelloPage } from "../../pages/hello/index.js";
import { ProjectPage } from "../../pages/project/index.js";
import { TrueHelloPage } from "../../pages/true-hello/index.js";
import { RegistrationPage } from "../../pages/registration/index.js";
import { ApplicationsPage } from "../../pages/applications/index.js";
import { CircleDiagramPage } from "../../pages/circle-diagram/index.js";
import { main } from "../../main.js";

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
            <section id="header-section" class="section">
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
                    <div class="navbar-start">
                        <a id="goto-applications" class="navbar-item">
                            <strong>Заявления</strong>
                        </a>
                        <a id="goto-circle-diagram" class="navbar-item">
                            <strong>Статистика</strong>
                        </a>
                        <a id="goto-project" class="navbar-item">
                            <strong>Проект</strong>
                        </a>
                    </div>
                    <div class="navbar-end">
                        <div class="navbar-item">
                            <div class="buttons">
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
            const html = this.getHTML();
            this.parent.root.insertAdjacentHTML('afterbegin', html)
            this.gotoProject = document.getElementById('goto-project');
            this.gotoHello = document.getElementById('goto-hello');
            this.gotoTrueHello1 = document.getElementById('goto-true-hello-1');
            this.gotoTrueHello2 = document.getElementById('goto-true-hello-2');
            this.gotoRegistration = document.getElementById('goto-registration');
            this.gotoApplications = document.getElementById('goto-applications');
            this.gotoCircleDiagram = document.getElementById('goto-circle-diagram');
            if (main.user === null) {
                this.gotoTrueHello2.classList.add("is-hidden");
                this.gotoApplications.classList.add("is-hidden");
                this.gotoCircleDiagram.classList.add("is-hidden");
            } else {
                if (main.isWorker) {
                    this.gotoApplications.classList.add("is-hidden");
                } else {
                    this.gotoCircleDiagram.classList.add("is-hidden");
                }
                this.gotoRegistration.classList.add("is-hidden");
                this.gotoHello.classList.add("is-hidden");
                this.gotoTrueHello2.onclick = this.signoutEvent.bind(this.gotoTrueHello2);
            }
            if (this.parent.constructor === HelloPage) {
                this.gotoHello.classList.add("is-hidden");
            } else {
                this.gotoHello.onclick = this.onClick.bind(HelloPage);
            }
            if (this.parent.constructor === ProjectPage) {
                this.gotoProject.classList.add("is-active");
            } else {
                this.gotoProject.onclick = this.onClick.bind(ProjectPage);
            }
            if (this.parent.constructor === TrueHelloPage) {
                this.gotoTrueHello1.classList.add("is-active");
            } else {
                this.gotoTrueHello1.onclick = this.onClick.bind(TrueHelloPage);
            }
            if (this.parent.constructor === RegistrationPage) {
                this.gotoRegistration.classList.add("is-hidden");
            } else {
                this.gotoRegistration.onclick = this.onClick.bind(RegistrationPage);
            }
            if (this.parent.constructor === ApplicationsPage) {
                this.gotoApplications.classList.add("is-active");
            } else {
                this.gotoApplications.onclick = this.onClick.bind(ApplicationsPage);
            }
            if (this.parent.constructor === CircleDiagramPage) {
                this.gotoCircleDiagram.classList.add("is-active");
            } else {
                this.gotoCircleDiagram.onclick = this.onClick.bind(CircleDiagramPage);
            }
        }
    }
}
