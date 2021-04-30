import API from "../components/API.js";
import {Form, VisitForm, VisitFormDentist, VisitFormTherapist, VisitFormCardiologist} from "../components/Form.js";
import {Visit, VisitDentist, VisitTherapist, VisitCardiologist} from "../components/Visit.js";
import DOMElement from "../components/DOMElement.js"
import {ModalLogIn, ModalCreateVisit} from "../components/Modal.js";

const root = document.querySelector('#root');
const main = new DOMElement("main", "main").render();
export const visitSection = new DOMElement("section", ["visit-section", "wrapper"]).render();
export const noVisitMessage = new DOMElement("p", "no-visit-message", "Визитов не добавлено", {hidden: false}).render();

export default function createMainSection(){

    visitSection.append(noVisitMessage)
    main.append(visitSection);
    root.append(main);
}



