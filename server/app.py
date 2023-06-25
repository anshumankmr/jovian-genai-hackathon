# Write a simple flask app with one route to return an response from OpenAI's Gpt3.5 turbo model using the completions API
from flask  import Flask, Response, stream_with_context, request
import os
import openai
import requests
from flask_cors import CORS
from dotenv import load_dotenv
from constants import constants
# import json
app = Flask(__name__)
CORS(app)
if os.getenv("PY_ENV") == None:
      load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def stream(input_text, system_prompt):
        completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"{input_text}"},
        ], stream=True, temperature=0)
        resp = ''
        for line in completion:
            if 'content' in line['choices'][0]['delta']:
                resp += line['choices'][0]['delta']['content']
                yield f'data: %s\n\n' % resp


@app.route('/stream-create-code-completions/chat-gpt', methods=['POST'])
def create_code_completions_with_chat_gpt():
        """
        This streams the response from ChatGPT
        """
        prompt = request.get_json(force = True).get('prompt','')
        prompt = f'Here\'s the question {prompt}'
        return Response(stream_with_context(stream(prompt,constants["code_completion_system_prompt"])),
                         mimetype='text/event-stream')

def stream_gpt3(input_text):
        completion = openai.Completion.create(model="text-davinci-003",
                    prompt=f'{input_text}',
                    temperature=0, top_p=1,
                    frequency_penalty=0,
                    presence_penalty=0,
                      max_tokens=3000,
                      stream = True
                    )
        resp = ''
        for line in completion:
            print(line['choices'][0])
            if 'text' in line['choices'][0]:
                resp += line['choices'][0]['text']
                yield f'data: %s\n\n' % resp
        print('Done')

@app.route('/stream-create-code-completions/gpt3', methods=['POST'])
def create_code_completions_with_gpt3():
        """
        This streams the response from GPT3
        """
        prompt = request.get_json(force = True).get('prompt','')
        prompt = f'Please Note These Are the Instructions You Must Always Follow: {constants["gpt3_coding_prompt"]}. Now here\'s the question: {prompt}'
        return Response(stream_with_context(stream_gpt3(prompt)),
                         mimetype='text/event-stream')
if __name__ == '__main__':
    app.run(host="0.0.0.0", port = 8080, debug=True, threaded = True)