"use strict";

let LOG = (text) => {
    console.log("VAPORWAVE::" + text)
}

let lightdm_debug = {
    // Boolean. Indicates if the user has successfully authenticated.
    is_authenticated : true,
    // When LightDM has prompted for input, provide the response to LightDM.
    users : [
        { username : 'rotter' },
        { username : 'lyud' },
        { username : 'tomachito' }
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
    suspend  : () => { console.log("lightdm.suspend()") },
    cancel_authentication : () => { console.log("lightdm.cancel_authentication()") }
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
    auth_pending    : false,

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
		// window.localStorage.clear();
            LOG("Localstorage: " + JSON.stringify(window.localStorage, null, 4));
            let last_authenticated_user = window.localStorage.getItem('last_authenticated_user');
            LOG("last_authenticated_user: " +  last_authenticated_user);
            if (last_authenticated_user === null) {
                vaporwave_theme.username = vaporwave_theme.users[0].username;
            } else {
                vaporwave_theme.username = last_authenticated_user;
            }
            vaporwave_theme.username_input.value = vaporwave_theme.username;
        } else {
            LOG("Error: Can't retrieve last authenticated user. LocalStorage not supported!")
        }
    },
    /**
     * Show error message
     *
     * @param none
     */
    show_error_message: (text, duration) => {
        vaporwave_theme.error_message.innerHTML += ("<p>Error:: " + text + "</p>");
        setTimeout(() => {
            vaporwave_theme.error_message.innerHTML = '';
        }, duration);
    },
    /**
     * Check username field value
     * params: none
     */
    check_username: () => {
        let username = vaporwave_theme.username_input.value;
        if (0 === username.length) {
            vaporwave_theme.username = '';
            vaporwave_theme.show_error_message("Username field is empty", 2500);
            return false
        } else {
            vaporwave_theme.username = username;
            return true
        }
    },
    /**
     * Authenticate process for the selected user.
     *
     * @param {object} event - Event object from 'click' event.
     */
    authenticate: (event) => {
        if (vaporwave_theme.check_username()) {
            let username = vaporwave_theme.username;
            if (vaporwave_theme.auth_pending) {
                vaporwave_theme.lightdm.cancel_authentication();
            }
            vaporwave_theme.auth_pending = true;
            vaporwave_theme.lightdm.authenticate(username);
        }
    },
    /**
     * user select from avalaible users
     *
     * @param {object} event - Event object from 'click' event.
     */
    user_select: (event) => {
        LOG("user_select()");
        if (vaporwave_theme.check_username()) {
            vaporwave_theme.authenticate(event);
        }
    },
    /**
     * Submit password
     *
     * @param none
     */
    submit_password: () => {
        if (vaporwave_theme.check_username()) {
            let password = vaporwave_theme.password_input.value;
            LOG("Call lightdm.respond(" + password + ")");
            vaporwave_theme.lightdm.respond(password);
        }
    },
    /**
     * Authentication complete
     *
     * @param none
     */
    authentication_complete: () => {
        LOG("lightdm.authentication_complete()");
        LOG("lightdm.authentication_user: " + vaporwave_theme.lightdm.authentication_user);
        vaporwave_theme.auth_pending = false;
	    if (vaporwave_theme.lightdm.is_authenticated) {
            LOG("User " + vaporwave_theme.lightdm.authentication_user + " is authenticated");
            window.localStorage.setItem('last_authenticated_user', vaporwave_theme.lightdm.authentication_user);
	        LOG("Localstorage (2): " + JSON.stringify(window.localStorage, null, 4));
            vaporwave_theme.lightdm.login(vaporwave_theme.lightdm.authentication_user, 0);
        } else {
            vaporwave_theme.show_error_message("Password is incorrect!", 2500);
            vaporwave_theme.password_input.value = '';
            LOG("Something went wrong at lightdm.authentication_complete() function");
        }
    },
    /**
     * Shutdown the system
     *
     * @param none
     */
    shutdown_system: () => { vaporwave_theme.lightdm.shutdown() },
    /**
     * Restart the system
     *
     * @param none
     */
    restart_system: () => { vaporwave_theme.lightdm.restart() },
    /**
     * Suspend the system
     *
     * @param none
     */
    suspend_system: () => { vaporwave_theme.lightdm.suspend() },

    show_prompt: (text, type) => {
        LOG("lightdm.show_prompt(" + text + "," + type + ")");
    },

    show_message: (text, type) => {
        let log = "lightdm.show_message(" + text + "," + type + ")";
        LOG(log);

    },

    autologin_timer_expired: () => {
        LOG("lightdm.autologin_timer_expired()");
    },

    cancel_authentication: () => {
        LOG("lightdm.cancel_authentication()");
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
    window.cancel_authentication = t.cancel_authentication;
    window.autologin_timer_expired = t.autologin_timer_expired;
    window.authenticate = t.authenticate;

    /**
     *
     * Preparing list of sessions and users
     *
     */
    t.get_session_list();
    t.get_users_list();

    /**
     * Register callbacks
     *
     */
    t.password_input.addEventListener('click', (event) => { t.user_select(event) });
    t.password_input.addEventListener('keydown', (event) => {
        if (event.keyCode === 13) { // Enter
            t.submit_password()
        }
    })
    t.username_input.addEventListener('keydown', (event) => {
        if (event.keyCode === 9) { // TAB
            t.user_select(event);
        }
    });
    t.login_button.addEventListener('click', t.submit_password);

    // TODO: Put the focus on password instead of username field
    t.username_input.focus();

    // System callbacks
    t.shutdown_button.addEventListener('click', t.shutdown_system);
    t.restart_button.addEventListener('click', t.restart_system);
    t.suspend_button.addEventListener('click', t.suspend_system);
});
