// --- Le global elements
let promptForm = document.getElementById("prompt");
let loginForm = promptForm.querySelector(".password-form");
let userClickBox = document.getElementById("username");
let userPasswordInput = document.getElementById("password");
let activeUserName = null;
let pendingAuthentication = false;


// --- Le helper functions
function prepare_list_users() {
    if (lightdm.users.length > 1) {
        for (let user of lightdm.users) {
            let option = document.createElement("option");
            option.setAttribute("value", user.name);
            // TODO: add selected attribute for last username login
            option.textContent = user.name;
            userClickBox.appendChild(option);
        }
    } else {
        let option = document.createElement("option");
        option.setAttribute("value", lightdm.users[0].name);
        option.text = lightdm.users[0].name;
        userClickBox.appendChild(option);
    }
}

function clear_messages() {
  messages = document.getElementById("messages");
  messages.innerHTML = "";
  messages.style.visibility = "hidden";
}

function start_authentication() {
    // clear previous alert or warning messages
    clear_messages();
    // display dialogue box
    // you can deactivate later if this visual goodie
    // doesnt fit your needs
    // setTimeout(function() {
    //     // fade in input fields
    //     document.getElementById('dialogue-box')
    //         .setAttribute('class', 'active');
    //     // set hostname
    //     // document.getElementById('hostname').innerHTML = lightdm.hostname;
    // }, 250);
}
// This function is called by LightDM when authentication has completed.
function authentication_complete() {
    if (lightdm.is_authenticated) {
        lightdm.login(lightdm.authentication_user, "i3");
    }
}

// --- Le Callbacks
function attemptLogin(event) {
    // Prevent Default Form Behavior (Try To Submit To Location)
    event.preventDefault();
    entry = document.getElementById("password");

    // Disable All Password Input Forms
    // disablePasswordForms(true);
    let password = entry.value;
    lightdm.respond(password);
}

function setActiveUser(event) {

    let userName = undefined;

    if (userClickBox.value === undefined) {
        // no username selected, set first one by default
        userName = userClickBox.firstChild.innerHTML;
    } else {
        userName = userClickBox.value;
    }

    // Update Status To Reflect Selected User
    pendingAuthentication = true;
    // Focus Password Box
    userPasswordInput.focus();
    // Begin Authentication
    lightdm.authenticate(userName);
}

// --- Le mocked lightDM object
let debugLightDM = {
    "authenticate" : function(activeUserName) {
        console.log("lightdm.authenticate:", activeUserName);
    },
    "respond" : function(inputText) {
        console.log("lightdm.respond:", inputText);
    },
    "shutdown" : function() {
        console.log("lightdm.shutdown");
    },
    "reboot" : function() {
        console.log("lightdm.reboot");
    },
    "users" : [
        { name: "rotter" } /* ,
        { name: "lyud" } ,
        { name: "tomachito" } */
    ],
    "hostname" : "arch"
}

// --- Le start
window.lightdm = window.lightdm || debugLightDM;
window.addEventListener('load', () => {
    prepare_list_users();
    start_authentication();
    userClickBox.addEventListener("keydown", function(event) {
        if (event.keyCode == 9) {
            event.preventDefault();
            setActiveUser(event);
        }
    });
    userPasswordInput.addEventListener("click", setActiveUser);
    loginForm.addEventListener("submit", attemptLogin);
});
