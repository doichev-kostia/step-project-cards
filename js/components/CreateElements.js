/**
 * create classes:
 * Button
 * input
 * select
 * textArea
 * */

export class CreateElement{
    constructor(elementTag, classListArr, textContent) {
        this.classList = classListArr;
        this.textContent = textContent;
        this.element = document.createElement(elementTag)
    }

    static count(){
        let counter = 0;
        return function (){
           return  counter ++
        }
    }

    static counter = CreateElement.count()

    addIdentifier(){
        const {element} = this;
        element.dataset.id = `${CreateElement.counter()}`
    }

    render(){
        let {element, classList, textContent} = this;
        if (!(Array.isArray(classList))) {
            classList = [...classList]
        }

        classList.forEach(CSSClass => {
            element.classList.add(CSSClass);
        })

        if(textContent){
            element.textContent = textContent;
        }

        this.addIdentifier()

        return element;
    }

    remove(){
        const {element, classList} = this;
        const elements = [...document.querySelectorAll(classList)];
        const elementToDelete = elements.find(elem =>elem.dataset.id === element.dataset.id);
        elementToDelete.remove()
    }

}

export class Select {
    /**
     * @requires:
     * parent DOMElement,
     * array with the options' text (the number of options is based on the length of the text array),
     * array with the options' value,
     * object with 2 CSS classes, 1 for <select> another one for <option>  {select: "form-select", options: ["form-option", "form-option2"]},
     * object with attributes and index of the element e.g: {disabled: 0, selected: 2}
     *
     * @returns array with created elements and append them on the page
     *
     * */
    constructor(parent, textContent, value, classListObj, optionAttributes) {
        this.parent = parent;
        this.textContent = textContent;
        this.value = value;
        this.classListObj = classListObj;
        this.optionAttributes = optionAttributes;
        this.elements = {
            select: document.createElement("select")
        }
    }

    static count(){
        let counter = 0;
        return function (){
           return  counter ++
        }
    }

    static counter = Select.count()

    addIdentifier() {
        const {select} = this.elements;
        select.dataset.id = `${Select.counter()}`
    }

    createOptions() {
        const {textContent, elements} = this;
        let optionsArr = []
        for (let i = 0; i < textContent.length; i++) {
            optionsArr.push(document.createElement("option"))
        }
        elements.options = optionsArr
    }

    addOptionAttributes() {
        const {elements, optionAttributes} = this;
        if (!optionAttributes) {
            return;
        }

    }

    addText() {
        const {textContent, elements} = this;
        elements.options.forEach((item, index) => {
            item.textContent = `${textContent[index]}`;
        })
    }

    addValue() {
        const {value, elements} = this;
        elements.options.forEach((item, index) => {
            item.value = `${value[index]}`;
        })
    }

    addStyles() {
        const {classListObj, elements} = this;
        let selectClasses, optionsClasses;

        !(Array.isArray(classListObj.select)) ? selectClasses = [classListObj.select] : selectClasses = [...classListObj.select]
        !(Array.isArray(classListObj.options)) ? optionsClasses = [classListObj.options] : optionsClasses = [...classListObj.options]

        selectClasses.forEach(CSSClass => elements.select.classList.add(CSSClass));
        optionsClasses.forEach(CSSClass => {
            elements.options.forEach(elem =>{
                elem.classList.add(CSSClass)
            })
        });

    }

    render() {
        this.createOptions()
        const {parent, elements} = this;

        this.addStyles()
        this.addText()
        this.addValue()
        this.addOptionAttributes()
        this.addIdentifier()

        parent.append(elements.select)
        elements.options.forEach(item => {
            elements.select.append(item)
        })

        return [elements.select, ...elements.options];
    }

    remove(){
        const {select} = this.elements
        const elements = [...this.parent.children];
        const elementToDelete = elements.find(elem =>elem.dataset.id === select.dataset.id);
        elementToDelete.remove()
    }

}

export class TextArea {
    /**
     * @requires:
     * parent DOMElement,
     * <label> textContent,
     * id that connects <label> and <textarea>,
     * object with classes  {label: "CSS class", textArea: ["CSS class1", "CSS class2"]},
     * object with attributes
     *
     * @returns  array with created elements and append elements on the page
     * */
    constructor(parent, labelTextContent, textAreaId, classListObj, attributes) {
        this.parent = parent;
        this.labelTextContent = labelTextContent;
        this.textAreaId = textAreaId;
        this.classListObj = classListObj;
        this.attributes = attributes;
        this.elements = {
            label: document.createElement("label"),
            textArea: document.createElement("textarea")
        }
    }

