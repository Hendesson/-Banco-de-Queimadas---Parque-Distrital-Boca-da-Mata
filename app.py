from flask import Flask, request, render_template, redirect, url_for, send_from_directory, jsonify
import os
import csv
from datetime import datetime

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = os.path.join('static', 'assets')
app.config['CSV_FILE'] = 'queimadas_local.csv'

# Garante que a pasta de uploads existe
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['foto']
    data = request.form['data']
    hora = request.form['hora']
    latitude = request.form['latitude']
    longitude = request.form['longitude']
    codigo = request.form['codigo']
    extensao_fogo = request.form.get('extensao_fogo', '')
    
    if file and codigo:
        filename = f"{codigo}.jpg"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        # Salva no CSV
        with open(app.config['CSV_FILE'], 'a', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow([data, hora, latitude, longitude, codigo, extensao_fogo])
        return redirect(url_for('index'))
    return 'Erro no upload', 400

@app.route('/dados_local')
def dados_local():
    dados = []
    if os.path.exists(app.config['CSV_FILE']):
        with open(app.config['CSV_FILE'], newline='', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                if len(row) >= 5:
                    dado = {
                        'data': row[0],
                        'hora': row[1],
                        'latitude': row[2],
                        'longitude': row[3],
                        'codigo': row[4]
                    }
                    if len(row) > 5:
                        dado['extensao_fogo'] = row[5]
                    dados.append(dado)
    return jsonify(dados)

@app.route('/dados_df')
def dados_df():
    dados = []
    if os.path.exists('queimadas_df.csv'):
        with open('queimadas_df.csv', newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                dados.append(row)
    return jsonify(dados)

@app.route('/excluir_ponto', methods=['POST'])
def excluir_ponto():
    codigo = request.json.get('codigo')
    if not codigo:
        return jsonify({'success': False, 'error': 'Código não informado'}), 400
    linhas = []
    removido = False
    if os.path.exists(app.config['CSV_FILE']):
        with open(app.config['CSV_FILE'], newline='', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                if len(row) >= 5 and row[4] == codigo:
                    removido = True
                    continue  # pula o ponto a ser removido
                linhas.append(row)
        with open(app.config['CSV_FILE'], 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerows(linhas)
    return jsonify({'success': removido})

@app.route('/editar_ponto', methods=['POST'])
def editar_ponto():
    data = request.json
    codigo = data.get('codigo')
    nova_latitude = data.get('latitude')
    nova_longitude = data.get('longitude')
    nova_extensao = data.get('extensao_fogo', '')
    if not codigo:
        return jsonify({'success': False, 'error': 'Código não informado'}), 400
    linhas = []
    editado = False
    if os.path.exists(app.config['CSV_FILE']):
        with open(app.config['CSV_FILE'], newline='', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                if len(row) >= 5 and row[4] == codigo:
                    # Atualiza os campos
                    row[2] = nova_latitude
                    row[3] = nova_longitude
                    if len(row) > 5:
                        row[5] = nova_extensao
                    else:
                        row.append(nova_extensao)
                    editado = True
                linhas.append(row)
        with open(app.config['CSV_FILE'], 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerows(linhas)
    return jsonify({'success': editado})

@app.route('/static/assets/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0') 