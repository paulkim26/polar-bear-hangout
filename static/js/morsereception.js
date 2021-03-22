//constants
const scorethreshold = 90;
const challengeCharactersAll = ["K", "M", "R", "S", "U", "A", "P", "T", "L", "O", "W", "I", ".", "N", "J", "E", "F", "0", "Y", ",", "V", "G", "5", "/", "Q", "9", "Z", "H", "3", "8", "B", "?", "4", "2", "7", "C", "1", "D", "6", "X"];

const defaultWpm = 8;
const defaultFwpm = 20;
const defaultStatic = 50;
const defaultTone = 600;

//working var
let transmissionTimeout = null;
let scoringMode;

let dit;
let dah;
let intraCharSpace;
let interCharSpace;
let wordSpace;

//resources
const toneMorse = new Tone.Oscillator(defaultTone, "sine").toDestination();
toneMorse.volume.value = -15;

const toneNoise = new Tone.Noise("pink").toDestination();
toneNoise.volume.value = -20;
toneNoise._playbackRate = 1.5;

//functions
function challengeCharSet() {
  const level = parseInt($("#level-select").val());
  return challengeCharactersAll.slice(0, level + 1);
}

function startTransmission(){
  const startBuffer = 2000; //ms
  const endBuffer = 1000; //ms

  //update icon
  $("#playback-button > .stop").show();
  $("#playback-button > .play").hide();

  //update ui
  $("#plaintext-form .check, #plaintext-entry").prop("disabled", false);
  $("#plaintext-entry").val("").focus();
  $(".transmission-disable").prop("disabled", true);
  $("#practice-alert a").hide();

  generateLevelInfo("Transmitting...");

  //generate message
  let message = "";
  const set = challengeCharSet();
  for (let i = 1; i <= 25; i++) {
    message += set[getRndInteger(0, set.length)];
    if (i % 5 == 0) {
      message += " ";
    }
  }
  $("#plaintext-entry").data("message", message);

  //playback
  toneNoise.start();
  transmissionTimeout = setTimeout(()=>{
    const iterFunction = (timeout, sequence, cursor)=>{
      transmissionTimeout = timeout;

      const progress = parseInt(100 * cursor / (sequence.length - 1));

      generateLevelInfo(`Transmitting...${progress}%`);
    };
    const endFunction = ()=>{
      transmissionTimeout = setTimeout(()=>{ stopTransmission(); }, endBuffer);
    };
    playTone(message, iterFunction, endFunction);
  }, startBuffer);
}

function playTone(message, iterFunction, endFunction) {
  playNextTone(generateToneSequence(message), 0);

  //inner functions
  function playNextTone(sequence, cursor) {
    const instruction = sequence[cursor];
    if (instruction.tone) {
      toneMorse.start();
    }
    const timeout = setTimeout(()=>{
      toneMorse.stop();
      if (cursor < sequence.length - 1) {
        playNextTone(sequence, cursor + 1); //increment cursor
      } else {
        if (endFunction) {
          endFunction();
        }
      }
    }, instruction.duration);

    if (iterFunction) {
      iterFunction(timeout, sequence, cursor);
    }
  }
}

function stopTransmission() {
  clearTimeout(transmissionTimeout);
  transmissionTimeout = null;
  toneMorse.stop();
  toneNoise.stop();

  //update icon
  $("#playback-button > .stop").hide();
  $("#playback-button > .play").show();

  //update ui
  $(".transmission-disable").prop("disabled", false);
  $("#practice-alert a").show();
  generateLevelInfo("Transmission end.");
}

function toggleTransmission() {
  if (transmissionTimeout === null) {
    startTransmission();
  } else {
    stopTransmission();
  }
}

function generateToneSequence(message) {
  const sequence = [];
  message.split("").forEach(char=>{
    switch (char) {
      case " ":
        addInstruction(false, wordSpace);
        break;
      default:
        const morse = morseTable[char];

        if (morse) {
          morse.split("").forEach(digit=>{
            switch (digit) {
              case "•":
                addInstruction(true, dit);
                break;
              case "−":
                addInstruction(true, dah);
                break;
            }
            addInstruction(false, intraCharSpace);
          });
        }
        addInstruction(false, interCharSpace - intraCharSpace); //add break between letters
    }
  });
  return sequence;

  //inner functions
  function addInstruction(tone, duration) {
    sequence.push({
      tone: tone,
      duration: duration
    });
  }
}

