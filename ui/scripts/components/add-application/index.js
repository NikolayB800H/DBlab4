import { addNewApplication, createApplication } from '../../application.js';
import { main } from '../../main.js';
import { showApplicationsList } from '../../ui.js';
export class AddApplicationComponent {
    constructor(parent, isDisplay, properties) {
        this.parent = parent;
        this.isDisplay = isDisplay;
        this.properties = properties;
    }

    async newApplicationOnClick(inputs, properties) {
        let input = [];
        for (let i = 0; i < properties.getters.length; ++i) {
            let tmp = properties.getters[i](inputs[i]);
            if (tmp === null) return;
            input.push(tmp);
        }
        const application = await createApplication(input[0], input[1], input[2], main.universalId);
        const application_id = await addNewApplication(application);
        await showApplicationsList(main.universalId, properties.exclude, properties.include, properties.types, properties.fields, properties.setters, properties.getters);
    }

    getHTML() {
        return (
            `
            <section class="section">
            <div id="applicationDiv" class="box" style="margin-bottom: -50px !important; margin-top: -50px !important;">
                <form id="add-application-form" class="box" style="display: table-caption;">Новое заявление<br />
                    <div class="field">
                        <label class="label">Содержание</label>
                        <div class="control">
                            <input class="input" type="text" id="add-description" placeholder="...">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Дедлайн</label>
                        <div id="datetime-input" class="control">
                            <input type="text" readonly="readonly" class="input" id="add-due_time" placeholder="...">
                        </div>
                    </div>
                    <input class="button is-light" type="button" id="new-application" value="Добавить" />
                </form>
            </div>
            </section>
            `
        )
    }
    
    render() {
        if (this.isDisplay) {
            //const html = this.getHTML();
            //this.parent.body.insertAdjacentHTML('beforeend', html);
            //this.fieldList = document.getElementById('add-application-form');
            this.root = document.createElement('section');
            root.classList.add("section");
            let applicationDiv = document.createElement('div');
            applicationDiv.id = "applicationDiv";
            applicationDiv.classList.add("box");
            //applicationDiv.style = "margin-bottom: -50px !important; margin-top: -50px !important;";
            let fieldList = document.createElement('form');
            fieldList.id = "add-application-form";
            //fieldList.classList.add("box");
            //fieldList.style = "display: table-caption;";
            let addLabel = document.createElement('label');
            addLabel.classList.add("label");
            addLabel.innerHTML = "Новое заявление";
            //this.fieldList.replaceChildren();
            fieldList.appendChild(addLabel);
            let inputs = [];
            for (let i = 0; i < this.properties.include.length; ++i) {
                let field = document.createElement('div');
                field.classList.add("field");
                let label = document.createElement('label');
                label.classList.add("label");
                label.innerHTML = this.properties.include[i];
                let control = document.createElement('div');
                control.classList.add("control");
                control.name = `${i}`;
                let input = this.properties.setters[i](control, "add");
                inputs.push(input);
                control.appendChild(input);
                field.appendChild(label);
                field.appendChild(control);
                fieldList.appendChild(field);
            }
            let add = document.createElement('input');
            add.id = "new-application";
            add.type = "button";
            add.classList.add("button");
            add.classList.add("is-light");
            add.value = "Добавить";
            fieldList.appendChild(add);
            applicationDiv.appendChild(fieldList);
            this.root.appendChild(applicationDiv);
            this.parent.body.appendChild(this.root);
            add.onclick = this.newApplicationOnClick.bind(this.newApplication, inputs, this.properties);
        }
    }
}
