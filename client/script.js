import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatcontainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
    element.textContent = '';

    loadInterval = setInterval(() => {
        element.textContent += '.';

        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300)
}

function typeText(element, link) {
    let imgElement = document.createElement("img");
    imgElement.src = link;
    element.appendChild(imgElement);
}

function generateuniqueid() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalstring = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalstring}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
       
        <div class="chat">

        <div class="profile">
        <img src=${isAi ? bot : user}/>
        </div> 
        <div class="message" id=${uniqueId}>${value}</div>
        </div>
       
        </div>

        `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    chatcontainer.innerHTML += chatStripe(false, data.get('prompt'));

    form.reset();

    const uniqueId = generateuniqueid();
    chatcontainer.innerHTML += chatStripe(true, " ", uniqueId);

    chatcontainer.scrollTop = chatcontainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);

    const response = await fetch('https://aishirts.onrender.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval);
    messageDiv.innerHTML = '';

    if (response.ok) {
        const data = await response.json();
        const parseData = data.bot.trim();

        typeText(messageDiv, parseData);
    } else {
        const err = await response.text();

        messageDiv.innerHTML = "Det sket sig"

        alert(err);
    }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e);
    }
})
