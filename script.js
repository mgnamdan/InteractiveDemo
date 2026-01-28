document.addEventListener('DOMContentLoaded', () => {
    // --- Grab elements ---
    const options = document.querySelectorAll(".option");
    const hiddenInput = document.getElementById("realAnswer");
    const submitBtn = document.getElementById("submitAnswer");
    const clearBtn = document.getElementById("clearAnswer");
    const feedback = document.getElementById("feedback");
    const container = document.querySelector(".container");

    // Correct answer (hidden from multiple-choice)
    const correctAnswer = "blue";

    // --- Focus hidden input on page load ---
    hiddenInput.focus();

    // Track wrong guesses and which options were tried
    let selectedOption = null;
    let wrongGuessCount = 0;
    let triedOptions = new Set();

    // --- Animate wrong options ---
    options.forEach((btn) => {
        btn.addEventListener("click", () => {
            options.forEach(option => {
            option.classList.remove("selected");
            });

            btn.classList.add("selected");
            selectedOption = btn;
        });
    });

    // --- Submit hidden input ---
    submitBtn.addEventListener("click", () => {
        // Correct answer check first
        if (hiddenInput.value.trim().toLowerCase() === correctAnswer) {
            showCorrectPage();
            return;
        }

        // Nothing selected and nothing typed
        if (!selectedOption && hiddenInput.value.trim() === "") {
            feedback.hidden = false;
            feedback.textContent = "You have to at least TRY something.";
            return;
        }

        // WRONG submission
        wrongGuessCount++;

        if (selectedOption) {
            triedOptions.add(selectedOption.textContent);

            // Lock this answer into the "wrong" state permanently
            selectedOption.classList.add("submitted");
        }

        const exclamations = "!".repeat(wrongGuessCount);

        feedback.hidden = false;

        if (triedOptions.size < options.length) {
            feedback.textContent = `WRONG${exclamations}`;
        } else {
            feedback.textContent =
            `WRONG${exclamations} …maybe you should try *typing* the answer 👀`;
        }
    });

    // --- Clear hidden input & reset options ---
    clearBtn.addEventListener("click", () => {
        hiddenInput.value = "";
        hiddenInput.focus();

        selectedOption = null;

        options.forEach((btn) => {
            btn.classList.remove("selected");
        });
    });

    // --- Optional: allow pressing Enter to submit ---
    hiddenInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            checkHiddenInput();
        }
    });

    // --- Function to check hidden input ---
    function checkHiddenInput() {
        if (hiddenInput.value.trim().toLowerCase() === correctAnswer) {
            showCorrectPage();
        } else {
            feedback.hidden = false;
            feedback.textContent = "Nope! Keep trying...";
            hiddenInput.value = "";
            hiddenInput.focus();
        }
    }

    // --- Show Correct Page ---
    function showCorrectPage() {
        container.innerHTML = "";

        const correctDiv = document.createElement("div");
        correctDiv.className = "correct-page";
        correctDiv.innerHTML = `
            <h1>🎉 Correct! You escaped the trap! 🎉</h1>
            <p>Press Enter to try again or Space for a secret secret!</p>
        `;
        container.appendChild(correctDiv);

        // Listen for Enter and Space on Correct page
        document.addEventListener("keydown", handleCorrectPageKeys);
    }

    // --- Handle keys on Correct page ---
    function handleCorrectPageKeys(e) {
        if (e.key === "Enter") {
            resetQuiz();
            document.removeEventListener("keydown", handleCorrectPageKeys);
        } else if (e.key === " ") {
            showSecretSecretPage();
            document.removeEventListener("keydown", handleCorrectPageKeys);
        }
    }

    // --- Reset the quiz ---
    function resetQuiz() {

        selectedOption = null;
        wrongGuessCount = 0;
        triedOptions = new Set();

        container.innerHTML = `
            <h1>The Impossible-ish Quiz!</h1>
            <p class="question">Which one of these is the correct color of the sky?</p>
            <div class="options">
            <button class="option">Green</button>
            <button class="option">Purple</button>
            <button class="option">Orange</button>
            <button class="option">Pink</button>
            </div>
            <input type="text" id="realAnswer" placeholder="Type your answer" />
            <div class="button-row">
            <button type="button" id="submitAnswer">Submit</button>
            <button type="button" id="clearAnswer">Clear Answer</button>
            </div>
            <div id="feedback" hidden></div>
        `;

        // Re-grab elements and re-attach event listeners
        reattachEventListeners();
    }

    // --- Secret secret page ---
    function showSecretSecretPage() {
        container.innerHTML = `
            <div class="correct-page" id="secretPage">
            <h1>🕵️‍♂️ Secret Secret Page Unlocked! 🕵️‍♀️</h1>
            <p>Press Enter to return to the quiz.</p>
            </div>
        `;

        const secretPage = document.getElementById("secretPage");

        // --- Create floating emojis ---
        const emojis = ["💥","🎉","🤪","🦄","🍕","🔥","😎","🐙"];
        const emojiElements = [];

        for (let i = 0; i < 15; i++) {
            const span = document.createElement("span");
            span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            span.style.position = "absolute";
            span.style.fontSize = `${Math.random() * 30 + 20}px`;
            span.style.left = `${Math.random() * window.innerWidth}px`;
            span.style.top = `${Math.random() * window.innerHeight}px`;
            span.style.pointerEvents = "none"; // let clicks pass through
            document.body.appendChild(span);
            emojiElements.push(span);
        }

        // --- Animate emojis floating ---
        const emojiInterval = setInterval(() => {
            emojiElements.forEach(span => {
            let top = parseFloat(span.style.top);
            let left = parseFloat(span.style.left);
            top -= Math.random() * 2 + 0.5; // float up
            left += Math.random() * 2 - 1; // drift sideways
            if (top < -50) top = window.innerHeight + 50; // loop from bottom
            span.style.top = `${top}px`;
            span.style.left = `${left}px`;
            });
        }, 30);

        // --- Page shake effect ---
        let shakeAmount = 5;
        const shakeInterval = setInterval(() => {
            const x = Math.random() * shakeAmount * 2 - shakeAmount;
            const y = Math.random() * shakeAmount * 2 - shakeAmount;
            secretPage.style.transform = `translate(${x}px, ${y}px)`;
            // Optional: random background color
            secretPage.style.backgroundColor = `hsl(${Math.random()*360}, 70%, 80%)`;
        }, 200);

        // --- Return to quiz on Enter ---
        document.addEventListener("keydown", function returnFromSecret(e) {
            if (e.key === "Enter") {
            clearInterval(emojiInterval);
            clearInterval(shakeInterval);
            emojiElements.forEach(span => span.remove());
            resetQuiz();
            document.removeEventListener("keydown", returnFromSecret);
            }
        });
    }

    // --- Reattach event listeners after reset ---
    function reattachEventListeners() {
        const newOptions = document.querySelectorAll(".option");
        const newHiddenInput = document.getElementById("realAnswer");
        const newSubmit = document.getElementById("submitAnswer");
        const newClear = document.getElementById("clearAnswer");
        const newFeedback = document.getElementById("feedback");

        // Focus hidden input
        newHiddenInput.focus();

        // Options hover & click
        newOptions.forEach((btn) => {
            btn.addEventListener("click", () => {
            newFeedback.hidden = false;
            newFeedback.textContent = "WRONG! Try typing the secret answer...";
            
            btn.style.transform = "translateX(-10px)";
            setTimeout(() => { btn.style.transform = "translateX(10px)"; }, 50);
            setTimeout(() => { btn.style.transform = "translateX(0px)"; }, 100);
            });
            btn.addEventListener("mouseenter", () => {
            btn.style.backgroundColor = "#ff4500";
            });
            btn.addEventListener("mouseleave", () => {
            btn.style.backgroundColor = "#ff69b4";
            });
        });

        // Submit button
        newSubmit.addEventListener("click", () => {
            if (newHiddenInput.value.trim().toLowerCase() === correctAnswer) {
            showCorrectPage();
            } else {
            newFeedback.hidden = false;
            newFeedback.textContent = "Nope! Keep trying...";
            newHiddenInput.value = "";
            newHiddenInput.focus();
            }
        });

        // Clear button
        newClear.addEventListener("click", () => {
            newHiddenInput.value = "";
            newHiddenInput.focus();
            newFeedback.hidden = true;
            newOptions.forEach((btn) => {
            btn.style.backgroundColor = "#ff69b4";
            btn.style.transform = "translateX(0px)";
            });
        });

        // Enter key submits
        newHiddenInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
            newSubmit.click();
            }
        });
    }
});