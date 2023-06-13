import { addNewApplication, changeApplication, getClientApplications, removeApplication, getClientApplicationsCount } from "./application.js";
import { getClientServicesCount, getClientServicesCountCount } from "./circle-diagram.js";
//import { getClientAppCount, getClientAppCountCount } from "./circle-diagram-sec.js";
import { main } from "./main.js";
class TableProperties {
    constructor(addTitle, title, include, allFields, types, fields, adder, changer, loader, remover, counter, listId, headerId, addArgs, queryArgs, master, slave, isEditable, isGeneric) {
        this.addTitle = addTitle;
        this.title = title;
        this.include = include;
        this.allFields = allFields;
        this.types = types;
        this.fields = fields;
        this.setters = [];
        this.getters = [];
        this.froms = [];
        this.searchers = [];
        this.stylers = [];
        this.adder = adder;
        this.changer = changer;
        this.loader = loader;
        this.remover = remover;
        this.counter = counter;
        this.listId = listId;
        this.headerId = headerId;
        this.addArgs = addArgs;
        this.queryArgs = queryArgs;
        this.master = master;
        this.slave = slave;
        this.isEditable = isEditable;
        this.isGeneric = isGeneric;
        this.updateXY = main.updateXYWith;
        this.types.forEach(element => {
            switch (element) {
                case "string":
                    this.setters.push(setInputString);
                    this.getters.push(getInputString);
                    this.froms.push(fromUserString);
                    this.searchers.push(searchString);
                    this.stylers.push(styleString);
                    break;
                case "bool":
                    this.setters.push(setInputBool);
                    this.getters.push(getInputBool);
                    this.froms.push(fromUserBool);
                    this.searchers.push(searchBool);
                    this.stylers.push(styleEnum);
                    break;
                case "applicationStatus":
                    this.setters.push(setInputApplicationStatus);
                    this.getters.push(getInputEnum);
                    this.froms.push(fromUserEnum);
                    this.searchers.push(searchEnum);
                    this.stylers.push(styleEnum);
                    break;
                case "serviceName":
                    this.setters.push(setInputServiceName);
                    this.getters.push(getInputEnum);
                    this.froms.push(fromUserEnum);
                    this.searchers.push(searchEnum);
                    this.stylers.push(styleEnum);
                    break;
                case "serviceStatus":
                    this.setters.push(setInputServiceStatus);
                    this.getters.push(getInputEnum);
                    this.froms.push(fromUserEnum);
                    this.searchers.push(searchEnum);
                    this.stylers.push(styleEnum);
                    break;
                case "datetime":
                    this.setters.push(setInputDatetime);
                    this.getters.push(getInputDatetime);
                    this.froms.push(fromUserDatetime);
                    this.searchers.push(searchDatetime);
                    this.stylers.push(styleDatetime);
                    break;
                case "int":
                    this.setters.push(setInputInt);
                    this.getters.push(getInputInt);
                    this.froms.push(fromUserInt);
                    this.searchers.push(searchInt);
                    this.stylers.push(styleInt);
                    break;
                default:
                    console.log(`Bad type property: ${element}`);
            }
        });
    }
}

export let applicationTable;
export let circleDiagramTable;
export let circleDiagramSecTable;

export function afterMain() {               // services                               | applications                                   //
    applicationTable = new TableProperties( // id, name, status, update_time, content | id, status, update_time, client_id, service_id //
        "Новое заявление на новую услугу",  // LEFT JOIN ON services.id = applications.service_id
        "Ваши заявления на услуги",
        ["Название услуги", "Содержание услуги", "Статус заявления", "Дата обновления"],
        ["services_id", "services_name", "services_status", "services_update_time", "services_content", "applications_id", "applications_status", "applications_update_time", "applications_client_id", "applications_service_id"],
        ["serviceName", "string", "applicationStatus", "datetime"],
        ["services_name", "services_content", "applications_status", "applications_update_time"],
        addNewApplication,
        changeApplication,
        getClientApplications,
        removeApplication,
        getClientApplicationsCount,
        "applications-list",
        "applications-header",
        [main.universalId],
        [main.universalId],
        "services",
        "applications",
        true,
        false
    );
    circleDiagramTable = new TableProperties( // clients_id, clients_name, services_count //
        "ОШИБКА",
        "Активность клиентов (количество услуг)",
        ["Имя клиента", "Количество услуг"],
        ["clients_id", "clients_name", "services_count"],
        ["string", "int"],
        ["clients_name", "services_count"],
        null,
        null,
        getClientServicesCount,
        null,
        getClientServicesCountCount,
        "services-count-list",
        "services-count-header",
        [],
        [],
        null,
        null,
        false,
        true
    );
    circleDiagramSecTable = new TableProperties( // clients_id, clients_name, applications_count //
        "ОШИБКА",
        "Активность клиентов (количество заявлений)",
        ["Имя клиента", "Количество заявлений"],
        ["clients_id", "clients_name", "services_count"],//["clients_id", "clients_name", "applications_count"]
        ["string", "int"],
        ["clients_name", "services_count"],//["clients_name", "applications_count"]
        null,
        null,
        getClientServicesCount,//getClientAppCount
        null,
        getClientServicesCountCount,//getClientAppCountCount
        "services-count-list",//"applications-count-list"
        "services-count-header",//"applications-count-header"
        [],
        [],
        null,
        null,
        false,
        true
    );
}

