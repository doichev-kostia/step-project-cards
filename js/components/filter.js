import DOMElement from "./DOMElement.js";
import API from "./API.js";
import {main} from '../sections/main.js'
import {Visit, VisitDentist, VisitTherapist, VisitCardiologist} from "./Visit.js";
import {createSearchIcon} from "./CreateSVG.js";

export let filterContainer = new DOMElement('div', ['filter', 'wrapper'], '').render()
main.append(filterContainer)

export function createFilter(parent) {
    let select = new DOMElement('select', 'filter__select').render()
    let selectPriority = new DOMElement('select', 'filter__select').render()
    let searchByDescriptionLabel = new DOMElement("label", "filter__label", "").render()
    let searchByDescription = new DOMElement('input', 'filter__input', "", {placeholder: 'Поиск по описанию'}).render()
    let searchByDescriptionBtn = new DOMElement('button', ["filter__btn", "btn"], 'Поиск').render()
    let searchIcon = createSearchIcon("filter__icon", 20, 20, "#9aa0a6");

    searchByDescriptionLabel.insertAdjacentHTML("afterbegin", searchIcon);
    searchByDescriptionLabel.append(searchByDescription);
    parent.prepend(select, selectPriority, searchByDescriptionLabel, searchByDescriptionBtn);
    //элементы фильтра поиска по врачу
    let optionDescription = new DOMElement('option', 'filter__option', 'Врач', {disabled: true, value: '', selected: true}).render();
    let optionAll = new DOMElement('option', 'filter__option', 'Все').render()
    let optionDentist = new DOMElement('option', 'filter__option', 'Стоматолог').render()
    let optionCardiologist = new DOMElement('option', 'filter__option', 'Кардиолог').render()
    let optionTherapist = new DOMElement('option', 'filter__option', 'Терапевт').render()
    select.append(optionDescription, optionAll, optionDentist, optionCardiologist, optionTherapist)
    //элементы фильтра поиска срочности
    let priorityDescription = new DOMElement('option', 'filter__option', 'Приоритетность', {disabled: true, value: '', selected: true}).render()
    let priorityAll = new DOMElement('option', 'filter__option', 'Все').render()
    let priorityLow = new DOMElement('option', 'filter__option', 'Обычная',{value:'low'}).render()
    let priorityNormal = new DOMElement('option', 'filter__option', 'Приоритетная',{value:'normal'}).render()
    let priorityHigh = new DOMElement('option', 'filter__option', 'Неотложная', {value:'high'}).render()
    selectPriority.append(priorityDescription,priorityAll, priorityLow, priorityNormal, priorityHigh)
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
        if (chosenDoctor !== "все" && chosenDoctor !== "") {
            chosenCards = chosenCards.filter(item => {
                return item.doctor.elementValue.toLowerCase() === chosenDoctor;
            })
        }

        let chosenPriority = selectPriority.value.toLowerCase()
        if (chosenPriority !== "все" && chosenPriority !== "") {
            chosenCards = chosenCards.filter(item => {
                return item.priority.elementValue.toLowerCase() === chosenPriority;
            })
        }
        chosenCards.forEach(card => {
            Visit.toggleVisibility(false, card.id)
        })

    })
}
