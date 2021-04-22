export default class Input {
    constructor(parent,placeholder,cssClass,inputType) {
        this.parent = parent;
        this.placeholder = placeholder;
        this.cssClass = cssClass;
        this.inputType = inputType;
        this.elements = {
            input: document.createElement('input')
        }
    }
    addStyle(){
        const {input} = this.elements;
        input.classList.add(this.cssClass)
    }
    addPlaceholder(){
        const {input} = this.elements;
        input.placeholder = `${this.placeholder}`
    }
    addInputType(){
        const {input} = this.elements;
        input.type = `${this.inputType}`
    }
    render(){
        const {input} = this.elements;
        this.addStyle()
        this.addPlaceholder()
        this.addInputType()
        this.parent.append(input)
    }
}
