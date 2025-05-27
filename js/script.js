document.addEventListener('DOMContentLoaded', function() {

    // --- MENÚ HAMBURGUESA ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNavWrapper = document.querySelector('.main-nav-wrapper');
    const navLinks = document.querySelectorAll('.main-nav-wrapper nav ul li a');

    function toggleMenu() {
        if (mainNavWrapper && menuToggle) {
            mainNavWrapper.classList.toggle('open');
            menuToggle.classList.toggle('open');
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (mainNavWrapper && mainNavWrapper.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // Asegurarse de que el menú se cierre si el tamaño de la ventana cambia (de móvil a desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mainNavWrapper && mainNavWrapper.classList.contains('open')) {
            mainNavWrapper.classList.remove('open');
            menuToggle.classList.remove('open');
        }
    });

    // --- ANIMACIÓN DE REVELACIÓN AL HACER SCROLL ---

    const fadeInElements = document.querySelectorAll('.fade-in-section, .fade-in-item');

    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeInElements.forEach(element => {
        observer.observe(element);
    });

    function checkInitialVisibility() {
        fadeInElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                element.classList.add('is-visible');
                observer.unobserve(element);
            }
        });
    }

    checkInitialVisibility();


    // --- MANEJO BÁSICO DEL FORMULARIO DE CONTACTO (SIMULACIÓN) ---
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            formStatus.classList.remove('success', 'error');
            formStatus.style.display = 'block';
            formStatus.textContent = 'Enviando mensaje...';

            setTimeout(() => {
                const isSuccess = Math.random() > 0.1;

                if (isSuccess) {
                    formStatus.textContent = '¡Mensaje enviado con éxito! Te responderé pronto.';
                    formStatus.classList.add('success');
                    contactForm.reset();
                } else {
                    formStatus.textContent = 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.';
                    formStatus.classList.add('error');
                }
            }, 1500);
        });
    }

    // --- Lógica de Paginación para Categorías de Playlists (AÑADIR ESTO) ---

// Selecciona todas las tarjetas de categoría. Es importante que esta selección
// se haga DESPUÉS de que todas las tarjetas estén consolidadas en un solo .category-grid en el HTML.
const categoryCards = document.querySelectorAll('#playlist-categories .category-grid .playlist-category'); 
const prevCategoryPageBtn = document.getElementById('prevCategoryPage');
const nextCategoryPageBtn = document.getElementById('nextCategoryPage');
const paginationNumbersContainer = document.getElementById('paginationNumbers');

const itemsPerPage = 6; // Cuántas tarjetas mostrar por página. AJUSTA ESTE NÚMERO si quieres más o menos.
let currentPage = 1;
// Calcula el total de páginas basándose en la cantidad de tarjetas y las que se muestran por página
let totalPages = Math.ceil(categoryCards.length / itemsPerPage);

