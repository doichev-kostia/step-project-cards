import API from "../components/API.js";
import Form from "../components/Form.js";
import {Visit, VisitCardiologist, VisitDentist, VisitTherapist} from "../components/Visit.js";
import {Select, Button, TextArea, Input, CreateElement} from "../components/CreateElements.js"
import {ModalLogin, ModalCreateVisit, ModalShowCard} from "../components/Modal.js"


export default function createHeaderSection() {
    const root = document.querySelector('#root');

    function createLoginButton(parent) {
        const button = new Button(parent, "Вход", ["btn", "logInBtn"]);
        const createdButton = button.render();
        createdButton.addEventListener("click", event => {
            const modal = new ModalLogin(root, 'Вход', ['modal-btn', "btn"])
            modal.render()
        })
    }

    const header = new CreateElement("header", ["header", "wrapper"]).render();
    const logoWrapper = new CreateElement("a", ["logo-wrapper"]).render();
    const logo = new CreateElement("img", ["logo"]).render();
    logo.src = "../dist/img/logo.png";

    const TODELETE = document.createElement("div");
    TODELETE.classList.add("wrapper");

    root.append(header, TODELETE);
    header.append(logoWrapper)
    createLoginButton(header);
    logoWrapper.append(logo)




    function test(){
        const form = new Form(TODELETE, "form");
        const formElement = form.render();
        const chooseDoctor = form.createSelect(
            ["Выберите врача:","Кардиолог", "Стоматолог", "Терапевт"],
            ["chooseDoctor", "cardiologist", "dentist", "therapist"],
            {
                select: "form-select",
                options: "form-option"
            });
        const fullName = form.createInput("ФИО","form-input", "text");
        const priority = form.createSelect(
            ["Срочность","Обычная","Приоритетная","Неотложная"],
            ["priority", "medium", "high", "crucial"],
            {
                select: "form-select",
                options: "form-option"
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
        let toDelete = [...parent.children].filter(child =>child.dataset.doctor !== doctor && child.dataset.doctor !== undefined )

        if (toDelete.length > 0){
            toDelete.forEach(elem => elem.remove());
        }
    }

    function therapistSet(flag, parent, doctor) {
        /**
         * flag is a boolean value that informs to append the element(true) or delete it(false)
         * */

        let age;
        if (flag) {
            age = new Input(parent, "Возраст", "form-input", "number");
            const ageElem = age.render();
            ageElem.dataset.doctor = doctor
            ageElem.min = "0";
            ageElem.max = "120";
            ageElem.title = "Введите значение от 0 до 120";

            cardiologistSet(false, parent, doctor);
            dentistSet(false, parent, doctor)
        } else {
            deleteDoctorSet(parent, doctor)
        }
    }

    function dentistSet(flag, parent, doctor) {
        /**
         * flag is a boolean value that informs to append the element(true) or delete it(false)
         * */

        let date;// Previous appointment date
        if (flag) {
            date = new Input(parent, "Дата последнего визита", "form-input", "date");
            const dateEl = date.render()
            dateEl.dataset.doctor = doctor

            therapistSet(false, parent, doctor);
            cardiologistSet(false, parent, doctor);
        } else {
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
            bpElem.dataset.doctor = doctor
            bpElem.max = "160";
            bpElem.min = "50";
            bpElem.title = "Введите значение между 50 и 160";

            bmi = new Input(parent, "Индекс массы тела", "form-input", "number");
            const bmiElem = bmi.render()
            bmiElem.dataset.doctor = doctor
            bmiElem.min = "10";
            bmiElem.max = "60";
            bmiElem.title = "Введите значение от 10 до 60";

            diseases = new Input(parent, "Перенесенные заболевания сердечно-сосудистой системы", "form-input", "text");
            const diseasesElem = diseases.render()
            diseasesElem.dataset.doctor = doctor

            age = new Input(parent, "Возраст", "form-input", "number");
            const ageElem = age.render()
            ageElem.dataset.doctor = doctor
            ageElem.min = "0";
            ageElem.max = "120";
            ageElem.maxLength = "3"
            ageElem.title = "Введите значение от 0 до 120"

            dentistSet(false, parent, doctor);
            therapistSet(false, parent, doctor);
        }else {
            deleteDoctorSet(parent, doctor)
        }
    }

    // test()

}

createHeaderSection()

export async function visitTest(parent){

    const visit = await new VisitDentist(parent, {
        doctor: "cardiologist",
        fullName: "Gogi Doe",
        priority: "medium",
        reason: "Any text",
        description: "Anything"
    })
    visit.createCard()
}
