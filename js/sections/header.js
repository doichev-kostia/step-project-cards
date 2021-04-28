import API from "../components/API.js";
import {Form, VisitForm, VisitFormDentist, VisitFormTherapist, VisitFormCardiologist} from "../components/Form.js";
import {Visit,VisitDentist, VisitTherapist, VisitCardiologist} from "../components/Visit.js";
import DOMElement from "../components/DOMElement.js"
import {ModalLogIn, ModalCreateVisit, ModalShowCard} from "../components/Modal.js";


const root = document.querySelector('#root');

export default async function createHeaderSection() {
    const header = new DOMElement("header", ["header", "wrapper"]).render();
    const logoWrapper = new DOMElement("a", "logo-wrapper", "", {href: "#"}).render();
    const logo = new DOMElement("img", "logo", "", {src: "../dist/img/logo.png"}).render();
    const main = new DOMElement("main", "main").render();
    const cardSection = new DOMElement("section", ["visit-section", "wrapper"]).render()
    const noVisitMessage = new DOMElement("p", "no-visit-message", "Визитов не добавлено", {hidden: true}).render();

    root.append(header, main);
    main.append(cardSection);
    cardSection.append(noVisitMessage)
    header.append(logoWrapper);
    logoWrapper.append(logo);

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
        title: 'modal__title',
        submitButton: ['btn', "submit-btn"]
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
                let error = new DOMElement('span', 'modal__error', 'Incorrect username or password').render()
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
      if(card.doctor.elementValue === "Терапевт"){
          const therapistCard = new VisitTherapist(card).renderCard();
          parent.append(therapistCard.cardContainer);
      }else if(card.doctor.elementValue === "Кардиолог"){
            const cardiologistCard = new VisitCardiologist(card).renderCard();
            parent.append(cardiologistCard.cardContainer);
      } else if(card.doctor.elementValue === "Стоматолог"){
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

    let doctorForm = await new Promise((resolve, reject) => {
        doctorSelect.addEventListener("change", event => {
            resolve(renderChosenDoctorForm(modal, event.target.value));
        })
    })

    doctorForm.submitButton.addEventListener("click", async (event) => {
        event.preventDefault();
        if(await validateData(doctorForm)){
            let error = [...doctorForm.form.children].filter(item => item.tagName.toLowerCase() === "span")
            if(error.length < 1){
                await createVisitCard(doctorForm);
                modalWrapper.remove()
            }else {
                error.remove()
            }
        }else{
           let error = [...doctorForm.form.children].filter(item => item.tagName.toLowerCase() === "span")
           if(error.length < 1){
            error = new DOMElement("span", "modal__error", "Заполните пожалуйста все поля с *").render();
            doctorForm.submitButton.before(error)
           }
        }
    })


    modal.append(doctorForm.form)
}

async function validateData(elements) {
    let inputs = []
    for(let [objectKey, objectValue] of Object.entries(elements)){
        if(objectKey !== "card"){
            if (objectValue.tagName.toLowerCase() === "label"){
                if(objectValue.children[0].tagName.toLowerCase() !== "textarea"){
                    inputs.push(...objectValue.children);
                }
            }
        }
    }

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value.length < 1){
            return false
        }
    }
    return true
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
            visitDetails[key].elementValue = formElementsObj[key].children[0].value;
    }

    let response = await API.saveCard(visitDetails);
    let cardSection = document.querySelector(".visit-section");
    renderCards(cardSection, response)
}
