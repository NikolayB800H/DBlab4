export class AddRecordComponent {
    constructor(parent, isDisplay, properties) {
        this.parent = parent;
        this.isDisplay = isDisplay;
        this.properties = properties;
    }

    async newRecordOnClick(inputs, properties, showContentList) {
        let input = [];
        for (let i = 0; i < properties.getters.length; ++i) {
            if (properties.types[i] != "datetime" & properties.types[i] != "applicationStatus") {
                let tmp = properties.getters[i](inputs[i]);
                if (tmp === null) return;
                tmp = properties.froms[i](tmp);
                input.push(tmp);
            } else {
                input.push("");
            }
        }
        input = input.concat(properties.addArgs);
        const recordId = await properties.adder(...input);
        await showContentList(properties);
    }
    
    render() {
        if (this.isDisplay) {
            this.root = document.createElement('section');
            root.classList.add("section");
            let recordDiv = document.createElement('div');
            recordDiv.id = "record-div";
            recordDiv.classList.add("box");
            let fieldList = document.createElement('form');
            fieldList.id = "add-record-form";
            let addLabel = document.createElement('label');
            addLabel.classList.add("label");
            addLabel.innerHTML = this.properties.addTitle;
            addLabel.style = "text-align: center; font-size: 30px;";
            fieldList.appendChild(addLabel);
            let inputs = [];
            for (let i = 0; i < this.properties.include.length; ++i) {
                if (this.properties.types[i] != "datetime" & this.properties.types[i] != "applicationStatus") {
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
            }
            let add = document.createElement('input');
            add.id = "new-record";
            add.type = "button";
            add.classList.add("button");
            add.classList.add("is-light");
            add.value = "Добавить";
            fieldList.appendChild(add);
            recordDiv.appendChild(fieldList);
            this.root.appendChild(recordDiv);
            this.parent.body.appendChild(this.root);
            add.onclick = this.newRecordOnClick.bind(this.add, inputs, this.properties, this.parent.tableComponent.showContentList);
        }
    }
}
