import API from "./API.js";
import DOMElement from "./DOMElement.js";
import {createEditSVG} from "./CreateSVG.js";
import {
    Form,
    VisitForm,
    VisitFormDentist,
    VisitFormTherapist,
    VisitFormCardiologist
} from "./Form.js";

/** Object with default CSS classes */
const defaultClasses = {
    cardContainer: "card",
    label: "card__label",
    inputDisabled: ["card__input--disabled", "card__input"],
    input: "card__input",
    button: "card__button",
    editSVG: ["card__icon", "edit"],
    editSVGButton: ["card__icon", "card__icon-button"],
    actionsContainer: "edit__container",
    editBtn: "edit__btn",
    deleteBtn: ["edit__btn", "edit__btn--hover-red"],
    extendedInfoContainer: "card__extended-info-container",
    textArea: "card__textarea",
    textAreaDisabled: ["card__textarea--disabled", "card__textarea"]
}

export class Visit {
    /** @constructor
     * Creates visit card
     *
     *  @param {Object} visitDetails - object {
     *   id: 15688
     *   description: {
     *                  label: "Описание визита: ",
     *                  elementValue: ""
     *                  },
         doctor: {
                    label: "Доктор: ",
                    elementValue: "Стоматолог"
                   },
         fullName: {
                    label: "ФИО: ",
                    elementValue: "gogidoe"
                    },
         previousVisitDate: {
                     label: "Дата последнего визита: ",
                     elementValue: "2021-02-04"
                    },
         priority: {
                    label: "Срочность: ",
                     elementValue: "Обычная"
                    },
         reason: {
                    label: "Цель визита: ",
                     elementValue: "Осмотр"
                    },
     *   }
     *
     *  @param {Object} classListObj - obj with CSS classes
     *  (array can be used as a value){
     *     cardContainer: "CSS class"
     *     label: "CSS class",
     *     inputDisabled: "CSS class",
     *     input: "CSS class",
     *     button: "CSS class"
     *     editSVG: "CSS class",
     *     actionsContainer: "CSS class",
     *     editBtn: ["btn", "visit-btn"],
     *     deleteBtn: ["btn", "CSS class", "CSS class2"],
     *     extendedInfoContainer: "CSS class"
     *     textArea: "CSS class",
     *     textAreaDisabled: "",
     *     }
     *  @param{Object} SVGParams - obj with parameters {
     *     width: number,
     *     height: number
     *     }
     */
    constructor(visitDetails,
                classListObj = defaultClasses,
                SVGParams = {width: 20, height: 20}) {
        this.visitDetails = visitDetails;
        this.classListObj = classListObj;
        this.SVGParams = SVGParams;
        this.elements = {
            cardContainer: new DOMElement(
                "div",
                classListObj.cardContainer,
                "",
                {id: visitDetails.id}).render()
        }
    }

    /**
     * Changes visibility of the card
     *
     *  @param {Boolean} toHide - If true - card will be hidden, if false - shown;
     *  @param {String | Number} cardId - id of the card that will change
     *  its visibility. Can look like "#idNumber", "idNumber", idNumber
     * */
    static toggleVisibility(toHide, cardId) {
        let card;
        cardId = cardId.toString()

        if (cardId.includes("#")) {
            card = document.querySelector(cardId);
        } else {
            let id = `#${cardId}`
            card = document.querySelector(id);
        }

        card.hidden = toHide;
    }

    /**
     * Insert element next to another one
     *  @param {Element} staticElement - element next to which another
     *  element will be inserted
     *
     *  @param {Element | Element[]} elementToInsert - element or
     *  array of elements that will be inserted
     *
     *  @param {String} place - put elementToInsert "after" of "begin" the staticElement
     * */
    static insertElementNextToAnotherElement(staticElement,
                                             elementToInsert,
                                             place = "after") {
        if (!Array.isArray(elementToInsert)) {
            elementToInsert = [elementToInsert];
        }

        if (place === "after" || place === "before") {
            elementToInsert.forEach(item => {
                staticElement[place](item);
            })
        } else {
            console.error(new Error("Not valid insert place"));
            return;
        }
    }

