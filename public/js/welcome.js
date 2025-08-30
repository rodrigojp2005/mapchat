let map;
let currentQuestion = null;
let timerInterval = null;
let timeLeft = 30;
let attempts = 0;
let maxAttempts = 5;
let marker = null;

function initMap() {
    const mapDiv = document.getElementById('map');
    if (!mapDiv) {
        console.error('Elemento #map não encontrado!');
        return;
    }
    map = new google.maps.Map(mapDiv, {
        center: { lat: -14.2350, lng: -51.9253 }, // Centro do Brasil
        zoom: 4,
        disableDefaultUI: true,
    });
    fetchQuestion();
    map.addListener('click', onMapClick);
    // Controles de zoom agora são botões fixos, não precisam de toggle JS
}

function fetchQuestion() {
    fetch('/api/question/random')
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                document.getElementById('questionText').innerText = data.error;
                return;
            }
            currentQuestion = data;
            document.getElementById('questionText').innerText = data.question_text;
            // Exibe o nome do usuário que criou a pergunta
            document.getElementById('hint').style.display = 'block';
            document.getElementById('hint').innerText = 'Pergunta criada por: ' + (data.user_name ? data.user_name : 'anônimo');
            attempts = 0;
            updateAttemptsDisplay();
            resetTimer();
            removerBotaoProximaPergunta();
        })
        .catch(() => {
            document.getElementById('questionText').innerText = 'Erro ao carregar pergunta.';
        });
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 30;
    document.getElementById('timer').innerText = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.getElementById('questionText').innerText = 'Tempo esgotado!';
            mostrarBotaoProximaPergunta();
        }
    }, 1000);
}


function onMapClick(event) {
    if (!currentQuestion || timeLeft <= 0 || attempts >= maxAttempts) return;
    attempts++;
    updateAttemptsDisplay();
    placeMarker(event.latLng);
    enviarPalpite(event.latLng.lat(), event.latLng.lng());
}


function enviarPalpite(lat, lng) {
    fetch('/api/question/guess', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            question_id: currentQuestion.id,
            lat: lat,
            lng: lng
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.correct) {
            document.getElementById('questionText').innerText = 'Parabéns! Você acertou!';
            clearInterval(timerInterval);
            mostrarBotaoProximaPergunta();
        } else {
            let msg = `Errou! Distância: ${data.distance} km. Dica: ${data.direction}`;
            if (attempts >= maxAttempts) {
                msg += '\nLimite de tentativas atingido!';
                clearInterval(timerInterval);
                mostrarBotaoProximaPergunta();
            }
            document.getElementById('questionText').innerText = msg;
        }
    })
    .catch(async (err) => {
        let msg = 'Erro ao validar palpite.';
        try {
            const res = err instanceof Response ? err : null;
            if (res && res.json) {
                const data = await res.json();
                if (data && data.message) msg += '\n' + data.message;
            }
        } catch (e) {}
        document.getElementById('questionText').innerText = msg;
        mostrarBotaoProximaPergunta();
    });
}


function mostrarBotaoProximaPergunta() {
    let balloon = document.getElementById('questionBalloon');
    if (!document.getElementById('btnProximaPergunta')) {
        let btn = document.createElement('button');
        btn.id = 'btnProximaPergunta';
        btn.innerText = 'Próxima pergunta';
        btn.className = 'mt-2 bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition';
        btn.onclick = function() {
            btn.remove();
            fetchQuestion();
        };
        balloon.appendChild(btn);
    }
}

function removerBotaoProximaPergunta() {
    let btn = document.getElementById('btnProximaPergunta');
    if (btn) btn.remove();
}

function updateAttemptsDisplay() {
    let attemptsSpan = document.getElementById('attemptsDisplay');
    if (!attemptsSpan) {
        // Cria o elemento se não existir
        let balloon = document.getElementById('questionBalloon');
        attemptsSpan = document.createElement('span');
        attemptsSpan.id = 'attemptsDisplay';
        attemptsSpan.className = 'text-sm text-gray-600 text-right';
        balloon.appendChild(attemptsSpan);
    }
    attemptsSpan.innerText = `${attempts + 1}/${maxAttempts}`;
}

function placeMarker(location) {
    if (marker) marker.setMap(null);
    marker = new google.maps.Marker({
        position: location,
        map: map,
    });
}

function zoomIn() {
    if (map) map.setZoom(map.getZoom() + 1);
}
function zoomOut() {
    if (map) map.setZoom(map.getZoom() - 1);
}

function toggleMenu() {
    const nav = document.getElementById('navbarRight');
    nav.classList.toggle('active');
}
