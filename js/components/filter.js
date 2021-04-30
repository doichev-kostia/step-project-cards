import DOMElement from "./DOMElement.js";
import API from "./API.js";
import {main} from '../sections/main.js'



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
    //конец элементов фильтра поиска по врачу

    //элементы фильтра поиска срочности
    let priorityAll = new DOMElement('option', 'filterOption', 'all').render()
    let priorityLow = new DOMElement('option', 'filterOption', 'low').render()
    let priorityNormal = new DOMElement('option', 'filterOption', 'normal').render()
    let priorityHigh = new DOMElement('option', 'filterOption', 'high').render()
    selectPriority.append(priorityAll, priorityLow, priorityNormal, priorityHigh)
    //конец элементов фильтра поиска по срочности


    let doctorArray;
    let priorityArray;
    let keyWordsArray;
    let arrayOfAllIDs;
    let uniqueIDs;
    let twoMatchesArr;
    let threeMatchesArr;

    let uniqueTwoMatchesArr;
    let uniqueThreeMatchesArr;



    searchByDescriptionBtn.addEventListener('click', async () => {
        document.querySelectorAll('.card').forEach(card => card.classList.add('hidden'))
        document.querySelectorAll('.card').forEach(function (card) {
            card.classList.remove('matchesTwocriterias')
        })
        uniqueIDs = [];
        arrayOfAllIDs = [];
        doctorArray = []//
        priorityArray = []
        keyWordsArray = []

        twoMatchesArr = []
        threeMatchesArr = []
        uniqueThreeMatchesArr = []
        uniqueTwoMatchesArr = []

        let doctor = select.value
        await API.getAllCards().then(response => response.forEach(function (object) {
                if (doctor === 'Все') {
                    doctorArray.push(object.id)
                } else if (object.doctor.elementValue === 'Стоматолог') {
                    if (doctor === 'Стоматолог') {
                        doctorArray.push(object.id)
                    }
                } else if (object.doctor.elementValue === 'Терапевт') {
                    if (doctor === 'Терапевт') {
                        doctorArray.push(object.id)
                    }
                } else if (object.doctor.elementValue === 'Кардиолог') {
                    if (doctor === 'Кардиолог') {
                        doctorArray.push(object.id)
                    }
                }
            }
        ))

        let priority = selectPriority.value;
        await API.getAllCards().then(response => response.forEach(function (object) {
            if (priority === 'all') {
                priorityArray.push(object.id)
            } else if (object.priority.elementValue === 'low') {
                if (priority === 'low') {
                    priorityArray.push(object.id)
                }
            } else if (object.priority.elementValue === 'normal') {
                if (priority === 'normal') {
                    priorityArray.push(object.id)
                }
            } else if (object.priority.elementValue === 'high') {
                if (priority === 'high') {
                    priorityArray.push(object.id)
                }
            }
        }))

        let searchValue = searchByDescription.value
        await API.getAllCards().then(response => response.forEach(function (object) {
            if (object.description.elementValue.includes(searchValue)) {
                keyWordsArray.push(object.id)
            }
        }))

        arrayOfAllIDs = doctorArray.concat(priorityArray, keyWordsArray)
        arrayOfAllIDs.sort()

        for (let i = 0; i < arrayOfAllIDs.length; i++){
            let test = arrayOfAllIDs.filter(element => element === arrayOfAllIDs[i])
            if (test.length === 2){
                twoMatchesArr.push(test[0])
                uniqueTwoMatchesArr = twoMatchesArr.reduce((uniq,item)=>{
                    return uniq.includes(item) ? uniq : [...uniq,item]
                },[])
            }
            else if(test.length === 3){
                threeMatchesArr.push(test[0])
                uniqueThreeMatchesArr = threeMatchesArr.reduce((uniq,item)=>{
                    return uniq.includes(item) ? uniq : [...uniq,item]
                },[])
            }
        }

        if (uniqueThreeMatchesArr.length === 0 && searchByDescription.value !== ''){
            return
        }
        if (uniqueThreeMatchesArr.length >= 1){
            uniqueThreeMatchesArr.forEach(function (elem){
                document.getElementById(`${elem}`).classList.remove('hidden')
            })
        }
        else if (uniqueThreeMatchesArr.length === 0){
            uniqueTwoMatchesArr.forEach(function (elem){
                document.getElementById(`${elem}`).classList.remove('hidden')
            })
        }
    })
}

