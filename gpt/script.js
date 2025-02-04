const inputText = document.getElementById('myInput');
const chatBox = document.getElementById('chat-box');
const sendButton = document.getElementById('myButton');
const themeToggle = document.getElementById('theme-toggle');


sendButton.addEventListener('click', pushcode);


inputText.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        pushcode();
    }
});


function addMessageToChat(message, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(isUser ? 'client' : 'ai');
    messageElement.innerHTML = `<p>${message}</p>`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; 
}


async function pushcode() {
    const userMessage = inputText.value.trim();
    if (!userMessage) return; 

    addMessageToChat(userMessage, true);


    inputText.value = '';

    try {

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDsUFKHCPMDHKZrHuXXYf-t84A3gIMFU9k",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userMessage }] }],
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const responseData = await response.json();
        const aiMessage = responseData.candidates[0].content.parts[0].text;


        addMessageToChat(aiMessage, false);
    } catch (error) {
        console.error('Error:', error);
        addMessageToChat("An error occurred while fetching the AI response. Please try again.", false);
    }
}


themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDarkMode = document.body.classList.contains('dark-theme');
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
});