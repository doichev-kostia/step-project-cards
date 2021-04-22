import API from "./components/API.js";
import Form from "./components/Form.js";
import {Select, Button, TextArea, Input} from "./components/CreateElements.js"
import {ModalLogin, ModalCreateVisit, ModalShowCard} from "./components/Modal.js"

const root = document.querySelector('#root');

function createLoginButton (){
    const button = new Button(root, "Вход", ["btn", "logInBtn"]);
    const createdButton = button.render();
    createdButton.addEventListener("click", event =>{
        const modal = new ModalLogin(root, 'Вход', ['modal-btn', "btn"])
        modal.render()
    })
}

createLoginButton()
