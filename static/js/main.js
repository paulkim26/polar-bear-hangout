//globals
let user = null;
const loginCookieName = "login_session";
const prevCookieName = "prev_state";
const loginProcess = checkLoginState();

//login
function checkLoginState() {
    return new Promise((resolve,reject)=>{
        const loginToken = getCookie(loginCookieName);

        if (loginToken) {
            $.ajax({
                method: "post",
                url: "/login/" + loginToken,
                contentType: "application/json",
                data: null
            }).done(function(response){
                if (response.success) {
                    user = response.user;
                }
                resolve();
            }).fail(function(response){
                console.log(response);
                generateToast("A sign-on error has occured.");
                reject();
            });
        } else {
            resolve();
        }
    });
}

function login(token, redirect = false) {
    setCookie(loginCookieName, token, 1);
    setCookie(prevCookieName, "login", 1);

    if (!redirect) {
        location.reload();
    } else {
        window.location.href = redirect;
    }
}

function logout() {
    eraseCookie(loginCookieName);
    setCookie(prevCookieName, "logout", 1);
    location.reload();
}

function warnUserLogin() {
    loginProcess.then(() => {
        if (!user) {
            generateToast(`Log in to save your progress.`, false, false);
        }
    });
}

function updateLoginDom() {
    $(".anonymous").show();
    $(".user").hide();

    const prevState = getCookie(prevCookieName);

    loginProcess.then(() => {
        if (user) {
            $(".user").show();
            $(".anonymous").hide();

            $("#user-fullname").html(`${user.firstName} ${user.lastName}`);

            if (prevState == "login") {
                generateToast(`Login successful. Welcome back ${user.firstName}!`, false, 5000);
            }
        } else {
            if (prevState == "logout") {
                generateToast(`Logout successful.`, false, 5000);
            }
        }
        eraseCookie(prevCookieName);
    });
}

//game state
function setGameData(userID, gameID, data) {
    const gameData = {
        userID: userID,
        gameID: gameID,
        data: data
    };

    return $.ajax({
        method: "post",
        url: "/api/setgamedata",
        contentType: "application/json",
        data: JSON.stringify(gameData),
    }).fail(function(data){
        console.log("An unexpected error occured.");
        console.log(data);
    });
}

function getGameData(userID, gameID) {
    return $.ajax({
        method: "post",
        url: "/api/getgamedata",
        contentType: "application/json",
        data: JSON.stringify({
            userID: userID,
            gameID: gameID
        }),
    }).fail(function(data){
        console.log("false");
        console.log(data);
    });
}

function getScores(gameID) {
  return $.ajax({
      method: "post",
      url: `/api/getscores/${gameID}`,
      contentType: "application/json",
      data: {}
  });
}

//settings
function setVolume(volume) {
  //set master volume
  if (volume == 0) {
    Tone.Master.mute = true;
  } else {
    const upper = +10;
    const lower = -10;

    //Tone.Master.mute = true;
    Tone.Master.volume.value = lower + Math.abs(upper - lower) * (volume / 100);
    if (Tone.Master.volume.value > upper) {
      Tone.Master.volume.value = upper; //safety
    }
  }

  //update icon
  $(".volume-control > .volume-icon > span").hide();
  if (volume > 66) {
    $(".volume-control .volume-high").show();
  } else if (volume > 44) {
    $(".volume-control .volume-medium").show();
  } else if (volume > 22) {
    $(".volume-control .volume-low").show();
  } else if (volume > 1) {
    $(".volume-control .volume-none").show();
  } else {
    $(".volume-control .volume-mute").show();
  }

  $(".volume-slider").val(volume);
}

function bindVolumeSlider() {
  //bind events
  $(".volume-slider").on("input", function(){
    const volume = $(this).val();
    setVolume(volume);
  });

  $(".volume-icon").on("click", function(){
    const slider = $(".volume-slider");
    const volume = slider.val();

    if (volume == 0) {
      const previousVolume = slider.data("previousVolume");
      if (previousVolume) {
        setVolume(previousVolume);
      }
      slider.removeData();
    } else {
      setVolume(0);
      slider.data("previousVolume", volume);
    }
  });

  setVolume(50);
}

function addOptionsMenu(options) {
  const optionsMenu = createFromTemplate($("#template-options"), $("#options-container"));
  const form = optionsMenu.find("form");

  options.forEach(option=>{
    createFromTemplate($(`#template-options-${option}`), form);
    if (option === "volume") {
      bindVolumeSlider();
    }
  });
}

$(function(){
    //initialize
    $('[data-toggle="tooltip"]').tooltip(); //enable tooltips globally
    updateLoginDom();

    $("#navbar-login-form").on("submit", function(e){
        e.preventDefault();

        const text = $("#login-text");
        text.html("").css({
            color: ""
        });

        $.ajax({
            method: "post",
            url: "/login",
            contentType: "application/json",
            data: JSON.stringify({
                email: $("#login-email").val(),
                password: $("#login-password").val()
            })
        }).done(function(response){
            text.html(response.message);

            if (response.success) {
                text.css({
                    color: "green"
                });
                login(response.token, false);
            } else {
                text.css({
                    color: "red"
                });
            }
        }).fail(function(response){
            console.log(response);
            alert("An unexpected error occured.");
        });
    });
});
