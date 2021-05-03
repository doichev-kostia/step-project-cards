import API from "./API.js";
import {Visit, VisitDentist, VisitTherapist, VisitCardiologist} from "./Visit.js";
import DOMElement from "./DOMElement.js"
import {ModalLogIn, ModalCreateVisit} from "./Modal.js";

/** Object with default CSS classes */
const defaultCSSClasses = {
    form: "form",
    input: "form__input",
    label: "form__label",
    select: "form__select",
    options: "form__option",
    textarea: "form__textarea"
}

/** Class creates a form */
export class Form {
    /**@constructor
     * Creates DOM Element form
     *              @param {object} [classListObj] - object with CSS classes like:
     *              {tagName: "CSS class"} arrays can be used as values:
     *              {
     *                       form: "form",
     *                       input: "form__input",
     *                       label: "form__label",
     *                       select: "form__select",
     *                       options: "form__option",
     *                       textarea: "form__textarea"
     *                   }
     *                   >>> (NOT used in renderForm(), renderInput(), renderSelect(), renderTextarea() methods) <<<
     *
     *              @param {object} [attributesObj] - object that represents attributes of the created element{
     *                          tagName: {
     *                                      attributeName: attributeValue
     *                                   }
     *                        }
     * */

    constructor(classListObj = defaultCSSClasses, attributesObj = {}) {
        this.classListObj = classListObj;
        this.attributesObj = attributesObj;
        this.elements = {
            form: new DOMElement("form", classListObj.form, "", attributesObj.form).render()
        }
    }

    static async validateForm(formElements) {
        formElements.form.onsubmit = function () {
            return false
        }

        let fields = []

        for (let [objectKey, objectValue] of Object.entries(formElements)) {
            if (objectValue instanceof Element){
                if (objectValue.tagName.toLowerCase() === "label") {
                    fields.push(objectValue.children[0]);
                }
            }
        }

        let notValidFields = fields.filter(item => !item.validity.valid);
        if (notValidFields.length === 0) {
            let card = await Visit.registerVisitCard(formElements);
            await Visit.renderCards(document.querySelector(".visit-section"), card);
            document.querySelector(".modal-wrapper").remove()
        }
    }

    /**
     * @returns {DOMElement} <form>
     * */
    renderForm() {
        let {elements} = this;
        return elements.form
    }

