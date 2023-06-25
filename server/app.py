# Write a simple flask app with one route to return an response from OpenAI's Gpt3.5 turbo model using the completions API
from flask  import Flask, Response, stream_with_context, request,jsonify
import os
import openai
import requests
from flask_cors import CORS
from dotenv import load_dotenv
from constants import constants
from flask_httpauth import HTTPBasicAuth
app = Flask(__name__)
auth = HTTPBasicAuth()

CORS(app)
if os.getenv("PY_ENV") == None:
      load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
users = {
    os.getenv("USER"): os.getenv("PASSWORD")
}
@auth.verify_password
def verify_password(username, password):
    if username in users and users[username] == password:
        return username


def stream(input_text, system_prompt):
        completion = openai.ChatCompletion.create(model="gpt-3.5-turbo-16k", messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"{input_text}"},
        ], stream=True, temperature=0)
        resp = ''
        for line in completion:
            if 'content' in line['choices'][0]['delta']:
                resp += line['choices'][0]['delta']['content']
                yield f'data: %s\n\n' % resp
        print(resp)


@app.route('/stream-create-code-completions/chat-gpt', methods=['POST'])
@auth.login_required
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
            if 'text' in line['choices'][0]:
                resp += line['choices'][0]['text']
                yield f'data: %s\n\n' % resp
        print('Done', resp)
        yield "Done"

@app.route('/stream-create-code-completions/gpt3', methods=['POST'])
@auth.login_required
def create_code_completions_with_gpt3():
        """
        This streams the response from GPT3
        """
        prompt = request.get_json(force = True).get('prompt','')
        prompt = f'Please Note These Are the Instructions You Must Always Follow: {constants["gpt3_coding_prompt"]}. Now here\'s the question: {prompt}'
        return Response(stream_with_context(stream_gpt3(prompt)),
                         mimetype='text/event-stream')

@app.route('/top_answers_for_query', methods=['POST'])
@auth.login_required
def top_answers_for_query_route():
    query = request.json.get('query')

    if not query:
        return jsonify({'error': 'Missing query parameter'}), 400

    questions = advanced_search(query, 3)

    if not questions:
        return jsonify({'error': 'No questions found for this query'}), 404

    # Get most upvoted answer for each question
    top_answers = []
    for question in questions:
        answer = get_most_upvoted_answer(question['question_id'])
        if answer:
            answer['question_title'] = question['title']
            top_answers.append(answer)

    return jsonify(top_answers)

def get_most_upvoted_answer(question_id):
    url = f"https://api.stackexchange.com/2.2/questions/{question_id}/answers"
    parameters = {
        "order": "desc",
        "sort": "votes",
        "site": "stackoverflow",
        "pagesize": 1,
        "filter": "withbody"
    }
    response = requests.get(url, params=parameters)
    return response.json()['items'][0] if response.status_code == 200 and response.json()['items'] else None

def advanced_search(query, num_results=1, sort='votes'):
    url = "https://api.stackexchange.com/2.2/search/advanced"
    parameters = {
        "order": "desc",
        "sort": sort,
        "q": query,
        "site": "stackoverflow",
        "pagesize": num_results,
        "filter": "withbody"
    }
    response = requests.get(url, params=parameters)
    return response.json()['items'] if response.status_code == 200 and response.json()['items'] else None

@app.route('/stream-code-tests/chatgpt', methods=['POST'])
@auth.login_required
def create_code_tests_with_chatgpt():
        """
        This streams the response from GPT3
        """
        prompt = request.get_json(force = True).get('prompt','')
        prompt = f'You are a super smart developer using Test Driven Development to write tests according to a specification. Please generate tests based on the above specification. The tests should be as simple as possible, but still cover all the functionality. BEGIN Code: ${prompt}'
        return Response(stream_with_context(stream(prompt,  constants["philosophy_prompt"] + constants["gen_code"])),
                         mimetype='text/event-stream')

@app.route('/stream-code-fixes/chatgpt', methods=['POST'])
@auth.login_required
def create_code_fixes_with_chatgpt():
        """
        This streams the response from GPT3
        """
        prompt = request.get_json(force = True).get('prompt','')
        prompt = f'${constants["fix_code"]} BEGIN Code: ${prompt}'
        return Response(stream_with_context(stream(prompt,  constants["philosophy_prompt"] + constants["gen_code"])),
                         mimetype='text/event-stream')
if __name__ == '__main__':
    app.run(host="0.0.0.0", port = 8080, debug=True, threaded = True)