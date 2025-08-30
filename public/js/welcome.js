let map;
let currentQuestion = null;
let timerInterval = null;
let timeLeft = 30;
let attempts = 0;
let maxAttempts = 3;
let marker = null;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -14.2350, lng: -51.9253 }, // Centro do Brasil
        zoom: 4,
        disableDefaultUI: true,
    });
    fetchQuestion();
    map.addListener('click', onMapClick);
    // Mostrar controles de zoom apenas em desktop
    if (window.innerWidth > 700) {
        document.getElementById('zoomControls').style.display = 'flex';
    } else {
        document.getElementById('zoomControls').style.display = 'none';
    }
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
            document.getElementById('hint').style.display = data.hint ? 'block' : 'none';
            document.getElementById('hint').innerText = data.hint || '';
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
