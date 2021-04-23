import {Select, Button, TextArea, Input, CreateElement} from "./CreateElements.js"
import API from "./API.js"
import Form from "./Form.js";
export class Modal {
    constructor(parent, titleText, CSSClassObject){
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
    addStyles(){
        const {modalWrapper,modal,crossButton,title} = this.elements
        modalWrapper.classList.add(this.CSSClass.modalWrapper)
        modal.classList.add(this.CSSClass.modal)
        crossButton.classList.add(this.CSSClass.crossButton)
        title.classList.add(this.CSSClass.title)
    }
    elementsAddTextContent(){
        const {crossButton,title} = this.elements
        title.textContent = this.titleText;
        crossButton.textContent = 'X'
    }
    //добавляет текстовый контент элементам
    closeModal(){
        const {modalWrapper} = this.elements
        modalWrapper.addEventListener('click',(event)=>{
            if (event.target.classList[0] === 'modalWrapper' || event.target.classList[0] === 'cross'){
                modalWrapper.remove()
            }
        })
    }
    //закрывает модальное окно по нажатию на крестик и вне области модалки
}
export class ModalLogin extends Modal{
    constructor(parent,titleText,CSSClassObject) {
        super(parent, titleText, CSSClassObject)
    }
    render(){
        const {parent,titleText,CSSClass} = this
        const {modalWrapper,modal,crossButton,title} = this.elements
        const form = new Form(modal, "form")
        form.render()
        this.elements.emailInput = form.createInput('email','email-input','email')
        this.elements.passwordInput = form.createInput('password','password-input','password')
        this.elements.loginButton = new Button(modal, "Вход", CSSClass.loginButton).render()
        this.addStyles()
        this.closeModal()
        this.elementsAddTextContent()
        this.parent.append(modalWrapper)
        modalWrapper.append(modal)
        modal.prepend(crossButton,title)
        this.verifyUserData()
    }
    //отрыгивает созданное на страницу
    verifyUserData(){
        const {modalWrapper,modal,crossButton,title,loginButton,emailInput,passwordInput} = this.elements
        loginButton.addEventListener('click', async ()=>{
            const credentials = {
                email: emailInput.value,
                password: passwordInput.value,
            }
            const {email,password} = credentials;
            const {modalWrapper,modal,crossButton} = this.elements
            try {
                let response = await API.login({email,password})
                if (API.token === 'Incorrect username or password'){
                    throw e
                }
                else{
                    modalWrapper.remove()
                    document.querySelector('.logInBtn').remove()
                    const visitButton = new Button(document.querySelector('.header'), "Создать визит", ["btn", "visitBtn"]);
                    visitButton.render()
                }
            }catch (e) {
                console.log(e)
                let error = new CreateElement('span','modal-error','Incorrect username or password').render()
                document.querySelector('.form').insertAdjacentElement('beforebegin',error)
                setTimeout(()=>{
                    error.remove()
                },500)
            }
        })
    }
}
export class ModalCreateVisit extends Modal{
    constructor(parent,titleText,CSSClassObject) {
        super(parent,titleText,CSSClassObject);
    }
    render(){
        const {parent,titleText,CSSClass} = this
        const {modalWrapper,modal,crossButton,title} = this.elements
        this.addStyles()
        this.elementsAddTextContent()
        parent.append(modalWrapper)
        modalWrapper.append(modal)
        modal.prepend(crossButton,title)
        this.closeModal()
        return modal
    }
}
export class ModalShowCard{
    constructor() {
    }
}