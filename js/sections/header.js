import API from "../components/API.js";
import {Form, VisitForm, VisitFormDentist, VisitFormTherapist, VisitFormCardiologist} from "../components/Form.js";
import {Visit,VisitDentist, VisitTherapist, VisitCardiologist} from "../components/Visit.js";
import DOMElement from "../components/DOMElement.js"
import {ModalLogIn, ModalCreateVisit, ModalShowCard} from "../components/Modal.js";


const root = document.querySelector('#root');

function createFilter(parent){

    let select = new DOMElement('select', 'filterSelect', 'Выберите врача').render()
    let selectConf = new DOMElement('button', 'selectConf', 'ok').render()

    let selectPriority = new DOMElement('select', 'filterSelect', 'Выберите срочность').render()
    let selectPriorityBtn = new DOMElement('button', 'selectConf', 'ok').render()

    let searchByDescription = new DOMElement('input', 'filterSearch', 'Поиск по описанию').render()
    let searchByDescriptionBtn = new DOMElement('button', 'filterSearchBtn', 'Поиск').render()

    parent.prepend(select, selectConf,selectPriority,selectPriorityBtn,searchByDescription,searchByDescriptionBtn);

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




    // let selectPriority = new DOMElement('select', 'filterSelect', 'Выберите срочность').render()
    // let selectPriorityBtn = new DOMElement('button', 'selectConf', 'ok').render()

    selectConf.addEventListener('click', async () => {
        document.querySelectorAll('.card').forEach(card => card.classList.remove('hidden'))
        let doctor = select.value
        await API.getAllCards().then(response => response.forEach(function (object) {
            if (doctor === 'Все') {
                return
            }
            else if (object.doctor.value !== doctor) {
                document.getElementById(`${object.id}`).classList.add('hidden');
            }
        }))
    })
    selectPriorityBtn.addEventListener('click',async ()=>{
        document.querySelectorAll('.card').forEach(card => card.classList.remove('hidden'))
        let priority = selectPriority.value;
        await API.getAllCards().then(response => response.forEach(function (object){
            console.log(object)
            if (priority === 'all') {
                return
            } else if(object.priority.value !== priority){
                document.getElementById(`${object.id}`).classList.add('hidden');
            }
        }))
    })
    searchByDescriptionBtn.addEventListener('click',async ()=>{
        document.querySelectorAll('.card').forEach(card => card.classList.remove('hidden'))
        let searchValue = searchByDescription.value
        await API.getAllCards().then(response => response.forEach(function (object){
            if (searchValue !== object.description.value){
                document.getElementById(`${object.id}`).classList.add('hidden');
            }
        }))
    })
}

export default async function createHeaderSection() {
    const header = new DOMElement("header", ["header", "wrapper"]).render();
    const logoWrapper = new DOMElement("a", "logo-wrapper", "", {href: "#"}).render();
    const logo = new DOMElement("img", "logo", "", {src: "../dist/img/logo.png"}).render();
    const main = new DOMElement("main", "main").render();
    const cardSection = new DOMElement("section", ["visit-section", "wrapper"]).render()
    const noVisitMessage = new DOMElement("p", "no-visit-message", "Визитов не добавлено", {hidden: true}).render();
    let filterContainer = new DOMElement('div', ['filter-section','wrapper'], '').render()


    root.append(header, main);
    main.append(cardSection);
    cardSection.append(noVisitMessage)
    header.append(logoWrapper);
    logoWrapper.append(logo);
    main.prepend(filterContainer)

    const logInButton = createLoginButton(header);
    let modalElements = await new Promise((resolve, reject) => {
        logInButton.addEventListener("click", event => {
            let modalElem = createLoginModal(root)
            resolve(modalElem)
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
    }
    await createVisitModal(modalElements);
}
createHeaderSection()


function createLoginButton(parent) {
    const logInButton = new DOMElement("button", ["btn", "logInBtn"], "Вход").render();

    parent.append(logInButton);

    return logInButton;
}

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
      if(card.doctor.value === "Терапевт"){
          const therapistCard = new VisitTherapist(card).renderCard();
          parent.append(therapistCard.cardContainer);
      }else if(card.doctor.value === "Кардиолог"){
            const cardiologistCard = new VisitCardiologist(card).renderCard();
            parent.append(cardiologistCard.cardContainer);
      } else if(card.doctor.value === "Стоматолог"){
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
        title: 'modal-title',
        submitButton: 'btn'
    }).render()

    const {modalWrapper, modal} = visitModal;

    const doctorSelect = new DOMElement("select", "form__select").render();
    let optionsTextArr = ["Выберите врача: ", "Терапевт", "Стоматолог", "Кардиолог"];
    let optionsValueArr = ["", "therapist", "dentist", "cardiologist"];
    let optionsArr = []
    for (let i = 0; i < optionsTextArr.length; i++) {
        let option = new DOMElement("option", "form__option", optionsTextArr[i], {
            value: optionsValueArr[i]
        }).render()
        optionsArr.push(option)
        doctorSelect.append(option);
    }


    optionsArr.forEach(item => item.disabled = item.value === "");

    modal.append(doctorSelect);

    let doctorForm = await new Promise((resolve, reject) => {
        doctorSelect.addEventListener("change", event => {
            resolve(renderChosenDoctorForm(modal, event.target.value));
        })
    })

    doctorForm.submitButton.addEventListener("click", async (event) => {
        event.preventDefault();
        await createVisitCard(doctorForm);
        modalWrapper.remove()
    })


    modal.append(doctorForm.form)
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




