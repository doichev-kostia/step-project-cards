import API from "../components/API.js";
import Form from "../components/Form.js";
import {Visit} from "../components/Visit.js";
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
    let labelsObj = {
        fullName: "ФИО: ",
        doctor: "Доктор: ",
        priority: "Приоритетность: ",
        reason: "Цель визита: ",
        description: "Описание визита: ",
        bloodPressure: "Обычное давление: ",
        bmi: "Индекс массы тела: ", //body mass index
        diseases: "Заболевания сердечно-сосудистой системы: ",
        age: "Возраст: ",
        date: "Дата последнего посещения: "
    }
    if (!Array.isArray(cards)) {
        cards = [cards]
    }

    const noVisitMessage = document.querySelector(".no-visit-message");
    noVisitMessage.hidden = true;

    cards.forEach(card => {
        const userCard = new Visit(card, labelsObj).render();
        parent.append(userCard);
    })
}

function createVisitModal(modalElements) {
    let {modalWrapper, modal, crossButton, title, visitButton, emailInput, loginButton, passwordInput} = modalElements
    visitButton.addEventListener('click', () => {
        createVisitForm()
    })
}

async function createVisitCard(formElements) {
    let visitDetails = {}
    formElements.forEach(item => {
        let itemTag = item.tagName.toLowerCase();

        if (itemTag === "div") {
            [...item.children].forEach(element => {
                if (element.tagName.toLowerCase() !== "label") {
                    visitDetails[element.name] = element.value;
                } else {
                    visitDetails[element.children[0].name] = element.children[0].value;
                }
            });
        } else if (itemTag === "input") {
            if (item.type !== "submit") {
                visitDetails[item.name] = item.value;
            }
        } else if (itemTag === "label") {
            item.children.forEach(elem => {
                visitDetails[elem.name] = elem.value;
            })
        }
    })

    let response = await API.saveCard(visitDetails);
    let cardSection = document.querySelector(".visit-section");
    renderCards(cardSection, response)
}

function createVisitForm() {
    const visitModal = new ModalCreateVisit(root, "Создать визит", {
        modalWrapper: 'modal-wrapper',
        modal: 'modal',
        crossButton: 'cross',
        title: 'modal-title',
        submitButton: 'btn'
    }).render()
    const {modalWrapper, modal} = visitModal;

    const form = new Form("form");
    const formElement = form.renderForm()


    const chooseDoctor = form.renderSelect("",
        ["", "cardiologist", "dentist", "therapist"],
        {select: "form__select", options: "form__options"},
        ["Выберите врача: ", "Кардиолог", "Стоматолог", "Терапевт"],
        {
            select: {
                required: true,
                name: "doctor"
            }
        });

    const fullName = form.renderInput("", {input: "form__input"}, "ФИО", {
        input: {
            required: true,
            name: "fullName"
        }
    });

    const priority = form.renderSelect("",
        ["", "regular", "medium", "high"],
        {select: "form__select", options: "form__options"},
        ["Срочность: ", "Обычная", "Приоритетная", "Неотложная"],
        {
            select: {
                required: true,
                name: "priority"
            }
        });

    const reason = form.renderInput("", {input: "form__input"}, "Цель визита", {
        input: {
            required: true,
            name: "reason"
        }
    });

    const doctorIndividualParametersContainer = new DOMElement("div", "form__doctor-input-container").render();//Needed to store the information that belongs to a specific doctor

    formElement.append(doctorIndividualParametersContainer)

    const submitButton = form.renderInput("", {input: "btn"}, "", {input: {type: "submit", value: "Создать визит"}});

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

    submitButton.addEventListener("click", event => {
        event.preventDefault();
        createVisitCard([...formElement.children]);
        modalWrapper.remove()
    })

    modal.append(formElement);
}

