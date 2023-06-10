import { addUser, createUser, tryLoginUser } from '../../user.js';
import { main } from '../../main.js';
import { TrueHelloPage } from '../../pages/true-hello/index.js';
import { setElementVisible } from '../../ui.js';
import { addNewClient, createClient } from '../../client.js';

export class RegisterComponent {
    constructor(parent, isDisplay, statusComponent) {
        this.parent = parent;
        this.isDisplay = isDisplay;
        this.statusComponent = statusComponent;
    }

    async registerWithOnClick(statusComponent) {
        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;
        const name = document.getElementById('name').value;
        //console.log("Try register: "+login+": "+password)
        const fAlSe = false;
        const user = await createUser(login, password, fAlSe);
        if (user == undefined) {
            setElementVisible(
                [statusComponent],
                [true           ]
            );
            return;
        }
        const user_id = await addUser(user);
        if (user_id == null) {
            setElementVisible(
                [statusComponent],
                [true           ]
            );
            return
        }
        const client = await createClient(name, user_id);
        if (client == undefined) {
            setElementVisible(
                [statusComponent],
                [true           ]
            );
            return;
        }
        const client_id = await addNewClient(client);
        if (client_id == null) {
            setElementVisible(
                [statusComponent],
                [true           ]
            );
            return
        }
        const maybeUser = await tryLoginUser(login, password);
        if (maybeUser == null) {
            setElementVisible(
                [statusComponent],
                [true           ]
            );
            return;
        }
        main.updateUserWith(maybeUser.id, maybeUser.login, false, client.name, client_id);
        main.updateActiveNowWith(new TrueHelloPage(main.activeNow.parent));
    }

    getHTML() {
        return (
            `
            <!--<section class="section">-->
            <div id="register-form" class="box">
                <h1 style="text-align: center; font-size: 30px;">
                    <strong>Регистрация</strong>
                </h1>
                <div class="field">
                    <label class="label">Ваши ФИО</label>
                    <div class="control">
                        <input id="name" class="input" type="text" placeholder="Иванов Иван Иванович">
                    </div>
                    <label class="label">Придумайте уникальный логин</label>
                    <div class="control">
                        <input id="login" class="input" type="text" placeholder="...">
                    </div>
                    <label class="label">Придумайте пароль</label>
                    <div class="control">
                        <input id="password" class="input" type="text" placeholder="Что-нибудь посложнее">
                    </div>
                </div>
                <input class="button is-light box" type="button" id="register-with" value="Готово" />
            </div>
            <!--</section>-->`
        )
    }
    
    render() {
        if (this.isDisplay) {
            const html = this.getHTML()
            this.parent.body.insertAdjacentHTML('beforeend', html)
            this.registerWith = document.getElementById('register-with');
            this.registerWith.onclick = this.registerWithOnClick.bind(this.signIn, this.statusComponent);
        }
    }
}
