import {Button,  Select, TextArea, Input} from "./CreateElements.js"


export default class Form{
    constructor(parent, classList) {
        this.parent = parent;
        this.classList = classList;
        this.elements ={
            form: document.createElement("form")
        }
    }

    render(){
        const { parent, classList, elements} = this;
        if(classList){
            elements.form.classList.add(classList)
        }
        parent.append(elements.form);
        return elements.form
    }

    createInput(placeholder,cssClass,inputType){
            const input = new Input(this.elements.form, placeholder,cssClass,inputType);
            return input.render()

    }

    createTextArea(labelTextContent, textAreaId, classListObj, attributes){
            const textArea = new TextArea(this.elements.form, labelTextContent, textAreaId, classListObj, attributes);
            return textArea.render()
    }

    createSelect(textContentArr, valueArr, classListObj, optionAttributes){
            const select = new Select(this.elements.form, textContentArr, valueArr, classListObj, optionAttributes );
            return select.render()
    }
}
