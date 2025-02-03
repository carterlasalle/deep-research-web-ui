      
#!/bin/bash

# Find and kill any existing Python process running "server.py"
pkill -f "python server.py"

# Start Flask backend in the background
source venv/bin/activate
python server.py &

# Store the PID of the background process
SERVER_PID=$!

# Start React frontend
cd client && yarn start

# Wait for any process to exit (like when you press Ctrl+C in the terminal)
wait $SERVER_PID

# When a process exits, check if it was the server and kill any remaining processes
if [[ $? -eq 0 ]]; then
  echo "Flask server process exited. Terminating other processes..."
  pkill -P $$ # Kill all child processes of this script
fi

    