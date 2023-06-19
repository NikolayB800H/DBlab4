import { HelloPage } from "./pages/hello/index.js";
import { ProjectPage } from "./pages/project/index.js";
import { TrueHelloPage } from "./pages/true-hello/index.js";
import { RegistrationPage } from "./pages/registration/index.js";
import { ApplicationsPage } from "./pages/applications/index.js";
import { CircleDiagramPage } from "./pages/circle-diagram/index.js";
import { CircleDiagramSecPage } from "./pages/circle-diagram-sec/index.js";
import { WorkerApplicationsPage } from "./pages/worker-appls/index.js";
import { WorkerServsPage } from "./pages/worker-servs/index.js";
import { WorkerClientsPage } from "./pages/worker-clients/index.js";
import { DiagramThiPage } from "./pages/diagram-thi/index.js";

export class PageProperties {
    constructor(buttonIsNavStart, btnLabel, id, isForAll, isForWorker, isForClient, constructor) {
        this.buttonIsNavStart = buttonIsNavStart;
        this.btnLabel = btnLabel;
        this.id = id;
        this.isForAll = isForAll;
        this.isForWorker = isForWorker;
        this.isForClient = isForClient;
        this.constructor = constructor;
        PageProperties.allPagesProperties.push(this);
    }
}

let applicationsPage;
let circleDiagramPage;
let circleSecDiagramPage;
let circleThiDiagramPage;
let projectPage;
let workerApplicationsPage;
let workerServicesPage;
let workerClientsPage;
//
let helloPage;
let registrationPage;
let trueHelloPage;

export function rightAfterMain() {
    PageProperties.allPagesProperties = [];
    applicationsPage = new PageProperties(true, "Заявления", "applications-page", false, false, true, ApplicationsPage);
    circleDiagramPage = new PageProperties(true, "Активность 1", "diagram-page", false, true, false, CircleDiagramPage);
    circleSecDiagramPage = new PageProperties(true, "Активность 2", "diagram-sec-page", false, true, false, CircleDiagramSecPage);
    circleThiDiagramPage = new PageProperties(true, "Активность 3", "diagram-thi-page", false, true, false, DiagramThiPage);
    workerApplicationsPage = new PageProperties(true, "Обновить заявления", "worker-appls-page", false, true, false, WorkerApplicationsPage);
    workerServicesPage = new PageProperties(true, "Обновить услуги", "worker-servs-page", false, true, false, WorkerServsPage);
    workerClientsPage = new PageProperties(true, "Добав./измен. клиента", "worker-clients-page", false, true, false, WorkerClientsPage);
    projectPage = new PageProperties(true, "Проект", "project-page", true, true, true, ProjectPage);
    //
    helloPage = new PageProperties(false, "Вход", "hello-page", true, false, false, HelloPage);
    registrationPage = new PageProperties(false, "Регистрация", "registration-page", true, false, false, RegistrationPage);
    trueHelloPage = new PageProperties(false, "Выход", "true-hello-page", true, true, true, TrueHelloPage);
}
