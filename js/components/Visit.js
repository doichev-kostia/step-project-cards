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


export class Visit{
    /***
     * @requires:
     * parent DOMElement,
     * object {
     *   id,
     *   fullName,
     *   doctor,
     *   priority,
     *   reason,
     *   description
     * },
     * CSS classes obj (array can be used as value){
     *     button: "CSS class"
     *     inputs: "CSS class",
     *     inputsDisabled: "CSS class",
     *     labels: "CSS class",
     *     textArea: "CSS class",
     *     editSVG: "CSS class",
     *     actionsContainer: "CSS class",
     *     editBtn: ["btn", "visit-btn"],
     *     deleteBtn: ["btn", "CSS class", "CSS class2"]
     * },
     * SVGParams obj {
     *     width: number,
     *     height: number
     * }
     */

    constructor(parent, visitDetails, classListObj, SVGParams) {
        this.parent = parent;
        this.visitDetails = visitDetails;
        this.classListObj = classListObj;
        this.SVGParams = SVGParams;
        this.elements = {}
    }
    //
    // async postUserData(){
    //     let {visitDetails} = this;
    //
    //     visitDetails =  await API.saveCard(visitDetails);
    //     this.id = visitDetails.id
    // }
    //
    // async deleteCard(elementToDelete, cardId){
    //     elementToDelete.remove()
    //     await API.deleteCard(cardId)
    // }
    //
    // async editCard(cardContainer) {
    //     const allInputs = [...cardContainer.children].map(item =>{
    //         return item.tagName.toLowerCase() === "input";
    //     });
    //
    //     allInputs.forEach(input =>{
    //         input.classList.replace(classListObj.inputsDisabled, classListObj.inputs);
    //     })
    //
    // }
    //
    // async applyChanges(cardId, editedCard){
    //
    //     const response = await API.editCard(cardId,editedCard)
    //     this.render(response)
    // }
    //
    // expandCard() {
    //
    // }
    //
    // renderTemplate(receivedVisitDetails){
    //     const {parent, elements, classListObj, SVGParams} = this;
    //     this.id = receivedVisitDetails.id;
    //
    //     elements.cardContainer = new DOMElement("div", classListObj.cardContainer).render();
    //
    //     elements.fullNameLabel = new DOMElement("label",classListObj.inputsDisabled , "Пациент: ").render();
    //     elements.fullName = new Input(elements.fullNameLabel, `${receivedVisitDetails.fullName}`, classListObj.inputsDisabled, "text");
    //
    //     elements.doctorLabel = new DOMElement("label", classListObj.labels, "Врач: ").render();
    //     elements.doctor = new Input(elements.doctorLabel, `${receivedVisitDetails.doctor}`,classListObj.inputsDisabled, "text");
    //
    //     elements.priorityLabel = new DOMElement("label", classListObj.labels, "Срочность: ").render();
    //     elements.priority = new Input(elements.priorityLabel, `${receivedVisitDetails.priority}`, classListObj.inputsDisabled, "text");
    //
    //     elements.reasonLabel = new DOMElement("label", classListObj.labels, "Цель визита: ").render();
    //     elements.reason = new Input(elements.reasonLabel, `${receivedVisitDetails.reason}`, classListObj.inputsDisabled, "text");
    //
    //     elements.description = new TextArea(parent,
    //         "Описание визита: ",
    //         "description",
    //         {label: classListObj.labels, textArea: classListObj.textArea},)
    //
    //     elements.showMoreButton = new Button(elements.cardContainer, "Показать больше", classListObj.button);
    //     elements.editSVG = createEditSVG(classListObj.editSVG, SVGParams.width, SVGParams.height );
    //
    //     elements.actionsContainer = new DOMElement("div", classListObj.actionsContainer).render();
    //     elements.editBtn = new Button(elements.actionsContainer, "Изменить", classListObj.editBtn).render();
    //     elements.deleteBtn = new Button(elements.actionsContainer, "Удалить", classListObj.deleteBtn).render();
    //
    //     elements.showMoreButton.addEventListener("click", event => this.expandCard())
    //     elements.deleteBtn.addEventListener("click", async (event) => await this.deleteCard(elements.cardContainer, this.id))
    //     elements.editBtn.addEventListener("click", async event => await this.editCard(elements.cardContainer))
    //
    //     parent.append(elements.cardContainer);
    //     elements.cardContainer.append(elements.editSVG, elements.actionsContainer,elements.fullNameLabel, elements.doctorLabel, elements.priorityLabel, elements.reasonLabel)
    // }


}

// export class VisitDentist extends Visit{
//     constructor(parent, visitDetails, classListObj, SVGParams) {
//         super(parent, visitDetails, classListObj, SVGParams);
//     }
//
//     render(receivedVisitDetails) {
//         super.renderTemplate(receivedVisitDetails)
//         const {parent, elements, classListObj} = this;
//         const {cardContainer, fullNameLabel, fullName, doctorLabel, doctor, priorityLabel,
//             priority, reasonLabel, reason, description ,showMoreButton,editSVG,actionsContainer,
//             editBtn,deleteBtn} = elements;
//
//         elements.dateLabel = new DOMElement("label", classListObj.labels, "Дата последнего посещения").render();
//         elements.date = new Input(elements.dateLabel, receivedVisitDetails.date, classListObj.inputsDisabled, "text");
//
//
//         cardContainer.append(editSVG, actionsContainer, fullNameLabel, doctorLabel, showMoreButton)
//     }
// }
//
// export class VisitCardiologist extends Visit{
//     constructor() {
//         super();
//     }
// }
//
// export class VisitTherapist extends Visit{
//     constructor() {
//         super();
//     }
// }
