import API from "../components/API.js";
import {Form, VisitForm, VisitFormDentist, VisitFormTherapist, VisitFormCardiologist} from "../components/Form.js";
import {Visit, VisitDentist, VisitTherapist, VisitCardiologist} from "../components/Visit.js";
import DOMElement from "../components/DOMElement.js"
import {ModalLogIn, ModalCreateVisit} from "../components/Modal.js";
import {noVisitMessage, visitSection} from "./main.js";
import {filterContainer,createFilter} from '../components/filter.js'

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

export default async function createHeaderSection(authorized) {
    root.append(header);
    header.append(logoWrapper);
    logoWrapper.append(logo);

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

        if (await ModalLogIn.verifyLogInData({...modalElements, logInButton, createVisitButton})) {
            await renderAllUserCards()
        }
    }

    await createVisitModal(createVisitButton);
    createFilter(filterContainer)
}

async function renderAllUserCards() {
    let allUserCards = await API.getAllCards()
    if (allUserCards.length > 0) {
        noVisitMessage.hidden = true
        await Visit.renderCards(visitSection, allUserCards);
    } else {
        noVisitMessage.hidden = false;
    }
}


function createVisitModal(visitButton) {
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

    const hint = new DOMElement("span",
        "form__hint",
        "Поля с * обязательны для заполнения").render()

    form = form.renderForm()
    form.append(hint, doctorSelect);
    modal.append(form);

    doctorSelect.addEventListener("change", event => handleSelectClick(event));

    function handleSelectClick(event) {
        let modalForms = [...event.target.closest(".modal").children]
            .filter(child => child.tagName.toLowerCase() === "form");

        if (modalForms.length > 1) {
            for (let i = 1; i < modalForms.length; i++) {
                modalForms[i].remove()
            }
        }

        let doctorForm = renderChosenDoctorForm(modal, event.target.value)

        doctorForm.submitButton.addEventListener("click", async (event) => {
            console.log(doctorForm)
            await Form.validateForm(doctorForm)
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