    /**
     * Creates and saves visit card
     *
     *  @param {Object} formElements - elements of the form
     *  Expected to look like(some fields may be different):
     *  {
            age: label.form__label
            bloodPressure: label.form__label
            bmi: label.form__label
            card: {fullName: {…}, priority: {…}, reason: {…}, description: {…}, bloodPressure: {…}, …}
            description: label.form__label
            form: form.form
            fullName: label.form__label
            heartDiseases: label.form__label
            priority: label.form__label
            reason: label.form__label
            submitButton: input.btn.form__btn
     *  }
     *
     *  @return {Object} saved card and its id
     * */
    static async registerVisitCard(formElements) {
        let card = formElements.card
        let formElementsObj = Object.assign(formElements)

        delete formElementsObj.card
        delete formElementsObj.form
        delete formElementsObj.submitButton

        for (let [key, value] of Object.entries(formElementsObj)) {
            card[key].elementValue = formElementsObj[key].children[0].value;
        }

        return await API.saveCard(card);
    }

    /**
     * Insert visit cards in page / parent element
     *
     *  @param {Element} parent - element in which cards will be
     *  inserted
     *
     *  @param {Object | Object[]} cards - object or array of objects with
     *  card details
     *
     * */
    static async renderCards(parent, cards) {
        if (!Array.isArray(cards)) {
            cards = [cards]
        }

        cards.forEach(card => {
            if (card.doctor.elementValue === "Терапевт") {
                const therapistCard = new VisitTherapist(card).renderCard();
                parent.append(therapistCard.cardContainer);
            } else if (card.doctor.elementValue === "Кардиолог") {
                const cardiologistCard = new VisitCardiologist(card).renderCard();
                parent.append(cardiologistCard.cardContainer);
            } else if (card.doctor.elementValue === "Стоматолог") {
                const dentistCard = new VisitDentist(card).renderCard();
                parent.append(dentistCard.cardContainer);
            }
        })
    }

    /**
     * Create default visit card.
     *
     * @returns {object} all created elements
     *
     * example of elements :{
     *      actionsContainer: div.edit__container
            age: label.card__label
            cardContainer: div#15681.card
            deleteBtn: button.edit__btn.edit__btn--hover-red
            description: label.card__label
            doctor: label.card__label
            editBtn: button.edit__btn
            editSVG: <svg></svg>
            editSVGButton: button.card__icon.card__icon-button
            fullName: label.card__label
            priority: label.card__label
            reason: label.card__label
            showMoreButton: button.card__button
     * }
     *
     * */
    render() {
        const {visitDetails, elements, classListObj, SVGParams} = this;
        this.id = visitDetails.id
        const form = new Form();

        for (let [objectKey, objectValue] of Object.entries(visitDetails)) {
            if (objectKey !== "id") {
                elements[objectKey] = form.renderInput(objectValue.label, {
                    label: classListObj.label,
                    input: classListObj.inputDisabled
                }, "", {
                    label: {
                        hidden: true,
                    },
                    input: {
                        value: objectValue.elementValue,
                        disabled: true,
                        name: objectKey
                    }
                });
            }
        }

        elements.fullName.hidden = false;
        elements.doctor.hidden = false;

        let priorityInput = elements.priority.children[0];

        if (priorityInput.value === "low") {
            priorityInput.value = "Обычная"
        } else if (priorityInput.value === "normal") {
            priorityInput.value = "Приоритетная"
        } else if (priorityInput.value === "high") {
            priorityInput.value = "Неотложная"
        }

        elements.showMoreButton = new DOMElement(
            "button",
            classListObj.button,
            "Показать больше").render();

        elements.editSVG = createEditSVG(
            classListObj.editSVG,
            SVGParams.width,
            SVGParams.height);

        elements.editSVGButton = new DOMElement(
            "button",
            classListObj.editSVGButton,
            "",
            {visibility: "hidden"}).render();

        elements.actionsContainer = new DOMElement(
            "div",
            classListObj.actionsContainer,
            "",
            {hidden: true}).render();

        elements.editBtn = new DOMElement(
            "button",
            classListObj.editBtn,
            "Изменить").render();

        elements.deleteBtn = new DOMElement(
            "button",
            classListObj.deleteBtn,
            "Удалить").render();

        let actionContainerTrigger = false;
        elements.editSVGButton.addEventListener("click", event => {
            elements.actionsContainer.hidden = actionContainerTrigger;
            actionContainerTrigger = !actionContainerTrigger;
        });

        let extendFlag = true;
        elements.showMoreButton.addEventListener("click", event => {
            this.extendCard(extendFlag);
            extendFlag = !extendFlag
        });

        elements.deleteBtn.addEventListener("click", async (event) => {
            await this.deleteCard(elements.cardContainer, this.id);
        });

        elements.editBtn.addEventListener("click", async event => {
            await this.editCard();
        });

        elements.actionsContainer.append(elements.editBtn, elements.deleteBtn);
        elements.cardContainer.insertAdjacentHTML("afterbegin", elements.editSVG);

        elements.cardContainer.append(
            elements.fullName,
            elements.doctor,
            elements.priority,
            elements.reason,
            elements.description,
            elements.actionsContainer,
            elements.editSVGButton,
            elements.showMoreButton
        );

        return elements
    }


