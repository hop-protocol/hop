#!/bin/bash

# Port number to check
PORT=4665

# Find process using the port and get its PID
pid=$(lsof -t -i:$PORT)

# Check if any process was found
if [ -z "$pid" ]; then
    echo "No process is using port $PORT."
else
    echo "Process $pid is using port $PORT. Killing it..."
    kill $pid
    echo "Process killed."
fi
