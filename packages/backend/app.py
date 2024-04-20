from flask import Flask, jsonify, request
from my_script import get_prompt
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS if needed, especially for local development with frontend

@app.route('/get-prompt', methods=['GET'])
def getChatGPTRequest():
    prompt = request.args.get('prompt', 'Write a Haiku about web3 hackathons?')  # Default prompt
    try:
        response = get_prompt(prompt)
        return jsonify({"success": True, "response": response}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)