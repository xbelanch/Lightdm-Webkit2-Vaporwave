# NOTES

## From [dmg_blue](https://github.com/davidmogar/lightdm-webkit2-dmg_blue)

* class DmgBlueTheme
  - initialize:
    + prepare_session_list: // Loop through the array of LightDMSession objects to create our session list
      * lightdm.sessions
    + prepare_users_list: // Loop through the array of LightDMUser objects to create our user list.
      * lightdm.users
    + register_callbacks: // Register callbacks for the LDM Greeter
      * authentication_complete: "This function is called by LightDM when authentication
         has completed."
      * cancel_authentication: "Cancels the authentication of any user currently in the
         process of authenticating."
      * start_authentication: "has been deprecated." -> lightdm.authenticate(username)
