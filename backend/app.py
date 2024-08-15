from flask import Flask, send_from_directory, request, jsonify

app = Flask(__name__, static_folder='../frontend/.next')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if path != "" and not path.endswith("favicon.ico") and not path.endswith("robots.txt"):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    emotion = data.get('emotion', None)
    query = data.get('query', None)
    
    input_data = preprocess_input(emotion, query)
    predictions = {'status': 'success', 'data': input_data}
    return jsonify(predictions)

def preprocess_input(emotion, query):
    return {'emotion': emotion, 'query': query}

if __name__ == '__main__':
    app.run(debug=True)
