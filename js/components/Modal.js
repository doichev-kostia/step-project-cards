import DOMElement from "./DOMElement.js"
import API from "./API.js"
import {Form, VisitForm} from "./Form.js";

export class Modal {
    constructor(parent, titleText, CSSClassObject) {
        this.parent = parent;
        this.titleText = titleText;
        this.CSSClass = CSSClassObject;
        this.elements = {
            modalWrapper: document.createElement('div'),
            modal: document.createElement('div'),
            crossButton: document.createElement('button'),
            title: document.createElement('p'),
        }
    }

    addStyles() {
        const {modalWrapper, modal, crossButton, title} = this.elements
        modalWrapper.classList.add(this.CSSClass.modalWrapper)
        modal.classList.add(this.CSSClass.modal)
        crossButton.classList.add(this.CSSClass.crossButton)
        title.classList.add(this.CSSClass.title)
    }

    elementsAddTextContent() {
        const {crossButton, title} = this.elements
        title.textContent = this.titleText;
        crossButton.textContent = 'X'
    }

    //добавляет текстовый контент элементам
    closeModal() {
        const {modalWrapper} = this.elements
        modalWrapper.addEventListener('click', (event) => {
            if (event.target.classList[0] === 'modalWrapper' || event.target.classList[0] === 'cross') {
                modalWrapper.remove()
            }
        })
    }

    //закрывает модальное окно по нажатию на крестик и вне области модалки
}

export class ModalLogIn extends Modal {

    render() {
        const {parent, titleText, CSSClass, elements} = this
        const {modalWrapper, modal, crossButton, title} = elements
        elements.form = new Form();

        elements.emailInput = elements.form.renderInput('', {input: 'form__input'}, 'email', {input:{
                type: "email",
                autocomplete: "username",
                required: true
        }});
        elements.passwordInput = elements.form.renderInput('', {input: 'form__input'}, 'password', {input:{
                type: "password",
                autocomplete: "current-password",
                required: true
            }});
        elements.submitButton = new DOMElement("button",  CSSClass.submitButton, "Войти", {type: "submit"}).render();

        this.addStyles()
        this.closeModal()
        this.elementsAddTextContent()

        elements.form = elements.form.renderForm();
        elements.form.append(elements.emailInput, elements.passwordInput, elements.submitButton);
        parent.append(modalWrapper)
        modalWrapper.append(modal)
        modal.prepend(crossButton, title, elements.form)

        return {
            modalWrapper,
            modal,
            crossButton,
            title,
            form: elements.form,
            submitButton: elements.submitButton,
            emailInput: elements.emailInput,
            passwordInput: elements.passwordInput
        }
    }

    static async verifyLogInData(elements) {
        const {
            form,
            modalWrapper,
            submitButton,
            emailInput,
            passwordInput,
            createVisitButton,
            logInButton
        } = elements;

        return new Promise((resolve, reject) => {
            submitButton.addEventListener('click', async (event) => {
                event.preventDefault();

                const credentials = {
                    email: emailInput.value,
                    password: passwordInput.value,
                }
                const {email, password} = credentials;

                try {
                    await API.login({email, password});

                    modalWrapper.remove()
                    logInButton.replaceWith(createVisitButton)
                    resolve(true)
                } catch (e) {
                    console.error(e)
                    let error = new DOMElement('span', 'modal__error', 'Incorrect username or password').render();
                    form.insertAdjacentElement('beforebegin', error);
                    setTimeout(() => {
                        error.remove()
                    }, 2000)
                    resolve(false)
                }
            })
        })
    }
}

export class ModalCreateVisit extends Modal {

    render() {
        const {parent, titleText, CSSClass, elements} = this
        const {modalWrapper, modal, crossButton, title} = this.elements
        this.addStyles()
        this.elementsAddTextContent()
        parent.append(modalWrapper)
        modalWrapper.append(modal)
        modal.prepend(crossButton, title)

        this.closeModal()
        return {
            modalWrapper,
            modal,
            crossButton,
            title,
        }
    }
}
