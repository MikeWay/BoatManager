rm /home/bitnami/.forever/forever1.log
cd ~/BoatManager
source ./server/set-smtp-env.sh
forever start -l forever1.log -o forever.out ./server/dist/server.js
