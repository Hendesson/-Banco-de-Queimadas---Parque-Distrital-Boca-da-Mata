# 🔥 Banco de Queimadas - Parque Distrital Boca da Mata

## 📋 Descrição

Sistema web desenvolvido para o mapeamento e monitoramento de queimadas no Parque Distrital Boca da Mata, localizado no Distrito Federal. Esta aplicação permite o registro georreferenciado de ocorrências de fogo, incluindo fotos, coordenadas geográficas e extensão da área afetada.

## 🎯 Objetivos

- **Monitoramento**: Acompanhar ocorrências de queimadas em tempo real
- **Mapeamento**: Visualizar pontos de fogo em mapa interativo
- **Registro**: Armazenar dados históricos de queimadas
- **Análise**: Fornecer base de dados para pesquisas científicas
- **Prevenção**: Contribuir para estratégias de prevenção e combate a incêndios

## 🏗️ Arquitetura do Sistema

### Backend
- **Framework**: Flask (Python)
- **Banco de Dados**: Arquivos CSV para armazenamento local
- **APIs**: Endpoints REST para operações CRUD

### Frontend
- **Mapa**: Leaflet.js para visualização geográfica
- **Interface**: HTML5, CSS3 e JavaScript vanilla
- **Componentes**: Awesome Markers e Leaflet Draw para funcionalidades avançadas

## 🚀 Funcionalidades

### ✅ Cadastro de Queimadas
- Upload de fotos com georreferenciamento
- Registro de data, hora e coordenadas
- Código único para cada ocorrência
- Medição da extensão da área afetada

### 🗺️ Visualização Geográfica
- Mapa interativo com pontos de queimadas
- Camadas de dados geográficos (GeoJSON)
- Marcadores personalizados para diferentes tipos de ocorrência
- Ferramentas de desenho para delimitar áreas

### 📊 Gestão de Dados
- Listagem de todas as ocorrências registradas
- Edição de coordenadas e informações
- Exclusão de registros
- Exportação de dados

### 🔍 Análise de Dados
- Filtros por período
- Estatísticas de ocorrências
- Integração com dados do INPE (BDQueimadas)

## 📁 Estrutura do Projeto

```
extensao/
├── app.py                 # Aplicação principal Flask
├── requirements.txt       # Dependências Python
├── queimadas_local.csv   # Banco de dados local
├── queimadas_df.csv      # Dados do Distrito Federal
├── static/               # Arquivos estáticos
│   ├── assets/          # Imagens e logos
│   ├── geojson/         # Dados geográficos
│   ├── script.js        # JavaScript da aplicação
│   └── style.css        # Estilos CSS
├── templates/            # Templates HTML
│   └── index.html       # Página principal
└── arquivos_extras/      # Dados geográficos adicionais
    └── extras/          # Shapefiles e imagens
```

## 🛠️ Tecnologias Utilizadas

### Backend
- **Python 3.x**
- **Flask 2.x** - Framework web
- **CSV** - Armazenamento de dados

### Frontend
- **HTML5** - Estrutura da página
- **CSS3** - Estilização
- **JavaScript ES6+** - Funcionalidades interativas
- **Leaflet.js** - Biblioteca de mapas
- **Font Awesome** - Ícones

### Dados Geográficos
- **GeoJSON** - Formato de dados espaciais
- **Shapefiles** - Dados vetoriais
- **GeoTIFF** - Imagens georreferenciadas

## 📦 Instalação e Configuração

### Pré-requisitos
- Python 3.7 ou superior
- pip (gerenciador de pacotes Python)

### Passos para Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/banco-queimadas.git
   cd banco-queimadas
   ```

2. **Crie um ambiente virtual (recomendado)**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Instale as dependências**
   ```bash
   pip install -r requirements.txt
   ```

4. **Execute a aplicação**
   ```bash
   python app.py
   ```

5. **Acesse no navegador**
   ```
   http://localhost:5000
   ```

## 🔧 Configuração

### Variáveis de Ambiente
- `UPLOAD_FOLDER`: Pasta para armazenar imagens (padrão: `static/assets`)
- `CSV_FILE`: Arquivo CSV para dados locais (padrão: `queimadas_local.csv`)

### Porta e Host
- **Porta padrão**: 5000
- **Host**: 0.0.0.0 (acessível externamente)

## 📱 Como Usar

### 1. Cadastrar Nova Queimada
1. Acesse a página principal
2. Preencha os campos obrigatórios:
   - Data e hora da ocorrência
   - Latitude e longitude
   - Código único da imagem
   - Foto da ocorrência
3. Use o botão "Desenhar Extensão" para delimitar a área afetada
4. Clique em "Enviar"

### 2. Visualizar Dados
- Os pontos aparecem automaticamente no mapa
- Use os controles para navegar e zoom
- Clique nos marcadores para ver detalhes

### 3. Gerenciar Registros
- Edite coordenadas clicando nos pontos
- Exclua registros através da interface
- Visualize histórico completo

## 🌐 APIs Disponíveis

### Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/` | Página principal |
| `POST` | `/upload` | Upload de nova queimada |
| `GET` | `/dados_local` | Dados das queimadas locais |
| `GET` | `/dados_df` | Dados do Distrito Federal |
| `POST` | `/excluir_ponto` | Excluir registro |
| `POST` | `/editar_ponto` | Editar coordenadas |
| `GET` | `/static/assets/<filename>` | Acesso a imagens |


## 🗃️ Estrutura dos Dados

### CSV Local (queimadas_local.csv)
```csv
data,hora,latitude,longitude,codigo,extensao_fogo
2024-01-15,14:30,-15.1234,-47.5678,Q001,0.5
```

### Campos
- **data**: Data da ocorrência (YYYY-MM-DD)
- **hora**: Hora da ocorrência (HH:MM)
- **latitude**: Coordenada latitudinal (decimal)
- **longitude**: Coordenada longitudinal (decimal)
- **codigo**: Identificador único da ocorrência
- **extensao_fogo**: Área afetada em hectares (opcional)

## 🗺️ Dados Geográficos

### Camadas Disponíveis
- **Áreas Urbanas**: Delimitação de zonas urbanas
- **PDBM**: Limites do Parque Distrital Boca da Mata
- **Vegetação**: Tipos de cobertura vegetal
- **ZA Atual**: Zona de Amortecimento atualizada

*Desenvolvido com ❤️ para a conservação ambiental e pesquisa científica.*