function generateLevelInfo(header) {
  const set = challengeCharSet();

  //generate message
  let msg = "";
  msg += `${header}<hr>`;
  set.forEach((char)=>{
    msg += `<a data-toggle="tooltip" title="${morseTable[char]}" href="#" onclick="playTone('${char}'); return false;">${char}</a> `;
  });
  msg += `<br>`;
  msg += `
    <div style="
      position: absolute;
      bottom: 0;
      left: 0;
      padding: inherit;
    ">
      <small>Tip: Click on a character to hear a preview.</small>
    </div>`;

  generateAlert($("#work-area"), "alert-secondary monospace", msg, false, false);
}

function setTransmissionSpeed() {
  const wpm = parseInt($("#wpm").val());
  const fwpm = parseInt($("#fwpm").val());

  if (wpm > fwpm) {
    $("#fwpm").val(wpm).change();
    return false;
  }

  if (fwpm === null) {
    //standard timing
    const unit = Math.ceil(1200 / wpm);

    dit = unit;
    dah = unit * 3;
    intraCharSpace = unit;
    interCharSpace = unit * 3;
    wordSpace = unit * 7;
  } else {
    //farnsworth compression
    const unit = Math.ceil(1200 / fwpm);
    const unit2 = (60 * fwpm - 37.2 * wpm) * 1000 / (wpm * fwpm);

    dit = unit;
    dah = unit * 3;
    intraCharSpace = unit;
    interCharSpace = Math.ceil(unit2 * 3 / 19);
    wordSpace = Math.ceil(unit2 * 7 / 19);
  }

  //generate warning if speed is too low
  if (wpm < defaultWpm || fwpm < defaultFwpm) {
    //practice mode
    scoringMode = false;
    $("#practice-alert").show();
  } else {
    //scoring mode
    scoringMode = true;
    $("#practice-alert").hide();
  }
}

function populateLevelSelect(highestLevelPassed = 0, change = false) {
  const select = $("#level-select");
  const maxLevel = challengeCharactersAll.length;

  let selectedLevel = 1;
  if (change) {
    selectedLevel = (highestLevelPassed < maxLevel) ? (highestLevelPassed + 1) : maxLevel;
  } else if (select.val()) {
    selectedLevel = select.val();
  }

  select.empty();
  for (let level = 1; level <= maxLevel; level++) {
    let html = "";
    html += `<option value=${level}>Level ${level}`;
    if (level <= highestLevelPassed) {
      html += ` - Passed`;
    }
    html += `</option>`;
    select.append(html);
  }

  select.val(selectedLevel).change();
}

function prepareOptions() {
  addOptionsMenu(["volume", "morsereception", "defaults"]);
  $('[data-toggle="tooltip"]').tooltip(); //rebind tooltips in options menu

  //level select
  $("#level-select").on("change", function(){
    $("#plaintext-form .check").prop("disabled", true);
    $("#plaintext-entry").prop("disabled", true).val("");
    generateLevelInfo("Characters to be transmitted:");
  });
  populateLevelSelect();

  //check for user previous progress
  loginProcess.then(() => {
    if (user) {
      getGameData(user._id, "morse_reception").done(gameData => {
        if (gameData) {
          highestLevelPassed = parseInt(gameData.score);
          populateLevelSelect(highestLevelPassed, true);
        }
      });
    }
  });

  //transmission speed
  {
    const select = $("#wpm");
    const minSpeed = 5;
    const maxSpeed = 30;

    $("#wpm, #fwpm").on("change", setTransmissionSpeed);

    for (let speed = minSpeed; speed <= maxSpeed; speed++) {
      $("#wpm, #fwpm").append(`
        <option value="${speed}">
          ${speed} wpm
        </option>
      `);
    }
  }

  //background static
  {
    for (let i = 100; i >= 0; i -= 10) {
      $("#static-level").append(`
        <option value="${i}">${i}%</option>
      `);
    }

    $("#static-level").change(function(){
      const upper = -10;
      const lower = -30;
      const value = $(this).val();
      if (value == 0) {
        toneNoise.mute = true;
      } else {
        toneNoise.mute = false;
        toneNoise.volume.value = lower + Math.abs(upper - lower) * (value / 100);
      }
    });
  }

  //tone frequency
  $("#tone-frequency").change(function(){
    //validate
    const upper = 1200;
    const lower = 300;
    const defaultValue = defaultTone;

    let toneFrequency = parseInt($(this).val());
    if (isNaN(toneFrequency)) {
      toneFrequency = defaultValue;
    } else {
      if (toneFrequency < lower) {
        toneFrequency = lower;
      } else if (toneFrequency > upper) {
        toneFrequency = upper;
      }
    }
    $(this).val(toneFrequency);

    //set
    toneMorse.frequency.value = $(this).val();
  });

  //reset to defaults
  $(".reset-to-default").on("click", setDefaults);
  setDefaults();
}

