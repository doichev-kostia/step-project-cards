import ModalLogin from "./ModalLogin.js";

/**
 * create classes:
 * Button
 * input
 * select
 * textArea
 * */

export default class Button {
    constructor() {
    }
    elements = {
        button: document.createElement('button')
    }

    addText(text){
        const {button} = this.elements
        button.textContent = text
    }
    addStyle(classList){
        const {button} = this.elements
        button.classList.add(`${classList}`)
    }
    render(parent,text,classList){
        const {button} = this.elements
        this.addText(text)
        this.addStyle(classList)
        parent.append(button)
    }
}
const button = new Button()
button.render(document.querySelector('#root',),'Вход','btn')
button.addStyle('logInBtn')

document.querySelector('.logInBtn').addEventListener('click',()=>{
    const modal = new ModalLogin(document.querySelector('#root'),'Вход','modal-btn')
    modal.render()
})


