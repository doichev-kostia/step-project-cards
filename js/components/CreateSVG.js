export function createEditSVG(classList, width, height){
       return `
        <svg class=${classList} height=${height.toString()} width=${width.toString()} xmlns="http://www.w3.org/2000/svg"><path class=${classList} d="M55.736 13.636l-4.368-4.362a2.308 2.308 0 00-1.636-.677c-.592 0-1.184.225-1.635.676l-3.494 3.484 7.639 7.626 3.494-3.483a2.305 2.305 0 000-3.264zm-33.814 21.76l7.64 7.627 21.045-21.006-7.64-7.627zm-1.649 1.632l-1.631 9.252 9.271-1.626z"/><path d="M41.393 50.403H12.587V21.597h20.329l5.01-5H10.82a3.243 3.243 0 00-3.234 3.234V52.17a3.243 3.243 0 003.234 3.234h32.339a3.243 3.243 0 003.234-3.234V29.049l-5 4.991v16.363z"/></svg>
        `
}