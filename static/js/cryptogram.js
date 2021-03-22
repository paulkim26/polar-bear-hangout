//globals
const plainAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const cipherAlphabet = generateCipherAlphabet();
let plaintext;
let hints = [];
let hintsUsed = 0;
const startTime = moment();
let puzzleIndex = getParameterByName("puzzle");

//generate puzzle
function generateCipherAlphabet() {
    let bank = plainAlphabet.slice(); //clone array
    let tempCipherAlphabet = [];
    while (bank.length > 0) {
        const i = getRndInteger(0, bank.length);
        tempCipherAlphabet.push(bank[i]);
        bank.splice(i, 1);
    }
    return tempCipherAlphabet;
}

function generateMessage() {
    const messages = [
        "An explorer's honour is to be trusted. An explorer is loyal to his country, leaders, parents, and subordinates. An explorer is made to serve and save their neighbour. An explorer is a friend to all and a brother to every other explorer. An explorer is courteous and chivalrous. An explorer sees in nature god's creation: he loves plants and animals. An explorer obeys proper orders and leaves nothing half finished. An explorer smiles and whistles under all difficulties. An explorer is thrifty; he takes care of his own posessions and those of others. An explorer is clean in thought, word, and deed.",
        "Our Father in heaven, hallowed be your name. Your kingdom come, your will be done, on earth as it is in heaven. Give us this day our daily bread, and forgive us our debts, as we also have forgiven our debtors. And lead us not into temptation, but deliver us from evil.",
        "There is a chill in the air after dark, and we had all drawn close to the blaze. The night was moonless, but there were some stars, and one could see for a little distance across the plain. Well, suddenly out of the darkness, out of the night, there swooped something with a swish like an aeroplane. The whole group of us were covered for an instant by a canopy of leathery wings, and I had a momentary vision of a long, snake-like neck, a fierce, red, greedy eye, and a great snapping beak, filled, to my amazement, with little, gleaming teeth.",
        "Those who follow the banners of reason are like the well-disciplined battalions which, wearing a more sober uniform and making a less dazzling show than the light troops commanded by imagination, enjoy more safety, and even more honor, in the conflicts of human life.",
        "What happens to a dream deferred? Does it dry up like a raisin in the sun? Or fester like a sore—And then run? Does it stink like rotten meat? Or crust and sugar over—like a syrupy sweet? Maybe it just sags like a heavy load. Or does it explode?",
        "Everything is made out of Magic, leaves and trees, flowers and birds, badgers and foxes and squirrels and people. So it must be all around us. In this garden-in all the places.",
        "But I am a blasted tree; the bolt has entered my soul; and I felt then that I should survive to exhibit what I shall soon cease to be--a miserable spectacle of wrecked humanity, pitiable to others and intolerable to myself.",
        "By ten o'clock the police organization, and by midday even the railway organizations, were losing coherency, losing shape and efficiency, guttering, softening, running at last in that swift liquefaction of the social body.",
        "For, as when the red-cheeked, dancing girls, April and May, trip home to the wintry, misanthropic woods; even the barest, ruggedest, most thunder-cloven old oak will at least send forth some few green sprouts, to welcome such glad-hearted visitants.",
        "They had courage; without which, men are as the standing straw in an unreaped field in winter; but having become like the hooded pine, that keepeth green in frost, and hath the bounding blood in all its icy branches.",
        "And not only did he learn by experience, but instincts long dead became alive again. The domesticated generations fell from him. In vague ways he remembered back to the youth of the breed, to the time the wild dogs ranged in packs through the primeval forest and killed their meat as they ran it down.",
        "Really it is very wholesome exercise, this trying to make one's words represent one's thoughts, instead of merely looking to their effect on others.",
        "Family likeness has often a deep sadness in it. Nature, that great tragic dramatist, knits us together by bone and muscle, and divides us by the subtler web of our brains; blends yearning and repulsion; and ties us by our heart-strings to the beings that jar us at every movement.",
        "It was a question of which of the two she preferred. On the one hand, the choice seemed simple. The more expensive one with a brand name would be the choice of most. It was the easy choice. The safe choice. But she wasn't sure she actually preferred it.",
        "There was something in the tree. It was difficult to tell from the ground, but Rachael could see movement. She squinted her eyes and peered in the direction of the movement, trying to decipher exactly what she had spied. The more she peered, however, the more she thought it might be a figment of her imagination. Nothing seemed to move until the moment she began to take her eyes off the tree. Then in the corner of her eye, she would see the movement again and begin the process of staring again.",
        "If men could see us as we really are, they would be a little amazed; but the cleverest, the acutest men are often under an illusion about women. They do not read them in a true light; they misapprehend them, both for good and evil. Their good woman is a queer thing, half doll, half angel; their bad woman almost always a fiend.",
        "NOW, what I want is, Facts. Teach these boys and girls nothing but Facts. Facts alone are wanted in life. Plant nothing else, and root out everything else. You can only form the minds of reasoning animals upon Facts: nothing else will ever be of any service to them. This is the principle on which I bring up my own children, and this is the principle on which I bring up these children. Stick to Facts, sir!",
        "It was a foggy day in London, and the fog was heavy and dark. Animate London, with smarting eyes and irritated lungs, was blinking, wheezing, and choking; inanimate London was a sooty spectre, divided in purpose between being visible and invisible, and so being wholly neither.",
        "The words hadn't flowed from his fingers for the past few weeks. He never imagined he'd find himself with writer's block, but here he sat with a blank screen in front of him. That blank screen taunting him day after day had started to play with his mind. He didn't understand why he couldn't even type a single word, just one to begin the process and build from there. And yet, he already knew that the eight hours he was prepared to sit in front of his computer today would end with the screen remaining blank.",
        "In other countries, art and literature are left to a lot of shabby bums living in attics and feeding on booze and spaghetti, but in America the successful writer or picture-painter is indistinguishable from any other decent business man.",
    ];

    //validate puzzle index
    if (!puzzleIndex || puzzleIndex < 1 || puzzleIndex > messages.length) {
        puzzleIndex = getRndInteger(1, messages.length + 1);
    }
    $("#puzzle-index").html(puzzleIndex);

    return messages[puzzleIndex - 1];
}

