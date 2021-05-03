export function createEditSVG(classList, width, height, fill = "#000000"){
    if(!Array.isArray(classList)){
        classList = [classList]
    }
       return `<svg viewBox="0 0 24 24"
                class="${classList.join(" ")}" height="${height}" width="${width}"
                 fill="${fill}" xmlns="http://www.w3.org/2000/svg"><path d="m19 12c-.553 0-1 .448-1 1v8c0 .551-.448 1-1 1h-14c-.552 0-1-.449-1-1v-14c0-.551.448-1 1-1h8c.553 0 1-.448 1-1s-.447-1-1-1h-8c-1.654 0-3 1.346-3 3v14c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3v-8c0-.553-.447-1-1-1z"/><path d="m9.376 11.089c-.07.07-.117.159-.137.255l-.707 3.536c-.033.164.019.333.137.452.095.095.223.146.354.146.032 0 .065-.003.098-.01l3.535-.707c.098-.02.187-.067.256-.137l7.912-7.912-3.535-3.535z"/><path d="m23.268.732c-.975-.975-2.561-.975-3.535 0l-1.384 1.384 3.535 3.535 1.384-1.384c.472-.471.732-1.099.732-1.767s-.26-1.296-.732-1.768z"/></svg>
                `
}

export function createEyeSVG(classList, width, height, fill){
    if(!Array.isArray(classList)){
        classList = [classList]
    }

    return `
    <svg xmlns="http://www.w3.org/2000/svg" class="${classList.join(" ")}" 
    height="${height}" width="${width}" fill="${fill}" viewBox="0 0 576 512"><path d="M288 144a110.94 110.94 0 00-31.24 5 55.4 55.4 0 017.24 27 56 56 0 01-56 56 55.4 55.4 0 01-27-7.24A111.71 111.71 0 10288 144zm284.52 97.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 000 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 000-29.19zM288 400c-98.65 0-189.09-55-237.93-144C98.91 167 189.34 112 288 112s189.09 55 237.93 144C477.1 345 386.66 400 288 400z"/></svg>
    `
}

export function createEyeSlashSVG(classList, width, height, fill){
    if(!Array.isArray(classList)){
        classList = [classList]
    }

    return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" 
    class="${classList.join(" ")}" height="${height}" width="${width}" 
    fill="${fill}" >
    <path d="M634 471L36 3.51A16 16 0 0013.51 6l-10 12.49A16 16 0 006 41l598 467.49a16 16 0 0022.49-2.49l10-12.49A16 16 0 00634 471zM296.79 146.47l134.79 105.38C429.36 191.91 380.48 144 320 144a112.26 112.26 0 00-23.21 2.47zm46.42 219.07L208.42 260.16C210.65 320.09 259.53 368 320 368a113 113 0 0023.21-2.46zM320 112c98.65 0 189.09 55 237.93 144a285.53 285.53 0 01-44 60.2l37.74 29.5a333.7 333.7 0 0052.9-75.11 32.35 32.35 0 000-29.19C550.29 135.59 442.93 64 320 64c-36.7 0-71.71 7-104.63 18.81l46.41 36.29c18.94-4.3 38.34-7.1 58.22-7.1zm0 288c-98.65 0-189.08-55-237.93-144a285.47 285.47 0 0144.05-60.19l-37.74-29.5a333.6 333.6 0 00-52.89 75.1 32.35 32.35 0 000 29.19C89.72 376.41 197.08 448 320 448c36.7 0 71.71-7.05 104.63-18.81l-46.41-36.28C359.28 397.2 339.89 400 320 400z"/></svg>
    `
}

export function createSearchIcon(classList, width, height, fill){
    if(!Array.isArray(classList)){
        classList = [classList]
    }

    return `
        <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
        class="${classList.join(" ")}" height="${height}" width="${width}" 
    fill="${fill}" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.414"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>
    `
}
