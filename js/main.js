function clear_messages() {
  messages = document.getElementById("messages");
  messages.innerHTML = "";
  messages.style.visibility = "hidden";
}

function start_authentication() {
    // clear previous alert or warning messages
    clear_messages();
    // start with null userid, have pam prompt for userid.
    lightdm.authenticate();
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

// Callbacks
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

    // Get Information For The Selected User Listing
    let userListing = event.currentTarget;
    let userName = lightdm.users[userListing.getAttribute("data-user-index")].name;
    console.log(userName);

    // fill input with username
    userListing.value = userName;

    // if selected user is already activeUsername, do nothing
    if (userName == activeUserName)
        return;

    // Update Status To Reflect Selected User
    pendingAuthentication = true;
    activeUserName = userName;
    // Focus Password Box
    userPasswordInput.focus();

    // Begin Authentication
    lightdm.authenticate(activeUserName);
}


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
        { name: "rotter" },
        { name: "lyud" } ,
        { name: "tomachito" }
    ],
    "hostname" : "arch"
}

// --- Booting up
let promptForm = document.getElementById("prompt");
let loginForm = promptForm.querySelector(".password-form");
let userClickBox = document.getElementById("username");
let userPasswordInput = document.getElementById("password");
let activeUserName = null;
let pendingAuthentication = false;

window.lightdm = window.lightdm || debugLightDM;
window.addEventListener('load', () => {
    start_authentication();

    // add data-user-index
    // need for user list context
    userClickBox.setAttribute("data-user-index", 0);
    // Add Login Form Listener
    // userClickBox.addEventListener("click", setActiveUser);
    userClickBox.addEventListener("keydown", function(event) {
        if (event.keyCode == 9) {
            event.preventDefault();
            setActiveUser(event);
        }
    })
    loginForm.addEventListener("submit", attemptLogin);
});
