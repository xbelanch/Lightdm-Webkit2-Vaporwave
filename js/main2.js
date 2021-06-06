// Le start

let globals = {
    "default_session" : undefined,
    "pagetitle": document.getElementById("pagetitle"),
    "session"  : document.getElementById("session"),
    "username" : document.getElementById("username"),
    "password" : document.getElementById("password"),
    "shutdown" : document.getElementById("shutdown"),
    "messages" : document.getElementById("messages")
}

// Le mocked lightDM object
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
        { username: "rotter" } ,
        { username: "lyud" } ,
        { username: "tomachito" }
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

// Helpers
function clear_messages() {
    globals.messages.innerHTML = "";
    globals.messages.style.visibility = "hidden";
}

// --- Helpers
// function debugLightDMVariables() {
//     let debug = document.getElementById("debug");
//     for (var property in lightdm) {
//         let p = document.createElement("p");
//         debug.appendChild(p);
//         p.innerHTML = property + ':' + lightdm[property] + ';';
//     }
// }

function checkBeforeSubmitPassword() {
    if (globals.username.value.length === 0) {
        show_message("Username field is empty", "error");
        return 0;
    }

    if (globals.password.value.length === 0) {
        show_message("Password field is empty", "error");
        return 0;
    }
    return 1;
}

function checkUsername(event) {
    if (globals.username.value.length === 0) {
        show_message('Username field cannot be empty', "error");
        return 0;
    }
    lightdm.authenticate(globals.username.value);
    return 1;
}

function handleUserKeydown(event) {
    if (event.keyCode === 9 && event.target.id === "username") { // TAB key pressed
        checkUsername(event);
    }
    if (event.keyCode === 13) { // Enter is pressed by user
	checkUsername(event);
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

// The following functions must be provided by the greeter theme and callable on the global "window" object.
/**
 * show_prompt callback.
 */

// This will be called when LightDM needs to prompt the user for some reason, such as asking for a password.  The "text" parameter will be the text of the prompt, and the "type" parameter will either be "text" for a visible prompt, or "password" for a prompt that the input should be hidden.

window.show_prompt = function(text, type) {
    console.log("Vaporwave::window.show_prompt(" + text + ", " + type + ")");
    if (type === "text") {
        globals.username.placeholder = text.toUpperCase() + text.slice(1, -1);
        globals.username.value = "";
    }

    if (type === "password") {
        globals.password.value = "";
    }

    globals.type = type;
};

/**
 * show_message callback.
 */
window.show_message = function(text, type) {
	console.log("Vaporwave::window.show_message(" + text + ", " + type + ")");
	if (0 === text.length) {
		return;
	}
	globals.messages.style.visibility = "visible";
	// type is either "info" or "error"
	if (type == 'error') {
		text = `<p style="color:red;">${text}</p>`;
	}
	globals.messages.innerHTML = `${globals.messages.innerHTML}${text}`;

	// Is this the way to avoid prompt error?
	// lightdm.authenticate();
}

// Listeners required by LightDM
window.authentication_complete = function() {
    // This function is called by LightDM when authentication has completed.
    console.log("Vaporwave::authentication_complete()");
    if (lightdm.is_authenticated) {
        console.log("Vaporwave::authenticatoin_complete::User is authenticated. Session: " +  globals.default_session.name);
        lightdm.login(lightdm.authentication_user, globals.default_session.key);
    } else {
        // TODO: Fix lightdm prompt asking for alternatives when error raised
        show_message("Vaporwave::authenticatoin_complete::Use name or password is incorrect. Try again", "ERROR");
        globals.password.value = '';
        lightdm.authenticate(globals.username.value);
    }
}

window.submitPassword = function(event) {
    event.preventDefault();
    if (checkBeforeSubmitPassword()) {
        console.log("Vaporwave::submitPassword:: " + event);
	console.log("Vaporwave::username: " + globals.username.value);
        lightdm.cancel_autologin(); // Cancels the authentication of the autologin user.
        lightdm.respond(globals.password.value);
    } else {
        globals.password.value = "";
        lightdm.authenticate(globals.username.value);
    }
}

window.autologin_timer_expired = function() {
	console.log("Vaporwave::autologin_timer_expired");
}

window.start_authentication = function(username) {

	if ('undefined' === typeof username) {
		show_prompt("Username?", 'text');
		lightdm.awaiting_username = true;
		return;
	}
	console.log("Vaporwave::start_authentication("+ username + ")");
    clear_messages();
    lightdm.authenticate(username);
};

// Le start
window.addEventListener('load', () => {
    // Load lightdm object based on development or production
    window.lightdm = window.lightdm || debugLightDM;

    // Set hostname if exists
    globals.pagetitle.innerText = lightdm.hostname || "Undefined";

    // Is it really necessary?
    const inputs = document.querySelectorAll("input");
    for (let input of inputs) {
        input.value = '';
        input.addEventListener('keydown', handleUserKeydown);
    }

    // TODO: Add last user logged to username input
    let lastUser = window.localStorage.getItem('lastUser');
    if (lastUser !== null) {
        globals.username.value = lastUser;
    } else {
        if (lightdm.users.length === 1) {
            globals.username.value = lightdm.users[0].username;
        } else {
            // More than one user, get the last one
            globals.username.value = lightdm.users[lightdm.users.length - 1].username;
        }
    }
    // window.localStorage.setItem('lastUser', globals.username.value);
    globals.password.focus();

    // At the moment set default session
    if (lightdm.sessions.length > 0 && globals.default_session === undefined) {
        globals.default_session = lightdm.sessions[0].name;
        globals.session.innerText = globals.default_session;
    }

    // If user clicks on password field, check username field
    globals.password.addEventListener('click', checkUsername);

    // Setup power system buttons
    setupPowerButtons();
});
