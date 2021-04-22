import ModalLogin from "./ModalLogin.js";

/**
 * create classes:
 * Button
 * input
 * select
 * textArea
 * */

export class Select {
    /**
     * @requires:
     * parent DOMElement,
     * array with the options' text (the number of options is based on the length of the text array),
     * array with the options' value,
     * array with 2 CSS classes, 1 for <select> another one for <option>,
     * object with attributes and index of the element e.g: {disabled: 0, selected: 2}
     *
     * @return append elements on page
     *
     * */
    constructor(parent, textContent, value, classList, optionAttributes) {
        this.parent = parent;
        this.textContent = textContent;
        this.value = value;
        this.classList = classList;
        this.optionAttributes = optionAttributes;
        this.elements = {
            select: document.createElement("select")
        }
    }

    createOptions(){
        const { textContent, elements} = this;
        let optionsArr = []
        for (let i = 0; i < textContent.length; i++) {
            optionsArr.push(document.createElement("option"))
        }
        elements.options = optionsArr
    }

    addOptionAttributes(){
        const {elements, optionAttributes} = this;
        if(!optionAttributes){
            return;
        }

    }

    addText(){
        const { textContent, elements} = this;
        elements.options.forEach((item, index) =>{
            item.textContent = textContent[index];
        })
    }

    addValue(){
        const { value, elements} = this;
        elements.options.forEach((item, index) =>{
            item.value = value[index];
        })
    }

    addStyles(){
        const {classList, elements} = this;
        elements.select.classList.add(classList[0]);
        elements.options.forEach((item, index) =>{
            item.classList.add(classList[1]);
        })
    }

    render(){
        this.createOptions()
        const {parent, elements} = this;

        this.addStyles()
        this.addText()
        this.addValue()
        this.addOptionAttributes()

        parent.append(elements.select)
        elements.options.forEach(item =>{
            elements.select.append(item)
        })
    }
}


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


