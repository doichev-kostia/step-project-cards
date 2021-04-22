import {/*Button, Input,*/ Select/*, TextArea*/} from "./Utils.js"


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

    // createInput(amount){
    //         const input = new Input();
    //         input.render()
    // }
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

const defaultOption = document.querySelectorAll(".form-option");
defaultOption[0].disabled = true;