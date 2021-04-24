import API from "../components/API.js";
import Form from "../components/Form.js";
import {Select, Button, TextArea, Input, CreateElement} from "../components/CreateElements.js"
import {ModalLogin, ModalCreateVisit, ModalShowCard} from "../components/Modal.js"
const root = document.querySelector('#root');
let createVisitButton;

export default function createHeaderSection() {
    // const root = document.querySelector('#root');
    let modalLogIn;

    function createLoginButton(parent) {
        const button = new Button(parent, "Вход", ["btn", "logInBtn"]);
        const createdButton = button.render();
        createdButton.addEventListener("click", event => {
            modalLogIn = new ModalLogin(root, 'Вход', {modalWrapper:'modalWrapper',modal:'modal',crossButton: 'cross',title:'modal-title',loginButton:'btn'})
            modalLogIn = modalLogIn.render()
            createVisitModal()
        })
    }
    function createVisitModal(){
        let {modalWrapper,modal,crossButton,title,visitButton,emailInput,loginButton,passwordInput} = modalLogIn
        visitButton.addEventListener('click', ()=>{
            createVisitForm()
        })
    }

    const header = new CreateElement("header", ["header", "wrapper"]).render();
    const logoWrapper = new CreateElement("a", ["logo-wrapper"]).render();
    const logo = new CreateElement("img", ["logo"]).render();
    logo.src = "../dist/img/logo.png";
    root.append(header);
    header.append(logoWrapper)
    createLoginButton(header);
    logoWrapper.append(logo)

    // createVisitModal()

}
createHeaderSection()
function createVisitForm(){
    const modal = new ModalCreateVisit(root,"Создать визит",{modalWrapper:'modalWrapper',modal:'modal',crossButton: 'cross',title:'modal-title',loginButton:'btn'}).render()
    const form = new Form(modal, "form");
    const formElement = form.render();
    const chooseDoctor = form.createSelect(
        ["Выберите врача:","Кардиолог", "Стоматолог", "Терапевт"],
        ["chooseDoctor", "cardiologist", "dentist", "therapist"],
        {
            select: "form-select",
            option: "form-option"
        });
    const fullName = form.createInput("ФИО","form-input", "text");
    const priority = form.createSelect(
        ["Срочность","Обычная","Приоритетная","Неотложная"],
        ["priority", "medium", "high", "crucial"],
        {
            select: "form-select",
            option: "form-option"
        }
    );
    const reason = form.createInput("Цель визита","form-input", "text");
    const description = form.createTextArea("Краткое описание",
        "description",
        {
            label: "form-label",
            textArea: "form-textarea"
        });
    chooseDoctor[1].disabled = true;
    priority[1].disabled = true;
    chooseDoctor[0].addEventListener("change", event=>{
        let value = event.currentTarget.value;
        doctorFormSet(value, form.elements.form )
    })
}


function doctorFormSet(chosenDoctor, parent){
    if (chosenDoctor === "cardiologist"){
        cardiologistSet(true, parent, chosenDoctor);
    }else if (chosenDoctor === "dentist"){
        dentistSet(true, parent, chosenDoctor);
    }else if( chosenDoctor === "therapist"){
        therapistSet(true, parent, chosenDoctor);
    }
}
function deleteDoctorSet(parent, doctor){
    let toDelete = [...parent.children].filter(child =>child.name === doctor)
}
function therapistSet(flag, parent, doctor){
    /**
     * flag is a boolean value that informs to append the element(true) or delete it(false)
     * */
    let age;
    if (flag){
        age = new Input(parent, "Возраст", "form-input", "number");
        const ageElem = age.render();
        ageElem.name = doctor
        ageElem.min = "0";
        ageElem.max = "120";
        ageElem.title = "Введите значение от 0 до 120"
    }else {
        deleteDoctorSet(parent, doctor)
    }
}
function dentistSet(flag, parent, doctor){
    /**
     * flag is a boolean value that informs to append the element(true) or delete it(false)
     * */
    let date;// Previous appointment date
    if (flag){
        date = new Input(parent, "Дата последнего визита", "form-input", "date");
        const dateEl = date.render()
        dateEl.name = doctor
        therapistSet(false, parent, doctor);
        cardiologistSet(false, parent, doctor);
    }else {
        deleteDoctorSet(parent, doctor)
    }
}
function cardiologistSet(flag, parent, doctor) {
    /**
     * flag is a boolean value that informs to append the element(true) or delete it(false)
     * */
    let bp;//Blood Pressure
    let bmi;// body mass index
    let diseases;
    let age;
    if (flag){
        bp = new Input(parent, "Обычное давление", "form-input", "number");
        const bpElem = bp.render()
        bpElem.name = doctor
        bpElem.max = "160";
        bpElem.min = "50";
        bpElem.title = "Введите значение между 50 и 160";
        bmi = new Input(parent, "Индекс массы тела", "form-input", "number");
        const bmiElem = bmi.render()
        bmiElem.name = doctor
        bmiElem.min = "10";
        bmiElem.max = "60";
        bmiElem.title = "Введите значение от 10 до 60";
        diseases = new Input(parent, "Перенесенные заболевания сердечно-сосудистой системы", "form-input", "text");
        const diseasesElem = diseases.render()
        diseasesElem.name = doctor
        age = new Input(parent, "Возраст", "form-input", "number");
        const ageElem = age.render()
        ageElem.name = doctor
        ageElem.min = "0";
        ageElem.max = "120";
        ageElem.title = "Введите значение от 0 до 120"
        dentistSet(false, parent, doctor);
        therapistSet(false, parent, doctor);
    }else {
        deleteDoctorSet(parent, doctor)
    }
}




