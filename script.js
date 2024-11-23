document.addEventListener('DOMContentLoaded', () => {
    feather.replace();

    const playPauseButton = document.getElementById('play-pause');
    const audio = document.getElementById('audio');
    const songDuration = document.getElementById('song-duration');
    const lyricsContainer = document.getElementById('lyrics-container');
    let intervalId;

    // Menggabungkan waktu transisi foto dengan lirik
    const contentTimeline = [
        { time: 0.7, text: "Melihat tawamu", photoIndex: 0 },
        { time: 3.8, text: "Mendengar senandungmu", photoIndex: 1 },
        { time: 7.4, text: "Terlihat jelas di mataku", photoIndex: 2 },
        { time: 10.7, text: "Warna-warna indahmu", photoIndex: 3 },
        { time: 13.8, text: "Menatap langkahmu", photoIndex: 4 },
        { time: 17.10, text: "Meratapi kisah hidupmu", photoIndex: 5 },
        { time: 20.7, text: "Terlihat jelas bahwa hatimu", photoIndex: 6 },
        { time: 23.8, text: "Anugrah terindah yang pernah kumiliki", photoIndex: 7 },
        { time: 29, text: "Anugrah Terindah-SO7", photoIndex: 8 },
        { time: 32, text: "Maaf ya kalau alay atau lagunya kurang bikin nyaman. jujur bingung mau pake lagu apa", photoIndex: 9 },
    ];

    playPauseButton.addEventListener('click', () => {
        togglePlay();
    });

    function togglePlay() {
        if (audio.paused) {
            audio.play();
            playPauseButton.innerHTML = '<i data-feather="pause"></i>';
            feather.replace();
            displayDuration();
            syncContent();
        } else {
            audio.pause();
            playPauseButton.innerHTML = '<i data-feather="play"></i>';
            feather.replace();
            clearInterval(intervalId);
        }
    }

    function displayDuration() {
        audio.addEventListener('loadedmetadata', () => {
            songDuration.textContent = formatTime(audio.duration);
        });

        audio.addEventListener('timeupdate', () => {
            const currentTime = formatTime(audio.currentTime);
            const duration = formatTime(audio.duration);
            songDuration.textContent = currentTime + ' / ' + duration;
        });
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    const rightPages = document.querySelectorAll('.right-page');
    let currentPage = 0;

    function showPage(pageIndex) {
        rightPages.forEach((page, index) => {
            if (index === pageIndex) {
                page.style.transform = 'rotateY(0deg)';
                page.style.zIndex = 2;
                page.style.visibility = 'visible';
            } else if (index < pageIndex) {
                page.style.transform = 'rotateY(-180deg)';
                page.style.zIndex = 1;
                page.style.visibility = 'visible';
            } else {
                page.style.transform = 'rotateY(0deg)';
                page.style.zIndex = 0;
                page.style.visibility = 'visible';
            }
        });
    }

    function syncContent() {
        // Clear any existing interval
        if (intervalId) clearInterval(intervalId);

        intervalId = setInterval(() => {
            const currentTime = audio.currentTime;
            
            // Find the current content based on time
            const currentContent = contentTimeline.reduce((prev, curr) => {
                if (currentTime >= curr.time) return curr;
                return prev;
            }, contentTimeline[0]);

            // Update lyrics and photo
            if (currentContent) {
                lyricsContainer.textContent = currentContent.text;
                showPage(currentContent.photoIndex);
            }
        }, 100); // Check more frequently for smoother transitions
    }

    // Preload images and show initial state
    function preloadImages() {
        return Promise.all(Array.from(rightPages).map(page => {
            const img = page.querySelector('img');
            return new Promise((resolve) => {
                if (img.complete) {
                    resolve();
                } else {
                    img.onload = resolve;
                }
            });
        }));
    }

    // Initialize
    preloadImages().then(() => {
        showPage(0);
    });

    // Reset when audio ends
    audio.addEventListener('ended', () => {
        playPauseButton.innerHTML = '<i data-feather="play"></i>';
        feather.replace();
        clearInterval(intervalId);
        showPage(0);
    });
});