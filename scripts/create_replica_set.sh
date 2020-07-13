#!/usr/bin/env bash

# echo "removing log directory..."
rm -rf ~/mongosvr/rs-0
rm -rf ~/mongosvr/rs-0
rm -rf ~/mongosvr/rs-0

# # rm -rf /Users/$(whoami)/data/db/

# # echo "creating log directory..."
# # mkdir -p /Users/$(whoami)/data/db/rs1/logs
# # mkdir -p /Users/$(whoami)/data/db/rs2/logs
# # mkdir -p /Users/$(whoami)/data/db/rs3/logs

# # echo "creating replica sets..."
# # ~/mongoDB/bin/mongod --dbpath=/Users/$(whoami)/data/db/rs1 --replSet spike --logpath "/Users/$(whoami)/data/db/rs1/logs/1.log" --port 27017 &
# # ~/mongoDB/bin/mongod --dbpath=/Users/$(whoami)/data/db/rs2 --replSet spike --logpath "/Users/$(whoami)/data/db/rs2/logs/2.log" --port 27018 &
# # ~/mongoDB/bin/mongod --dbpath=/Users/$(whoami)/data/db/rs3 --replSet spike --logpath "/Users/$(whoami)/data/db/rs3/logs/3.log" --port 27019 &

# echo $conf

# echo "replica sets created successfully"


echo "------------------>"

# shell script to create a simple mongodb replica set (tested on osx)
set -e

red=$(tput setaf 1)
green=$(tput setaf 2)
yellow=$(tput setaf 3)
default=$(tput sgr0)

function finish {
    pids=(`cat ~/mongosvr/rs-*.pid`)
    for pid in "${pids[@]}"
    do
        kill $pid
        wait $pid
    done
}

trap finish EXIT


mkdir -p ~/mongosvr/rs-0
mkdir -p ~/mongosvr/rs-1
mkdir -p ~/mongosvr/rs-2

~/mongoDB/bin/mongod --dbpath ~/mongosvr/rs-0 --replSet spike --port 27017 \
    --pidfilepath ~/mongosvr/rs-0.pid 2>&1 | sed "s/.*/$red&$default/" &

~/mongoDB/bin/mongod --dbpath ~/mongosvr/rs-1 --replSet spike --port 27018 \
    --pidfilepath ~/mongosvr/rs-1.pid 2>&1 | sed "s/.*/$green&$default/" &

~/mongoDB/bin/mongod --dbpath ~/mongosvr/rs-2 --replSet spike --port 27019 \
    --pidfilepath ~/mongosvr/rs-2.pid 2>&1 | sed "s/.*/$yellow&$default/" &

# ~/mongoDB/bin/mongod --dbpath ~/mongosvr/rs-0 --replSet spike --logpath ~/mongosvr/1.log --port 27017 &
# ~/mongoDB/bin/mongod --dbpath ~/mongosvr/rs-1 --replSet spike --logpath ~/mongosvr/2.log --port 27018 &
# ~/mongoDB/bin/mongod --dbpath ~/mongosvr/rs-2 --replSet spike --logpath ~/mongosvr/3.log --port 27019 &

# wait a bit for the first server to come up
# sleep 5

# call rs.initiate({...})
# cfg="{
#     _id: 'set',
#     members: [
#         {_id: 1, host: 'localhost:27091'},
#         {_id: 2, host: 'localhost:27092'},
#         {_id: 3, host: 'localhost:27093'}
#     ]
# }"

# echo cfg="{
#   _id: 'spike',
#   members: [
#     { _id: 1, host: '127.0.0.1:27017' },
#     { _id: 2, host: '127.0.0.1:27018' },
#     { _id: 3, host: '127.0.0.1:27019' },
#   ]
# }"

# connect to default mongo shell and initiate the replSet
# sleep 5
# ~/mongoDB/bin/mongo << !
# rs.initiate($cfg)
# !

# ~/mongoDB/bin/mongod localhost:27091 --eval "JSON.stringify(db.adminCommand({'replSetInitiate' : $cfg}))"

# sleep forever
# cat