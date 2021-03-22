//math
function getRndInteger(min, max) { //min inclusive, max exclusive
    return Math.floor(Math.random() * (max - min) ) + min;
}

//string
function isLetter(char) {
    return char.toLowerCase() != char.toUpperCase();
}

function addOrdinalSuffix(num) {
  let suffix;
  switch (num) {
    case 1:
      suffix = "st";
      break;
    case 2:
      suffix = "nd";
      break;
    case 3:
      suffix = "rd";
      break;
    default:
      suffix = "th";
  }
  return `${num}${suffix}`;
}

function pad(number, width, char = '0') {
  number = number + '';
  return number.length >= width ? number : new Array(width - number.length + 1).join(char) + number;
}

//arrays
function removeDuplicates(arr) {
    let unique = {};
    arr.forEach(function(i) {
        if (!unique[i]) {
            unique[i] = true;
        }
    });
    return Object.keys(unique);
}

//objects
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

//url
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

//cookies
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}

//bootstrap
function generateAlert(target, type, msg, dismissable = true, timeout = false) {
    //generate html
    let html = "";
    if (dismissable) {
        html += `<div class="alert ${type} alert-dismissible fade show" role="alert">`;
    } else {
        html += `<div class="alert ${type}" role="alert">`;
    }
    html += msg;

    if (dismissable) {
        html += `
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        `;
    }
    html += `</div>`;

    //create & append DOM node
    const alert = $(html);
    target.empty().append(alert);

    if (timeout) {
        setTimeout(function(){
            alert.alert('close');
        }, timeout);
    }

    return alert;
}

function generateToast(msg, header = true, timeout = 5000) {
    let html = "";

    //generate toast class
    html += `<div class="toast" role="alert" aria-live="assertive" aria-atomic="true" `;

    if (timeout) {
        html += `data-autohide="true" data-delay="${timeout}"`;
    } else {
        html += `data-autohide="false"`;
    }
    html += ">";

    //generate header
    if (header) {
        html += `
            <div class="toast-header">
                <img id="logo" src="/static/img/bear_paw_black.png" width="20" class="d-inline-block align-top" alt="" loading="lazy">
                &nbsp
                <strong class="mr-auto">Polar Bear Hangout</strong>
                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `;
    }

    //generate body
    html += `
        <div class="toast-body">
            ${msg}
        </div>
    `;
    html += `</div>`;

    //generate toast & append
    const toast = $(html);
    $(".toast-area").append(toast);
    toast.toast("show");

    return toast;
}

//jquery
function createFromTemplate(template, parent) {
  const html = template.html();
  const element = $(html);
  parent.append(element);
  return element;
}
