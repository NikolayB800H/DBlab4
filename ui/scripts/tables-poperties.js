class TableProperties {
    constructor(include, exclude, types, fields) {
        this.include = include;
        this.exclude = exclude;
        this.types = types;
        this.fields = fields;
        this.setters = [];
        this.getters = [];
        this.froms = [];
        this.types.forEach(element => {
            switch (element) {
                case "string":
                    this.setters.push(setInputString);
                    this.getters.push(getInputString);
                    this.froms.push(fromUserString);
                    break;
                case "bool":
                    this.setters.push(setInputBool);
                    this.getters.push(getInputBool);
                    this.froms.push(fromUserBool);
                    break;
                case "datetime":
                    this.setters.push(setInputDatetime);
                    this.getters.push(getInputDatetime);
                    this.froms.push(fromUserDatetime);
                    break;
                default:
                    console.log(`Bad type property: ${element}`);
            }
        });
    }
}

export const boolType = ["true", "false"];

export const applicationTable = new TableProperties(
    ["Содержание", "Выполнено", "Дедлайн"],
    ["id", "created_by"],
    ["string", "bool", "datetime"],
    ["description", "done", "due_time"]
);

export function fromUserString(str) {
    return `'${str}'`;
}

export function fromUserBool(str) {
    return `${str}`.toUpperCase();
}

export function fromUserDatetime(str) {
    str = str.split(',');
    str[0] = str[0].split('/').reverse().join('-');
    return `'${str.join('')}'`;
}

export function getInputString(i) {
    if (i.value == "") return null;
    return i.value;
}

export function getInputBool(i) {
    let valu = document.querySelector(`input[name="${i.firstChild.lastChild.name}"]:checked`);
    if (valu === null) {
        return null;
    }
    return valu.value == "true";
}

export function getInputDatetime(i) {
    if (i.value == "") return null;
    return i.value;
}

export function setInputString(i, prefix) {
    i.style.width = "225px";
    let bar = document.createElement('input');
    bar.type = "text";
    bar.classList.add("input");
    bar.name = i.name;
    bar.placeholder = "...";
    //bar.style = "margin-left: 6px; padding: 0px !important; height: 26px; display: inline-block;";
    return bar;
}

export function setInputBool(i, prefix) {
    let bar = document.createElement('div');
    bar.name = i.name;
    //bar.style = "margin-left: 6px;";
    let len = 0;
    boolType.forEach(element => {
        len += element.length + 1.8;
        let varBut = document.createElement('input');
        varBut.type = "radio";
        varBut.id = `radio-${i.name}-${element}`;
        varBut.name = `${prefix}-bar-choice`;
        varBut.value = element;
        let varButLabel = document.createElement('label');
        varButLabel.for = `${prefix}-bar-choice`;
        varButLabel.textContent = element;
        varButLabel.classList.add("radio");
        varButLabel.appendChild(varBut);
        bar.appendChild(varButLabel);
    });
    i.style.width = 48 + 8 * len + "px";
    return bar;
}

export function setInputDatetime(i, prefix) {
    i.style.width = "225px";
    let bar = document.createElement('input');
    bar.type = "text";
    bar.classList.add("input");
    bar.name = i.name;
    bar.readOnly = true;
    bar.placeholder = "...";
    //bar.style.position = "relative";
    const opitons = {
        "appendTo": i,
        "autoClose": false,
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
            "selectedDay": "has-background-light",
            "dayBodyElem": "has-text-weight-normal",
            "timeOption": "has-text-weight-normal",
            "selectedTime": "rd-time-selected has-text-weight-normal",
            "dayTable": "table is-bordered"
            /*"back": "rd-back",
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
            "timeOption": "rd-time-option"*/
        },
        "time": true,
        "timeFormat": "HH:mm:ss",
        "timeInterval": 1800,
        "timeValidator": Function.prototype,
        "weekdayFormat": "short",
        "weekStart": 1
    };
    rome(bar, opitons);
    return bar;
}
