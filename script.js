const themeToggle = document.querySelector(".theme-toggle");
// this is for taking input for prompt 
const promptInput = document.querySelector(".prompt-input");
const promptForm = document.querySelector(".prompt-form");
// prompt button
const promptbtn = document.querySelector(".prompt-btn");
// selcting the model 
const modelselect = document.getElementById("model-select");
const countselect = document.getElementById("count-select");
const ratioSelect = document.getElementById("ratio-select");
const gridGallery = document.querySelector(".gallery-grid");
const generateBtn = document.querySelector(".generate-btn");
//const micBtn = document.querySelector(".voice-btn");




const examplePrompt = [
    "A glowing mountain at night with rivers of light running down",
    "A desert with giant hourglasses standing in the sand",
    "A jungle village built inside huge tree roots with lanterns",
    "An ice castle under the northern lights in the sky",
    "A space train moving through stars and planets",
    "An old arena where magical creatures are fighting",
    "A floating crystal city above the ocean with rainbow bridges",
    "A cave full of colorful glowing crystals",
    "A lake with hundreds of floating lanterns at night",
    "A library inside an asteroid flying around Saturn",
    "A giant firebird sitting on top of a volcano",
    "A city built on the backs of giant moving robots",
    "A field where glowing flowers move slowly in the wind",
    "A secret glowing portal behind a waterfall",
    "A carnival in the sky with rides made of light",
];























//themeToggle.addEventListener("click", toggleTheme);

(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPreferDark = window.matchMedia("(prefers-color-schema:dark)").matches;
    const isDarkTheme = savedTheme === "dark" || (!savedTheme && systemPreferDark);
    document.body.classList.toggle("dark-theme", isDarkTheme);
    themeToggle.querySelector("i").classList = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon";
})();



// switch between light and dark themes 
const toggleTheme = () => {
    const isDarkTheme = document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
    themeToggle.querySelector("i").className = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon";

};


const getImageDimensions = (aspectratio, baseSize = 512) => {
    const [width, height] = aspectratio.split("/").map(Number);
    const scaleFactor = baseSize / Math.sqrt(width * height);
    let calculateWidth = Math.round(width * scaleFactor);
    let calculateHeight = Math.round(height * scaleFactor);

    calculateWidth = Math.floor(calculateWidth / 16) * 16;
    calculateHeight = Math.floor(calculateHeight / 16) * 16;

    return { width: calculateWidth, height: calculateHeight };

};

const updateImageCard = (imgIndex, imgUrl) => {
    const imgCard = document.getElementById(`img-card-${imgIndex}`);
    if (!imgCard) return;

    imgCard.classList.remove("loading");
    imgCard.innerHTML = `<img src="${imgUrl}" class="result-img" />
                    <div class="img-overlay">
                        <a href="${imgUrl}" class="img-download-btn" download="${Date.now()}.png">
                            <i class="fa-solid fa-download"></i>
                            </button>
                        </a>    
                    </div>`;

}

// const generateImages = async (selectedModel, imagecount, aspectratio, prompttext) => {
//     const MODEL_URL = `https://api-inference.huggingface.co/models/${selectedModel}`;
//     const { width, height } = getImageDimensions(aspectratio);

//     generateBtn.setAttribute("disabled", "true");

//     const imagePromises = Array.from({ length: imagecount }, async (_, i) => {
//         try {
//             const response = await fetch(MODEL_URL, {
//                 headers: {
//                     Authorization: `Bearer ${API_KEY}`,
//                     "Content-Type": "application/json",
//                 },
//                 method: "POST",
//                 body: JSON.stringify({
//                     inputs: prompttext,
//                     parameters: { width, height },   // these two models support it
//                     options: { wait_for_model: true }
//                 }),
//             });

//             if (!response.ok) {
//                 const err = await response.json().catch(() => ({}));
//                 throw new Error(err.error || `HTTP ${response.status}`);
//             }

//             // if JSON comes back instead of an image → error
//             if (response.headers.get("content-type")?.includes("application/json")) {
//                 const err = await response.json();
//                 throw new Error(err.error || "Invalid response (JSON instead of image)");
//             }

//             // ✅ image blob
//             const blob = await response.blob();
//             updateImageCard(i, URL.createObjectURL(blob));
//         } catch (error) {
//             console.error("Image generation failed:", error.message);
//             const imgCard = document.getElementById(`img-card-${i}`);
//             if (imgCard) {
//                 imgCard.classList.remove("loading");
//                 imgCard.innerHTML = `<p class="error-text">⚠️ ${error.message}</p>`;
//             }
//         }
//     });

//     await Promise.allSettled(imagePromises);
//     generateBtn.removeAttribute("disabled");
// };

const generateImages = async (selectedModel, imagecount, aspectratio, prompttext) => {
    const { width, height } = getImageDimensions(aspectratio);

    generateBtn.setAttribute("disabled", "true");

    const imagePromises = Array.from({ length: imagecount }, async (_, i) => {
        try {

            const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompttext)}?width=${width}&height=${height}&random=${Math.random()}`;


            updateImageCard(i, url);
        } catch (error) {
            console.error("Image generation failed:", error.message);
            const imgCard = document.getElementById(`img-card-${i}`);
            if (imgCard) {
                imgCard.classList.remove("loading");
                imgCard.innerHTML = `<p class="error-text">⚠️ ${error.message}</p>`;
            }
        }
    });

    await Promise.allSettled(imagePromises);
    generateBtn.removeAttribute("disabled");
};
















const createImageCards = (selectedModel, imagecount, aspectratio, prompttext) => {
    gridGallery.innerHTML = "";
    for (let i = 0; i < imagecount; i++) {
        gridGallery.innerHTML += `  <div class="img-card loading" id="img-card-${i}" style="aspect-ratio:${aspectratio}">
                        <div class="status-container">
                            <div class="spinner"></div>
                            <i class="fa-solid fa-triangle-exclamation"></i>
                            <p class="status-text">Generating...</p>
                        </div>
                        <img src="" class="result-img" alt="placeholder"/>

                        </div>`;

    }
    generateImages(selectedModel, imagecount, aspectratio, prompttext);
}


const handleFormSubmit = (e) => {
    e.preventDefault();

    const selectedModel = modelselect.value;
    const imagecount = parseInt(countselect.value) || 1;
    const aspectratio = ratioSelect.value || "1/1";
    const prompttext = promptInput.value.trim();


    createImageCards(selectedModel, imagecount, aspectratio, prompttext);


}


document.addEventListener("DOMContentLoaded", () => {
    const micBtn = document.querySelector(".voice-btn");
    const promptInput = document.querySelector(".prompt-input");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Speech Recognition is not supported in this browser.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = navigator.language || "en-US";

    let isListening = false;

    micBtn.addEventListener("click", () => {
        if (!isListening) {
            recognition.start();
            isListening = true;
            micBtn.classList.add("listening");
            console.log("🎤 Listening in:", recognition.lang);
        } else {
            recognition.stop();
            isListening = false;
            micBtn.classList.remove("listening");
            console.log("Stopped listening");
        }
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("Recognized:", transcript);
        promptInput.value = transcript;
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
        isListening = false;
        micBtn.classList.remove("listening");
        console.log("Recognition ended");
    };
});



















//fill the prompt with random examples 
promptbtn.addEventListener("click", () => {
    const prompt = examplePrompt[Math.floor(Math.random() * examplePrompt.length)];
    promptInput.value = prompt;
    promptInput.focus();


})


promptForm.addEventListener("submit", handleFormSubmit);



themeToggle.addEventListener("click", toggleTheme);

