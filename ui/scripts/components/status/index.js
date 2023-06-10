import { setElementVisible } from '../../ui.js';

export class StatusComponent {
    constructor(parent, isDisplay) {
        this.parent = parent;
        this.isDisplay = isDisplay;
    }

    getHTML() {
        return (
            `
            <div id="status" class="notification is-danger is-light">
                <button id="close-notif" class="delete"></button>
                Некорректные данные!
            </div>
            `
        )
    }

    async closeNotifOnClick(statusComponent) {
        setElementVisible(
            [statusComponent],
            [false          ]
        );
    }
    
    render() {
        if (this.isDisplay) {
            const html = this.getHTML()
            this.parent.body.insertAdjacentHTML('beforeend', html)
            this.closeNotif = document.getElementById('close-notif');
            this.closeNotif.onclick = this.closeNotifOnClick.bind(this.closeNotif, this);
        }
    }
}
