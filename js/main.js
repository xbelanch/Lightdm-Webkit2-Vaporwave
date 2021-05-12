let username = document.getElementById("username");
let password = document.getElementById("pass");

password.addEventListener('keydown', (e) => {
    if (e.keyCode == 13) { // user press intro
        // Check if username field is empty
        if (username.value.length == 0) {
            console.log('Username is empty!');
        } else {
            console.log(
                'Authenticate username: ' +
                    username.value
                    + ' and password: ' +
                    password.value);

            if (password.value !== 'hola') {
                username.value = '';
                username.focus();
                password.value = '';
            }
        }
    }
});

// var input = document.getElementById("input");
// input.addEventListener("keydown", function (e) {
//     if (e.keyCode === 13) {
//         authenticate(e.target.value);
//     }
// });

// window.authentication_complete = function() {
//     if (lightdm.is_authenticated) {
//             lightdm.login(lightdm.authentication_user, null);
//     } else {
//         input.value = "";
//         input.placeholder = "user";
//         input.type = "text";
//         input.disabled = false;
//         input.focus();
//         input.select();
//     }
// }

// function authenticate(input_text) {
//     if(!lightdm.in_authentication || !lightdm.authentication_user) {
//         lightdm.authenticate(input_text);
//         input.value = "";
//         input.type = "password";
//         input.placeholder = "password";
//         input.disabled = false;
//     } else {
//         input.disabled = true;
//         lightdm.respond(input_text);
//     }
// }

// --- Booting up
window.addEventListener('load', () => {
    // new VaporwaveTheme();
    // input.focus();
    // input.select();
    // input.value = lightdm.select_user_hint;
    // if(input.value) {
    //   authenticate(input.value);
    // }
});
