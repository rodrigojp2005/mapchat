let map;
let currentQuestion = null;
let timerInterval = null;
let timeLeft = 30;
let attempts = 0;
let maxAttempts = 3;
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
            resetTimer();
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
        }
    }, 1000);
}

function onMapClick(event) {
    if (!currentQuestion || timeLeft <= 0 || attempts >= maxAttempts) return;
    attempts++;
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
        } else {
            let msg = `Errou! Distância: ${data.distance} km. Dica: ${data.direction}`;
            if (attempts >= maxAttempts) {
                msg += '\nLimite de tentativas atingido!';
                clearInterval(timerInterval);
            }
            document.getElementById('questionText').innerText = msg;
        }
    })
    .catch(() => {
        document.getElementById('questionText').innerText = 'Erro ao validar palpite.';
    });
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
