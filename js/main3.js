"use strict";

window.addEventListener('load', () => {
    window.lightdm = window.lightdm || lightdmDEBUG;

    const usernameInput = document.getElementById("username");
    const loginButtonContainer = document.getElementById("loginButton");
    loginButtonContainer.addEventListener('click', (e) => {
        login();
    })
    const passwordInput = document.getElementById("password");

    function login() {
        let password = passwordInput.value;
        if (password != "") {
            lightdm.respond(password);
        } else {
            throw "Password is empty!";
        }
    }

    window.addEventListener('keydown', (e) => {
        passwordInput.focus();
    }, false);

    passwordInput.addEventListener('keyup', (e) => {
        if (e.keyCode === 13)
            login();
    })

    console.log("Everything is fine!");
});


let lightdmDEBUG = {
    // When LightDM has prompted for input, provide the response to LightDM.
    respond : function(text) {
        console.log("lightdm.respond(" + text + ")");
    }
};
