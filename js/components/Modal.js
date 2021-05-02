import DOMElement from "./DOMElement.js"
import API from "./API.js"
import {Form, VisitForm} from "./Form.js";
import {createEyeSVG, createEyeSlashSVG} from "./CreateSVG.js";

/**
 * @requires:
 * parent - DOM element
 * titleText - string
 * textContent - string
 * CSSClassObject - object with pairs {
 *     attributeName: attributeValue
 * }
 * */

export class Modal {
/**
 * Creates a modal window
 * */

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
    /**
     * addStyles() method
     * adds css classes to the components of a modal window
     * */
    addStyles() {
        const {modalWrapper, modal, crossButton, title} = this.elements
        modalWrapper.classList.add(this.CSSClass.modalWrapper)
        modal.classList.add(this.CSSClass.modal)
        crossButton.classList.add(this.CSSClass.crossButton)
        title.classList.add(this.CSSClass.title)
    }
    /**
     * elementsAddTextContent() method
     * adds text content to the modal window title and the cross sign to the close button
     * */
    elementsAddTextContent() {
        const {crossButton, title} = this.elements
        title.textContent = this.titleText;
        crossButton.textContent = 'X'
    }

    /**
     * closeModal() method
     * enables to close the modal window by clicking at the cross button or outside of the modal block
     * */
    closeModal() {
        const {modalWrapper} = this.elements
        modalWrapper.addEventListener('click', (event) => {
            if (event.target.classList[0] === this.CSSClass.modalWrapper || event.target.classList[0] === this.CSSClass.crossButton) {
                modalWrapper.remove()
            }
        })
    }
}

export class ModalLogIn extends Modal {

    /**
     * render() method
     * renders the login modal window onto the page.
     * */

    render() {
        const {parent, titleText, CSSClass, elements} = this
        const {modalWrapper, modal, crossButton, title} = elements
        elements.form = new Form();

        elements.emailInput = elements.form.renderInput('Email', {input: 'form__input', label: "form__label"}, '', {input:{
                type: "email",
                autocomplete: "username",
                required: true
        }});
        elements.passwordInput = elements.form.renderInput('Password', {input: 'form__input', label: "form__label"}, 'password', {input:{
                type: "password",
                autocomplete: "current-password",
                required: true
            }});

        elements.passwordInput.insertAdjacentHTML("beforeend", createEyeSVG("eye-icon", 20, 20, "#585f73"));
        elements.passwordInput.insertAdjacentHTML("beforeend", createEyeSlashSVG(["eye-icon", "eye-icon-slash", "hidden"], 20, 20, "#585f73"));

        elements.eyeIconSlash = [...elements.passwordInput.children]
            .find(item => item.classList.contains("eye-icon-slash"));

        elements.eyeIcon = [...elements.passwordInput.children]
            .find(item => item.classList.contains("eye-icon"));

        elements.eyeIcon.addEventListener("click", event =>{
            elements.eyeIcon.classList.add("hidden")
            elements.eyeIconSlash.classList.remove("hidden")
            elements.passwordInput.children[0].type = "text";
        })

        elements.eyeIconSlash.addEventListener("click", event=>{
           elements.eyeIconSlash.classList.add("hidden")
            elements.eyeIcon.classList.remove("hidden")
            elements.passwordInput.children[0].type = "password";
        })

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
            passwordInput: elements.passwordInput,
            eyeIconSlash: elements.eyeIconSlash,
            eyeIcon: elements.eyeIcon
        }
    }

    /**
     * verifyLogInData(elements) method
     * verifies the users' credentials
     * */

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
                    email: emailInput.children[0].value,
                    password: passwordInput.children[0].value,
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

/**
 * ModalCreateVisit class
 * creates a modal window to submit users visits
 * */

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
