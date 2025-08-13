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

### Exemplo de Uso da API

```bash
# Obter dados locais
curl http://localhost:5000/dados_local

# Excluir ponto
curl -X POST http://localhost:5000/excluir_ponto \
  -H "Content-Type: application/json" \
  -d '{"codigo": "Q001"}'
```

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
- **NDVI**: Índice de Vegetação por Diferença Normalizada

### Formatos Suportados
- **Shapefiles** (.shp, .dbf, .prj)
- **GeoJSON** (.geojson)
- **GeoTIFF** (.tif)

## 🔒 Segurança e Validação

### Validações Implementadas
- Verificação de arquivos de imagem
- Validação de coordenadas geográficas
- Códigos únicos para cada ocorrência
- Sanitização de dados de entrada

### Recomendações de Segurança
- Implementar autenticação de usuários
- Validar tipos de arquivo permitidos
- Limitar tamanho de uploads
- Implementar rate limiting

## 🧪 Testes

### Testes Manuais
1. Cadastre uma nova queimada
2. Verifique se aparece no mapa
3. Teste edição de coordenadas
4. Teste exclusão de registros
5. Verifique upload de imagens

### Testes Automatizados (Futuro)
- Testes unitários com pytest
- Testes de integração
- Testes de interface

## 🚀 Deploy

### Desenvolvimento Local
```bash
python app.py
```

### Produção
```bash
# Usando Gunicorn
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Usando Waitress (Windows)
pip install waitress
waitress-serve --host=0.0.0.0 --port=5000 app:app
```

### Docker (Futuro)
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

## 🤝 Contribuição

### Como Contribuir
1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código
- Use PEP 8 para Python
- Comente funções complexas
- Mantenha nomes descritivos
- Teste suas alterações

## 📊 Estatísticas do Projeto

- **Linhas de código**: ~120
- **Tecnologias**: 5+
- **Dependências**: 1 principal
- **Arquivos**: 15+
- **Funcionalidades**: 8 principais

## 🔮 Roadmap

### Versão 1.1
- [ ] Autenticação de usuários
- [ ] Dashboard com estatísticas
- [ ] Exportação de relatórios
- [ ] Notificações em tempo real

### Versão 1.2
- [ ] API REST completa
- [ ] Integração com banco de dados PostgreSQL
- [ ] Sistema de backup automático
- [ ] Logs de auditoria

### Versão 2.0
- [ ] Aplicativo mobile
- [ ] Machine Learning para detecção
- [ ] Integração com satélites
- [ ] Análise preditiva

## 📞 Suporte

### Contato
- **Desenvolvedor**: Hendesson Alves
- **Email**: [seu-email@exemplo.com]
- **GitHub**: [@seu-usuario]

### Issues
- Reporte bugs através do GitHub Issues
- Descreva o problema detalhadamente
- Inclua logs e screenshots quando possível

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE). Veja o arquivo LICENSE para mais detalhes.

## 🙏 Agradecimentos

### Instituições Parceiras
- **Universidade de Brasília (UnB)**
- **Instituto Nacional de Pesquisas Espaciais (INPE)**
- **Parque Distrital Boca da Mata**
- **GPAT - Grupo de Pesquisa em Gestão da Paisagem e Território**

### Professores e Orientadores
- **Profª. Potira Meirelles** - Disciplina de Extensão em Geografia

### Equipe de Desenvolvimento
- **Hendesson Alves** - Programação e Desenvolvimento
- **Guilherme Miguel** - Pesquisa e Revisão
- **Lucas Marçal** - Pesquisa e Revisão

---

## 📈 Status do Projeto

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Python](https://img.shields.io/badge/python-3.7+-blue)
![Flask](https://img.shields.io/badge/flask-2.x-green)
![License](https://img.shields.io/badge/license-MIT-blue)

**Última atualização**: Janeiro 2025  
**Versão**: 1.0.0  
**Status**: ✅ Funcional

---

*Desenvolvido com ❤️ para a conservação ambiental e pesquisa científica.*
