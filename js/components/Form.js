import {/*Button,*/  Select/*, TextArea*/} from "./Utils.js"
import Input from "./Input.js"

export default class Form{
    constructor(parent) {
        this.parent = parent;
        this.elements ={
            form: document.createElement("form")
        }
    }

    render(){
        const { parent, elements} = this;
        parent.append(elements.form);
    }

    createInput(placeholder,cssClass,inputType){
            const input = new Input(this.elements.form, placeholder,cssClass,inputType);
            input.render()
    }
    //
    // createTextArea(amount){
    //         const textArea = new TextArea();
    //         textArea.render()
    // }

    createSelect(textContentArr, valueArr, classListArr, optionAttributes){
            const select = new Select(this.elements.form, textContentArr, valueArr, classListArr, optionAttributes );
            select.render()
    }
}


const form = new Form(document.querySelector("#root"))
form.render()
form.createSelect(
    ["Select", "option1","option2", "option3"],
    ["select", "option1","option2", "option3"],
    ["form-select", "form-option"]
)
form.createInput("Input", "form-input", "text")
form.createInput("Input2", "form-input", "email")
form.createInput("Input3", "form-input", "radio")

const defaultOption = document.querySelectorAll(".form-option");
defaultOption[0].disabled = true;