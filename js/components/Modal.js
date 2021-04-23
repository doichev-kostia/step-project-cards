import {Select, Button, TextArea, Input} from "./CreateElements.js"
import API from "./API.js"
import Form from "./Form.js";

export class Modal {
    constructor(parent, text, CSSClass) {

    }

    render(){
        // title
        // let cross
        // let btn = new Button(parent, textcontent, class)
    }
}

export class ModalLogin extends Modal{
    constructor(parent,title,btnClass) {
        super()
        this.parent = parent;
        this.title = title;
        this.btnClass = btnClass;
        this.elements = {
            modalWrapper: document.createElement('div'),
            modal: document.createElement('div'),
            crossButton: document.createElement('button'),
            title: document.createElement('p'),
        }
    }

    addStyles(){
        const {modalWrapper,modal,crossButton,title} = this.elements
        modalWrapper.classList.add('modalWrapper');
        modal.classList.add('modal')
        crossButton.classList.add('cross')
        title.classList.add('modal-title')
    }
    //добавляет css классы элементам

    titleAddText(){
        const {crossButton,title} = this.elements
        title.textContent = this.title;
        crossButton.textContent = 'X'
    }
    //добавляет текстовый контент элементам

    render(){
        const {modalWrapper,modal,crossButton,title,} = this.elements
        const form = new Form(modal, "form")
        form.render()
        const emailInput = form.createInput('email','email-input','email')
        const passwordInput = form.createInput('password','password-input','password')
        const loginButton = new Button(modal, "Вход",this.btnClass)
        loginButton.render()
        this.addStyles()
        this.closeModal()
        this.titleAddText()
        this.parent.append(modalWrapper)
        modalWrapper.append(modal)
        modal.prepend(crossButton,title)
        this.verifyUserData()

        // emailInput.render()
        // passwordInput.render()
    }
    //отрыгивает созданное на страницу

    closeModal(){
        const {modalWrapper,modal,crossButton} = this.elements
        modalWrapper.addEventListener('click',(event)=>{
            if (event.target.classList[0] === 'modalWrapper' || event.target.classList[0] === 'cross'){
                modalWrapper.remove()
            }
        })
    }
    //закрывает модальное окно по нажатию на крестик и вне области модалки

    verifyUserData(){
        document.querySelector('.modal-btn').addEventListener('click', async ()=>{
            console.log(document.querySelector('.email-input'))
            console.log(document.querySelector('.password-input'))
            const credentials = {
                email: document.querySelector('.email-input').value,
                password: document.querySelector('.password-input').value,
            }
            const {email,password} = credentials;
            const {modalWrapper,modal,crossButton} = this.elements

            await API.login({email,password})
            // debugger
            if (API.token){
                modalWrapper.remove()
            }
        })
    }

}

export class ModalCreateVisit extends Modal{
    constructor() {
        super();
    }
}

export class ModalShowCard{
    constructor() {
    }
}