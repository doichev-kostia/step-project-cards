import API from "../components/API.js";
import {Form, VisitForm, VisitFormDentist, VisitFormTherapist, VisitFormCardiologist} from "../components/Form.js";
import {Visit, VisitDentist, VisitTherapist, VisitCardiologist} from "../components/Visit.js";
import DOMElement from "../components/DOMElement.js"
import {ModalLogIn, ModalCreateVisit, ModalShowCard} from "../components/Modal.js";
import {noVisitMessage} from "./main.js";

const root = document.querySelector('#root');
const header = new DOMElement("header", ["header", "wrapper"]).render();
const logoWrapper = new DOMElement("a", "logo-wrapper", "", {href: "#"}).render();
const logo = new DOMElement("img", "logo", "", {src: "../dist/img/logo.png"}).render();
const logInButton = new DOMElement("button", ["btn", "logInBtn"], "Вход").render();
const logInModal = new ModalLogIn(parent, 'Вход', {
    modalWrapper: 'modal-wrapper',
    modal: 'modal',
    crossButton: 'cross',
    title: 'modal__title',
    submitButton: ['btn', "submit-btn"]
}).render();


export default async function createHeaderSection() {

    root.append(header);
    header.append(logoWrapper, logInButton);
    logoWrapper.append(logo);

    let modalElements = await new Promise((resolve, reject) => {
        logInButton.addEventListener("click", event => {
            resolve(logInModal)
        })
    })

    if (await ModalLogIn.verifyLogInData({...modalElements, logInButton})) {
        let allUserCards = await API.getAllCards()
        if (allUserCards.length > 0) {
            await Visit.renderCards(cardsSection, allUserCards);
        } else {
            noVisitMessage.hidden = false;
        }
    }
    await createVisitModal(modalElements);
}

createHeaderSection()

function createVisitModal(modalElements) {
    let {visitButton} = modalElements
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

    let doctorForm = await new Promise((resolve, reject) => {
        doctorSelect.addEventListener("change", event => {
            resolve(renderChosenDoctorForm(modal, event.target.value));
        })
    })

    doctorForm.submitButton.addEventListener("click", async (event) => {
        event.preventDefault();

        if (await VisitForm.validateData(doctorForm)) {
            let error = [...doctorForm.form.children].filter(item => item.tagName.toLowerCase() === "span")
            if (error.length < 1) {
                let card = await Visit.createVisitCard(doctorForm);
                await Visit.renderCards(document.querySelector(".visit-section"), card);
                modalWrapper.remove()
            } else {
                error.remove()
            }
        } else {
            let error = [...doctorForm.form.children].filter(item => item.tagName.toLowerCase() === "span")
            if (error.length < 1) {
                error = new DOMElement("span", "modal__error", "Заполните пожалуйста все поля с *").render();
                doctorForm.submitButton.before(error)
            }
        }
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

