let map;
let currentQuestion = null;
// Perguntas mockadas para teste local sem API
const mockQuestions = [
    {
        id: 1,
        question_text: 'Onde fica o Cristo Redentor?',
        category: 'Ponto turístico',
        hint: 'Fica no Rio de Janeiro',
        answer_lat: -22.9519,
        answer_lng: -43.2105,
        user_name: 'anônimo'
    },
    {
        id: 2,
        question_text: 'Onde está a Praça dos Três Poderes?',
        category: 'Praça',
        hint: 'Fica na capital do Brasil',
        answer_lat: -15.7997,
        answer_lng: -47.8645,
        user_name: 'anônimo'
    },
    {
        id: 3,
        question_text: 'Em que cidade está o Mercado Ver-o-Peso?',
        category: 'Mercado',
        hint: 'Fica no Norte do Brasil',
        answer_lat: -1.4521,
        answer_lng: -48.5044,
        user_name: 'anônimo'
    }
];
let mockIndex = 0;
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
        gestureHandling: 'greedy', // Permite arrastar com um dedo no mobile
    });
    fetchQuestion();
    map.addListener('click', onMapClick);
    // Controles de zoom agora são botões fixos, não precisam de toggle JS
}

function fetchQuestion() {
    // Seleciona pergunta mockada
    if (mockQuestions.length === 0) {
        document.getElementById('questionText').innerText = 'Nenhuma pergunta disponível.';
        return;
    }
    currentQuestion = mockQuestions[mockIndex];
    console.log('Pergunta carregada:', currentQuestion);
    document.getElementById('questionText').innerText = currentQuestion.question_text;
    document.getElementById('hint').style.display = 'block';
    document.getElementById('hint').innerHTML = `<b>Pergunta criada:</b> ${currentQuestion.user_name ? currentQuestion.user_name : 'anônimo'}`;
    attempts = 0;
    updateAttemptsDisplay();
    resetTimer();
    removerBotaoProximaPergunta();
    mockIndex = (mockIndex + 1) % mockQuestions.length;
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
    // Validação no frontend
    const answerLat = currentQuestion.answer_lat;
    const answerLng = currentQuestion.answer_lng;
    console.log('Palpite recebido:', { lat, lng });
    console.log('Resposta correta:', { answerLat, answerLng });
    const distance = haversine(lat, lng, answerLat, answerLng);
    const isCorrect = distance < 10; // 10km de tolerância
    const direction = getDirection(lat, lng, answerLat, answerLng);
    console.log('Distância calculada:', distance.toFixed(2), 'km');
    console.log('Direção:', direction);

    let title, html, imageUrl = '';
    if (isCorrect) {
        title = '🎉 Parabéns! Você acertou!';
        html = `<div style='font-size:1.1em;'>Você acertou a localização!<br><b>Distância:</b> ${distance.toFixed(2)} km<br><b>Direção:</b> ${direction}</div>`;
        imageUrl = 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHRrN3c5aWwxNnI5eWhua2k2OW4za3ZxMG9neDQwY2NpODNqdjFpMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qHaKRvrEA00Hm/giphy.gif';
        clearInterval(timerInterval);
        mostrarBotaoProximaPergunta();
        console.log('Resultado: ACERTOU');
    } else {
        title = 'Tente novamente!';
        html = `<div style='font-size:1.1em;'>Errou!<br><b>Distância:</b> ${distance.toFixed(2)} km<br><b>Direção:</b> ${direction}</div>`;
        imageUrl = 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmtrYnB0bTNyYm03eDZ3bmhlc3dxZWJncXh3a24zOTlkNWJqbnc3OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SB0NySeYf268N2Nhv7/giphy.gif';
        if (attempts >= maxAttempts) {
            html += '<br><b>Limite de tentativas atingido!</b>';
            clearInterval(timerInterval);
            mostrarBotaoProximaPergunta();
        }
        console.log('Resultado: ERROU');
    }
    if (typeof Swal !== 'undefined' && typeof Swal.fire === 'function') {
        Swal.fire({
            title: title,
            html: html,
            imageUrl: imageUrl,
            imageHeight: 180,
            confirmButtonText: 'OK',
            customClass: {
                popup: 'rounded-lg',
                confirmButton: 'bg-blue-600 text-white px-6 py-2 rounded font-bold',
            },
        });
    } else {
        alert(title + '\n' + html.replace(/<[^>]+>/g, ''));
    }
}

// Fórmula de Haversine para calcular distância entre dois pontos
function haversine(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return earthRadius * c;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

// Retorna direção cardinal aproximada
function getDirection(lat1, lon1, lat2, lon2) {
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    const angle = Math.atan2(dLon, dLat) * 180 / Math.PI;
    const directions = ['Norte', 'Nordeste', 'Leste', 'Sudeste', 'Sul', 'Sudoeste', 'Oeste', 'Noroeste'];
    const index = Math.round(((angle + 360) % 360) / 45) % 8;
    return directions[index];
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
    if (attemptsSpan) {
        // Só limpa a contagem se for a última pergunta do ciclo
        if (attempts >= maxAttempts && mockIndex === 0) {
            attemptsSpan.innerText = '';
        } else {
            attemptsSpan.innerText = `${attempts + 1}/${maxAttempts}`;
        }
    }
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