function setDefaults() {
  $("#wpm").val(defaultWpm);
  $("#fwpm").val(defaultFwpm).change();
  $("#static-level").val(defaultStatic).change();
  $("#tone-frequency").val(defaultTone).change();
}

//progress
function saveProgress() {
  if (!user) {
    return false;
  }

  if (!scoringMode) {
    generateToast("Disable practice mode to save your progress.", true, 20000);
    return false;
  }

  const level = parseInt($("#level-select").val());
  const toastSaving = generateToast("Saving...", false, false);

  //update level select
  populateLevelSelect(level);

  //update user game data
  const userID = user._id;
  const gameID = "morse_reception";

  getGameData(userID, gameID).done(gameData => {
      //initialize property if new
      if (gameData === null) {
          gameData = {
              score: 0
          };
      }

      //update progress
      if (level > gameData.score) {
        gameData.score = level;
      }

      setGameData(userID, gameID, gameData).done(result => {
          generateToast(`Congratulations! You've passed level ${level}.`, true, 20000);
      }).fail(result => {
          generateToast("An unexpected error occured.", true, 20000);
      }).always(() => {
          toastSaving.toast("dispose");
      });
  });
}

$(function(){
  //initialize
  warnUserLogin();
  prepareOptions();

  //message input controls
  $("#plaintext-entry").on("input", function(){
    const text = $(this).val().toUpperCase();
    $(this).val(text);
  });

  $("#plaintext-form").on("submit", function(e){
    const transmission = $("#plaintext-entry").data("message").replace(/\ /g, "").split("");
    const copy = $("#plaintext-entry").val().replace(/\ /g, "").split("");

    e.preventDefault();
    stopTransmission();
    $("#plaintext-form .check").prop("disabled", true);
    $("#plaintext-entry").prop("disabled", true);

    //compare
    let transmissiontext = "";
    let copytext = "";
    const transmissioncount = transmission.length;
    let matchedcount = 0;
    let pass = false;

    for (let i = 1; i <= transmission.length; i++) {
      const transmissionchar = transmission[i - 1];
      const copychar = copy[i - 1];

      transmissiontext += `${transmissionchar}`;
      if (copychar) {
        if (transmissionchar === copychar) {
          copytext += `<span style="color: green;">${copychar}</span>`;
          matchedcount++;
        } else {
          copytext += `<strike style="color: red;">${copychar}</strike>`;
        }
      }

      if (i % 5 === 0 && i != transmission.length) {
        transmissiontext += " ";
        copytext += " ";
      }
    }
    const matchedpercentage = parseInt((matchedcount / transmissioncount) * 100);
    if (matchedpercentage >= scorethreshold) {
      pass = true;
      saveProgress();
    }

    //generate alert
    let msg = "";
    let alertStyle = "alert-info";
    if (pass) {
      alertStyle = "alert-success";
    }

    //header
    msg += `<h4 class="alert-heading" style="text-align: center;"><strong>`;
    if (pass) {
      msg += `SUCCESS!</strong></h4>`;
    } else {
      msg += `RESULTS</strong></h4>`;
    }
    msg += `<hr>`;
    msg += `Tranmission: ${transmissiontext}<br>`;
    msg += `------ Copy: ${copytext}<br>`;
    msg += `<br>`;
    msg += `-- Accuracy: <strong style="color: green;">${matchedpercentage}%</strong> (need ${scorethreshold}% to pass)<br>`;

    generateAlert($("#work-area"), `${alertStyle} monospace`, msg, true, false).on("close.bs.alert", function(){
      $("#level-select").change();
    });
  });

  $("#plaintext-entry").keypress(function (e) {
    if(e.which == 13 && !e.shiftKey) {
        $(this).closest("form").submit();
        e.preventDefault();
    }
  });

});
