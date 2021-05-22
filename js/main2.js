// --- Le start
// --- Le mocked lightDM object
let debugLightDM = {
    "authenticate" : function(activeUserName) {
        console.log("lightdm.authenticate:", activeUserName);
    },
    "respond" : function(inputText) {
        console.log("lightdm.respond:", inputText);
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
    "users" : [
        { name: "rotter" } ,
        { name: "lyud" } ,
        { name: "tomachito" }
    ],
    "hostname" : "arch"
}

function checkBeforeSubmitPassword() {
    let username = document.getElementById("username");
    let password = document.getElementById("password");

    if (username.value.length === 0) {
        lightdm.show_message("Username field is empty", "error");
    }

    if (password.value.length === 0) {
        lightdm.show_message("Password field is empty", "error");
    }
}

function submitPassword() {
    console.log("submitPassword()");
    checkBeforeSubmitPassword();
}

function handleUserKeydown(event) {
    if (event.keyCode == 13) { // Enter is pressed by user
        event.preventDefault();
        submitPassword();
    }
}

window.lightdm = window.lightdm || debugLightDM;
window.addEventListener('load', () => {
    console.log(lightdm);
    const inputs = document.querySelectorAll("input");
    for (let input of inputs) {
        input.addEventListener('keydown', handleUserKeydown);
    }
});
