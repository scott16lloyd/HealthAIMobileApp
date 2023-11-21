#This is a file to post request and recieve the response to the DocBot API

import requests



# API endpoint URLs
base_url = 'http://127.0.0.1:5000' # Defining the base URL for the Flask API

# Flask Endpoints
start_url = f'{base_url}/start' #Start Endpoint
post_url = f'{base_url}/post' #Post Endpoint
exit_url = f'{base_url}/exit' #Exit Endpoint


#Function to start the conversation
def start_conversation():
    response = requests.get(start_url)
    return response.json()["message"]



def send_message(message):
    try:

        # Send a post request to the chatbot
        response = requests.post(post_url, json={"user_input": message})
        return response.json()["response"]
    except Exception as e:
        return str(e)

def exit_chat():

    # Exiting the chat
    response = requests.get(exit_url)
    return response.json()["message"]



if __name__ == "__main__":
  
    

    # Start the conversation
    start_message = start_conversation()
    print(start_message)


    while True:
        user_input = input("You: ")
        
        if user_input.lower() == "exit":
            # Exit the chat
            exit_message = exit_chat()
            print(exit_message)
            break


        #Getting bot response
        bot_response = send_message(user_input)
        print("Doc-bot:", bot_response)