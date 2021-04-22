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

        return element;
    }
}

export class Select {
    /**
     * @requires:
     * parent DOMElement,
     * array with the options' text (the number of options is based on the length of the text array),
     * array with the options' value,
     * object with 2 CSS classes, 1 for <select> another one for <option> e.g. {select: "form-select", option: "form-option"},
     * object with attributes and index of the element e.g: {disabled: 0, selected: 2}
     *
     * @returns array with created elements and append them on the page
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
        const {classList, elements} = this;
        elements.select.classList.add(classList.select);
        elements.options.forEach((item, index) => {
            item.classList.add(classList.option);
        })
    }

    render() {
        this.createOptions()
        const {parent, elements} = this;

        this.addStyles()
        this.addText()
        this.addValue()
        this.addOptionAttributes()

        parent.append(elements.select)
        elements.options.forEach(item => {
            elements.select.append(item)
        })

        return [elements.select, ...elements.options];
    }
}

export class TextArea {
    /**
     * @requires:
     * parent DOMElement,
     * <label> textContent,
     * id that connects <label> and <textarea>,
     * object with classes e.g  {label: "form-label", textArea: "form-textarea"},
     * object with attributes
     *
     * @returns  array with created elements and append elements on the page
     * */
    constructor(parent, labelTextContent, textAreaId, classList, attributes) {
        this.parent = parent;
        this.labelTextContent = labelTextContent;
        this.textAreaId = textAreaId;
        this.classList = classList;
        this.attributes = attributes;
        this.elements = {
            label: document.createElement("label"),
            textArea: document.createElement("textarea")
        }
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
        const {classList, elements} = this;
        elements.label.classList.add(classList.label);
        elements.textArea.classList.add(classList.textArea)
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

        parent.append(elements.label)
        elements.label.append(elements.textArea)
        return [elements.label, elements.textArea];
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

    render() {
        const {parent} = this;
        const {button} = this.elements
        this.addText()
        this.addStyle()
        parent.append(button)
        return button
    }
}

export class Input {
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
        return input
    }
}


