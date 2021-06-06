"use strict";

window.addEventListener('load', () => {
    window.lightdm = window.lightdm || lightdmDEBUG;

    let selectedSession = localStorage.selectedSession || lightdm.sessions[0].key;
    let selectedUser = localStorage.selectedUser || lightdm.users[0].username;

    function authUser(username) {
        selectedUser = username;
        localStorage.selectedUser = selectedUser;
        lightdm.authenticate(username);
    }

    const usernameInput = document.getElementById("username");
    const loginButtonContainer = document.getElementById("loginButton");
    loginButtonContainer.addEventListener('click', (e) => {
        login();
    })
    const passwordInput = document.getElementById("password");

    function login() {
        if (0 === usernameInput.value.length)
            throw "Username is empty!"
        if (0 === passwdInput.value.length) {
            throw "Password is empty!";
        } else {
            lightdm.respond(password);
        }
    }

    window.addEventListener('keydown', (e) => {
        passwordInput.focus();
    }, false);

    passwordInput.addEventListener('keyup', (e) => {
        if (e.keyCode === 13)
            login();
    }, false);

    // This function is called by LightDM when authentication has completed.
    window.authentication_complete = function() {
        if (lightdm.is_authenticated) {
            setTimeout(() => {
                lightdm.start_session(selectedSession);
            }, 1000);
        } else {
            // Do something...
        }
    };

    // System buttons
    const shutdownButton = document.getElementById('shutdown-button');
    shutdownButton.addEventListener('click', (e) => {
        lightdm.shutdown();
    }, false);

    const restartButton = document.getElementById('restart-button');
    restartButton.addEventListener('click', (e) => {
        lightdm.restart();
    }, false);

    const suspendButton = document.getElementById('suspend-button');
    suspendButton.addEventListener('click', (e) => {
        lightdm.suspend();
    }, false);
    console.log("Everything is fine!");
});

let lightdmDEBUG = {
    // Boolean. Indicates if the user has successfully authenticated.
    is_authenticated : true,
    // When LightDM has prompted for input, provide the response to LightDM.
    users : [
        { username : 'Rotter' },
        { username : 'Lyud' },
        { username : 'Tomachito' }
    ],
    sessions : [
        { key: 0, name: 'i3' },
        { key: 1, name: 'i3-default' }
    ],
    respond : function(text) {
        console.log("lightdm.respond(" + text + ")");
    },
    shutdown : function() {
        console.log("lightdm.shutdown()");
    },
    restart : function() {
        console.log("lightdm.restart()");
    },
    suspend : function() {
        console.log("lightdm.suspend()");
    },
};
