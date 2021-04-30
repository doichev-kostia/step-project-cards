import API from "./components/API.js";
import {Form, VisitForm} from "./components/Form.js";
import  DOMElement from "./components/DOMElement.js"
import {ModalLogIn, ModalCreateVisit} from "./components/Modal.js"
import Footer from "./sections/footer.js"
import createHeaderSection from "./sections/header.js";
import createMainSection from "./sections/main.js";
import createFooterSection from "./sections/footer.js";

if(sessionStorage.token){
    createHeaderSection(true)
}else{
    createHeaderSection(false)
}

createMainSection()
createFooterSection()
