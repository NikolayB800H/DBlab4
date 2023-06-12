const { invoke } = window.__TAURI__.tauri;

export function changeApplication(applicationId, description, isDone, dueTime) {
    return invoke('change_application', { applicationId, description, isDone, dueTime });
}

export function createApplication(description, isDone, dueTime, createdBy) {
    const application = invoke('create_application', { description, done: isDone, dueTime, createdBy });
    return application;
}

export function getClientApplicationsCount(searchCol, searchValue, createdBy) {
    const count = invoke('get_client_applications_count', {createdBy, searchCol, searchValue});
    return count;
}

export function getClientApplications(searchCol, searchValue, sortCol, sortWay, limit, offset, clientId) {
    const applications = invoke('get_client_applications', { clientId, searchCol, searchValue, sortCol, sortWay, limit, offset });
    return applications;
}

/*export function addNewApplication(application) {
    const application_id = invoke('add_application', { application });
    return application_id;
}*/
export function addNewApplication(description, isDone, dueTime, createdBy) {
    const application_id = invoke('add_application', { description, isDone, dueTime, createdBy });
    return application_id;
}

export function setApplicationDone(applicationId, done) {
    return invoke('set_application_done', { applicationId, done });
}

export function removeApplication(applicationId) {
    return invoke('remove_application', { applicationId });
}
