import API from "../components/API.js";
import {Form, VisitForm, VisitFormDentist, VisitFormTherapist, VisitFormCardiologist} from "../components/Form.js";
import {Visit, VisitDentist, VisitTherapist, VisitCardiologist} from "../components/Visit.js";
import DOMElement from "../components/DOMElement.js"
import {ModalLogIn, ModalCreateVisit} from "../components/Modal.js";
import {noVisitMessage, visitSection} from "./main.js";

const root = document.querySelector('#root');
const header = new DOMElement("header", ["header", "wrapper"]).render();
const logoWrapper = new DOMElement("a", "logo-wrapper", "", {href: "#"}).render();
const logo = new DOMElement("img", "logo", "", {src: "../dist/img/logo.png"}).render();
const logInButton = new DOMElement("button", ["btn", "logInBtn"], "Вход").render();
const logInModal = new ModalLogIn(root, 'Вход', {
    modalWrapper: 'modal-wrapper',
    modal: 'modal',
    crossButton: 'cross',
    title: 'modal__title',
    submitButton: ['btn', "submit-btn"]
});
const createVisitButton = new DOMElement("button", ["btn", "visitBtn"], "Создать визит").render()


function createFilter(parent) {

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



    searchByDescriptionBtn.addEventListener('click', async () => {
        document.querySelectorAll('.card').forEach(card => card.classList.add('hidden'))
        document.querySelectorAll('.card').forEach(function (card){
            card.classList.remove('matchesTwocriterias')
        })
        uniqueIDs = [];
        arrayOfAllIDs = [];
        doctorArray = []//
        priorityArray = []
        keyWordsArray = []



        let doctor = select.value
        await API.getAllCards().then(response => response.forEach(function (object) {
                if (doctor === 'Все') {
                    doctorArray.push(object.id)
                } else if (object.doctor.value === 'Стоматолог') {
                    if (doctor === 'Стоматолог') {
                        doctorArray.push(object.id)
                    }
                } else if (object.doctor.value === 'Терапевт') {
                    if (doctor === 'Терапевт') {
                        doctorArray.push(object.id)
                    }
                } else if (object.doctor.value === 'Кардиолог') {
                    if (doctor === 'Кардиолог') {
                        doctorArray.push(object.id)
                    }
                }
            }
        ))
        console.log('doctors: ' + doctorArray)

        let priority = selectPriority.value;
        await API.getAllCards().then(response => response.forEach(function (object) {
            if (priority === 'all') {
                priorityArray.push(object.id)
            } else if (object.priority.value === 'low') {
                if (priority === 'low') {
                    priorityArray.push(object.id)
                }
            } else if (object.priority.value === 'normal') {
                if (priority === 'normal') {
                    priorityArray.push(object.id)
                }
            } else if (object.priority.value === 'high') {
                if (priority === 'high') {
                    priorityArray.push(object.id)
                }
            }
        }))
        console.log('priority: ' + priorityArray)

        // document.querySelectorAll('.card').forEach(card => card.classList.remove('hidden'))
        let searchValue = searchByDescription.value
        await API.getAllCards().then(response => response.forEach(function (object) {
            if (searchValue === object.description.value) {
                keyWordsArray.push(object.id)
            }
        }))
        console.log('keywords: ' + keyWordsArray)

        arrayOfAllIDs = doctorArray.concat(priorityArray,keyWordsArray)
        arrayOfAllIDs.sort()
        console.log('all IDs: ' +arrayOfAllIDs)

            for (let i =0; i < arrayOfAllIDs.length; i++){
                let test = arrayOfAllIDs.filter(item => item === arrayOfAllIDs[i])
                // console.log(test)
                if (test.length === 3){
                    document.getElementById(`${test[0]}`).classList.remove('matchesTwocriterias')
                    // document.getElementById(`${test[0]}`).classList.add('matchesThreeCriterias')
                    document.getElementById(`${test[0]}`).classList.remove('hidden')

                }
                 else if (test.length === 2){
                    document.getElementById(`${test[0]}`).classList.add('matchesTwocriterias')
                    document.getElementById(`${test[0]}`).classList.remove('hidden')
                }
            }
    })
}