function doctorFormSet(chosenDoctor, parent, form) {
    if (chosenDoctor === "cardiologist") {
        cardiologistSet(true, parent, chosenDoctor, form);
    } else if (chosenDoctor === "dentist") {
        dentistSet(true, parent, chosenDoctor, form);
    } else if (chosenDoctor === "therapist") {
        therapistSet(true, parent, chosenDoctor, form);
    }
}

function deleteDoctorSet(parent, doctor) {
    let toDelete = [...parent.children].filter(child => child.dataset.doctor !== doctor && child.dataset.doctor !== undefined)

    if (toDelete.length > 0) {
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
            {
                input: {
                    min: "0",
                    max: "120",
                    title: "Введите значение от 0 до 120",
                    required: true,
                    type: "number",
                    maxLength: "3",
                    size: "3",
                    name: "age"
                }
            },
            {parent: parent, position: "beforeend"})

        age.dataset.doctor = doctor;

        let description = form.renderTextarea("Краткое описание: ",
            {label: "form__label", textarea: "form__textarea"},
            "description",
            {
                textarea: {
                    name: "description"
                }
            },
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
        let date = form.renderInput("Дата последнего визита: ", //date of the previous appointment
            {input: "form__input", label: "form__label"},
            "",
            {
                input: {
                    type: "date",
                    name: "date",
                    required: true,
                }
            },
            {parent: parent, position: "beforeend"});

        date[1].dataset.doctor = doctor;

        let description = form.renderTextarea("Краткое описание: ",
            {label: "form__label", textarea: "form__textarea"},
            "description",
            {
                textarea: {
                    name: "description"
                }
            },
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

    if (flag) {
        let bloodPressure = form.renderInput("",
            {input: "form__input"},
            "Обычное давление",
            {
                input: {
                    type: "text",
                    max: "160",
                    min: "50",
                    title: "Введите значение между 50 и 160",
                    maxLength: "6",
                    size: "6",
                    name: "bloodPressure",
                    required: true,
                }
            },
            {parent: parent, position: "beforeend"});

        bloodPressure.dataset.doctor = doctor;

        let bmi = form.renderInput("", // body mass index
            {input: "form__input"},
            "Индекс массы тела",
            {
                input: {
                    type: "number",
                    max: "60",
                    min: "10",
                    title: "Введите значение между 10 и 60",
                    maxLength: "5",
                    size: "5",
                    name: "bmi",
                    required: true,
                }
            },
            {parent: parent, position: "beforeend"});

        bmi.dataset.doctor = doctor;

        let heartDiseases = form.renderInput("",
            {input: "form__input"},
            "Перенесенные заболевания сердечно-сосудистой системы",
            {
                input: {
                    name: "diseases",
                    required: true,
                }
            },
            {parent: parent, position: "beforeend"});

        heartDiseases.dataset.doctor = doctor;

        let age = form.renderInput("",
            {input: "form__input"},
            "Возраст",
            {
                input: {
                    min: "0",
                    max: "120",
                    title: "Введите значение от 0 до 120",
                    required: true,
                    type: "number",
                    maxLength: "3",
                    size: "3",
                    name: "age"
                }
            },
            {parent: parent, position: "beforeend"})

        age.dataset.doctor = doctor;

        let description = form.renderTextarea("Краткое описание: ",
            {label: "form__label", textarea: "form__textarea"},
            "description",
            {
                textarea: {
                    name: "description"
                }
            },
            {parent: parent, position: "beforeend"});

        description[0].dataset.doctor = doctor;// <label> is parent for textarea and has index 0

        bloodPressure.addEventListener("keydown", event => {
            let targetValue = event.target.value;
            if (targetValue.length === 3) {
                targetValue += "/"
                event.target.value = targetValue;
                if (event.code === "Backspace") {
                    targetValue = ""
                    event.target.value = targetValue
                }
            }

        })

        dentistSet(false, parent, doctor);
        therapistSet(false, parent, doctor);
    } else {
        deleteDoctorSet(parent, doctor)
    }
}
