import Button from "./Utils.js";
import API from "./API.js"
import Input from "./Input.js";

export default class ModalLogin{
    constructor(parent,title,btnClass) {
        this.parent = parent;
        this.title = title;
        this.btnClass = btnClass;
        this.elements = {
            modalWrapper: document.createElement('div'),
            modal: document.createElement('div'),
            crossButton: document.createElement('button'),
            title: document.createElement('p'),
            logInButton: new Button()
        }
    }
    addBtnClass(){
        const {logInButton} = this.elements
        logInButton.addStyle(`${this.btnClass}`)
    }
    //добавляет уникальный класс на кнопку модалки

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
        const {modalWrapper,modal,crossButton,title,logInButton} = this.elements
        this.addBtnClass()
        const button = logInButton.render(modal,'Вход', 'btn')
        this.addStyles()
        this.closeModal()
        this.titleAddText()
        this.parent.append(modalWrapper)
        modalWrapper.append(modal)
        modal.prepend(crossButton,title)
        this.verifyUserData()

        const emailInput = new Input(document.querySelector('.modal'),'email','email-input','email')
        const passwordInput = new Input(document.querySelector('.modal'),'password','password-input','password')
        emailInput.render()
        passwordInput.render()
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
         document.querySelector('.modal-btn').addEventListener('click', ()=>{
            // console.log(document.que)
             API.login({ email: 'antonmolchanov97@gmail.com', password: 'Ilona16122020' })
        })
    }

}

// const modal = new ModalLogin(document.querySelector('#root'),'Вход')
// modal.render()
