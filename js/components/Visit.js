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

    constructor(visitDetails, classListObj = defaultClasses, SVGParams = {width: 20, height: 20}) {
        this.visitDetails = visitDetails;
        this.classListObj = classListObj;
        this.SVGParams = SVGParams;
        this.elements = {
            cardContainer: new DOMElement("div", classListObj.cardContainer, "", {id: visitDetails.id}).render()
        }
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

    extendCard() {

    }

    async editCard() {
        const {visitDetails, elements, classListObj, SVGParams} = this;
        if (!Array.isArray(classListObj.input)){
            classListObj.input = [classListObj.input]
        }

        const labels = [...elements.cardContainer.children].filter(child => child.tagName.toLowerCase() === "label");
        labels.forEach(label => {
            [...label.children].forEach(child => {
                if (child.disabled === true) {
                    child.className = classListObj.input.join(" ")
                    child.disabled = false;
                    elements.editBtn.textContent = "Готово";
                } else {
                    this.applyChanges()
                    elements.editBtn.textContent = "Изменить"
                    child.className = classListObj.inputDisabled.join(" ")
                    child.disabled = true;
                }
            });
        });
    }

    async applyChanges() {
        const {visitDetails, elements, classListObj, SVGParams} = this;




        const response = await API.editCard(this.id,visitDetails)
        this.render(response)
    }

    static insertElementNextToAnotherElement(staticElement, elementToInsert) {
        if(!Array.isArray(elementToInsert)){
            elementToInsert = [elementToInsert]
        }

        elementToInsert.forEach(item =>{
            staticElement.after(item);
        })
    }

    render() {
        const {visitDetails, elements, classListObj, SVGParams} = this;
        this.id = visitDetails.id

        const form = new Form();

        for (let [key, value] of Object.entries(visitDetails)) {
            if (key !== "id") {
                elements[key] = form.renderInput(value.label, {
                    label: classListObj.label,
                    input: classListObj.inputDisabled
                }, value.value, {
                    input: {
                        disabled: true
                    }
                });
            }
        }


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
        elements.editBtn.addEventListener("click", async event =>{await this.editCard();})

        elements.actionsContainer.append(elements.editBtn, elements.deleteBtn);


        elements.cardContainer.insertAdjacentHTML("afterbegin", elements.editSVG)

        elements.cardContainer.append(
            elements.fullName,
            elements.doctor,
            elements.actionsContainer,
            elements.editSVGButton,
            elements.showMoreButton
        );

        return elements
    }
}

export class VisitTherapist extends Visit {
    renderCard() {
       return super.render();
    }

    extendCard(flag) {
        /**flag is a boolean value. True - the card needs to be extended
         * False - the card needs to be compressed  */

        const {visitDetails, elements, classListObj, SVGParams} = this;

        super.extendCard()
        const root = document.querySelector("#root");

        if (flag) {
            const modalWrapper = new DOMElement("div", "modal-wrapper").render();
            elements.showMoreButton.textContent = "Скрыть"

            root.append(modalWrapper);
            modalWrapper.append(elements.cardContainer);
            Visit.insertElementNextToAnotherElement(elements.doctor,
                [elements.priority, elements.reason, elements.age, elements.description ]);
        }else{
               const modalWrapper = document.querySelector(".modal-wrapper");
               elements.showMoreButton.textContent = "Показать больше";

               modalWrapper.remove()
        }
    }
}

export class VisitDentist extends Visit {
    renderCard() {
        return  super.render()
    }
}

export class VisitCardiologist extends Visit {
    renderCard() {
        return  super.render()
    }
}
