#!/bin/bash

# Start Flask backend
source venv/bin/activate
python server.py &

# Start React frontend
cd client && yarn start 