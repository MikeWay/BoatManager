# Boat Manager
This project contains both an Angular App and a NodeJS server which provides both API support and an Administration interface

The Angular app is documented in ./README-App.md
The NodeJS server in ./server/README.md

# Build it all

Once the code is cloned from it's repository you should be able to build using
**npm run build-all**

# Web Site Structure

Currently the built server code is in ./server/dist with the app deployed into ./server/public and the views (ejs) in ./server/views

# Server Deployment
When deployed the server is executed as a NodeJS app running with a tool called **forever** which ensures the process is restarted if it dies. The server runs on port 3000.

Apache2 is configured to forward requests to the server on 3000

The Angular app is in the ./server/public directory.

To update:
1. Connect to the server
2. cd BoatManager
3. ./stop.sh
4. git pull
5. npm run build-all-prod
6. ./start.sh
7. Verify running at https://ribmanager.exe-sailing-club.org/