    static count(){
        let counter = 0;
        return function (){
           return  counter ++
        }
    }

    static counter = TextArea.count()

    addIdentifier(){
        const {label} = this.elements;
        label.dataset.id = `${TextArea.counter()}`
    }

    addLabel() {
        const {labelTextContent, textAreaId, elements} = this;
        elements.label.textContent = `${labelTextContent}`
        elements.textArea.id = `${textAreaId}`
        elements.label.for = `${textAreaId}`
    }

    addName() {
        const {textAreaId, elements} = this;
        elements.textArea.name = `${textAreaId}`
    }

    addStyles() {
        const {classListObj, elements} = this;

        let labelClasses, textAreaClasses;

        !(Array.isArray(classListObj.label)) ? labelClasses = [classListObj.label] : labelClasses = [...classListObj.label]
        !(Array.isArray(classListObj.textArea)) ? textAreaClasses = [classListObj.textArea] : textAreaClasses = [...classListObj.textArea]

        labelClasses.forEach(CSSClass => elements.label.classList.add(CSSClass));
        textAreaClasses.forEach(CSSClass => elements.textArea.classList.add(CSSClass))

        elements.label.classList.add(classListObj.label);
        elements.textArea.classList.add(classListObj.textArea)
    }

    addAttributes() {
        const {attributes, elements} = this;

    }

    render() {
        const {parent, labelTextContent, textAreaId, classList, attributes, elements} = this;

        this.addLabel()
        this.addName()
        this.addStyles()
        this.addAttributes()
        this.addIdentifier()

        parent.append(elements.label)
        elements.label.append(elements.textArea)
        return [elements.label, elements.textArea];
    }

    remove(){
        const {label} = this.elements
        const elements = [...this.parent.children];
        const elementToDelete = elements.find(elem =>elem.dataset.id === button.dataset.id);
        elementToDelete.remove()
    }

}

export class Button {
    /**
     * @requires:
     * parent DOMElement,
     * textContent(string),
     * array with CSS classes(even if there is only 1)
     *
     * @returns created button and append it on the page
     * */
    constructor(parent, textContent, classListArr) {
        this.parent = parent;
        this.textContent = textContent;
        this.classList = classListArr;

        this.elements = {
            button: document.createElement('button')
        }
    }

    static count(){
        let counter = 0;
        return function (){
            return counter ++
        }
    }

    static counter = Button.count()

    addText() {
        const {button} = this.elements
        button.textContent = this.textContent
    }

    addStyle() {
        const {button} = this.elements;
        let {classList} = this;
        if (!(Array.isArray(classList))) {
            classList = [...classList]
        }
        classList.forEach(CSSClass => {
            button.classList.add(CSSClass);
        })
    }

    addIdentifier(){
        const {button} = this.elements;
        button.dataset.id = `${Button.counter()}`
    }

    render() {
        const {parent} = this;
        const {button} = this.elements
        this.addText()
        this.addStyle()
        this.addIdentifier()
        parent.append(button)
        return button
    }

    remove(){
        const {button} = this.elements
        const elements = [...this.parent.children];
        const elementToDelete = elements.find(elem =>elem.dataset.id === button.dataset.id);
        elementToDelete.remove()
    }
}

export class Input {
    constructor(parent,placeholder,cssClassArr,inputType) {
        this.parent = parent;
        this.placeholder = placeholder;
        this.cssClassArr = cssClassArr;
        this.inputType = inputType;
        this.elements = {
            input: document.createElement('input')
        }
    }

    static count(){
        let counter = 0;
        return function (){
           return  counter ++
        }
    }

    static counter = Input.count()

    addStyle(){
        const {input} = this.elements;
        let inputClasses;
        !(Array.isArray(this.cssClassArr)) ? inputClasses = [this.cssClassArr] : inputClasses = [...this.cssClassArr]

        inputClasses.forEach(CSSClass => input.classList.add(CSSClass))

    }

    addPlaceholder(){
        const {input} = this.elements;
        input.placeholder = `${this.placeholder}`;
    }

    addIdentifier (){
        const {input} = this.elements;
        input.dataset.id = `${Input.counter()}`
    }

    addInputType(){
        const {input} = this.elements;
        input.type = `${this.inputType}`
    }

    render(){
        const {input} = this.elements;
        this.addStyle()
        this.addPlaceholder()
        this.addIdentifier()
        this.addInputType()
        this.parent.append(input)
        return input
    }

    remove(){
        const {input} = this.elements;
        const elements = [...this.parent.children];
        const elementToDelete = elements.find(elem =>elem.dataset.id === input.dataset.id);
        elementToDelete.remove()
    }
}


