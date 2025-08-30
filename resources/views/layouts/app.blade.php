<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @stack('styles')
    </head>
    <body class="font-sans antialiased">
        <!-- Navigation Bar -->
        <nav class="w-full bg-white flex items-center justify-between px-6 md:px-12 h-14 shadow fixed top-0 left-0 z-50">
            <div class="flex items-center">
                <img src="https://img.icons8.com/ios-filled/50/000000/chat.png" alt="Logo" class="h-8 mr-3">
                <span class="font-bold text-lg text-blue-600 tracking-wide">mapchat</span>
            </div>
            <div class="hidden md:flex items-center space-x-6 pr-2" id="navbarRight">
                <a href="#sobre" class="text-gray-700 font-medium hover:text-blue-600">Sobre</a>
                <a href="#como-jogar" class="text-gray-700 font-medium hover:text-blue-600">Como jogar</a>
                @auth
                    <a href="{{ route('dashboard') }}" class="bg-blue-600 text-white rounded px-4 py-1 font-semibold ml-2 hover:bg-blue-700 transition">Dashboard</a>
                    <form method="POST" action="{{ route('logout') }}" class="inline">
                        @csrf
                        <button type="submit" class="ml-2 bg-gray-200 text-gray-700 rounded px-3 py-1 font-semibold hover:bg-gray-300 transition">Sair</button>
                    </form>
                @else
                    <a href="/login" class="bg-blue-600 text-white rounded px-4 py-1 font-semibold ml-2 hover:bg-blue-700 transition">Entrar</a>
                @endauth
            </div>
            <div class="md:hidden flex items-center">
                <button id="navbarMenu" onclick="toggleMenu()" class="focus:outline-none p-2 rounded hover:bg-gray-100">
                    <svg class="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
            </div>
            <div class="absolute right-2 top-14 w-48 bg-white rounded shadow-lg flex-col items-end py-2 space-y-1 z-50 hidden" id="mobileMenu">
                <a href="#sobre" class="block px-4 py-2 text-gray-700 hover:text-blue-600">Sobre</a>
                <a href="#como-jogar" class="block px-4 py-2 text-gray-700 hover:text-blue-600">Como jogar</a>
                @auth
                    <a href="{{ route('dashboard') }}" class="block px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Dashboard</a>
                    <form method="POST" action="{{ route('logout') }}" class="block px-4 py-2">
                        @csrf
                        <button type="submit" class="w-full text-left text-gray-700">Sair</button>
                    </form>
                @else
                    <a href="/login" class="block px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Entrar</a>
                @endauth
            </div>
        </nav>

        <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
            <main>
                @yield('content')
            </main>
        </div>

        <!-- Footer -->
        <footer class="w-full bg-white text-gray-700 text-center py-3 text-base fixed left-0 bottom-0 z-40 shadow">
            mapchat 2025 @ vc sabe onde está? direitos reservados. 
        </footer>

        <script>
            function toggleMenu() {
                const menu = document.getElementById('mobileMenu');
                menu.classList.toggle('hidden');
            }
        </script>
        @stack('scripts')
    </body>
</html>
