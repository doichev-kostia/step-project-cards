export default class DOMElement {
    /**
     * @requires:
     * elementTag - string
     * classList - string (can be array of strings) e.g ["class1", "class2"]
     * textContent - string
     * attributesObj - object with pairs {
     *     attributeName: attributeValue
     * }
     * */

    constructor(elementTag, classList, textContent, attributesObj) {
        this.attributesObj = attributesObj;
        this.classList = classList;
        this.textContent = textContent;
        this.element = document.createElement(elementTag)
    }
    static count(){
        let counter = 0;
        return function (){
            return  counter ++
        }
    }

    static counter = DOMElement.count()

    addIdentifier(){
        const {element} = this;
        element.dataset.id = `${DOMElement.counter()}`
    }

    addAttributes(){
        const {attributesObj, element} = this;
        if (attributesObj){
            for (let [key, value] of Object.entries(attributesObj)){
                element[key] = value;
            }
        }
    }

    render(){
        let {element, classList, textContent} = this;

        if (!(Array.isArray(classList))) {
            classList = [classList]
        }

        classList.forEach(CSSClass => {
            element.classList.add(CSSClass);
        })

        if(textContent){
            element.textContent = textContent;
        }

        this.addAttributes()
        this.addIdentifier()

        return element;
    }

    remove(){
        const {element, classList} = this;
        const elements = [...document.querySelectorAll(classList)];
        const elementToDelete = elements.find(elem =>elem.dataset.id === element.dataset.id);
        elementToDelete.remove()
    }
}
