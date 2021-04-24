import API from "../components/API.js";
import Form from "../components/Form.js";
// import {Visit, VisitCardiologist, VisitDentist, VisitTherapist} from "../components/Visit.js";
import DOMElement from "../components/DOMElement.js"
import {ModalLogIn, ModalCreateVisit, ModalShowCard} from "../components/Modal.js";


const root = document.querySelector('#root');

export default function createHeaderSection() {
    const header = new DOMElement("header", ["header", "wrapper"]).render();
    const logoWrapper = new DOMElement("a", "logo-wrapper", "", {href: "#"}).render();
    const logo = new DOMElement("img", "logo", "", {src: "../dist/img/logo.png"}).render();

    root.append(header);
    header.append(logoWrapper);
    logoWrapper.append(logo);

    createLoginButton(header, root);
}

createHeaderSection()


function createLoginButton(parent, modalParent) {
    const loginButton = new DOMElement("button", ["btn", "logInBtn"], "Вход").render();

    loginButton.addEventListener("click", event => {
        let modalLogInElements = new ModalLogIn(modalParent, 'Вход', {
            modalWrapper: 'modal-wrapper',
            modal: 'modal',
            crossButton: 'cross',
            title: 'modal-title',
            submitButton: 'btn'
        }).render();

        createVisitModal(modalLogInElements)
    })

    parent.append(loginButton);
}

function createVisitModal(modalElements) {
    let {modalWrapper, modal, crossButton, title, visitButton, emailInput, loginButton, passwordInput} = modalElements
    visitButton.addEventListener('click', () => {
        createVisitForm()
    })
}

function createVisitForm() {
    const modal = new ModalCreateVisit(root, "Создать визит", {
        modalWrapper: 'modal-wrapper',
        modal: 'modal',
        crossButton: 'cross',
        title: 'modal-title',
        submitButton: 'btn'
    }).render()

    const form = new Form("form");
    const formElement = form.renderForm()


    const chooseDoctor = form.renderSelect("",
        ["", "cardiologist", "dentist", "therapist"],
        {select: "form__select", options: "form__options"},
        ["Выберите врача: ", "Кардиолог", "Стоматолог", "Терапевт"],
        {select:{required: true}});

    const fullName = form.renderInput("", {input: "form__input"}, "ФИО", {input:{required: true}});

    const priority = form.renderSelect("",
        ["", "regular", "medium", "high"],
        {select: "form__select", options: "form__options"},
        ["Срочность: ", "Обычная", "Приоритетная", "Неотложная"],
        {select:{required: true}});

    const reason = form.renderInput("", {input: "form__input"}, "Цель визита", {input:{required: true}});

    const doctorIndividualParametersContainer = new DOMElement("div", "form__doctor-input-container").render();//Needed to store the information that belongs to a specific doctor

    formElement.append(doctorIndividualParametersContainer)

    const submitButton = form.renderInput("", {input: "btn"}, "", {input:{type: "submit",value: "Создать визит"}});

    chooseDoctor.forEach(item => {
        if (item.value === "" && item.tagName.toLowerCase() === "option") {
            item.disabled = true
        }
    })

    priority.forEach(item => {
        if (item.value === "" && item.tagName.toLowerCase() === "option") {
            item.disabled = true
        }
    })



    chooseDoctor.forEach(item => {
        if (item.tagName.toLowerCase() === "select") {
            item.addEventListener("change", event => {
                let value = event.currentTarget.value;
                doctorFormSet(value, doctorIndividualParametersContainer, form)
            })
        }
    })

    modal.append(formElement);



}

function doctorFormSet(chosenDoctor, parent, form){
    if (chosenDoctor === "cardiologist"){
        cardiologistSet(true, parent, chosenDoctor, form);
    }else if (chosenDoctor === "dentist"){
        dentistSet(true, parent, chosenDoctor, form);
    }else if( chosenDoctor === "therapist"){
        therapistSet(true, parent, chosenDoctor, form);
    }
}

function deleteDoctorSet(parent, doctor){
    let toDelete = [...parent.children].filter(child =>child.dataset.doctor !== doctor && child.dataset.doctor !== undefined )

    if (toDelete.length > 0){
        toDelete.forEach(elem => elem.remove());
    }
}

