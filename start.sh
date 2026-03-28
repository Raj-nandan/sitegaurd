#!/bin/bash

# Start MongoDB
mkdir -p /home/runner/data/mongodb
mongod --dbpath /home/runner/data/mongodb --logpath /home/runner/data/mongodb/mongod.log --fork --bind_ip 127.0.0.1

# Start backend server
cd server && npm run dev &

# Start frontend
cd client && npm run dev
