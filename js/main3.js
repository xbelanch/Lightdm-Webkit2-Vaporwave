"use strict";

let lightdm_debug = {
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
    authenticate : function(username) {
        console.log("lightdm.authenticate(" + username + ")")
    },
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

let vaporwave_theme = {
    lightdm : window.lightdm || lightdm_debug,
    username_input : document.getElementById("username"),
    login_button : document.getElementById("loginbutton"),
    password_input : document.getElementById("password"),
    authenticate_user : (username) => {
        if (username !== undefined) {
           vaporwave_theme.lightdm.authenticate(username)
        } else {
            // TODO: Display error message
        }
    }
};

window.addEventListener('load', () => {
    vaporwave_theme.authenticate_user("rotter");
    // let auth_user = (username) => {
    //     selected_user = username;
    //     localStorage.selected_user = selected_user;
    //     lightdm.authenticate(username);
    // }

    // login_button_container.addEventListener('click', (e) => {
    //     login();
    // })

    // function login() {
    //     if (0 === username_input.value.length)
    //         throw "Username is empty!"
    //     if (0 === password_input.value.length) {
    //         throw "Password is empty!";
    //     } else {
    //         lightdm.respond(password);
    //     }
    // }

    // window.addEventListener('keydown', (e) => {
    //     password_input.focus();
    // }, false);

    // password_input.addEventListener('keyup', (e) => {
    //     if (e.keyCode === 13)
    //         login();
    // }, false);


    // /**
    // * This function is called by LightDM when authentication has completed
    // */
    // window.authentication_complete = () => {
    //     let selected_session = 'i3' // TODO: Need to be defined by user
    //     if (lightdm.is_authenticated) {
    //         // setTimeout(() => {
    //         //     lightdm.start_session(selectedSession);
    //         // }, 1000);
    //         lightdm.login(lightdm.authentication_user, selected_session);
    //     } else {
    //         // TODO: Do something...
    //         console.log('TODO: Do something if authentication user fails')
    //     }
    // };

    // // System buttons
    // const shutdownButton = document.getElementById('shutdown-button');
    // shutdownButton.addEventListener('click', (e) => {
    //     lightdm.shutdown();
    // }, false);

    // const restartButton = document.getElementById('restart-button');
    // restartButton.addEventListener('click', (e) => {
    //     lightdm.restart();
    // }, false);

    // const suspendButton = document.getElementById('suspend-button');
    // suspendButton.addEventListener('click', (e) => {
    //     lightdm.suspend();
    // }, false);
    // console.log("Everything is fine!");
});
