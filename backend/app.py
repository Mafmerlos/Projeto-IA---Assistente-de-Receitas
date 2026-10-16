import os
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from controllers.receita_controller import receita_bp

load_dotenv()

app = Flask(__name__)
CORS(app)
app.register_blueprint(receita_bp)

porta = int(os.getenv("PORT", 3001))

if __name__ == "__main__":
    print(f"Servidor rodando na porta {porta}...", flush=True)
    app.run(host="0.0.0.0", port=porta, debug=False)
