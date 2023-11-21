from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

app = Flask(__name__)
CORS(app)  # Initialize CORS to communicate backend to frontend
CORS(app, resources={r"/*": {"origins": "*"}})

# Connecting to ChatGPT with API Key
api_key = "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"
openai.api_key = api_key


# Flask endpoints
@app.route('/start', methods=['GET'])
def start_conversation():
    try:
        # Starting the conversation
        return jsonify({"message": "Welcome to the Doc-Bot Chat! Please message here."})
    except Exception as e:
        return jsonify({"error": str(e)})



@app.route('/post', methods=['POST'])
def post_message():
    try:
        # Get user input from the request
        user_input = request.json['user_input']

        # Defining context for the API to instruct ChatGPT on its directive to the user
        system_message = "You are a medical chatbot to predict specifically heart disease, lung cancer, and colon cancer. If you are asked anything unrelated to these topics, please advise the user that this is not your specialty. Please ask questions to determine the risk of these illnesses on a given patient and provide information on disease risk and treatment. Please dont give yourself any prefixes when sending a response"

        # Send a prompt to GPT
        prompt = f"{system_message}\{user_input}\n" 
        response = openai.Completion.create(
            engine="text-davinci-003", # ChatGPT-3 model name
            prompt=prompt,
            max_tokens=1000,  # This can cut off the chatbot after spending a set amount of tokens on a response to conserve tokens (cost)
            n=1, # Number of responses from a single prompt
            stop=None # No specific stopping point for the response
        )


        # Return the response of the chatbot
        ai_response = response.choices[0].text.strip()
        return jsonify({"response": ai_response})
    except Exception as e:
        return jsonify({"error": str(e)})
        

    # Exit command for use in cmd terminals
@app.route('/exit', methods=['GET'])
def exit_chat():
    try:
        # Exiting the chat
        return jsonify({"message": "Chat closed. Goodbye!"})
    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == '__main__':
    app.run(debug=True)