function generateCryptogram() {
    //select/retrieve plaintext phrase
    const message = generateMessage();

    //filter message
    plaintext = message.replace(/[0-9]/gi, "").toUpperCase();
    const plainCharacters = plaintext.split("");
    
    //encode message
    let ciphertext = "";
    plainCharacters.forEach(function(character){
        if (isLetter(character)) {
            const index = plainAlphabet.indexOf(character);
            ciphertext += cipherAlphabet[index];
        } else {
            ciphertext += character;
        }
    });
    const cipherCharacters = ciphertext.split("");

    //generate html
    let word;

    for (let i = 0; i < cipherCharacters.length; i++) {
        const first = (i === 0);
        const prevSpace = (i > 0 && cipherCharacters[i - 1] == ' ');
        const currentSpace = (cipherCharacters[i] == ' ');

        //start new word
        if (first || prevSpace) {
            word = $(`<div class="word-container"></div>`);
            $("#work-area").append(word);
        }

        if (!currentSpace) {
            addNewCharacter(cipherCharacters[i], plainCharacters[i], word);
        }
    }
}

function addNewCharacter(cipherChar, plainChar, parent) {
    let container;
    if (isLetter(cipherChar)) {
        container = $("#letter-container-template").children().clone();
        container.find(".plain-letter").data({
            cipherLetter: cipherChar,
            plainLetter: plainChar
        });
    } else {
        container = $("#symbol-container-template").children().clone();
    }
    parent.append(container);
    container.find(".cipher-char").html(cipherChar);
}

//input validation
function checkInput(input) {
    const inputs = $("input.plain-letter:visible");
    let char = input.val().toUpperCase();

    if (isLetter(char)) {
        //fill letter
        input.val(char);

        //fill all matching letters
        const cipherLetter = input.data("cipherLetter");
        inputs.each(function(){
            if ($(this).data("cipherLetter") === cipherLetter) {
                $(this).val(char);
            }
        });

        //shift focus to next free input
        const currentIndex = inputs.index(input);
        for (let i = currentIndex; i < inputs.length; i++) {
            const nextInput = inputs.eq(i);
            if (nextInput.val() === "") {
                nextInput.focus();
                break;
            }
        }
    } else {
        input.val("");

        //clear other fields
        const cipherLetter = input.data("cipherLetter");
        inputs.each(function(){
            if ($(this).data("cipherLetter") === cipherLetter) {
                $(this).val("");
            }
        });
    }

}