function displayCategoryPage(page) {
    // Asegúrate de que la página no se salga de los límites
    currentPage = Math.max(1, Math.min(page, totalPages));

    // **AÑADIR ESTA LÍNEA:** Guardar el número de página actual en localStorage
    localStorage.setItem('lastCategoryPage', currentPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Oculta todas las tarjetas primero
    categoryCards.forEach(card => {
        card.style.display = 'none';
    });

    // Muestra solo las tarjetas de la página actual
    for (let i = startIndex; i < endIndex && i < categoryCards.length; i++) {
        const card = categoryCards[i];
        card.style.display = 'flex'; // Usamos 'flex' porque tus tarjetas son flexbox
        // Opcional: Si quieres que la animación de fade-in se dispare cada vez que cambias de página
        // Remueve la clase y luego la añade con un pequeño retraso para re-disparar la animación
        // card.classList.remove('fade-in-item', 'is-visible');
        // setTimeout(() => {
        //     card.classList.add('fade-in-item', 'is-visible');
        // }, 50); // Un pequeño retraso para que el navegador "vea" el cambio
    }

    updatePaginationControls();
    updatePageNumbers();
}

function updatePaginationControls() {
    // Deshabilita los botones si no hay páginas previas/siguientes
    if (prevCategoryPageBtn) {
        prevCategoryPageBtn.disabled = currentPage === 1;
    }
    if (nextCategoryPageBtn) {
        nextCategoryPageBtn.disabled = currentPage === totalPages;
    }
}

function updatePageNumbers() {
    if (!paginationNumbersContainer) return; // Salir si el contenedor no existe

    paginationNumbersContainer.innerHTML = ''; // Limpiar números anteriores
    for (let i = 1; i <= totalPages; i++) {
        const pageNumberSpan = document.createElement('span');
        pageNumberSpan.classList.add('page-number');
        pageNumberSpan.textContent = i;
        if (i === currentPage) {
            pageNumberSpan.classList.add('active'); // Marca el número de página actual
        }
        // Añade un evento click a cada número de página
        pageNumberSpan.addEventListener('click', () => displayCategoryPage(i));
        paginationNumbersContainer.appendChild(pageNumberSpan);
    }
}

// Event Listeners para los botones de paginación
if (prevCategoryPageBtn) {
    prevCategoryPageBtn.addEventListener('click', () => {
        displayCategoryPage(currentPage - 1);
    });
}

if (nextCategoryPageBtn) {
    nextCategoryPageBtn.addEventListener('click', () => {
        displayCategoryPage(currentPage + 1);
    });
}

// Inicializar la paginación al cargar la página
// Esto se ejecuta cuando el DOM está completamente cargado y las tarjetas ya existen.
// Asegúrate de que esta llamada a displayCategoryPage(1) no entre en conflicto
// con tu lógica existente de 'fade-in-section' si oculta inicialmente las tarjetas.
// Si tus tarjetas ya están ocultas por 'fade-in-item' y solo se muestran con scroll,
// esta paginación las manejará, pero quizás necesites ajustar la visibilidad inicial de 'fade-in-item'
// para que la primera página sea visible de inmediato.
document.addEventListener('DOMContentLoaded', () => {
    // Recalcular totalPages si las tarjetas se cargan dinámicamente o después del inicio
    totalPages = Math.ceil(categoryCards.length / itemsPerPage);
    if (categoryCards.length > 0) {
        displayCategoryPage(1); // Muestra la primera página al cargar
    }
});

    // --- REPRODUCTOR DE MÚSICA PERSONALIZADO ---

    const audioPlayerSection = document.getElementById('custom-audio-player');
    if (!audioPlayerSection) {
        console.log("No se encontró la sección del reproductor de audio personalizado. Saltando inicialización del reproductor.");
        return;
    }

    const audio = new Audio();
    let currentSongIndex = 0;
    let isPlaying = false;
    let volumeBeforeMute = 1;

    const playerArtwork = document.getElementById('player-artwork');
    const playerTitle = document.getElementById('player-title');
    const playerArtist = document.getElementById('player-artist');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('player-progress-bar');
    const playerSeek = document.getElementById('player-seek');
    const currentTimeSpan = document.getElementById('current-time');
    const durationSpan = document.getElementById('duration');
    const volumeSlider = document.getElementById('volume-slider');
    const muteBtn = document.getElementById('mute-btn');
    const playlistContainer = document.getElementById('playlist');

    

    // La playlist activa que está sonando en el reproductor
    let currentActivePlaylist = [];
    let currentPlaylistName = ''; // Para saber qué playlist está activa

    // --- Funciones del Reproductor (Adaptadas para usar currentActivePlaylist) ---

    function loadSong(songIndex) {
        if (songIndex >= 0 && songIndex < currentActivePlaylist.length) {
            currentSongIndex = songIndex;
            const song = currentActivePlaylist[currentSongIndex]; // Usa currentActivePlaylist
            audio.src = song.src;
            if (playerTitle) playerTitle.textContent = song.title;
            if (playerArtist) playerArtist.textContent = song.artist;
            if (playerArtwork) playerArtwork.src = song.artwork;

            updatePlaylistActiveState();

            // **AÑADIR ESTAS LÍNEAS:** Guardar el índice de la canción actual
            if (currentPlaylistName) { // Asegúrate de que currentPlaylistName esté definido
                localStorage.setItem(`lastPlayedTrackIndex_${currentPlaylistName}`, currentSongIndex);
            }

            if (isPlaying) {
                audio.play();
            } else {
                audio.load();
            }
        }
    }

    function playSong() {
        if (currentActivePlaylist.length === 0) { // Si no hay canciones cargadas, no reproducir
            console.warn("No hay canciones en la playlist activa para reproducir.");
            return;
        }
        isPlaying = true;
        if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        audio.play();
        playPauseBtn.classList.add('active'); // <--- AÑADE ESTA LÍNEA AQUÍ
    }

    function pauseSong() {
        isPlaying = false;
        if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        audio.pause();
        playPauseBtn.classList.remove('active'); // <--- AÑADE ESTA LÍNEA AQUÍ
    }

    function togglePlayPause() {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    }

    function nextSong() {
        if (currentActivePlaylist.length === 0) return; // No hacer nada si no hay canciones
        currentSongIndex = (currentSongIndex + 1) % currentActivePlaylist.length; // Usa currentActivePlaylist
        loadSong(currentSongIndex);
        playSong();
    }

    function prevSong() {
        if (currentActivePlaylist.length === 0) return; // No hacer nada si no hay canciones
        currentSongIndex = (currentSongIndex - 1 + currentActivePlaylist.length) % currentActivePlaylist.length; // Usa currentActivePlaylist
        loadSong(currentSongIndex);
        playSong();
    }

    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function updateProgressBar() {
        const { duration, currentTime } = audio;
        const progressPercent = (currentTime / duration) * 100;
        if (progressBar) progressBar.style.width = `${progressPercent}%`;
        if (playerSeek) playerSeek.value = progressPercent;
        if (currentTimeSpan) currentTimeSpan.textContent = formatTime(currentTime);
        if (durationSpan && !isNaN(duration)) durationSpan.textContent = formatTime(duration);
    }

    function setProgressBar(e) {
        const target = e.target.closest('.progress-bar-container');
        if (!target) return;

        const width = target.offsetWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        if (!isNaN(duration)) {
            audio.currentTime = (clickX / width) * duration;
        }
    }

    function setVolume() {
        if (volumeSlider) {
            audio.volume = volumeSlider.value;
            if (muteBtn) {
                if (audio.volume === 0) {
                    muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                } else if (audio.volume < 0.5) {
                    muteBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
                } else {
                    muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                }
            }
        }
    }

    function toggleMute() {
        if (audio.volume > 0) {
            volumeBeforeMute = audio.volume;
            audio.volume = 0;
            if (volumeSlider) volumeSlider.value = 0;
            if (muteBtn) muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            audio.volume = volumeBeforeMute;
            if (volumeSlider) volumeSlider.value = volumeBeforeMute;
            setVolume();
        }
    }

    // --- Manejo de la Lista de Reproducción (Visualización) - Adaptada ---
    function displayPlaylist() {
        if (!playlistContainer) return;

        playlistContainer.innerHTML = '';
        currentActivePlaylist.forEach((song, index) => { // Usa currentActivePlaylist
            const li = document.createElement('li');
            li.classList.add('playlist-item');
            if (index === currentSongIndex) {
                li.classList.add('active');
            }
            li.innerHTML = `
                <img src="${song.artwork}" alt="${song.title}">
                <div class="song-info">
                    <span class="playlist-title">${song.title}</span><br>
                    <span class="playlist-artist">${song.artist}</span>
                </div>
                <span class="playlist-duration"></span>`;
            li.addEventListener('click', () => {
                loadSong(index);
                playSong();
            });
            playlistContainer.appendChild(li);
        });
    }

    function updatePlaylistActiveState() {
        if (!playlistContainer) return;
        document.querySelectorAll('.playlist-item').forEach((item, index) => {
            if (index === currentSongIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // --- NUEVA FUNCIÓN: Cargar una playlist específica y actualizar el reproductor ---
    function loadAndDisplayPlaylist(playlistName) {
        if (allPlaylists[playlistName]) {
            currentActivePlaylist = allPlaylists[playlistName]; // Establece la playlist activa
            currentPlaylistName = playlistName; // Guarda el nombre de la playlist activa
            currentSongIndex = 0; // Reinicia el índice al cargar una nueva playlist

            displayPlaylist(); // Renderiza la nueva playlist en el contenedor
            loadSong(currentSongIndex); // Carga la primera canción de la nueva playlist
            
            // Habilita los controles si se cargó una playlist
            if (playPauseBtn) playPauseBtn.disabled = false;
            if (prevBtn) prevBtn.disabled = false;
            if (nextBtn) nextBtn.disabled = false;
            if (muteBtn) muteBtn.disabled = false;
            if (volumeSlider) volumeSlider.disabled = false;

        } else {
            console.error(`Playlist '${playlistName}' no encontrada.`);
            // Si la playlist no se encuentra, deshabilita controles y muestra un mensaje
            if (playerTitle) playerTitle.textContent = 'Playlist no encontrada';
            if (playerArtist) playerArtist.textContent = '';
            if (playerArtwork) playerArtwork.src = 'img/default_artwork.jpg';
            if (playPauseBtn) playPauseBtn.disabled = true;
            if (prevBtn) prevBtn.disabled = true;
            if (nextBtn) nextBtn.disabled = true;
            if (muteBtn) muteBtn.disabled = true;
            if (volumeSlider) volumeSlider.disabled = true;
            if (playlistContainer) playlistContainer.innerHTML = '<li class="no-songs">No hay canciones en esta playlist.</li>';
        }
    }

    // --- Event Listeners del Reproductor ---

    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
    if (prevBtn) prevBtn.addEventListener('click', prevSong);
    if (nextBtn) nextBtn.addEventListener('click', nextSong);

    audio.addEventListener('timeupdate', updateProgressBar);
    audio.addEventListener('ended', nextSong);

    // Si nextSong() no existe o no se reproduce una nueva canción, asegúrate de quitar la clase active:
    if (playPauseBtn && !isPlaying) { // Si el reproductor no va a seguir sonando automáticamente
        playPauseBtn.classList.remove('active');
    }

    const progressBarContainer = document.querySelector('.progress-bar-container');
    if (progressBarContainer) {
        progressBarContainer.addEventListener('click', setProgressBar);
    }
    if (playerSeek) {
        playerSeek.addEventListener('input', function() {
            const seekTime = (this.value / 100) * audio.duration;
            if (!isNaN(seekTime)) {
                audio.currentTime = seekTime;
            }
        });
    }

    if (volumeSlider) volumeSlider.addEventListener('input', setVolume);
    if (muteBtn) muteBtn.addEventListener('click', toggleMute);

    audio.addEventListener('loadedmetadata', () => {
        if (durationSpan) durationSpan.textContent = formatTime(audio.duration);
        const activePlaylistItem = playlistContainer ? playlistContainer.querySelector('.playlist-item.active .playlist-duration') : null;
        if (activePlaylistItem && !isNaN(audio.duration)) {
            activePlaylistItem.textContent = formatTime(audio.duration);
        }
    });

    // --- NUEVOS EVENT LISTENERS PARA LOS BOTONES DE CATEGORÍA DE PLAYLISTS ---
    const categoryButtons = document.querySelectorAll('.playlist-category .view-playlist-btn');

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const categoryDiv = this.closest('.playlist-category');
            if (categoryDiv) {
                const playlistName = categoryDiv.dataset.playlistName;
                if (playlistName) {
                    loadAndDisplayPlaylist(playlistName);
                    // Opcional: desplazar la vista al reproductor una vez cargada la playlist
                    audioPlayerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

                     // **AÑADIR ESTA LÍNEA:** Guardar la playlist seleccionada
                    localStorage.setItem('lastPlayedPlaylist', playlistName);
                    // También reinicia el índice de la canción guardada para esa playlist al cargarla nueva
                    localStorage.removeItem(`lastPlayedTrackIndex_${playlistName}`);
                }
            }
        });
    });

    // --- Manejar clics en los títulos de las canciones fuera del reproductor (en la sección de "Explora Mi Colección") ---
    // Este manejador ahora también debe considerar la playlist activa
    document.querySelectorAll('.playable-song').forEach(songTitleSpan => {
        songTitleSpan.addEventListener('click', function(event) {
            event.preventDefault();
            const parentElement = this.closest('[data-src]');
            if (parentElement) {
                const src = parentElement.dataset.src;
                const title = parentElement.dataset.title;
                const artist = parentElement.dataset.artist;
                const artwork = parentElement.dataset.artwork;

                // Encuentra la canción dentro de la playlist actualmente activa
                let songIndex = currentActivePlaylist.findIndex(s => s.src === src);

                if (songIndex === -1) {
                    // Si la canción no está en la playlist activa, la añadimos TEMPORALMENTE a la playlist activa
                    // Esto no modifica la definición original en allPlaylists
                    currentActivePlaylist.push({ src, title, artist, artwork });
                    songIndex = currentActivePlaylist.length - 1;
                    displayPlaylist(); // Vuelve a renderizar la lista para mostrar la canción añadida
                }
                
                loadSong(songIndex);
                playSong();
            }
        });
    });

    // --- Inicialización: Cargar la última playlist guardada o la por defecto ---
    const defaultPlaylistName = Object.keys(allPlaylists)[0]; // Obtén la primera playlist como fallback
    let playlistToLoad = defaultPlaylistName; // Por defecto, carga la primera playlist

    const lastSavedPlaylistName = localStorage.getItem('lastPlayedPlaylist'); // Intenta obtener la última playlist del localStorage

    if (lastSavedPlaylistName && allPlaylists[lastSavedPlaylistName]) {
        // Si hay una playlist guardada y existe en tu colección de playlists
        playlistToLoad = lastSavedPlaylistName;
    } else if (!defaultPlaylistName) {
        // Si no hay ninguna playlist definida en allPlaylists
        console.warn("No hay playlists definidas en allPlaylists. Por favor, define al menos una.");
        // Deshabilitar controles y mostrar mensaje de error si no hay playlists
        if (playerTitle) playerTitle.textContent = 'No hay playlists para cargar';
        if (playerArtist) playerArtist.textContent = '';
        if (playerArtwork) playerArtwork.src = 'img/default_artwork.jpg';
        if (playPauseBtn) playPauseBtn.disabled = true;
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
        if (muteBtn) muteBtn.disabled = true;
        if (volumeSlider) volumeSlider.disabled = true;
        if (playlistContainer) playlistContainer.innerHTML = '<li class="no-songs">No hay playlists definidas.</li>';
        return; // Detiene la ejecución si no hay playlists
    }
    
    // Carga la playlist (ya sea la guardada o la por defecto)
    loadAndDisplayPlaylist(playlistToLoad);

    // Opcional: Cargar la última canción dentro de esa playlist
    const lastSavedSongIndex = localStorage.getItem(`lastPlayedTrackIndex_${playlistToLoad}`);
    if (lastSavedSongIndex !== null && !isNaN(lastSavedSongIndex)) {
        currentSongIndex = parseInt(lastSavedSongIndex);
        loadSong(currentSongIndex); // Carga la canción específica
        // NOTA: No uses playSong() aquí si no quieres que empiece a sonar automáticamente.
        // Si quieres que empiece a sonar si estaba sonando antes, necesitarías guardar
        // también el estado de `isPlaying`. Por ahora, solo carga la canción.
    } else {
        currentSongIndex = 0; // Si no hay índice guardado, o es inválido, empieza por la primera canción
        loadSong(currentSongIndex); // Carga la primera canción de la playlist
    }

    // Inicializar la paginación de categorías al cargar la página
    // Asegúrate de que esto se ejecute después de que categoryCards haya sido definido
    // Inicializar la paginación de categorías al cargar la página
totalPages = Math.ceil(categoryCards.length / itemsPerPage); // Calcula el total de páginas

let pageToLoad = 1; // Por defecto, la página 1
if (categoryCards.length > 0) { // Solo intenta cargar si hay categorías
    const lastSavedCategoryPage = localStorage.getItem('lastCategoryPage');
    if (lastSavedCategoryPage !== null) {
        const parsedPage = parseInt(lastSavedCategoryPage);
        // Asegúrate de que es un número y está dentro del rango de páginas válidas
        if (!isNaN(parsedPage) && parsedPage >= 1 && parsedPage <= totalPages) {
            pageToLoad = parsedPage;
        }
    }
}
// Llama a displayCategoryPage con la página determinada (guardada o por defecto)
// Esto mostrará las tarjetas correctas y actualizará los controles de paginación.
displayCategoryPage(pageToLoad);


// --- Lógica para "Recomendaciones de Estela" ---
document.addEventListener('DOMContentLoaded', () => {
    const recommendationButtons = document.querySelectorAll('.play-recommendation-btn');

    recommendationButtons.forEach(button => {
        button.addEventListener('click', () => {
            const playlistName = button.dataset.playlistName; // Obtiene el nombre de la playlist del atributo data-playlist-name

            if (allPlaylists[playlistName]) {
                // Modificación aquí: Usar loadAndDisplayPlaylist() que ya tienes
                loadAndDisplayPlaylist(playlistName); // Esta función ya maneja currentActivePlaylist y currentPlaylistName
                playSong(); // Inicia la reproducción después de cargar la playlist
                // Opcional: Desplázate al reproductor si está en otra parte de la página
                document.getElementById('player-section').scrollIntoView({ behavior: 'smooth' });

                // **AÑADIR ESTA LÍNEA:** Guardar la playlist seleccionada para recordar
                localStorage.setItem('lastPlayedPlaylist', playlistName);
                // También reinicia el índice de la canción guardada para esa playlist al cargarla nueva
                localStorage.removeItem(`lastPlayedTrackIndex_${playlistName}`);

            } else {
                console.error(`Playlist '${playlistName}' no encontrada en data.js`);
                alert('La playlist solicitada no está disponible.');
            }
        });
    });
});
});