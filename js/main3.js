"use strict";

let LOG = (text) => {
    console.log("VAPORWAVE::" + text)
}

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
    /**
     * Public theme variables
     *
     */
    version         : "0.2",
    lightdm         : window.lightdm || lightdm_debug,
    username        : '',
    password        : '',
    users           : [],
    session         : '',
    sessions        : [],

    /**
     * HTML id elements
     *
     */
    username_input  : document.getElementById("username"),
    password_input  : document.getElementById("password"),
    error_message   : document.getElementById("error_message"),
    login_button    : document.getElementById("login_button"),
    shutdown_button : document.getElementById('shutdown_button'),
    restart_button  : document.getElementById('restart_button'),
    suspend_button  : document.getElementById('suspend_button'),

    /**
     * Get list avalaible sessions and set first as the default
     *
     */
    get_session_list: () => {
        for (let session of vaporwave_theme.lightdm.sessions) {
            vaporwave_theme.sessions.push(session);
        }
        vaporwave_theme.session = vaporwave_theme.sessions[0];
    },
    /**
     * Get list avalaible users and set first as the default
     *
     */
    get_users_list: () => {
        for (let user of vaporwave_theme.lightdm.users) {
            vaporwave_theme.users.push(user);
        }

        if (typeof(Storage) !== 'undefined') {
            let last_authenticated_user = localStorage.getItem('last_authenticated_user');
            if (last_authenticated_user === null) {
                vaporwave_theme.username = vaporwave_theme.users[0].username;
                localStorage.setItem('last_authenticated_user', vaporwave_theme.username);
            } else {
                vaporwave_theme.username = last_authenticated_user;
            }
            vaporwave_theme.username_input.value = vaporwave_theme.username;
        } else {
            LOG("Error: Can't retrieve last authenticated user. LocalStorage not supported!")
        }
    },

    /**
     * Check username field value
     * params: none
     */
    check_username_value: () => {
        let username = vaporwave_theme.username_input.value;
        if (0 === username.length) {
            vaporwave_theme.username = undefined;
            vaporwave_theme.error_message.innerHTML += ("<p>Warning: user name field is empty!</p>");
            setTimeout(() => {
                vaporwave_theme.error_message.innerHTML = '';
            }, 2500);
            return false
        } else {
            vaporwave_theme.username = username;
            return true
        }
    },
    start_authenticate_user: (event) => {

        if (vaporwave_theme.check_username_value() || !vaporwave_theme.lightdm.in_authentication) {
            LOG("lightdm.authenticate(" + vaporwave_theme.username +")")
            vaporwave_theme.lightdm.authenticate(vaporwave_theme.username)
            if (vaporwave_theme.lightdm.is_authenticated) {
                LOG("User: " + vaporwave_theme.lightdm.authentication_user +  " is authenticated")
            } else {
            LOG("ERROR: User: " + vaporwave_theme.lightdm.authentication_user +  " is NOT authenticated")
            }
        }
    },
    submit_password: () => {
        if (vaporwave_theme.check_username_value()) {
            let password = vaporwave_theme.password_input.value;
            LOG("Call lightdm.respond(" + password + ")");
            vaporwave_theme.lightdm.respond(password);
        }
    },
    shutdown_system: () => { vaporwave_theme.lightdm.shutdown() },
    restart_system: () => { vaporwave_theme.lightdm.restart() },
    suspend_system: () => { vaporwave_theme.lightdm.suspend() },
    show_prompt: (text, type) => {
        let log = "lightdm.show_prompt(" + text + "," + type + ")";
        if (type === 'password') {
            lightdm.respond("alcestes1972");
        }
        LOG(log);
    },
    show_message: (text, type) => {
        let log = "lightdm.show_message(" + text + "," + type + ")";
        LOG(log);

    },
    authentication_complete: () => {
        LOG("lightdm.authentication_complete()");
        vaporwave_theme.lightdm.authentication_complete();
    },
    autologin_timer_expired: () => {
        LOG("lightdm.autologin_timer_expired()");
    }
};

window.addEventListener('load', () => {

    let t = vaporwave_theme;

    /**
     *
     * The following functions must be provided by the greeter
     * theme and callable on the global "window" object.
     *
     */
    window.show_prompt = t.show_prompt;
    window.show_message = t.show_message;
    window.authentication_complete = t.authentication_complete;
    window.autologin_timer_expired = t.autologin_timer_expired;

    /**
     *
     * Preparing list of sessions and users
     *
     */
    t.get_session_list();
    t.get_users_list();

    LOG(t.sessions);
    LOG(t.users);
    LOG(t.username);
s
    // Called by LightDM when authentication has completed.
    t.lightdm.authentication_complete = () => {
        LOG("lightdm.authentication_complete()");
	    LOG("lightdm.authentication_user: " + t.lightdm.authentication_user);
        if (t.lightdm.is_authenticated) {
            LOG("User is authenticated");
            t.lightdm.login(t.lightdm.authentication_user, 0);
        } else {
            LOG("Something went wrong at lightdm.authentication_complete() function");
        }
    }

    /**
     * Register callbacks
     *
     */
    t.username_input.addEventListener('keydown', (event) => {
        if (event.keyCode === 9) {
            t.check_username_value();
        }
    });
    t.password_input.addEventListener('click', (event) => { t.start_authenticate_user(event) });
    t.login_button.addEventListener('click', t.submit_password);

    // System callbacks
    t.shutdown_button.addEventListener('click', t.shutdown_system);
    t.restart_button.addEventListener('click', t.restart_system);
    t.suspend_button.addEventListener('click', t.suspend_system);
});
