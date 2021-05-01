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

    //элементы фильтра поиска срочности
    let priorityAll = new DOMElement('option', 'filterOption', 'all').render()
    let priorityLow = new DOMElement('option', 'filterOption', 'low').render()
    let priorityNormal = new DOMElement('option', 'filterOption', 'normal').render()
    let priorityHigh = new DOMElement('option', 'filterOption', 'high').render()
    selectPriority.append(priorityAll, priorityLow, priorityNormal, priorityHigh)
    //конец элементов фильтра поиска по срочности

    /**
     * [doctorArray] collects user IDs matching the search criteria
     * **/
    let doctorArray;
    /**
     * [priorityArray] collects user IDs matching the search criteria
     * **/
    let priorityArray;
    /**
     * [keyWordsArray] collects user IDs matching a card description field
     * **/
    let keyWordsArray;
    /**
     * [arrayOfAllIDs] concats keyWordsArray, priorityArray and doctorArray into the one and contains all the IDs.
     * **/
    let arrayOfAllIDs;
    /**
     * [twoMatchesArr] contains the IDs that match on two criteria (this array contains duplicate IDs. E.G. [15605,15605,15606,15606]
     * **/
    let twoMatchesArr;
    /**
     * [threeMatchesArr] contains the IDs that match on three criteria (this array contains duplicate IDs. E.G. [15605,15605,15605,15606,15606,15606]
     * **/
    let threeMatchesArr;

    /**
     * [uniqueTwoMatchesArr] contains the IDs that match on three criteria without duplicates
     * **/
    let uniqueTwoMatchesArr;
    /**
     * [uniqueThreeMatchesArr] contains the IDs that match on three criteria without duplicates
     * **/
    let uniqueThreeMatchesArr;



    searchByDescriptionBtn.addEventListener('click', async () => {
        document.querySelectorAll('.card').forEach(card => card.classList.add('hidden'))
        document.querySelectorAll('.card').forEach(function (card) {
            card.classList.remove('matchesTwocriterias')
        })

        /**
         * [] contains the IDs that match on three criteria without duplicates
         * **/
        arrayOfAllIDs = [];
        doctorArray = []//
        priorityArray = []
        keyWordsArray = []

        twoMatchesArr = []
        threeMatchesArr = []
        uniqueThreeMatchesArr = []
        uniqueTwoMatchesArr = []
        /**
         * strings 81-89 clear the arrays in the beginning of every function call
         * **/

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

        /**
         * duplicate variable contains an array of repeating IDs (the IDs will repeat if the search criteria matched on two or more criteria)
         * **/
        for (let i = 0; i < arrayOfAllIDs.length; i++){
            let duplicate = arrayOfAllIDs.filter(element => element === arrayOfAllIDs[i])

            /**
             * if an ID repeated two/three times (matched on two/three criteria), a 'duplicate' array will have a length of two (two same IDs)
             * strings 154-166 will erase the duplicates so that we only have a unique ID that matched on two or three criteria
             * **/

            if (duplicate.length === 2){
                twoMatchesArr.push(duplicate[0])
                uniqueTwoMatchesArr = twoMatchesArr.reduce((uniq,item)=>{
                    return uniq.includes(item) ? uniq : [...uniq,item]
                },[])
            }
            else if(duplicate.length === 3){
                threeMatchesArr.push(duplicate[0])
                uniqueThreeMatchesArr = threeMatchesArr.reduce((uniq,item)=>{
                    return uniq.includes(item) ? uniq : [...uniq,item]
                },[])
            }
        }

        /**
         * If an ID didn't match on none of the criteria, no IDs will be removed a hidden class
         * **/

        if (uniqueThreeMatchesArr.length === 0 && searchByDescription.value !== ''){
            return
        }
        /**
         * Should uniqueThreeMatchesArr array contain one or more items, that will mean that some ID matched on three criteria.
         * The hidden class will be removed from them
         * **/
        if (uniqueThreeMatchesArr.length >= 1){
            uniqueThreeMatchesArr.forEach(function (elem){
                document.getElementById(`${elem}`).classList.remove('hidden')
            })
        }
        /**
         * Should uniqueThreeMatchesArr array length be 0, that will mean that none of the IDs matched on three criteria, only two.
         * The hidden class will be removed from IDs that appeared in the uniqueTwoMatchesArr array.
         * **/
        else if (uniqueThreeMatchesArr.length === 0){
            uniqueTwoMatchesArr.forEach(function (elem){
                document.getElementById(`${elem}`).classList.remove('hidden')
            })
        }
    })
}

