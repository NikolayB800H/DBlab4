export class MadeByComponent {
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
                    <h1 style="text-align: center; font-size: 30px; margin-top: 20px;">
                        Приложение разработано Горкуновым Николаем (ИУ5-43Б)
                    </h1>
                </div>

                <!-- Hero content: will be in the middle -->
                <div class="hero-body">
                    <div class="container has-text-centered">
                        <p class="title">
                            АС Муниципального Учреждения
                        </p>
                        <p class="subtitle">
                            Rust + Tauri + PostgreSQL + JS + HTML + CSS + Bulma + ApexCharts
                            </br>
                            <img src="img/bmstu.png" width="120" height="120">
                        </p>
                    </div>
                </div>

                <!-- Hero footer: will stick at the bottom -->
                <div class="hero-foot">
                    <h1 style="text-align: center; font-size: 30px; margin-bottom: 20px;">
                        Курсовая работа дисциплины "Базы Данных", 4-ый семестр кафедры ИУ5
                    </h1>
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