export const boolType = ['true', 'false'];
export const applicationStatus = ['Принято', 'Отклонено', 'Закрыто', 'Обрабатывается'];
export const serviceName = ['Анализы', 'Больничный', 'Справка', 'Обследование'];
export const serviceStatus = ['Выполнена', 'Провалена', 'Неначата'];

export function styleString(bar) {
    bar.classList.remove("input");
    bar.style.height = "26px !important";
    bar.style.display = "inline-block !important";
}

export function styleEnum(bar) { }

export function styleDatetime(bar) {
    bar.classList.remove("input");
    bar.style.height = "26px !important";
    bar.style.display = "inline-block !important";
}

export function styleInt(bar) {
    bar.classList.remove("input");
    bar.style.height = "26px !important";
    bar.style.display = "inline-block !important";
}

export function fromUserString(str) {
    return `'${str}'`;
}

export function fromUserBool(str) {
    return `${str}`.toUpperCase();
}

export function fromUserEnum(str) {
    return `'${str}'`;
}

export function fromUserDatetime(str) {
    str = str.split(',');
    str[0] = str[0].split('/').reverse().join('-');
    return `'${str.join('')}'`;
}

export function fromUserInt(str) {
    return `${str}`;
}

export function searchString(str) {
    return `LIKE '%${str}%'`;
}

export function searchBool(str) {
    return `= ${fromUserBool(str)}`;
}

export function searchEnum(str) {
    return `= ${fromUserEnum(str)}`;
}

export function searchDatetime(str) {
    return `= ${fromUserDatetime(str)}`;
}

export function searchInt(str) {
    return `= ${fromUserInt(str)}`;
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

export function getInputEnum(i) {
    let valu = document.querySelector(`input[name="${i.firstChild.lastChild.name}"]:checked`);
    if (valu === null) {
        return null;
    }
    return valu.value;
}

export function getInputDatetime(i) {
    if (i.value == "") return null;
    return i.value;
}

export function getInputInt(i) {
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
    return bar;
}

function setInputEnum(i, prefix, type) {
    let bar = document.createElement('div');
    bar.name = i.name;
    let len = 0;
    type.forEach(element => {
        len += element.length + 1.8;
        let varBut = document.createElement('input');
        varBut.type = "radio";
        varBut.id = `radio-${i.name}-${element}`;
        varBut.name = `${i.name}-${prefix}-bar-choice`;
        varBut.value = element;
        let varButLabel = document.createElement('label');
        varButLabel.for = `${i.name}-${prefix}-bar-choice`;
        varButLabel.textContent = element;
        varButLabel.classList.add("radio");
        varButLabel.appendChild(varBut);
        bar.appendChild(varButLabel);
    });
    i.style.width = 48 + 10 * len + "px";
    return bar;
}

export function setInputBool(i, prefix) {
    return setInputEnum(i, prefix, boolType);
}

export function setInputApplicationStatus(i, prefix) {
    return setInputEnum(i, prefix, applicationStatus);
}

export function setInputServiceName(i, prefix) {
    return setInputEnum(i, prefix, serviceName);
}

export function setInputServiceStatus(i, prefix) {
    return setInputEnum(i, prefix, serviceStatus);
}

export function setInputDatetime(i, prefix) {
    i.style.width = "225px";
    let bar = document.createElement('input');
    bar.type = "text";
    bar.classList.add("input");
    bar.name = i.name;
    bar.readOnly = true;
    bar.placeholder = "...";
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

export function setInputInt(i, prefix) {
    i.style.width = "225px";
    let bar = document.createElement('input');
    bar.type = "text";
    bar.classList.add("input");
    bar.name = i.name;
    bar.placeholder = "...";
    bar.addEventListener("keyup", function() {
        this.value = this.value.replace(/[^0-9]/g, "");
    });
    return bar;
}
