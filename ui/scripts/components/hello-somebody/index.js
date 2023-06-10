import { main } from "../../main.js";

export class HelloSomebodyComponent {
    constructor(parent, isDisplay) {
        this.parent = parent;
        this.isDisplay = isDisplay;
    }

    getHTML() {
        return (
            `
            <section class="box hero is-dark is-medium">
                <!-- Hero head: will stick at the top -->
                <div class="hero-head">
                </div>

                <!-- Hero content: will be in the middle -->
                <div class="hero-body">
                    <div class="container has-text-centered">
                        <p class="title">
                            Вас приветствует БутовоЗдрав!
                        </p>
                        <p class="subtitle">Доброго времени суток` + ((main.userName === null) ? `.` : (((main.isWorker) ? `, сотрудник` : `, пользователь`) +` ${main.userName}.`)) + `
                        </p>
                    </div>
                </div>

                <!-- Hero footer: will stick at the bottom -->
                <div class="hero-foot">
                </div>
            </section>
            `
        )
    }
    
    render() {
        if (this.isDisplay) {
            const html = this.getHTML()
            this.parent.body.insertAdjacentHTML('beforeend', html)
        }
    }
}
