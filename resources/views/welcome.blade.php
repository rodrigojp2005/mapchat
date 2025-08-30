@extends('layouts.visitor')

@section('title', 'MapChat - Adivinhe Onde')

@section('content')
    <div class="question-balloon" id="questionBalloon">
        <div id="questionText">Carregando pergunta...</div>
        <div class="timer" id="timer">30</div>
        <div id="hint" style="display:none; margin-top:8px; color:#3182ce;"></div>
    </div>
    <div id="map"></div>
    <!-- Zoom Controls -->
    <div class="zoom-controls" id="zoomControls">
        <button onclick="zoomIn()">+</button>
        <button onclick="zoomOut()">-</button>
    </div>
@endsection

@push('scripts')
<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBzEzusC_k3oEoPnqynq2N4a0aA3arzH-c&callback=initMap"></script>
@endpush
