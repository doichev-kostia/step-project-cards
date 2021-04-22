import API from "../components/API.js";
import Form from "../components/Form.js";
import {Select, Button, TextArea, Input, CreateElement} from "../components/CreateElements.js"
import {ModalLogin, ModalCreateVisit, ModalShowCard} from "../components/Modal.js"


export default function createHeaderSection() {
    const root = document.querySelector('#root');

    function createLoginButton(parent) {
        const button = new Button(parent, "Вход", ["btn", "logInBtn"]);
        const createdButton = button.render();
        createdButton.addEventListener("click", event => {
            const modal = new ModalLogin(root, 'Вход', ['modal-btn', "btn"])
            modal.render()
        })
    }

    const header = new CreateElement("header", ["header", "wrapper"]).render();
    const logoWrapper = new CreateElement("a", ["logo-wrapper"]).render();
    const logo = new CreateElement("img", ["logo"]).render();
    logo.src = "../dist/img/logo.png";

    root.append(header);
    header.append(logoWrapper)
    createLoginButton(header);
    logoWrapper.append(logo)
}

createHeaderSection()
