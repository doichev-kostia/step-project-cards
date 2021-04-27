import DOMElement from "./DOMElement.js"

const defaultCSSStyles = {
    input: "form__input",
    label: "form__label",
    select: "form__select",
    options: "form__option",
    textarea: "form__textarea"
}


export class Form {
    /**
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

    constructor(classList = "form", attributesObj = {}) {
        this.attributesObj = attributesObj;
        this.classList = classList;
        this.elements = {
            form: new DOMElement("form", classList, "").render()
        }
    }

    renderForm(){
        let {classList,  attributesObj, elements} = this;
        return elements.form
    }


    renderInput(labelText,
                classListObj = defaultCSSStyles,
                placeholder,
                attributesObj = {},
    ) {
        const {elements} = this;

        let {label: labelAttr, input: inputAttr} = attributesObj

        if (labelText) {
            const label = new DOMElement("label", classListObj.label, labelText, labelAttr).render()
            const input = new DOMElement("input", classListObj.input, "", {
                ...attributesObj.input,
                placeholder,
            }).render()

            label.append(input)
            return label
        } else {
            return new DOMElement("input", classListObj.input, "", {
                ...inputAttr,
                placeholder,
            }).render()

        }
    }

    renderSelect(labelText,
                 optionValues,
                 classListObj = defaultCSSStyles,
                 optionsTextArr,
                 attributesObj = {},
    ) {
        const {elements} = this;
        let {select: selectAttr, label: labelAttr, options: optionsAttr} = attributesObj;
        const select = new DOMElement("select", classListObj.select, "", selectAttr).render();

        for (let i = 0; i < optionsTextArr.length; i++) {
            const option = new DOMElement("option", classListObj.options, optionsTextArr[i], {
                ...optionsAttr,
                value: optionValues[i]
            }).render();

            select.append(option)
        }

        if (labelText) {
            const label = new DOMElement("label", classListObj.label, labelText, labelAttr).render();

            label.append(select);
            return label
        }


            return select

    }

    renderTextarea(labelText,
                   classListObj = defaultCSSStyles,
                   textareaDescription,
                   attributesObj = {},
    ) {
        const {elements} = this;

        let {label: labelAttr, textarea: textareaAttr} = attributesObj;

        const label = new DOMElement("label", classListObj.label, labelText, {
            ...labelAttr,
            for: textareaDescription
        }).render();

        const textarea = new DOMElement("textarea", classListObj.textarea, "", {
            ...textareaAttr,
            id: textareaDescription
        }).render();

        label.append(textarea)

        return label
    }

}

export class VisitForm extends Form {

    static insertElementNextToAnotherElement(staticElement, elementToInsert) {
        staticElement.after(elementToInsert);
    }

    renderVisitForm() {
        const {classListObj, attributesObj, elements} = this;

        elements.fullName = super.renderInput("ФИО",
            {label: classListObj.label, input: classListObj.input},
            "",
            {
                input: {
                    required: true,
                    name: "fullName"
                }
            });

        elements.priority = super.renderSelect("Срочность: ",
            ["regular", "medium", "high"],
            {label: classListObj.label, select: classListObj.select, options: classListObj.options},
            ["Обычная", "Приоритетная", "Неотложная"],
            {
                select: {
                    required: true,
                    name: "priority"
                }
            });

        elements.reason = super.renderInput("Цель визита",
            {label: classListObj.label, input: classListObj.input},
            "",
            {
                input: {
                    required: true,
                    name: "reason"
                }
            });

        elements.description = super.renderTextarea("Краткое описание: ",
            {label: classListObj.label, textarea: classListObj.textarea},
            "description",
            {
                textarea: {
                    name: "description"
                }
            });

        elements.submitButton = new DOMElement("button",
            classListObj.button,
            "Создать визит",
            {type: "submit"}).render();

        elements.form.append(
            elements.doctor,
            elements.fullName,
            elements.priority,
            elements.reason,
            elements.description,
            elements.submitButton)


        return {
            form: elements.form,
            fullName: elements.fullName,
            priority: elements.priority,
            reason: elements.reason,
            description: elements.description,
            submitButton:  elements.submitButton
        };
    }

    deleteSelf(){
        this.elements.form.remove();
    }

}

export class VisitFormTherapist extends VisitForm{
    renderDoctorSet(){
        const {classListObj, textObj, attributesObj, elements} = this;
        const defaultFormElements = super.renderVisitForm()

        elements.age = super.renderInput("Возраст   : ",
            {input: classListObj.input, label: classListObj.label},
            "",
            {
                input: {
                    min: "0",
                    max: "120",
                    title: "Введите значение от 0 до 120",
                    required: true,
                    type: "number",
                    maxLength: "3",
                    size: "3",
                    name: "age"
                }
            })

        VisitForm.insertElementNextToAnotherElement(elements.reason, elements.age);
        return{
            ...defaultFormElements,
            age: elements.age
        }
    }

}

export class VisitFormDentist extends VisitForm {
    renderDoctorSet() {
        const {classListObj, textObj, attributesObj, elements} = this;
        const defaultFormElements = super.renderVisitForm()

        elements.previousVisitDate = super.renderInput("Дата последнего визита: ", //date of the previous appointment
            {input: classListObj.input, label: classListObj.label},
            "",
            {
                input: {
                    type: "date",
                    name: "date",
                    required: true,
                }
            })

        VisitForm.insertElementNextToAnotherElement(elements.reason, elements.previousVisitDate);
        return {
            ...defaultFormElements,
            date: elements.previousVisitDate
        }
    }
}

export class VisitFormCardiologist extends VisitForm {
    renderDoctorSet() {
        const {classListObj, textObj, attributesObj, elements} = this;
        const defaultFormElements = super.renderVisitForm();

        elements.bloodPressure = super.renderInput("Обычное давление: ",
            {input: classListObj.input, label: classListObj.label},
            "",
            {
                input: {
                    type: "text",
                    max: "160",
                    min: "50",
                    title: "Введите значение между 50 и 160",
                    maxLength: "6",
                    size: "6",
                    name: "bloodPressure",
                    required: true,
                }
            });

        elements.bmi = super.renderInput("Индекс массы тела: ", /*body mass index*/
            {input: classListObj.input, label: classListObj.label},
            "",
            {
                input: {
                    type: "number",
                    max: "60",
                    min: "10",
                    title: "Введите значение между 10 и 60",
                    maxLength: "5",
                    size: "5",
                    name: "bmi",
                    required: true,
                }
            });

        elements.heartDiseases = super.renderInput("Перенесенные заболевания сердечно-сосудистой системы",
            {input: classListObj.input, label: classListObj.label},
            "",
            {
                input: {
                    name: "diseases",
                    required: true,
                }
            });

        elements.age = super.renderInput("Возраст   : ",
            {input: classListObj.input, label: classListObj.label},
            "",
            {
                input: {
                    min: "0",
                    max: "120",
                    title: "Введите значение от 0 до 120",
                    required: true,
                    type: "number",
                    maxLength: "3",
                    size: "3",
                    name: "age"
                }
            })


        elements.bloodPressure.addEventListener("keydown", event => {
            let targetValue = event.target.value;
            if (targetValue.length === 3) {
                targetValue += "/"
                event.target.value = targetValue;
                if (event.code === "Backspace") {
                    targetValue = ""
                    event.target.value = targetValue
                }
            }

        })

        VisitForm.insertElementNextToAnotherElement(elements.reason, elements.previousVisitDate);
        return {
            ...defaultFormElements,
            bloodPressure: elements.bloodPressure,
            bmi: elements.bmi,
            heartDiseases: elements.heartDiseases,
            age: elements.age
        }
    }
}



