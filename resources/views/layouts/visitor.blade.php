<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'MapChat')</title>
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">
    <link rel="stylesheet" href="/css/welcome.css">
    @stack('styles')
</head>
<body>
    <!-- Navigation Bar -->
    <nav class="navbar">
        <div class="navbar-left">
            <img src="https://img.icons8.com/ios-filled/50/000000/chat.png" alt="Logo" class="logo">
            <span class="platform-name">mapchat</span>
        </div>
        <div class="navbar-right" id="navbarRight">
            <a href="#sobre">Sobre</a>
            <a href="#como-jogar">Como jogar</a>
            <a href="/login" class="btn-entrar">Entrar</a>
        </div>
        <div class="navbar-menu" id="navbarMenu" onclick="toggleMenu()">
            <span></span><span></span><span></span>
        </div>
    </nav>

    @yield('content')

    <!-- Footer -->
    <footer class="footer">
        mapchat 2025 @ vc sabe onde está? direitos reservados.
    </footer>

    <script src="/js/welcome.js"></script>
    <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBzEzusC_k3oEoPnqynq2N4a0aA3arzH-c&callback=initMap"></script>
    @stack('scripts')
</body>
</html>
