const output = document.querySelector("#output");
const instruction = document.querySelector("#instruction-text");
const isTouchDevice = checkTouchScreen();
let textBlock; 

function checkTouchScreen() {
    return 'ontouchstart' in window;
};
function createBlock(content, id) {
    const block = document.createElement('p');
    block.innerText = content;
    block.id = id;

    return block;
}
async function getFact() {
    const url = 'https://catfact.ninja/fact';
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
        if(xhr.status !== 200) {
            output.innerText = `an error has occurred. ${xhr.status}: ${xhr.statusText}`;
            return;
        }
        if(textBlock) {
            textBlock.remove();
        }

        const response = new Promise((resolve) => {
            resolve(xhr.response);
        })

        response.then((data)=> {
            textBlock = createBlock(data.fact, 'fact');
            output.insertAdjacentElement('afterbegin', textBlock);
        })

        
    };

    xhr.onerror = () => {
        output.innerText = 'The request wasn\'t fullfilled. Please, try again';
    }

    xhr.send();
};
function setInstruction(isTouchDevice) {
    const touchInstruction = 'Tap twice to see a random fact';
    const noTouchInstruction = "Click to see a random fact";

    return (
        isTouchDevice
        ?  touchInstruction
        : noTouchInstruction
    )
}

instruction.innerText = setInstruction(isTouchDevice);
if (isTouchDevice) {
    doubleTap(output,getFact);
} else {
    output.addEventListener('click', (event)=> {
        event.preventDefault();
        getFact();
    }, false)
}

function doubleTap(element, callback) {
    let  timeout;
    let lastTap = 0;
    element.addEventListener('touchend', function(event) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        clearTimeout(timeout);
        if (tapLength < 500 && tapLength > 0) {
        //double tap
            event.preventDefault();
            callback();
        } else {
            //single tap
            timeout = setTimeout(function() {
                clearTimeout(timeout);
            }, 500);
        }
        lastTap = currentTime;
    });
}