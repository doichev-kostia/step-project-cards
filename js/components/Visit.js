import API from "./API.js";
import DOMElement from "./DOMElement.js";
import {createEditSVG} from "./CreateSVG.js";

/*
* DefaultObj ={
*   id,
*   fullName,
*   doctor,
*   priority,
*   reason,
*   description
* }
* */
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
    deleteBtn: ["edit__btn", "edit__btn--hover"],
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

    constructor(visitDetails, labelsObj, classListObj = defaultClasses, SVGParams = {width: 20, height: 20}) {
        this.visitDetails = visitDetails;
        this.labelsObj = labelsObj;
        this.classListObj = classListObj;
        this.SVGParams = SVGParams;
        this.elements = {}
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

    toggleVisibility() {
        const {visitDetails, elements, classListObj, SVGParams} = this;
        const {cardContainer} = elements;

        cardContainer.hidden = !cardContainer.hidden
    }

    async editCard() {
        const {visitDetails, elements, classListObj, SVGParams} = this;

        // const allInputs = [...elements.cardContainer.children].map(item => {
        //     let tagName = item.tagName.toLowerCase()
        //     if (tagName !== input) {
        //         item.children.map(element => {
        //             if (element.tagName.toLowerCase() !== "input"){
        //                 element.children.map(elem => elem.tagName.toLowerCase() === "input")
        //             }else {
        //                 return element
        //             }
        //         })
        //     } else {
        //         return item
        //     }

        // });
        //
        // allInputs.forEach(input => {
        //     input.classList.replace(classListObj.inputsDisabled, classListObj.inputs);
        // })

    }

    async applyChanges(cardId, editedCard) {
        //
        //     const response = await API.editCard(cardId,editedCard)
        //     this.render(response)
    }

    extendCard() {
        const {visitDetails, elements, classListObj, SVGParams} = this;
        const {
            cardContainer,
            fullNameLabel,
            fullName,
            doctorLabel,
            doctor,
            extendedInformationContainer,
            showMoreButton,
            editSVG,
            actionsContainer,
            editBtn,
            deleteBtn
        } = elements;


    }

    render() {
        const {visitDetails, labelsObj, elements, classListObj, SVGParams} = this;
        this.id = visitDetails.id;

        elements.cardContainer = new DOMElement("div", classListObj.cardContainer, "",
            {id: this.id}).render();

        for (let [key, value] of Object.entries(labelsObj)) {
            elements[`${key}Label`] = new DOMElement("label", classListObj.label, `${value}`).render();
        }

        for (let [key, value] of Object.entries(visitDetails)) {
            if (key === "description") {
                elements[key] = new DOMElement("textarea", classListObj.textAreaDisabled)
            } else if (key !== "id") {
                elements[key] = new DOMElement("input", classListObj.inputDisabled, "",
                    {placeholder: `${value}`, disabled: true}).render()

            }
        }

        elements.extendedInformationContainer = new DOMElement("div", classListObj.extendedInfoContainer).render()

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

        elements.showMoreButton.addEventListener("click", event => this.extendCard());
        elements.deleteBtn.addEventListener("click", async (event) => await this.deleteCard(elements.cardContainer, this.id));
        elements.editBtn.addEventListener("click", async event => await this.editCard(elements.cardContainer));

        elements.actionsContainer.append(elements.editBtn, elements.deleteBtn);
        elements.fullNameLabel.append(elements.fullName);
        elements.doctorLabel.append(elements.doctor);

        elements.cardContainer.insertAdjacentHTML("afterbegin", elements.editSVG)
        elements.cardContainer.append(
            elements.actionsContainer,
            elements.editSVGButton,
            elements.fullNameLabel,
            elements.doctorLabel,
            elements.extendedInformationContainer,
            elements.showMoreButton
        );

        return elements.cardContainer
    }
}