import API from "./API.js";
import DOMElement from "./DOMElement.js";
import {createEditSVG} from "./CreateSVG.js";
import {Form, VisitForm, VisitFormDentist, VisitFormTherapist, VisitFormCardiologist} from "./Form.js";

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
    /***
     * @requires:
     * visitDetails - object {
     *   id,
     *   fullName,
     *   doctor,
     *   priority,
     *   reason,
     *   description
     * },
     * CSS classes - obj (array can be used as a value){
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
     * },
     * SVGParams obj {
     *     width: number,
     *     height: number
     * }
     */
    constructor(visitDetails, classListObj = defaultClasses, SVGParams = {width: 20, height: 20}) {
        this.visitDetails = visitDetails;
        this.classListObj = classListObj;
        this.SVGParams = SVGParams;
        this.elements = {
            cardContainer: new DOMElement("div", classListObj.cardContainer, "", {id: visitDetails.id}).render()
        }
    }

    static toggleVisibility(toHide, cardId) {
        /**
         * toHide argument is a boolean value. If true - card will be hidden, if false - shown;
         * */
        let card;

        if (cardId.includes("#")) {
            card = document.querySelector(cardId);
        } else {
            card = document.querySelector(`#${cardId}`);
        }

        card.hidden = toHide;
    }

    static insertElementNextToAnotherElement(staticElement, elementToInsert) {
        if (!Array.isArray(elementToInsert)) {
            elementToInsert = [elementToInsert]
        }

        elementToInsert.forEach(item => {
            staticElement.after(item);
        })
    }

    static async createVisitCard(formElements) {
        let visitDetails = formElements.card
        let formElementsObj = Object.assign(formElements)

        delete formElementsObj.card
        delete formElementsObj.form
        delete formElementsObj.submitButton

        for (let [key, value] of Object.entries(formElementsObj)) {
            visitDetails[key].elementValue = formElementsObj[key].children[0].value;
        }

        return await API.saveCard(visitDetails);
    }

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

                elements[objectKey].children[0].textContent = objectValue.elementValue // elements[objectKey] = <label>
            }
        }

        elements.fullName.hidden = false;
        elements.doctor.hidden = false;

        elements.showMoreButton = new DOMElement("button", classListObj.button, "Показать больше").render();

        elements.editSVG = createEditSVG(classListObj.editSVG, SVGParams.width, SVGParams.height);
        elements.editSVGButton = new DOMElement("button", classListObj.editSVGButton, "",
            {visibility: "hidden"}).render();

        elements.actionsContainer = new DOMElement("div", classListObj.actionsContainer, "", {hidden: true}).render();
        elements.editBtn = new DOMElement("button", classListObj.editBtn, "Изменить").render();
        elements.deleteBtn = new DOMElement("button", classListObj.deleteBtn, "Удалить").render();

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

        elements.deleteBtn.addEventListener("click", async (event) => await this.deleteCard(elements.cardContainer, this.id));
        elements.editBtn.addEventListener("click", async event => await this.editCard());

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

    extendCard() {
        const {visitDetails, elements, classListObj, SVGParams} = this;

        const root = document.querySelector("#root");

        let cardCopy = elements.cardContainer.cloneNode(true)
        const cardCopyChildren = [...cardCopy.children];

        const cardFields = cardCopyChildren.filter(child => child.tagName.toLowerCase() === "label");
        cardFields.forEach(item => item.hidden = false);

        let showMoreBtn = cardCopyChildren
            .find(child => child.tagName.toLowerCase() === "button" && child.classList.contains(classListObj.button || classListObj.button.join(" ")));
        let editSVGButton = cardCopyChildren
            .find(child => child.tagName.toLowerCase() === "button" && child.className.includes(classListObj.editSVGButton.join(" ")));
        let actionsContainer = cardCopyChildren
            .find(child => child.classList.contains(classListObj.actionsContainer));
        let deleteBtn = [...actionsContainer.children].find(child => child.className.includes(classListObj.deleteBtn.join(" ")));
        let editBtn = [...actionsContainer.children].find(child => child.classList.contains(classListObj.editBtn));


        let lastLabel = cardCopyChildren.filter(child => child.tagName.toLowerCase() === "label").pop();
        let modalWrapper = new DOMElement("div", "modal-wrapper").render();


        let actionContainerTrigger = false;
        editSVGButton.addEventListener("click", event => {
            actionsContainer.hidden = actionContainerTrigger;
            actionContainerTrigger = !actionContainerTrigger;
        });

        editBtn.addEventListener("click", async event => {
            await this.editCard(cardCopy)
        });

        deleteBtn.addEventListener("click", async (event) =>{
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

    async deleteCard(elementToDelete, cardId) {
        elementToDelete.remove()

        await API.deleteCard(cardId);
        let cardsLeft = await API.getAllCards();

        if (cardsLeft.length === 0) {
            const noVisitMessage = document.querySelector(".no-visit-message");
            noVisitMessage.hidden = false;
        }
    }

    async editCard(card = this.elements.cardContainer) {
        const {visitDetails, elements, classListObj, SVGParams} = this;
        if (!Array.isArray(classListObj.input)) {
            classListObj.input = [classListObj.input]
        }

        let actionsContainer, editBtn;

        if (card !== elements.cardContainer) {
            actionsContainer = [...card.children].find(child => {
                if (child.tagName.toLowerCase() !== "svg"){
                    return child.className.includes(classListObj.actionsContainer);
                }
            })
            editBtn = [...actionsContainer.children].find(child => {
                   return child.className.includes(classListObj.editBtn)
            });

        } else {
            editBtn = elements.editBtn
        }

        const labels = [...card.children].filter(child => child.tagName.toLowerCase() === "label");
        labels.forEach(label => {

            [...label.children].forEach(async child => {

                if (child.disabled === true) {
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

    async applyChanges(card = this.elements.cardContainer) {
        const {visitDetails, elements, classListObj, SVGParams} = this;

        let labelsObj = {};
        for (let [objectKey, objectValue] of Object.entries(elements)) {
            if (typeof (objectValue) !== "string") {
                if (objectValue.tagName.toLowerCase() === "label") {
                    labelsObj[objectKey] = objectValue.children[0].value;
                }
            }
        }


        if (card !== elements.cardContainer) {
            let cardInputs = [...card.children]
                .filter(child => child.tagName.toLowerCase() === "label")
                .map(label => label.children[0]);

            for(let [objectKey, objectValue] of Object.entries(labelsObj)){
                labelsObj[objectKey] = cardInputs.find(item => item.name === objectKey).value
            }
        }

        for (let [objectKey, objectValue] of Object.entries(labelsObj)) {
            visitDetails[objectKey].elementValue = labelsObj[objectKey];
        }

        for (let [objectKey, objectValue] of Object.entries(visitDetails)){
            if(objectKey !== 'id'){
                elements[objectKey].children[0].value = visitDetails[objectKey].elementValue
            }
        }

        const response = await API.editCard(this.id, visitDetails);
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

        Visit.insertElementNextToAnotherElement(elements.reason, elements.previousVisitDate);
        return elements
    }
}

export class VisitCardiologist extends Visit {
    renderCard() {
        const {visitDetails, elements, classListObj, SVGParams} = this;
        super.render();

        Visit.insertElementNextToAnotherElement(elements.reason,
            [elements.bloodPressure, elements.bmi, elements.heartDiseases, elements.age]);

        return elements;
    }
}