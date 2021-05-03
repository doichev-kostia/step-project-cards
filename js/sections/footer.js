import DOMElement from "../components/DOMElement.js"

const root = document.querySelector('#root');

export default function createFooterSection(){
    const footer = new DOMElement("footer", "footer").render()
    const footerText = new DOMElement("p", "footer__text", "Copyright © 2021  | All Rights Reserved").render()

    root.append(footer);
    footer.append(footerText);
}

