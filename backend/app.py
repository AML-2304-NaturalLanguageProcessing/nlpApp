from flask import Flask, send_from_directory, jsonify

app = Flask(__name__, static_folder='../frontend/.next')

@app.route('/')
@app.route('/<path:path>')
def serve_index(path=None):
    if path and path.startswith('_next/static'):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder + '/static/pages', 'index.html')

@app.route('/_next/static/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder + '/static', path)

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