function updatePuzzleMeta(){
    const inputs = $("input.plain-letter:visible");

    //check for duplicates
    let duplicates = {};
    let letterPairs = new Map();
    inputs.each(function(){
        const p = $(this).val();
        const c = $(this).data("cipherLetter");
        if (p != "") {
            const getP = letterPairs.get(p);

            if (getP) {
                if (c != getP) {
                    duplicates[c] = null;
                    duplicates[getP] = null;
                }
            } else {
                letterPairs.set(p, c);
            }
        }
    });

    //highlight duplicate letters
    duplicates = Object.keys(duplicates);
    inputs.css({color: ""});
    if (duplicates.length > 1) {
        inputs.each(function(){
            if (duplicates.includes($(this).data("cipherLetter"))) {
                $(this).css({color: "red"});
            }
        });
    }

    //show letters remaining
    {
        const lettersRemaining = plainAlphabet.slice(); //clone array
        letterPairs.forEach(function(value, key, map){
            const index = lettersRemaining.indexOf(key);
            lettersRemaining.splice(index, 1);
        });

        let message = "Letters Remaining: ";
        lettersRemaining.forEach(function(letter){
            message += `${letter} `;
        });
        $("#letters-remaining").empty().html(message);
    }
};

//interface
function toggleInstructions() {
    const card = $("#cryptogram-instructions");
    if (!card.is(":visible")) {
        card.show();
        $("#instructions-button > .show").hide();
        $("#instructions-button > .hide").show();
    } else {
        card.hide();
        $("#instructions-button > .show").show();
        $("#instructions-button > .hide").hide();
    }
}

function checkAnswer(){
    let inputAnswerRaw = "";
    const checkAnswerRaw = plaintext.replace(/[^A-Z]/gi, "");

    $("#work-area .plain-letter").each(function(){
        let char = $(this).val();
        if (!isLetter(char)) {
            char = ' ';
        }

        inputAnswerRaw += char;
    });

    if (inputAnswerRaw === checkAnswerRaw) {
        finish();
    } else {
        messages = [
            "So close...",
            "Not quite right...",
            "Not quite a match...",
            "Answer doesn't match...",
            "This isn't quite right..."
        ];

        generateAlert($("#check-result"), "alert-danger", messages[getRndInteger(0, messages.length)], true, 4000);
    }
}

function finish() {
    if (user) {
        const toastSaving = generateToast("Saving...", false, false);
        
        //update user game data
        const userID = user._id;
        const gameID = "cryptograms";
    
        getGameData(userID, gameID).done(gameData => {
            //initialize property if new
            if (gameData === null) {
                gameData = {
                    completed: []
                };
            }
            
            //update progress
            gameData.completed.push(puzzleIndex);
            gameData.completed = removeDuplicates(gameData.completed);
    
            setGameData(userID, gameID, gameData).done(result => {
                generateToast("Progress saved!", true, 20000);
            }).fail(result => {
                generateToast("An unexpected error occured.", true, 20000);
            }).always(() => {
                toastSaving.toast("dispose");
            });
        });
    }

    //calculate time
    const secondsElapsed = moment().diff(startTime, 'seconds');

    //disable inputs
    $("input.plain-letter:visible").prop("disabled", true);
    $("#cryptogram-buttons > button").prop("disabled", true);

    //generate message
    const message = `
        Congratulations! You deciphered the cryptogram!<br>
        It took you ${Math.floor(secondsElapsed / 60)} minutes and ${secondsElapsed % 60} seconds.<br>
        You used ${hintsUsed} hints.<br>
    `;

    generateAlert($("#check-result"), "alert-success", message, false, false);
    $("#letters-remaining").remove();
}

function applyHint(){
    let hintApplied = false;    
    while(!hintApplied && hints.length > 0) {
        const letter = hints.shift();

        //attempt to apply hint
        $("input.plain-letter").each(function(){
            if ($(this).data("plain-letter") == letter && $(this).val() != letter) {
                $(this).val(letter);
                hintApplied = true;
            }
        });
    }

    if (hintApplied) {
        hintsUsed++;
    } else if (hints.length == 0) {
        generateAlert($("#check-result"), "alert-danger", "No hints left.", true, 4000);
    }
}

function initializeCryptogram() {
    $("input.plain-letter").val("");
    hints = ['A', 'E', 'I', 'O', 'U'];
}

function resetCryptogram(){
    if (confirm("Are you you want to reset your answers?")) {
        initializeCryptogram();
        updatePuzzleMeta();
    }
}

$(function(){
    warnUserLogin();
    generateCryptogram();
    updatePuzzleMeta();
    initializeCryptogram();

    $(".plain-letter").on("input", function(){
        checkInput($(this))
        updatePuzzleMeta();
    });
});