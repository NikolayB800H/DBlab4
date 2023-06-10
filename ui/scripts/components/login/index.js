import { setElementVisible } from '../../ui.js';
import { TrueHelloPage } from '../../pages/true-hello/index.js';
import { tryLoginUser } from '../../user.js';
import { main } from '../../main.js';
import { getUserClient } from '../../client.js';
import { getUserWorker } from '../../worker.js';

export class LoginComponent {
    constructor(parent, isDisplay, statusComponent) {
        this.parent = parent;
        this.isDisplay = isDisplay;
        this.statusComponent = statusComponent;
    }

    async signInOnClick(statusComponent) {
        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;
        const maybeUser = await tryLoginUser(login, password);
        if (maybeUser == null) {
            setElementVisible(
                [statusComponent],
                [true           ]
            );
            return;
        } else {
            if (maybeUser.is_worker) {
                const maybeWorker = await getUserWorker(maybeUser.id);
                if (maybeWorker === null) {
                    setElementVisible(
                        [statusComponent],
                        [true           ]
                    );
                    return;
                } else {
                    main.updateUserWith(maybeUser.id, maybeUser.login, true, maybeWorker.name, maybeWorker.id);
                }
            } else {
                const maybeClient = await getUserClient(maybeUser.id);
                if (maybeClient === null) {
                    setElementVisible(
                        [statusComponent],
                        [true           ]
                    );
                    return;
                } else {
                    main.updateUserWith(maybeUser.id, maybeUser.login, false, maybeClient.name, maybeClient.id);
                }
            }
            main.updateActiveNowWith(new TrueHelloPage(main.activeNow.parent));
        }
    }

    getHTML() {
        return (
            `
            <!--<section class="section">-->
            <div id="login-form" class="box">
                <h1 style="text-align: center; font-size: 30px;">
                    <strong>Вход</strong>
                </h1>
                <div class="field">
                    <label class="label">Ваш логин</label>
                    <div class="control">
                        <input id="login" class="input" type="text" placeholder="...">
                    </div>
                    <label class="label">Пароль</label>
                    <div class="control">
                        <input id="password" class="input" type="text" placeholder="...">
                    </div>
                </div>
                <input class="button is-light box" type="button" id="signin" value="Войти" />
            </div>
            <!--</section>-->`
        )
    }
    
    render() {
        if (this.isDisplay) {
            const html = this.getHTML()
            this.parent.body.insertAdjacentHTML('beforeend', html)
            this.signIn = document.getElementById('signin');
            this.signIn.onclick = this.signInOnClick.bind(this.signIn, this.statusComponent);
        }
    }
}
