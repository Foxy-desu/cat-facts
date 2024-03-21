const output = document.querySelector("#output");
const instruction = document.querySelector("#instruction-text");
const isTouchDevice = checkTouchScreen();
const textBlock = createBlock("", 'fact');


function checkTouchScreen() {
    return 'ontouchstart' in window;
};
function createBlock(content, id) {
    const block = document.createElement('p');
    block.classList.add('text-block');
    block.innerText = content;
    block.id = id;

    return block;
}
async function getFact() {
    textBlock.innerText = "\u23F3";
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
            textBlock.innerText = '';
        }

        const response = new Promise((resolve) => {
            resolve(xhr.response);
        })

        response.then((data)=> {
            textBlock.innerText = data.fact;
        })

        
    };

    xhr.onerror = () => {
        output.innerText = 'The request wasn\'t fullfilled. Please, try again';
    }

    setTimeout(()=> {
        xhr.send();
    }, 1000)
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

output.insertAdjacentElement('afterbegin', textBlock);
instruction.innerText = setInstruction(isTouchDevice);
if (isTouchDevice) {
    doubleTap(output,getFact);
} else {
    output.addEventListener('click', (event)=> {
        event.preventDefault();
        moveInstruction()
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
            moveInstruction();
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

function moveInstruction() {
    instruction.classList.remove('fact__instruction-text_centerred')
}