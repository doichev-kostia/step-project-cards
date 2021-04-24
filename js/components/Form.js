import DOMElement from "./DOMElement.js"

const defaultCSSStyles = {
    input: "form__input",
    label: "form__label",
    select: "form__select",
    options: "form__option",
    textarea: "form__textarea"
}


export default class Form{/**
     * @requires:
     * classList - string (can be array of strings),
     * attributesObj - object {attributeName: attributeValue}
     *
     * @method renderForm():
     * creates DOM element <form> and returns it
     *
     * @method renderInput():
     *      @requires:
     *      labelText - string (in case you need tag <label> if not, put empty string "")
     *      classListObj - object with CSS classes (array of strings can be used as a value){
     *          input: ["CSS class1", "CSS class2"],
     *          label: "CSS class"
     *      },
     *      placeholder - string(for placeholder attribute in input if don't need it, put empty string ""),
     *      attributesObj - object  {attributeName: attributeValue},
     *      position - object that represents the position the element needs to be inserted in {
 *          parent: DOM element,
 *          position: "afterbegin" || "beforebegin" || "afterend" || "beforeend"
 *      }
     *      @returns created DOM elements
     *
     * @method renderSelect():
     *      @requires:
     *      labelText - string (in case you need tag <label> if not, put empty string ""),
     *      optionValues - array of strings. value attribute for tag <option>,
     *      classListObj - object with CSS classes (array of strings can be used as a value){
     *          label: "CSS class"
     *          select: ["CSS class1", "CSS class2"],
     *          options: "CSS class"
     *      },
     *      optionsTextArr - array of strings. Number of options is based on its length,
     *      attributesObj - object {
     *          select: {
     *              attributeName: attributeValue
     *          },
     *         label:{
     *             attributeName: attributeValue
     *         },
     *         options: {
     *             attributeName: attributeValue
     *         }
     *      }
     *      @returns array of created DOM elements
     *
     * @method renderTextarea():
     *      @requires:
     *      labelText - string (in case you need tag <label> if not, put empty string ""),
     *      classListObj - object with CSS classes (array of strings can be used as a value){
     *          label: "CSS class"
     *          textarea: "CSS class"
     *      },
     *      attributesObj - object  {
     *          label: {
     *               attributeName: attributeValue
     *          },
     *          textarea: {
     *              attributeName: attributeValue
     *          }
     *      }
     *      @returns array of created DOM elements
     * */

    constructor(classList = "form", attributesObj) {
        this.attributesObj = attributesObj;
        this.classList = classList;
        this.elements ={
            form: new DOMElement("form", classList, "", attributesObj).render()
        }
    }


    renderForm(){
        let {classList,  attributesObj, elements} = this;
        return elements.form
    }

    renderInput( labelText,
                 classListObj = defaultCSSStyles,
                 placeholder,
                 attributesObj = {},
                 position ={
                    parent: this.elements.form,
                     position: "beforeend",
                 }
    ) {
        const {elements} = this;

        let { label: labelAttr , input: inputAttr} = attributesObj

        if(labelText){
            const label = new DOMElement("label", classListObj.label, labelText, labelAttr).render()
            const input = new DOMElement("input", classListObj.input, "", {
                ...attributesObj.input,
                placeholder,
            }).render()

            position.parent.insertAdjacentElement(position.position,label);
            label.append(input)
            return [label, input]
        }else{
            const input = new DOMElement("input", classListObj.input, "", {
                ...inputAttr,
                placeholder,
            }).render()

            position.parent.insertAdjacentElement(position.position,input);
            return input
        }
    }

    renderSelect(labelText,
                 optionValues,
                 classListObj = defaultCSSStyles,
                 optionsTextArr,
                 attributesObj = {},
                 position ={
                     parent: this.elements.form,
                     position: "beforeend",
                 }
    ){
        const {elements} = this;
        let {select: selectAttr, label: labelAttr, options: optionsAttr} = attributesObj;
        let createdElements = []
        const select = new DOMElement("select", classListObj.select, "", selectAttr).render();

        createdElements.push(select)

        if (labelText){
            const label = new DOMElement("label", classListObj.label, labelText, labelAttr).render();

            label.append(select);
            createdElements.push(label)
            position.parent.insertAdjacentElement(position.position,label);
        }

        for (let i = 0; i < optionsTextArr.length; i++) {
            const option = new DOMElement("option", classListObj.options, optionsTextArr[i], {
                ...optionsAttr,
                value: optionValues[i]
            }).render();

            createdElements.push(option);
            select.append(option)
        }

        position.parent.insertAdjacentElement(position.position,select);
        return createdElements
    }

    renderTextarea( labelText,
                    classListObj = defaultCSSStyles,
                    textareaDescription,
                    attributesObj = {},
                    position ={
                        parent: this.elements.form,
                        position: "beforeend",
                    }
    ){
        const {elements} = this;

        let {label: labelAttr, textarea: textareaAttr} = attributesObj;

        const label = new DOMElement("label", classListObj.label, labelText, {
            ...labelAttr,
            for: textareaDescription
        }).render();

        const textarea = new DOMElement("textarea", classListObj.textarea, "",{
            ...textareaAttr,
            id: textareaDescription
        }).render();

        position.parent.insertAdjacentElement(position.position, label);
        label.append(textarea)

        return[label, textarea]
    }

}
