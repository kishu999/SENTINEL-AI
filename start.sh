#!/usr/bin/env bash
set -e

echo "======================================================="
echo "        SENTINEL AI - CYBERSECURITY FIREWALL"
echo "======================================================="
echo ""

# Activate backend venv if present
if [ -d "backend/.venv" ]; then
    source backend/.venv/bin/activate
fi

echo "[1/2] Starting Sentinel AI Backend on http://localhost:8000 ..."
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

echo "[2/2] Starting Sentinel AI Frontend on http://localhost:5173 ..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "======================================================="
echo "  Sentinel AI is active!"
echo "  UI Dashboard: http://localhost:5173"
echo "  OpenAI Proxy: http://localhost:8000/v1"
echo "  Attacker Sink: http://localhost:8000/v1/attacker-sink"
echo "======================================================="

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
