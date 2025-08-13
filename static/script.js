// Toda a lógica dentro do DOMContentLoaded

document.addEventListener('DOMContentLoaded', function() {
    try {
        // Inicializa o mapa centrado no Parque Boca da Mata (ajuste as coordenadas conforme necessário)
        var map = L.map('map').setView([-15.866778, -48.046979], 15); // Centro atualizado para o Parque Boca da Mata

        // Camada base padrão (OSM)
        var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Camada de satélite Esri
        var esriSat = L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            {
                attribution: 'Tiles © Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            }
        );

        // Layer Control
        var baseMaps = {
            'Mapa de Ruas': osm,
            'Satélite': esriSat
        };
        var layerControl = L.control.layers(baseMaps, null, {collapsed: false}).addTo(map);

        // Por padrão, OSM já está adicionado

        // Camadas GeoJSON
        var geojsonLayers = {};
        function addGeoJsonLayer(url, style, name) {
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    var layer = L.geoJSON(data, {style: style});
                    geojsonLayers[name] = layer;
                    layer.addTo(map);
                    // Atualiza o controle de camadas se já existir
                    if (layerControl) {
                        layerControl.addOverlay(layer, name);
                    }
                });
        }

        // Definições de estilo com transparência
        var stylePDBM = { color: '#2d572c', weight: 3, fill: true, fillColor: '#2d572c', fillOpacity: 0.08 };
        var styleZA = { color: '#ffd600', weight: 2, dashArray: '6 4', fill: true, fillColor: '#ffd600', fillOpacity: 0.10 };
        var styleVEG = { color: '#4caf50', weight: 1, fill: true, fillColor: '#4caf50', fillOpacity: 0.18 };
        var styleURB = { color: '#e75480', weight: 2, fill: true, fillColor: '#e75480', fillOpacity: 0.18 }; // rosa

        // Adiciona as camadas
        addGeoJsonLayer('/static/geojson/PDBM.geojson', stylePDBM, 'Limite do Parque');
        addGeoJsonLayer('/static/geojson/ZA_ATUAL_PDBM.geojson', styleZA, 'Zona de Amortecimento');
        addGeoJsonLayer('/static/geojson/VEGETACAO.geojson', styleVEG, 'Vegetação');
        // Removido: addGeoJsonLayer('/static/geojson/AREAS_URBANAS.geojson', styleURB, 'Áreas Urbanas');

        // Layer Control
        // Quando todas as camadas forem carregadas, adiciona ao controle
        // (Já está sendo feito no addGeoJsonLayer)

        // Legenda
        var legend = L.control({position: 'bottomright'});
        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend');
            div.innerHTML = `
                <div style="background: #fff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.08); padding: 10px 18px; font-size: 15px; border: 1px solid #b2c2b0;">
                    <b>Legenda</b><br>
                    <svg width='22' height='10' style='vertical-align:middle'><rect x='0' y='2' width='22' height='6' fill='#2d572c' fill-opacity='0.08' stroke='#2d572c' stroke-width='3'/></svg> Limite do Parque<br>
                    <svg width='22' height='10' style='vertical-align:middle'><rect x='0' y='2' width='22' height='6' fill='#ffd600' fill-opacity='0.10' stroke='#ffd600' stroke-width='2' stroke-dasharray='6,4'/></svg> Zona de Amortecimento<br>
                    <svg width='22' height='10' style='vertical-align:middle'><rect x='0' y='2' width='22' height='6' fill='#4caf50' fill-opacity='0.18' stroke='#4caf50' stroke-width='1'/></svg> Vegetação<br>
                    <!-- Removido: Legenda Áreas Urbanas -->
                </div>
            `;
            return div;
        };
        legend.addTo(map);

        // Ícone PNG para queimadas do DF
        var fogoIcon = L.icon({
            iconUrl: '/static/assets/Icone-fogo-Png.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });

        // Função para limpar todos os marcadores do mapa
        var markersLayer = L.layerGroup().addTo(map);
        function clearMarkers() {
            markersLayer.clearLayers();
        }

        // === 1. Preencher latitude/longitude ao clicar no mapa ===
        map.on('click', function(e) {
            var lat = e.latlng.lat.toFixed(6);
            var lng = e.latlng.lng.toFixed(6);
            var latInput = document.getElementById('latitude');
            var lngInput = document.getElementById('longitude');
            if (latInput && lngInput) {
                latInput.value = lat;
                lngInput.value = lng;
            }
        });

        // === 2. Desenhar extensão do fogo ===
        var drawControl, drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);
        var extensaoGeoJson = null;

        var btnDesenhar = document.getElementById('btn-desenhar-extensao');
        if (btnDesenhar) {
            btnDesenhar.onclick = function() {
                if (drawControl) map.removeControl(drawControl);
                drawControl = new L.Control.Draw({
                    draw: {
                        polygon: {
                            allowIntersection: false,
                            showArea: true,
                            shapeOptions: {
                                color: '#d32f2f',
                                fillColor: '#d32f2f',
                                fillOpacity: 0.25
                            }
                        },
                        marker: false,
                        polyline: false,
                        rectangle: false,
                        circle: false,
                        circlemarker: false
                    },
                    edit: { featureGroup: drawnItems, edit: false, remove: true }
                });
                map.addControl(drawControl);
            };
        }

        map.on(L.Draw.Event.CREATED, function (e) {
            drawnItems.clearLayers();
            var layer = e.layer;
            drawnItems.addLayer(layer);
            extensaoGeoJson = layer.toGeoJSON();
            // Salva no campo oculto do formulário
            var extInput = document.getElementById('extensao_fogo');
            if (extInput) {
                extInput.value = JSON.stringify(extensaoGeoJson.geometry);
            }
            // Remove o controle de desenho após desenhar
            if (drawControl) map.removeControl(drawControl);
        });

        // === 3. Exibir extensão ao clicar no marcador local ===
        function addLocalMarker(dado) {
            var lat = parseFloat(dado.latitude);
            var lng = parseFloat(dado.longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
                var marker = L.marker([lat, lng], {icon: fogoIcon, draggable: false}).addTo(markersLayer);
                var imgUrl = `/static/assets/${dado.codigo}.jpg`;
                var popupContent = `
                <div class='custom-popup'>
                  <b>Data:</b> ${dado.data}<br>
                  <b>Hora:</b> ${dado.hora}<br>
                  <b>Código:</b> ${dado.codigo}<br>
                  <img src='${imgUrl}' alt='Foto' style='width:200px;'>
                  <div class='popup-btns'>
                    <button class='btn-mostrar-extensao' data-codigo='${dado.codigo}'>Mostrar Extensão</button>
                    <button class='btn-editar-extensao' data-codigo='${dado.codigo}'>Editar Extensão</button>
                    <button class='btn-editar-local' data-codigo='${dado.codigo}'>Editar Localização</button>
                    <button class='btn-excluir-ponto' data-codigo='${dado.codigo}'>Excluir</button>
                  </div>
                </div>`;
                marker.bindPopup(popupContent);
                // Controle da extensão desenhada
                marker._extLayer = null;
                marker._extensaoVisivel = false;
                function mostrarExtensao() {
                    if (dado.extensao_fogo && !marker._extLayer) {
                        try {
                            var geo = JSON.parse(dado.extensao_fogo);
                            var extLayer = L.geoJSON({type: 'Feature', geometry: geo}, {
                                style: {color: '#d32f2f', fillColor: '#d32f2f', fillOpacity: 0.25}
                            });
                            extLayer.addTo(map);
                            marker._extLayer = extLayer;
                            marker._extensaoVisivel = true;
                        } catch(e) {}
                    }
                }
                function ocultarExtensao() {
                    if (marker._extLayer) {
                        map.removeLayer(marker._extLayer);
                        marker._extLayer = null;
                        marker._extensaoVisivel = false;
                    }
                }
                // Alternar extensão ao clicar no ícone do fogo
                marker.on('click', function() {
                    if (marker._extensaoVisivel) {
                        ocultarExtensao();
                    } else {
                        mostrarExtensao();
                    }
                });
                marker.on('popupopen', function(e) {
                    // Botão Mostrar/Ocultar Extensão
                    var btnExtVis = document.querySelector('.btn-mostrar-extensao[data-codigo="' + dado.codigo + '"]');
                    if (btnExtVis) {
                        btnExtVis.textContent = marker._extensaoVisivel ? 'Ocultar Extensão' : 'Mostrar Extensão';
                        btnExtVis.onclick = function() {
                            if (marker._extensaoVisivel) {
                                ocultarExtensao();
                                btnExtVis.textContent = 'Mostrar Extensão';
                            } else {
                                mostrarExtensao();
                                btnExtVis.textContent = 'Ocultar Extensão';
                            }
                        };
                    }
                    // Excluir
                    var btn = document.querySelector('.btn-excluir-ponto[data-codigo="' + dado.codigo + '"]');
                    if (btn) {
                        btn.onclick = function() {
                            if (confirm('Tem certeza que deseja excluir este ponto?')) {
                                fetch('/excluir_ponto', {
                                    method: 'POST',
                                    headers: {'Content-Type': 'application/json'},
                                    body: JSON.stringify({codigo: dado.codigo})
                                })
                                .then(res => res.json())
                                .then(resp => {
                                    if (resp.success) {
                                        marker.closePopup();
                                        showLocalData();
                                    } else {
                                        alert('Erro ao excluir ponto: ' + (resp.error || 'Desconhecido'));
                                    }
                                })
                                .catch(() => alert('Erro ao excluir ponto.'));
                            }
                        };
                    }
                    // Editar Localização
                    var btnEdit = document.querySelector('.btn-editar-local[data-codigo="' + dado.codigo + '"]');
                    if (btnEdit) {
                        btnEdit.onclick = function() {
                            marker.closePopup();
                            marker.dragging.enable();
                            alert('Arraste o marcador para a nova posição e clique novamente para salvar.');
                            marker.on('dragend', function(e) {
                                var novaLat = marker.getLatLng().lat.toFixed(6);
                                var novaLng = marker.getLatLng().lng.toFixed(6);
                                fetch('/editar_ponto', {
                                    method: 'POST',
                                    headers: {'Content-Type': 'application/json'},
                                    body: JSON.stringify({codigo: dado.codigo, latitude: novaLat, longitude: novaLng, extensao_fogo: dado.extensao_fogo || ''})
                                })
                                .then(res => res.json())
                                .then(resp => {
                                    if (resp.success) {
                                        showLocalData();
                                    } else {
                                        alert('Erro ao editar localização: ' + (resp.error || 'Desconhecido'));
                                    }
                                })
                                .catch(() => alert('Erro ao editar localização.'));
                            }, {once: true});
                        };
                    }
                    // Editar Extensão
                    var btnExt = document.querySelector('.btn-editar-extensao[data-codigo="' + dado.codigo + '"]');
                    if (btnExt) {
                        btnExt.onclick = function() {
                            marker.closePopup();
                            // Ativa o controle de desenho
                            if (window.drawControl) map.removeControl(window.drawControl);
                            var drawnItems = new L.FeatureGroup();
                            map.addLayer(drawnItems);
                            window.drawControl = new L.Control.Draw({
                                draw: {
                                    polygon: {
                                        allowIntersection: false,
                                        showArea: true,
                                        shapeOptions: {
                                            color: '#d32f2f',
                                            fillColor: '#d32f2f',
                                            fillOpacity: 0.25
                                        }
                                    },
                                    marker: false,
                                    polyline: false,
                                    rectangle: false,
                                    circle: false,
                                    circlemarker: false
                                },
                                edit: { featureGroup: drawnItems, edit: false, remove: true }
                            });
                            map.addControl(window.drawControl);
                            map.once(L.Draw.Event.CREATED, function (e) {
                                drawnItems.clearLayers();
                                var layer = e.layer;
                                drawnItems.addLayer(layer);
                                var extensaoGeoJson = layer.toGeoJSON();
                                var novaExtensao = JSON.stringify(extensaoGeoJson.geometry);
                                // Salva no backend
                                fetch('/editar_ponto', {
                                    method: 'POST',
                                    headers: {'Content-Type': 'application/json'},
                                    body: JSON.stringify({codigo: dado.codigo, latitude: dado.latitude, longitude: dado.longitude, extensao_fogo: novaExtensao})
                                })
                                .then(res => res.json())
                                .then(resp => {
                                    if (resp.success) {
                                        showLocalData();
                                    } else {
                                        alert('Erro ao editar extensão: ' + (resp.error || 'Desconhecido'));
                                    }
                                })
                                .catch(() => alert('Erro ao editar extensão.'));
                                map.removeControl(window.drawControl);
                                map.removeLayer(drawnItems);
                            });
                        };
                    }
                });
                marker.on('popupclose', function() {
                    marker.dragging.disable();
                });
            }
        }

        // Função para adicionar marcador do DF com ícone personalizado
        function addDFMarker(dado) {
            // Aceita tanto Latitude/Longitude quanto latitude/longitude
            var lat = parseFloat(dado.Latitude || dado.latitude);
            var lng = parseFloat(dado.Longitude || dado.longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
                var marker = L.marker([lat, lng], {icon: fogoIcon}).addTo(markersLayer);
                var popupContent = `<b>Data:</b> ${dado.DataHora || dado.datahora || ''}<br><b>Município:</b> ${dado.Municipio || dado.municipio || ''}`;
                marker.bindPopup(popupContent);
            } else {
                // Mostra mensagem de debug se não conseguir adicionar marcador
                document.getElementById('debug-msg').innerText = 'Coordenadas inválidas em algum registro do Banco BD.';
            }
        }

        // Função para carregar e exibir dados locais
        function showLocalData() {
            clearMarkers();
            fetch('/dados_local')
                .then(res => res.json())
                .then(dados => {
                    dados.forEach(addLocalMarker);
                });
        }

        // Função para carregar e exibir dados do DF
        function showDFData() {
            clearMarkers();
            fetch('/dados_df')
                .then(res => res.json())
                .then(dados => {
                    if (!dados.length) {
                        document.getElementById('debug-msg').innerText = 'Nenhum dado encontrado no Banco BD.';
                    } else {
                        document.getElementById('debug-msg').innerText = '';
                        dados.forEach(addDFMarker);
                    }
                })
                .catch(e => {
                    document.getElementById('debug-msg').innerText = 'Erro ao carregar dados do Banco BD: ' + e.message;
                });
        }

        // Adiciona botões de seleção no div#controls
        var controlsDiv = document.getElementById('controls');
        if (controlsDiv) {
            controlsDiv.innerHTML = `
                <button id=\"btn-local\">Banco Boca</button>
                <button id=\"btn-df\">Banco BD</button>
            `;
            document.getElementById('btn-local').onclick = showLocalData;
            document.getElementById('btn-df').onclick = showDFData;
            console.log('Botões inseridos com sucesso!');
        } else {
            document.getElementById('debug-msg').innerText = 'Erro: div#controls não encontrado no DOM.';
            console.error('Erro: div#controls não encontrado no DOM.');
        }

        // Exibe dados locais por padrão ao carregar
        showLocalData();
        // Atualiza opções de ano sempre que o usuário alternar para Banco BD
        document.addEventListener('click', function(e) {
            if (e.target && (e.target.id === 'btn-df' || e.target.id === 'btn-local')) {
                // Remover funções relacionadas ao seletor de ano
                // Remover atualizarOpcoesAno, eventos e filtros por ano em showDFData
                function showDFData() {
                    clearMarkers();
                    fetch('/dados_df')
                        .then(res => res.json())
                        .then(dados => {
                            if (!dados.length) {
                                document.getElementById('debug-msg').innerText = 'Nenhum dado encontrado no Banco BD.';
                            } else {
                                document.getElementById('debug-msg').innerText = '';
                                dados.forEach(addDFMarker);
                            }
                        })
                        .catch(e => {
                            document.getElementById('debug-msg').innerText = 'Erro ao carregar dados do Banco BD: ' + e.message;
                        });
                }
            }
        });

        // Após o envio do formulário de upload, atualizar opções de ano
        var form = document.querySelector('form[action="/upload"]');
        if (form) {
            form.addEventListener('submit', function(e) {
                setTimeout(function() {
                    // Remover funções relacionadas ao seletor de ano
                    // Remover atualizarOpcoesAno, eventos e filtros por ano em showDFData
                    function showDFData() {
                        clearMarkers();
                        fetch('/dados_df')
                            .then(res => res.json())
                            .then(dados => {
                                if (!dados.length) {
                                    document.getElementById('debug-msg').innerText = 'Nenhum dado encontrado no Banco BD.';
                                } else {
                                    document.getElementById('debug-msg').innerText = '';
                                    dados.forEach(addDFMarker);
                                }
                            })
                            .catch(e => {
                                document.getElementById('debug-msg').innerText = 'Erro ao carregar dados do Banco BD: ' + e.message;
                            });
                    }
                }, 1000); // Pequeno delay para garantir que o backend já salvou
            });
        }
    } catch (e) {
        document.getElementById('debug-msg').innerText = 'Erro no script: ' + e.message;
        console.error('Erro no script:', e);
    }
}); 