const { invoke } = window.__TAURI__.tauri;

export function changeApplication(applicationId, servicesName, servicesContent, applicationsStatus, applicationsUpdateTime) {
    return invoke('change_application', { applicationId, servicesName, servicesContent, applicationsStatus, applicationsUpdateTime });
}

export function getClientApplicationsCount(searchCol, searchValue, clientId) {
    const count = invoke('get_client_applications_count', {clientId, searchCol, searchValue});
    return count;
}

export function getClientApplications(searchCol, searchValue, sortCol, sortWay, limit, offset, clientId) {
    const applications = invoke('get_client_applications', { clientId, searchCol, searchValue, sortCol, sortWay, limit, offset });
    return applications;
}

export function addNewApplication(servicesName, servicesContent, applicationsStatus, applicationsUpdateTime, applicationsClientId) {
    const application_id = invoke('add_application', { servicesName, servicesContent, applicationsStatus, applicationsUpdateTime, applicationsClientId });
    return application_id;
}

export function removeApplication(applicationId) {
    return invoke('remove_application', { applicationId });
}