export default async function createHeaderSection() {
    const header = new DOMElement("header", ["header", "wrapper"]).render();
    const logoWrapper = new DOMElement("a", "logo-wrapper", "", {href: "#"}).render();
    const logo = new DOMElement("img", "logo", "", {src: "../dist/img/logo.png"}).render();
    const main = new DOMElement("main", "main").render();
    const cardSection = new DOMElement("section", ["visit-section", "wrapper"]).render()
    const noVisitMessage = new DOMElement("p", "no-visit-message", "Визитов не добавлено", {hidden: true}).render();
    let filterContainer = new DOMElement('div', ['filter-section', 'wrapper'], '').render()


export default async function createHeaderSection(authorized) {

    root.append(header);
    header.append(logoWrapper);
    logoWrapper.append(logo);
    main.prepend(filterContainer)

    if(authorized){
        header.append(createVisitButton);
        await renderAllUserCards()
    }else{
        header.append(logInButton)
        let modalElements = await new Promise((resolve, reject) => {
            logInButton.addEventListener("click", event => {
                resolve(logInModal.render())
            })
        })

    if (await verifyLoginData({...modalElements, logInButton})) {
        let allUserCards = await API.getAllCards()
        if (allUserCards.length > 0) {
            await renderCards(cardSection, allUserCards);
        } else {
            noVisitMessage.hidden = false;
        }
        createFilter(filterContainer)
        if (await ModalLogIn.verifyLogInData({...modalElements, logInButton, createVisitButton})) {
            await renderAllUserCards()
        }
    }

    await createVisitModal(createVisitButton);
}

async function renderAllUserCards(){
    let allUserCards = await API.getAllCards()
    if (allUserCards.length > 0) {
        noVisitMessage.hidden = true
        await Visit.renderCards(visitSection, allUserCards);
    } else {
        noVisitMessage.hidden = false;
    }
}

function createVisitModal(visitButton) {
function createLoginModal(parent) {
    return new ModalLogIn(parent, 'Вход', {
        modalWrapper: 'modal-wrapper',
        modal: 'modal',
        crossButton: 'cross',
        title: 'modal-title',
        submitButton: 'btn'
    }).render();
}

async function verifyLoginData(modalElements) {
    const {
        form,
        modalWrapper,
        modal,
        crossButton,
        title,
        submitButton,
        emailInput,
        passwordInput,
        visitButton,
        logInButton
    } = modalElements;

    return new Promise((resolve, reject) => {
        submitButton.addEventListener('click', async (event) => {
            event.preventDefault();

            const credentials = {
                email: emailInput.value,
                password: passwordInput.value,
            }
            const {email, password} = credentials;

            try {
                let response = await API.login({email, password})
                modalWrapper.remove()
                logInButton.replaceWith(visitButton)
                resolve(true)
            } catch (e) {
                console.error(e)
                let error = new DOMElement('span', 'modal-error', 'Incorrect username or password').render()
                form.insertAdjacentElement('beforebegin', error)
                setTimeout(() => {
                    error.remove()
                }, 2000)
                resolve(false)
            }
        })
    })
}

function renderCards(parent, cards) {
    if (!Array.isArray(cards)) {
        cards = [cards]
    }

    const noVisitMessage = document.querySelector(".no-visit-message");
    noVisitMessage.hidden = true;

    cards.forEach(card => {
        if (card.doctor.value === "Терапевт") {
            const therapistCard = new VisitTherapist(card).renderCard();
            parent.append(therapistCard.cardContainer);
        } else if (card.doctor.value === "Кардиолог") {
            const cardiologistCard = new VisitCardiologist(card).renderCard();
            parent.append(cardiologistCard.cardContainer);
        } else if (card.doctor.value === "Стоматолог") {
            const dentistCard = new VisitDentist(card).renderCard();
            parent.append(dentistCard.cardContainer);
        }
    })
}

function createVisitModal(modalElements) {
    let {modalWrapper, modal, crossButton, title, visitButton, emailInput, loginButton, passwordInput} = modalElements
    visitButton.addEventListener('click', () => {
        createVisitForm()
    })
}

async function createVisitForm() {

    const visitModal = new ModalCreateVisit(root, "Создать визит", {
        modalWrapper: 'modal-wrapper',
        modal: 'modal',
        crossButton: 'cross',
        title: 'modal__title',
        submitButton: ['btn'],
        form: "form"
    }).render()

    const {modalWrapper, modal} = visitModal;

    let form = new Form();

    let doctorSelect = form.renderSelect("*Выберите врача: ",
        ["", "therapist", "dentist", "cardiologist"],
        {label: "form__label", select: "form__select", options: "form__options"},
        ["Выберите врача: ", "Терапевт", "Стоматолог", "Кардиолог"])

    doctorSelect.children[0].children[0].disabled = true;

    form = form.renderForm()
    form.append(doctorSelect)
    modal.append(form);

        doctorSelect.addEventListener("change", event => handleSelectClick(event));

    function handleSelectClick(event){
        let modalForms = [...event.target.closest(".modal").children]
            .filter(child => child.tagName.toLowerCase() === "form");

        if(modalForms.length > 1){
            for (let i = 1; i < modalForms.length; i++) {
                modalForms[i].remove()
            }
        }

        let doctorForm = renderChosenDoctorForm(modal, event.target.value)

        doctorForm.submitButton.addEventListener("click", async (event) => {
            // event.preventDefault();
            let card = await Visit.createVisitCard(doctorForm);
            await Visit.renderCards(document.querySelector(".visit-section"), card);
            modalWrapper.remove()
        })

        modal.append(doctorForm.form)
    }
}

function renderChosenDoctorForm(modal, chosenDoctor) {
    const standardArgumentsSet = {
        form: "form",
        label: "form__label",
        input: "form__input",
        textarea: "form__textarea",
        select: "form__select",
        options: "form__option",
        button: ["btn", "form__btn"]
    }

    const cardiologist = new VisitFormCardiologist(standardArgumentsSet);
    const dentist = new VisitFormDentist(standardArgumentsSet);
    const therapist = new VisitFormTherapist(standardArgumentsSet);

    if (chosenDoctor === "cardiologist") {
        dentist.deleteSelf()
        therapist.deleteSelf()
        return cardiologist.renderDoctorSet()
    } else if (chosenDoctor === "dentist") {
        therapist.deleteSelf()
        cardiologist.deleteSelf()
        return dentist.renderDoctorSet()
    } else if (chosenDoctor === "therapist") {
        dentist.deleteSelf()
        cardiologist.deleteSelf()
        return therapist.renderDoctorSet()
    }
}

async function createVisitCard(formElements) {
    let visitDetails = formElements.card
    let formElementsObj = Object.assign(formElements)

    delete formElementsObj.card
    delete formElementsObj.form
    delete formElementsObj.submitButton

    for (let [key, value] of Object.entries(formElementsObj)) {

        visitDetails[key].value = formElementsObj[key].children[0].value;
    }

    let response = await API.saveCard(visitDetails);
    let cardSection = document.querySelector(".visit-section");
    renderCards(cardSection, response)
}




