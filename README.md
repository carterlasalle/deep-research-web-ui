# Deep Research Web UI

A modern, real-time chat interface for deep research interactions. This application provides a beautiful, animated UI for interacting with a deep research backend service.

## Features

- Real-time streaming responses using Server-Sent Events (SSE)
- Modern, animated chat interface
- Conversation history storage
- Beautiful, responsive design
- Progress tracking for research queries
- Error handling and recovery

## Tech Stack

- **Frontend:**
  - React 18+
  - Modern CSS with animations
  - EventSource for SSE handling
  
- **Backend:**
  - Flask (Python 3.x)
  - Server-Sent Events (SSE)
  - CORS support
  
- **Proxy Target:**
  - Node.js backend service

## Prerequisites

- Python 3.x
- Node.js 16+
- Yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/carterlasalle/deep-research-web-ui.git
   cd deep-research-web-ui
   ```

2. Set up Python virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Install frontend dependencies:
   ```bash
   cd client
   yarn install
   ```

## Development

1. Start the Flask backend:
   ```bash
   python server.py
   ```
   The server will run on http://localhost:5001

2. In a new terminal, start the React frontend:
   ```bash
   cd client
   yarn start
   ```
   The development server will run on http://localhost:3000

## Project Structure

```
deep-research-web-ui/
├── server.py          # Flask backend
├── requirements.txt   # Python dependencies
├── templates/         # Flask templates
├── static/           # Static assets
└── client/           # React frontend
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── styles/
    │   └── utils/
    └── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Carter Lasalle - [GitHub](https://github.com/carterlasalle) 