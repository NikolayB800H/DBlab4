import { addNewApplication, createApplication } from '../../application.js';
import { main } from '../../main.js';
import { showApplicationsList } from '../../ui.js';
import { applicationTable } from '../../tables-poperties.js';

export class AddApplicationComponent {
    constructor(parent, isDisplay, properties) {
        this.parent = parent;
        this.isDisplay = isDisplay;
        this.properties = properties;
    }

    async newApplicationOnClick(getters, inputs) {
        /*const description = document.getElementById('add-description').value;
        const dueTime = document.getElementById('add-due_time').value;*/
        let input = [];
        for (let i = 0; i < getters.length; ++i) {
            let tmp = getters[i](inputs[i]);
            if (tmp === null) return;
            input.push(tmp);
        }
        const application = await createApplication(input[0], input[1], input[2], main.universalId);
        //const application = await createApplication(description, false, dueTime, main.universalId);
        const application_id = await addNewApplication(application);
        await showApplicationsList(main.universalId, applicationTable.exclude, applicationTable.include, applicationTable.types, applicationTable.fields);
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
            fieldList.style = "display: table-caption;";
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
                let input = this.properties.setters[i](control, this.properties.types);
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
            //this.newApplication = document.getElementById('new-application');
            /*this.newApplication*/add.onclick = this.newApplicationOnClick.bind(this.newApplication, this.properties.getters, inputs);
            /*const opitons = {
                "appendTo": document.getElementById('datetime-input'),
                "autoClose": true,
                "autoHideOnBlur": true,
                "autoHideOnClick": true,
                "date": true,
                "dateValidator": Function.prototype,
                "dayFormat": "DD",
                "initialValue": null,
                "inputFormat": "DD/MM/YYYY, HH:mm:ss",
                "invalidate": true,
                "max": null,
                "min": null,
                "monthFormat": "MMMM YYYY",
                "monthsInCalendar": 1,
                "required": false,
                "strictParse": false,
                "styles": {
                    "back": "rd-back",
                    "container": "rd-container",
                    "date": "rd-date",
                    "dayBody": "rd-days-body",
                    "dayBodyElem": "rd-day-body",
                    "dayConcealed": "rd-day-concealed",
                    "dayDisabled": "rd-day-disabled",
                    "dayHead": "rd-days-head",
                    "dayHeadElem": "rd-day-head",
                    "dayRow": "rd-days-row",
                    "dayTable": "rd-days",
                    "month": "rd-month",
                    "next": "rd-next",
                    "positioned": "rd-container-attachment",
                    "selectedDay": "rd-day-selected",
                    "selectedTime": "rd-time-selected",
                    "time": "rd-time",
                    "timeList": "rd-time-list",
                    "timeOption": "rd-time-option"
                },
                "time": true,
                "timeFormat": "HH:mm:ss",
                "timeInterval": 1800,
                "timeValidator": Function.prototype,
                "weekdayFormat": "short",
                "weekStart": 1
            }
            rome(document.getElementById("add-due_time"), opitons);*/
        }
    }
}
