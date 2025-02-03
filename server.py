from flask import Flask, render_template, request, Response, stream_with_context
from flask_cors import CORS
import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for development

# Configuration
NODE_SERVER_URL = os.getenv('NODE_SERVER_URL', 'http://localhost:3000/api/v1')

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/query", methods=["POST", "GET"])
def query():
    """
    Proxy endpoint that forwards queries to the Node.js server and initiates SSE streaming
    """
    try:
        if request.method == "POST":
            data = request.get_json()
            q = data.get("q")
            budget = data.get("budget", 1000000)
            max_bad_attempt = data.get("maxBadAttempt", 3)

            # Forward the request to Node.js server
            node_res = requests.post(
                f"{NODE_SERVER_URL}/query",
                headers={"Content-Type": "application/json"},
                json={"q": q, "budget": budget, "maxBadAttempt": max_bad_attempt},
                timeout=30  # 30 second timeout
            )

            if node_res.status_code != 200:
                return {
                    "error": "Failed to process query",
                    "details": node_res.text
                }, node_res.status_code

            return node_res.json()

        elif request.method == "GET":
            # For GET requests, we expect the request_id in the query params
            request_id = request.args.get("request_id")
            if not request_id:
                return {"error": "No request ID provided"}, 400

            def generate():
                """Generator function for SSE streaming"""
                try:
                    with requests.get(
                        f"{NODE_SERVER_URL}/stream/{request_id}",
                        stream=True,
                        timeout=None  # No timeout for streaming connection
                    ) as r:
                        if r.encoding is None:
                            r.encoding = 'utf-8'
                        
                        for line in r.iter_lines(decode_unicode=True):
                            if line:
                                if line.startswith('data:'):
                                    yield f"{line}\n\n"
                                else:
                                    yield f"data: {line}\n\n"
                except Exception as e:
                    error_msg = json.dumps({"type": "error", "message": str(e)})
                    yield f"data: {error_msg}\n\n"
                    yield "event: close\ndata: {}\n\n"

            return Response(
                stream_with_context(generate()),
                mimetype='text/event-stream',
                headers={
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'X-Accel-Buffering': 'no'
                }
            )

    except Exception as e:
        return {"error": str(e)}, 500

@app.route("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}, 200

if __name__ == "__main__":
    port = int(os.getenv('PORT', 5001))
    debug = os.getenv('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug) 