const { invoke } = window.__TAURI__.tauri;

export function createWorker(name, registeredAs) {
    const worker = invoke('create_worker', { name, registeredAs });
    return worker;
}

export function getUserWorker(userId) {
    const worker = invoke('get_user_worker', { userId });
    return worker;
}

export function addNewWorker(worker) {
    const worker_id = invoke('add_worker', { worker });
    return worker_id;
}