function therapistSet(flag, parent, doctor, form) {
    /**
     * flag is a boolean value that informs to append the element(true) or delete it(false)
     * */

    if (flag) {
        let age = form.renderInput("",
            {input: "form__input"},
            "Возраст",
            {input: {
                min: "0",
                max: "120",
                title: "Введите значение от 0 до 120",
                required: true,
                type: "number",
                    maxLength: "3",
                    size: "3"

                }
            },
            {parent: parent, position: "beforeend"})

        age.dataset.doctor = doctor;

        let description = form.renderTextarea("Краткое описание: ",
            {label: "form__label", textarea: "form__textarea"},
            "description",
            {},
            {parent: parent, position: "beforeend"});

        description[0].dataset.doctor = doctor;// <label> is parent for textarea and has index 0

        cardiologistSet(false, parent, doctor);
        dentistSet(false, parent, doctor)
    } else {
        deleteDoctorSet(parent, doctor)
    }
}

function dentistSet(flag, parent, doctor, form) {
    /**
     * flag is a boolean value that informs to append the element(true) or delete it(false)
     * */

    if (flag) {
        let date = form.renderInput("", //date of the previous appointment
            {input: "form__input"},
            "Дата последнего визита",
            {
                input: {
                    type: "date"
                }
            },
            {parent: parent, position: "beforeend"});

        date.dataset.doctor = doctor;

        let description = form.renderTextarea("Краткое описание: ",
            {label: "form__label", textarea: "form__textarea"},
            "description",
            {},
            {parent: parent, position: "beforeend"});

        description[0].dataset.doctor = doctor;// <label> is parent for textarea and has index 0

        therapistSet(false, parent, doctor);
        cardiologistSet(false, parent, doctor);
    } else {
        deleteDoctorSet(parent, doctor)
    }
}

function cardiologistSet(flag, parent, doctor, form) {
    /**
     * flag is a boolean value that informs to append the element(true) or delete it(false)
     * */

    if (flag){
        let bp = form.renderInput("", //Blood Pressure
            {input: "form__input"},
            "Обычное давление",
            {input: {
                type: "text",
                max: "160",
                min: "50",
                title: "Введите значение между 50 и 160",
                    maxLength: "6",
                    size: "6",
                }
            },
            {parent: parent, position: "beforeend"});

        bp.dataset.doctor = doctor;

        let bmi = form.renderInput("", // body mass index
            {input: "form__input"},
            "Индекс массы тела",
            {input: {
                type: "number",
                max: "60",
                min: "10",
                title: "Введите значение между 10 и 60",
                    maxLength: "5",
                    size: "5"
                }
            },
            {parent: parent, position: "beforeend"});

        bmi.dataset.doctor = doctor;

        let heartDiseases = form.renderInput("",
            {input: "form__input"},
            "Перенесенные заболевания сердечно-сосудистой системы",
            {},
            {parent: parent, position: "beforeend"});

        heartDiseases.dataset.doctor = doctor;

        let age = form.renderInput("",
            {input: "form__input"},
            "Возраст",
            {input: {
                min: "0",
                max: "120",
                title: "Введите значение от 0 до 120",
                required: true,
                type: "number",
                    maxLength: "3",
                    size: "3"
                }
            },
            {parent: parent, position: "beforeend"})

        age.dataset.doctor = doctor;

        let description = form.renderTextarea("Краткое описание: ",
            {label: "form__label", textarea: "form__textarea"},
            "description",
            {},
            {parent: parent, position: "beforeend"});

        description[0].dataset.doctor = doctor;// <label> is parent for textarea and has index 0

        bp.addEventListener("keydown", event =>{
            let targetValue = event.target.value;
            if(targetValue.length === 3){
                targetValue += "/"
                event.target.value = targetValue;
                if(event.code === "Backspace"){
                    targetValue = ""
                    event.target.value = targetValue
                }
            }

        })

        dentistSet(false, parent, doctor);
        therapistSet(false, parent, doctor);
    }else {
        deleteDoctorSet(parent, doctor)
    }
}

