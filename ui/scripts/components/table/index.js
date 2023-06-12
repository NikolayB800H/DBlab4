import { main } from "../../main.js";
import { showContentList } from "../../ui.js";

export class TableComponent {
    constructor(parent, isDisplay, properties) {
        this.parent = parent;
        this.isDisplay = isDisplay;
        this.properties = properties;
    }

    getHTML() {
        return (
            `
            <section class="section px-0">
            <div class="box" style="margin-bottom: -50px !important;">
                <h1 style="text-align: center; font-size: 30px;">
                    <strong>${this.properties.title}</strong>
                </h1>
                <br/>
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
            showContentList(this.properties);
        }
    }
}
