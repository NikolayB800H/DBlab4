export class TableApplicationsComponent {
    constructor(parent, isDisplay) {
        this.parent = parent;
        this.isDisplay = isDisplay;
    }

    getHTML() {
        return (
            `
            <section class="section">
            <div id="applicationsDisplay" class="box" style="margin-bottom: -50px !important;">
                Ваши заявления:
                <br />
                <div class="table-responsive">
                    <table id="myTable" class="table is-bordered is-full-width">
                        <thead>
                            <tr id="applicationsHeader">
                                <th scope="col">Содержание</th>
                                <th scope="col">Выполнено</th>
                                <th scope="col">Дедлайн</th>
                                <th scope="col" style="width: 100px !important;"></th>
                                <!--<th scope="col">Удалить?</th>-->
                            </tr>
                        </thead>
                        <tbody id="applicationsList">
                        <!--<tr>
                                <td>1</td>
                                <td>!!!</td>
                                <td>false</td>
                                <td>2023-05-27 09:06:26.113602+03</td>
                                <td>1</td>
                                <td>Delete</td>
                            </tr>-->
                        </tbody>
                    </table>
                </div>
                <nav class="pagination" role="navigation" aria-label="pagination" style="margin-top: 6px;">
                    <a id="pagination-previous" class="pagination-previous">Предыдущая</a>
                    <a id="pagination-next" class="pagination-next">Следущая</a>
                    <ul id="pagination-list" class="pagination-list">
                    </ul>
                </nav>
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