    /**
     * Creates <input> or <label> with <input> inside of it
     *
     *     @param {string} [labelText] - Text that will be in <label>
     *         (in case you don't need tag <label> put empty string "")
     *     @param {object} [classListObj] - object with CSS classes
     *     (array of strings can be used as a value) {
     *          input: ["CSS class1", "CSS class2"],
     *          label: "CSS class"
     *      },
     *
     *      @param {string} [placeholder] - text that will be in the input
     *      (if don't need it, put empty string ""),
     *
     *      @param {object} [attributesObj] - object that represents attributes of the created element {
     *                                  tagName:{
     *                                  attributeName: attributeValue
     *                                  }
     *                             },
     *
     *
     *      @returns {DOMElement} <label> or <input>
     *          (if the label argument was an empty string)
     *
     *
     * */
    renderInput(labelText,
                classListObj = defaultCSSClasses,
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

    /**
     *  Creates <label> (if first argument is not an empty string) <select> with <options>
     *
     *     @param {string} [labelText] - Text that will be in <label>
     *         (in case you don't need tag <label> put empty string "")
     *
     *     @param {string[]} optionValues - array with options' values
     *
     *     @param {object} [classListObj] - object with CSS classes
     *     (array of strings can be used as a value) {
     *          input: ["CSS class1", "CSS class2"],
     *          label: "CSS class"
     *      },
     *
     *      @param {string[]} [optionsTextArr] - array of text that will be
     *      in the options. The number of options is based on the  length of
     *      this array
     *      (if don't need it, put empty string ""),
     *
     *      @param {object} [attributesObj] - object that represents attributes of the created element {
     *                                  tagName:{
     *                                  attributeName: attributeValue
     *                                  }
     *                             },
     *
     *      @returns {DOMElement} <label> or <select>
     *          (if the label argument was an empty string)
     *
     *
     * */
    renderSelect(labelText,
                 optionValues,
                 classListObj = defaultCSSClasses,
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

    /**
     *   Creates <label> and <textarea> inside of it
     *
     *     @param {string} [labelText] - Text that will be in <label>
     *         (in case you don't need tag <label> put empty string "")
     *
     *     @param {object} [classListObj] - object with CSS classes
     *     (array of strings can be used as a value)
     *     {tagName: "CSS class"}
     *     e.g {
     *          input: ["CSS class1", "CSS class2"],
     *          label: "CSS class"
     *      }
     *
     *      @param {object} [attributesObj] - object that represents attributes of the created element {
     *                                  tagName:{
     *                                  attributeName: attributeValue
     *                                  }
     *                             },
     *
     *      @returns created DOM Element <label>
     * */
    renderTextarea(labelText,
                   classListObj = defaultCSSClasses,
                   attributesObj = {},
    ) {
        const {elements} = this;

        let {label: labelAttr, textarea: textareaAttr} = attributesObj;

        const label = new DOMElement("label", classListObj.label, labelText, {
            ...labelAttr,
        }).render();

        const textarea = new DOMElement("textarea", classListObj.textarea, "", {
            ...textareaAttr,
        }).render();

        label.append(textarea)

        return label
    }

}

/** Class creates a form to create a visit */
export class VisitForm extends Form {
    /**@constructor
     * Creates DOM Element form for visit
     *              @param {object} [classListObj] - object with CSS classes like: {tagName: "CSS class"} arrays can be used as values:
     *              {
     *                       form: "form",
     *                       input: "form__input",
     *                       label: "form__label",
     *                       select: "form__select",
     *                       options: "form__option",
     *                       textarea: "form__textarea"
     *                   }
     *                   >>> ( used in renderForm(), renderInput(), renderSelect(), renderTextarea() methods) <<<
     *
     *              @param {object} [attributesObj] - object that represents attributes of the created element{
     *                          tagName: {
     *                                      attributeName: attributeValue
     *                                   }
     *                        }
     * */

    /**
     *  Inserts one element next to another one
     *
     *          @param {DOMElement} staticElement - DOM Element according to which another DOM Element will be inserted
     *          @param {DOMElement | DOMElement[]} elementsToInsert - DOM
     *          Element or array
     *          of DOM Elements
     *          @param {string} [place] - "after" or "before" (insert element after or before the staticElement)
     *
     * */
    static insertElementNextToAnotherElement(staticElement, elementsToInsert, place = "after") {
        if (!Array.isArray(elementsToInsert)) {
            elementsToInsert = [elementsToInsert]
        }

        if (!staticElement || !elementsToInsert) {
            return false
        }

        elementsToInsert.forEach(item => {
            staticElement[place](item);
        })
    }


    /**
     * Creates form with common fields to every doctor:
     *          full name, priority of the visit, reason, description and submit button.
     *
     *          Appends all the created elements to <form>
     *
     *          @returns {object} created DOM elements.
     *          Key "card" represents the way data will be shown in a visit card
     *
     *          card object looks like:
     *          card: {
                fullName: {
                    label: "ФИО: ",
                    elementValue: full name input value
                },
                priority: {
                    label: "Срочность: ",
                    elementValue: priority input value
                },
                reason: {
                    label: "Цель визита: ",
                    elementValue: reason input value
                },
                description: {
                    label: "Описание визита: ",
                    elementValue: description input value
                }
            }
     * */
    renderVisitForm() {
        const {classListObj, attributesObj, elements} = this;

        elements.fullName = super.renderInput("*ФИО: ",
            {label: classListObj.label, input: classListObj.input},
            "",
            {
                input: {
                    required: true,
                    name: "fullName"
                }
            });

        elements.priority = super.renderSelect("*Срочность: ",
            ["", "low", "normal", "high"],
            {label: classListObj.label, select: classListObj.select, options: classListObj.options},
            ["Выберите срочность: ", "Обычная", "Приоритетная", "Неотложная"],
            {
                select: {
                    required: true,
                    name: "priority"
                }
            });

        elements.priority.children[0].children[0].disabled = true;

        elements.reason = super.renderInput("*Цель визита: ",
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
            {
                textarea: {
                    name: "description"
                }
            });

        elements.submitButton = super.renderInput("",
            {input: classListObj.button},
            "",
            {
                input: {
                    type: "submit",
                    value: "Создать визит",
                }
            })

        elements.form.append(
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
            submitButton: elements.submitButton,
            card: {
                fullName: {
                    label: "ФИО: ",
                    elementValue: elements.fullName.children[0].value
                },
                priority: {
                    label: "Срочность: ",
                    elementValue: elements.priority.children[0].value
                },
                reason: {
                    label: "Цель визита: ",
                    elementValue: elements.reason.children[0].value
                },
                description: {
                    label: "Описание визита: ",
                    elementValue: elements.description.children[0].value
                }
            }
        };
    }

    /**
     * Deletes created form
     * */
    deleteSelf() {
        this.elements.form.remove();
    }

}

/** Class creates a form to create a visit to the specific doctor */
export class VisitFormTherapist extends VisitForm {
    /** @constructor
     * Creates DOM Element form for Therapist
     *
     *              @param {object} [classListObj] - object with CSS classes like: {tagName: "CSS class"} arrays can be used as values:
     *              {
     *                       form: "form",
     *                       input: "form__input",
     *                       label: "form__label",
     *                       select: "form__select",
     *                       options: "form__option",
     *                       textarea: "form__textarea"
     *                   }
     *                   >>> ( used in renderForm(), renderInput(), renderSelect(), renderTextarea() methods) <<<
     *
     *              @param {object} [attributesObj] - object that represents attributes of the created element{
     *                          tagName: {
     *                                      attributeName: attributeValue
     *                                   }
     *                        }
     * */

    /**
     * Creates age field and inserts it after reason field.
     *
     *          @returns {object} with created DOM elements and the default ones
     *          (those which are created in class VisitForm)
     *
     *           card object looks like:
     *          card: {
                fullName: {
                    label: "ФИО: ",
                    elementValue: full name input value
                },
                priority: {
                    label: "Срочность: ",
                    elementValue: priority input value
                },
                reason: {
                    label: "Цель визита: ",
                    elementValue: reason input value
                },
                description: {
                    label: "Описание визита: ",
                    elementValue: description input value
                } age = {
                    label: "Возраст: ",
                    elementValue: age input value
                } doctor = {
                    label: "Доктор: ",
                    elementValue: "Терапевт"
                }
     * */
    renderDoctorSet() {
        const {classListObj, textObj, attributesObj, elements} = this;
        const defaultFormElements = super.renderVisitForm()

        elements.age = super.renderInput("*Возраст: ",
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

        defaultFormElements.card.age = {
            label: "Возраст: ",
            elementValue: elements.age.children[0].value
        };

        defaultFormElements.card.doctor = {
            label: "Доктор: ",
            elementValue: "Терапевт"
        };

        VisitForm.insertElementNextToAnotherElement(elements.reason, elements.age);

        return {
            ...defaultFormElements,
            age: elements.age,
        }
    }
}

/** Class creates a form to create a visit to the specific doctor */
export class VisitFormDentist extends VisitForm {
    /** @constructor
     * * Creates DOM Element form for Dentist
     *
     *              @param {object} [classListObj] - object with CSS classes like: {tagName: "CSS class"} arrays can be used as values:
     *              {
     *                       form: "form",
     *                       input: "form__input",
     *                       label: "form__label",
     *                       select: "form__select",
     *                       options: "form__option",
     *                       textarea: "form__textarea"
     *                   }
     *                   >>> ( used in renderForm(), renderInput(), renderSelect(), renderTextarea() methods) <<<
     *
     *              @param {object} [attributesObj] - object that represents attributes of the created element{
     *                          tagName: {
     *                                      attributeName: attributeValue
     *                                   }
     *                        }
     * */

    /**
     * Creates previous appointment date field and inserts it after reason field.
     *
     *           @returns {object} with created DOM elements and the default ones(those which are created in class VisitForm)
     *
     *           card object looks like:
     *          card: {
                fullName: {
                    label: "ФИО: ",
                    elementValue: full name input value
                },
                priority: {
                    label: "Срочность: ",
                    elementValue: priority input value
                },
                reason: {
                    label: "Цель визита: ",
                    elementValue: reason input value
                },
                description: {
                    label: "Описание визита: ",
                    elementValue: description input value
                },
                previousVisitDate = {
                    label: "Дата последнего визита: ",
                    elementValue: previous visit date input value
                },
                doctor = {
                    label: "Доктор: ",
                    elementValue: "Стоматолог"
                }
     * */
    renderDoctorSet() {
        const {classListObj, textObj, attributesObj, elements} = this;
        const defaultFormElements = super.renderVisitForm()

        elements.previousVisitDate = super.renderInput("*Дата последнего визита: ", //date of the previous appointment
            {input: classListObj.input, label: classListObj.label},
            "",
            {
                input: {
                    type: "date",
                    name: "date",
                    required: true,
                }
            })

        defaultFormElements.card.previousVisitDate = {
            label: "Дата последнего визита: ",
            elementValue: elements.previousVisitDate.children[0].value
        };

        defaultFormElements.card.doctor = {
            label: "Доктор: ",
            elementValue: "Стоматолог"
        };

        VisitForm.insertElementNextToAnotherElement(elements.reason, elements.previousVisitDate);
        return {
            ...defaultFormElements,
            previousVisitDate: elements.previousVisitDate
        }
    }
}

/** Class creates a form to create a visit to the specific doctor */
export class VisitFormCardiologist extends VisitForm {
    /** @constructor
     * * Creates DOM Element form for Dentist
     *
     *              @param {object} [classListObj] - object with CSS classes like: {tagName: "CSS class"} arrays can be used as values:
     *              {
     *                       form: "form",
     *                       input: "form__input",
     *                       label: "form__label",
     *                       select: "form__select",
     *                       options: "form__option",
     *                       textarea: "form__textarea"
     *                   }
     *                   >>> ( used in renderForm(), renderInput(), renderSelect(), renderTextarea() methods) <<<
     *
     *              @param {object} [attributesObj] - object that represents attributes of the created element{
     *                          tagName: {
     *                                      attributeName: attributeValue
     *                                   }
     *                        }
     * */

    /**
     *  Creates such fields:
     *              blood pressure
     *              body mass index(bmi)
     *              heart disease
     *              age
     *
     *           Inserts these fields after reason field
     *
     *           @returns {object} with created DOM elements and the default ones(those which are created in class VisitForm)
     *
     *          card object looks like:
     *          card: {
                fullName: {
                    label: "ФИО: ",
                    elementValue: full name input value
                },
                priority: {
                    label: "Срочность: ",
                    elementValue: priority input value
                },
                reason: {
                    label: "Цель визита: ",
                    elementValue: reason input value
                },
                description: {
                    label: "Описание визита: ",
                    elementValue: description input value
                },
                bloodPressure = {
                    label: "Обычное давление: ",
                    elementValue: blood pressure input value
                },
                bmi = {
                    label: "Индекс массы тела: ",
                    elementValue: body mass index input value
                },
                heartDiseases = {
                    label: "Заболевания сердечно-сосудистой системы: ",
                    elementValue: heart diseases input value
                },
                age = {
                    label: "Возраст: ",
                    elementValue: age input value
                },
                doctor = {
                    label: "Доктор: ",
                    elementValue: "Кардиолог"
                },
     * */

    renderDoctorSet() {
        const {classListObj, textObj, attributesObj, elements} = this;
        const defaultFormElements = super.renderVisitForm();

        elements.bloodPressure = super.renderInput("*Обычное давление: ",
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

        elements.bmi = super.renderInput("*Индекс массы тела: ", /*body mass index*/
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

        elements.heartDiseases = super.renderInput("*Перенесенные заболевания сердечно-сосудистой системы: ",
            {input: classListObj.input, label: classListObj.label},
            "",
            {
                input: {
                    name: "diseases",
                    required: true,
                }
            });

        elements.age = super.renderInput("*Возраст: ",
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

        defaultFormElements.card.bloodPressure = {
            label: "Обычное давление: ",
            elementValue: elements.bloodPressure.children[0].value
        }

        defaultFormElements.card.bmi = {
            label: "Индекс массы тела: ",
            elementValue: elements.bmi.children[0].value
        }

        defaultFormElements.card.heartDiseases = {
            label: "Заболевания сердечно-сосудистой системы: ",
            elementValue: elements.heartDiseases.children[0].value
        }

        defaultFormElements.card.age = {
            label: "Возраст: ",
            elementValue: elements.age.children[0].value
        }

        defaultFormElements.card.doctor = {
            label: "Доктор: ",
            elementValue: "Кардиолог"
        }


        VisitForm.insertElementNextToAnotherElement(elements.reason,
            [elements.bmi, elements.bloodPressure, elements.heartDiseases, elements.age]);
        return {
            ...defaultFormElements,
            bloodPressure: elements.bloodPressure,
            bmi: elements.bmi,
            heartDiseases: elements.heartDiseases,
            age: elements.age
        }
    }
}


