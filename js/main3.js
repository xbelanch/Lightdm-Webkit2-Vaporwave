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
    authenticate : (username) => {
        console.log("lightdm.authenticate(" + username + ")")
    },
    respond  : (text) => { console.log("lightdm.respond(" + text + ")") },
    shutdown : () => { console.log("lightdm.shutdown()") },
    restart  : () => { console.log("lightdm.restart()") },
    suspend  : () => { console.log("lightdm.suspend()") }
};

let vaporwave_theme = {
    version         : "0.1",
    lightdm         : window.lightdm || lightdm_debug,
    username        : undefined,
    password        : undefined,
    username_input  : document.getElementById("username"),
    password_input  : document.getElementById("password"),
    error_message   : document.getElementById("error_message"),
    login_button    : document.getElementById("login_button"),
    shutdown_button : document.getElementById('shutdown_button'),
    restart_button  : document.getElementById('restart_button'),
    suspend_button  : document.getElementById('suspend_button'),
    /**
     * Check username field value
     * params: none
     */
    check_username : () => {
        let username = vaporwave_theme.username_input.value;
        if (0 === username.length) {
            vaporwave_theme.username = undefined;
            vaporwave_theme.error_message.append("ERROR: Username field is empty!");
            return false
        } else {
            vaporwave_theme.username = username;
            return true
        }
    },
    authenticate_user : () => {
        if (vaporwave_theme.check_username())
            vaporwave_theme.lightdm.authenticate(vaporwave_theme.username)
    },
    handleEventKeyboard: (event) => { console.log('Hello ' + vaporwave_theme.version) },
    shutdown_system: () => { vaporwave_theme.lightdm.shutdown() },
    restart_system: () => { vaporwave_theme.lightdm.restart() },
    suspend_system: () => { vaporwave_theme.lightdm.suspend() }
};

window.addEventListener('load', () => {

    let t = vaporwave_theme;
    t.username_input.addEventListener('keydown', (event) => {
        if (event.keyCode === 9) {
            t.check_username();
        }
    });
    t.password_input.addEventListener('click', (event) => { console.log(t.username_input.value)});
    t.login_button.addEventListener('click', t.authenticate_user);
    t.shutdown_button.addEventListener('click', t.shutdown_system);
    t.restart_button.addEventListener('click', t.restart_system);
    t.suspend_button.addEventListener('click', t.suspend_system);

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
