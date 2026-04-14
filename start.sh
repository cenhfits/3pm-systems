#!/bin/bash
echo "Starting 3PM System..."

# Start Backend
echo "[Backend] Starting FastAPI on port 8000..."
cd backend
python -m uvicorn server:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Start Frontend
echo "[Frontend] Starting React on port 3000..."
cd frontend
yarn start &
FRONTEND_PID=$!
cd ..

echo ""
echo "Both servers running:"
echo " - Frontend: http://localhost:3000"
echo " - Backend:  http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait and cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
