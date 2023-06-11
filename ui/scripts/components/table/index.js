export class TableComponent {
    constructor(parent, isDisplay, properties) {
        this.parent = parent;
        this.isDisplay = isDisplay;
        this.properties = properties;
    }

    getHTML() {
        return (
            `
            <section class="section">
            <div class="box" style="margin-bottom: -50px !important;">
                Ваши заявления:
                <br />
                <div class="table-responsive">
                    <table id="myTable" class="table is-bordered is-full-width">
                        <thead>
                            <tr id="${this.properties.headerId}">
                            </tr>
                        </thead>
                        <tbody id="${this.properties.listId}">
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