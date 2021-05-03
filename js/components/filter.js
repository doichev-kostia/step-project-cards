import DOMElement from "./DOMElement.js";
import API from "./API.js";
import {main} from '../sections/main.js'
import {Visit, VisitDentist, VisitTherapist, VisitCardiologist} from "./Visit.js";

export let filterContainer = new DOMElement('div', ['filter-section', 'wrapper'], '').render()
main.append(filterContainer)

export function createFilter(parent) {
    let select = new DOMElement('select', 'filterSelect', 'Выберите врача').render()
    let selectPriority = new DOMElement('select', 'filterSelect', 'Выберите срочность').render()
    let searchByDescription = new DOMElement('input', 'filterSearch', 'Поиск по описанию').render()
    let searchByDescriptionBtn = new DOMElement('button', 'filterSearchBtn', 'Поиск').render()
    parent.prepend(select, selectPriority, searchByDescription, searchByDescriptionBtn);
    //элементы фильтра поиска по врачу
    let optionAll = new DOMElement('option', 'filterOption', 'Все').render()
    let optionDentist = new DOMElement('option', 'filterOption', 'Стоматолог').render()
    let optionCardiologist = new DOMElement('option', 'filterOption', 'Кардиолог').render()
    let optionTherapist = new DOMElement('option', 'filterOption', 'Терапевт').render()
    select.append(optionAll, optionDentist, optionCardiologist, optionTherapist)
    //элементы фильтра поиска срочности
    let priorityAll = new DOMElement('option', 'filterOption', 'Все').render()
    let priorityLow = new DOMElement('option', 'filterOption', 'Обычная',{value:'low'}).render()
    let priorityNormal = new DOMElement('option', 'filterOption', 'Приоритетная',{value:'normal'}).render()
    let priorityHigh = new DOMElement('option', 'filterOption', 'Неотложная', {value:'high'}).render()
    selectPriority.append(priorityAll, priorityLow, priorityNormal, priorityHigh)
    //конец элементов фильтра поиска по срочности

    searchByDescriptionBtn.addEventListener("click", async event => {
        let chosenCards = []
        let allCards = await API.getAllCards()
        allCards.forEach(card => {
            Visit.toggleVisibility(true, card.id)
            if (searchByDescription.value !== "") {
                for (let [objectKey, objectValue] of Object.entries(card)) {
                    if (objectKey !== "id") {
                        let cardElementValue = card[objectKey].elementValue.toString().toLowerCase();
                        if (cardElementValue.includes(searchByDescription.value.toLowerCase())) {
                            chosenCards.push(card);
                        }
                    }
                }
            } else {
                chosenCards.push(card);
            }
        });

        let chosenDoctor = select.value.toLowerCase()
        if (chosenDoctor !== "все") {
            chosenCards = chosenCards.filter(item => {
                return item.doctor.elementValue.toLowerCase() === chosenDoctor;
            })
        }

        let chosenPriority = selectPriority.value.toLowerCase()
        if (chosenPriority !== "все") {
            chosenCards = chosenCards.filter(item => {
                return item.priority.elementValue.toLowerCase() === chosenPriority;
            })
        }
        chosenCards.forEach(card => {
            Visit.toggleVisibility(false, card.id)
        })

    })
}
