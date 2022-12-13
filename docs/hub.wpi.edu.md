# hub.wpi.edu Transition

## Server Stuff

1. Need A-Record for hub.wpi.edu to point to server IP address.
2. Need to re-bundle SSL certificate to include hub.wpi.edu as the primary CNAME, and have it, its, its-web-p-u01 as secondary CNAMEs.
3. Need to change NGINX config to make hub.wpi.edu the primary server_name and redirect all other CNAMEs to the new.
4. Re-Configure SAML to use hub.wpi.edu as the host rather than its.wpi.edu.
5. Update any references to its.wpi.edu in the WebApp to hub.wpi.edu.
6. Update Google Search Console to know about hub.wpi.edu.
7. All internal actions in the app should be updated to point to hub.wpi.edu instead of its.wpi.edu.