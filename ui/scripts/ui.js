export function setElementVisible(element, visible) {
    for (let i = 0; i < element.length; i++) {
        element[i].isDisplay = visible[i];
    }
    element[0].parent.unrender();
    element[0].parent.render();
}