    /**
     * if showMoreButton is clicked, copy of the visit card and all the
     * visit information will be shown
     * like a modal
     *
     * */
    extendCard() {
        const {visitDetails, elements, classListObj, SVGParams} = this;

        const root = document.querySelector("#root");
        let cardCopy = elements.cardContainer.cloneNode(true)
        const cardCopyChildren = [...cardCopy.children];

        for (let [key, value] of Object.entries(classListObj)) {
            if (!Array.isArray(value)) {
                classListObj[key] = [value]
            }
        }

        const cardFields = cardCopyChildren.filter(child => {
            return child.tagName.toLowerCase() === "label"
        });

        cardFields.forEach(item => item.hidden = false);
        let showMoreBtn = cardCopyChildren
            .find(child => {
                return child.tagName.toLowerCase() === "button" &&
                    child.className === classListObj.button.join(" ")
            });

        let editSVGButton = cardCopyChildren
            .find(child => child.tagName.toLowerCase() === "button" &&
                child.className === classListObj.editSVGButton.join(" "));

        let actionsContainer = cardCopyChildren
            .find(child => {
                if(child.tagName.toLowerCase() !== "svg"){
                    return child.className === classListObj.actionsContainer.join(" ")
                }
            });

        let deleteBtn = [...actionsContainer.children].find(child => {
            return child.className === classListObj.deleteBtn.join(" ");
        });

        let editBtn = [...actionsContainer.children].find(child => {
            return child.className === classListObj.editBtn.join(" ")
        });

        let modalWrapper = new DOMElement("div",
            "modal-wrapper").render();

        let actionContainerTrigger = false;

        editSVGButton.addEventListener("click", event => {
            actionsContainer.hidden = actionContainerTrigger;
            actionContainerTrigger = !actionContainerTrigger;
        });

        editBtn.addEventListener("click", async event => {
            await this.editCard(cardCopy)
        });

        deleteBtn.addEventListener("click", async (event) => {
            modalWrapper.remove()
            await this.deleteCard(elements.cardContainer, this.id);
        });


        modalWrapper.addEventListener("click", ({target}) => {
            if (target === modalWrapper || target === showMoreBtn) {
                modalWrapper.remove()
            }
        })

        showMoreBtn.textContent = "Скрыть";


        modalWrapper.append(cardCopy);
        root.append(modalWrapper);
    }

    /**
     * Deletes the card from page and from Database
     *  @param {Element} elementToDelete - cardContainer that will be removed
     *  @param {Number} cardId - id that database use to find and delete the
     *  card
     *
     * */
    async deleteCard(elementToDelete, cardId) {
        elementToDelete.remove()

        await API.deleteCard(cardId);
        let cardsLeft = await API.getAllCards();

        if (cardsLeft.length === 0) {
            const noVisitMessage = document.querySelector(".no-visit-message");
            noVisitMessage.hidden = false;
        }
    }

