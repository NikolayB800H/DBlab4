import { TrueHelloPage } from "./pages/true-hello/index.js";

class Main {
    constructor(activeNow) {
        this.universalId = null;
        this.userName = null;
        this.isWorker = null;
        this.user = null;
        this.login = null;
        this.activeNow = activeNow;
        this.xs = [];
        this.ys = [];
        this.updateDiag = null;
    }

    startRender() {
        this.activeNow.render();
    }

    updateActiveNowWith(newPage) {
        this.activeNow = newPage;
        this.activeNow.render();
    }

    updateUserWith(newUser, newLogin, isWorker, userName, universalId) {
        this.universalId = universalId;
        this.userName = userName;
        this.isWorker = isWorker;
        this.user = newUser;
        this.login = newLogin;
        this.activeNow.unrender();
        this.activeNow.render();
    }
}

const root = document.getElementById('root');
export const main = new Main(new TrueHelloPage(root));
main.startRender();
