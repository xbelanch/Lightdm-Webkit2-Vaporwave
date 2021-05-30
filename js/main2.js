// --- Le start
// --- Le mocked lightDM object
let debugLightDM = {
    "debug" : false,
    "authenticate" : function(activeUserName) {
        console.log("lightdm.authenticate(" + activeUserName + ")");
    },
    "authentication_complete" : function() {
        console.log("authentication_complete()");
        if (lightdm.is_authenticated) {
            console.log("User is authenticated. Session: " +  dafault_session.name);
            lightdm.login(lightdm.authentication_user, dafault_session.key);
        }
    },
    // Cancels the authentication of the autologin user
    "cancel_autologin" : function() {
        console.log("lightdm.cancel_autologin()");
    },
    // When LightDM has prompted for input, provide the response to LightDM
    "respond" : function(inputText) {
        console.log("lightdm.respond(" + inputText + ")");
    },
    "start_session_sync" : function(session) {
        console.log("lightdm.start_session_sync(" + session + ")");
    },
    "show_message" : function(text, type) {
        console.log(type + " " + text);
    },
    "shutdown" : function() {
        console.log("lightdm.shutdown");
    },
    "reboot" : function() {
        console.log("lightdm.reboot");
    },
    "suspend" : function() {
        console.log("lightdm.suspend");
    },
    "hibernate" : function() {
        console.log("lightdm.hibernate");
    },
    "users" : [
        { name: "rotter" } ,
        { name: "lyud" } ,
        { name: "tomachito" }
    ],
    // Variables
    "is_authenticated" : true, // Indicates if the user has successfully authenticated
    "in_authentication" : false, // Indicates if lightdm is currently in the authentication phase
    "authentication_user" : null, // The username of the authentication user being authenticated or null if no authentication is in progress
    "can_hibernate" : true, // Whether or not the system can be hibernate by the greeter
    "can_restart" : true, // Whether or not the system can be restarted by the greeter
    "can_shutdown" : true, // Whether or not the system can be shutdown by the greeter
    "can_suspend" : true, // Whether or not the system can be suspended by the greeter
    "default_session" : "default", // The name of the default session (as configured in lightdm.conf)
    "has_guest_account" : false, // A guest account is available for login
    "num_users": 3, // The number of users able to log in
    "select_user": "rotter", // The username that should be selected by default for login
    "language" : "ca", // The currently selected language
    "hostname" : "bunker-t440p", // The hostname of the system
    "sessions" : [
        {name: "i3" },
        {name: "i3-default"}
    ], // The sessions that are available on the system
    "default_language" : "Català",
    "layout" : "es cat"
}

// --- Listeners required by LightDM
function authentication_complete() {
    // This function is called by LightDM when authentication has completed.
    console.log("authentication_complete()");
    if (lightdm.is_authenticated) {
        console.log("User is authenticated. Session: " +  dafault_session.name);
        lightdm.login(lightdm.authentication_user, dafault_session.key);
    }
}

function show_message(text, type) {
    console.log(type + ':' + text);
}

function submitPassword(event) {
    event.preventDefault();
    console.log("submitPassword()");
    if (checkBeforeSubmitPassword()) {
        console.log("Password submitted");
        lightdm.cancel_autologin(); // Cancels the authentication of the autologin user.
        lightdm.respond(password.value);
        // comment this line on production
        // lightdm.authentication_complete();
    } else {
        console.log("Clean fields and start again");
        username.value = "";
        password.value = "";
    }
}

// --- Helpers
function debugLightDMVariables() {
    let debug = document.getElementById("debug");
    for (var property in lightdm) {
        let p = document.createElement("p");
        debug.appendChild(p);
        p.innerHTML = property + ':' + lightdm[property] + ';';
    }
}

function checkBeforeSubmitPassword() {
    if (username.value.length === 0) {
        lightdm.show_message("Username field is empty", "error");
        return 0;
    }

    if (password.value.length === 0) {
        lightdm.show_message("Password field is empty", "error");
        return 0;
    }
    return 1;
}

function checkUsername(event) {
    if (username.value.length === 0) {
        console.log('Username field is empty')
        return 0;
    }
    lightdm.authenticate(username.value);
    return 1;
}

function handleUserKeydown(event) {
    if (event.keyCode === 9 && event.target.id === "username") {
        console.log("TAB pressed on username field");
        checkUsername(event);
    }
    if (event.keyCode === 13) { // Enter is pressed by user
        submitPassword(event);
    }
}

function setupPowerButtons() {
    if (lightdm.can_shutdown) {
        shutdown.addEventListener('click', () => {
            lightdm.shutdown();
        });
    }
    if (lightdm.can_suspend) {
        sleep.addEventListener('click', () => {
            lightdm.suspend();
        });
    }
    if (lightdm.can_restart) {
        reboot.addEventListener('click', () => {
            lightdm.restart();
        });
    }
}

window.lightdm = window.lightdm || debugLightDM;

// --- Globals
let dafault_session = lightdm.sessions[0];
let username = document.getElementById("username");
let password = document.getElementById("password");
let shutdown = document.getElementById("shutdown");

window.addEventListener('load', () => {
    if (lightdm.debug)
        debugLightDMVariables();

    const inputs = document.querySelectorAll("input");
    for (let input of inputs) {
        input.value = '';
        input.addEventListener('keydown', handleUserKeydown);
    }

    // start with cursor focusing on username input
    username.focus();

    // print by default last user logged
    // that info perhaps can grabbed from ligthdm sessions?
    if (lightdm.users.length > 0) {
        username.value = lightdm.users[lightdm.users.length - 1].name;
        lightdm.select_user = username.value;
    }

    // if user clicks on password field, check username field
    let passwordField = document.getElementById("password");
    passwordField.addEventListener('click', checkUsername);

    // Setup power system buttons
    setupPowerButtons();

});