    /**
     * If edit button is clicked, all the fields become changeable(disabled
     * = false) if it's clicked one more time, the fields become disabled
     *
     * @param {Element} card - cardContainer or cardContainer copy
     * */
    async editCard(card = this.elements.cardContainer) {
        const {visitDetails, elements, classListObj, SVGParams} = this;

        for (let [key, value] of Object.entries(classListObj)) {
            if (!Array.isArray(value)) {
                classListObj[key] = [value]
            }
        }


        let actionsContainer, editBtn;

        if (card !== elements.cardContainer) {
            actionsContainer = [...card.children].find(child => {
                if (child.tagName.toLowerCase() !== "svg") {
                    return child.className === classListObj.actionsContainer.join(" ")
                }
            })
            editBtn = [...actionsContainer.children].find(child => {
                return child.classList.contains(classListObj.editBtn[0]);
            });

        } else {
            editBtn = elements.editBtn
        }

        const labels = [...card.children].filter(child => {
            return child.tagName.toLowerCase() === "label"
        });

        labels.forEach(label => {

            [...label.children].forEach(async child => {

                if (child.disabled) {
                    child.className = classListObj.input.join(" ")
                    child.disabled = false;
                    editBtn.textContent = "Готово";
                    editBtn.classList.add("edit__btn--hover-green")
                } else {
                    editBtn.classList.remove("edit__btn--hover-green")
                    editBtn.textContent = "Изменить";
                    child.className = classListObj.inputDisabled.join(" ")
                    child.disabled = true;
                }
            });
        });
        await this.applyChanges(card)
    }

    /**
     * Sends request to server to put edited object
     *  @param {Element} card - edited card. cardContainer is expected to be
     *  passed
     * */
    async applyChanges(card = this.elements.cardContainer) {
        const {visitDetails, elements, classListObj, SVGParams} = this;

        let labelsObj = {};
        for (let [objectKey, objectValue] of Object.entries(elements)) {
            if (objectValue instanceof Element) {
                if (objectValue.tagName.toLowerCase() === "label") {
                    labelsObj[objectKey] = objectValue.children[0].value;
                }
            }
        }


        if (card !== elements.cardContainer) {
            let cardInputs = [...card.children]
                .filter(child => child.tagName.toLowerCase() === "label")
                .map(label => label.children[0]);

            for (let [objectKey, objectValue] of Object.entries(labelsObj)) {
                labelsObj[objectKey] = cardInputs.find(item => {
                    return item.name === objectKey
                }).value
            }
        }

        for (let [objectKey, objectValue] of Object.entries(labelsObj)) {
            visitDetails[objectKey].elementValue = labelsObj[objectKey];
        }

        for (let [objectKey, objectValue] of Object.entries(visitDetails)) {
            if (objectKey !== 'id') {
                elements[objectKey].children[0].value = visitDetails[objectKey].elementValue
            }
        }

        await API.editCard(this.id, visitDetails);
    }
}

export class VisitTherapist extends Visit {
    renderCard() {
        const {visitDetails, elements, classListObj, SVGParams} = this;
        super.render();

        Visit.insertElementNextToAnotherElement(elements.reason, elements.age);
        return elements;
    }

}

export class VisitDentist extends Visit {
    renderCard() {
        const {visitDetails, elements, classListObj, SVGParams} = this;
        super.render();

        Visit.insertElementNextToAnotherElement(elements.reason,
            elements.previousVisitDate);

        return elements
    }
}

export class VisitCardiologist extends Visit {
    renderCard() {
        const {visitDetails, elements, classListObj, SVGParams} = this;
        super.render();

        Visit.insertElementNextToAnotherElement(elements.reason,
            [elements.bloodPressure, elements.bmi,
                elements.heartDiseases, elements.age]);

        return elements;
    }
}