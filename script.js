// --------------------------------------
// Déplacement aléatoire et animation de secousse pour les boutons
// --------------------------------------
function moveButton(btn) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const btnWidth = btn.offsetWidth;
    const btnHeight = btn.offsetHeight;
    const randomX = Math.random() * (viewportWidth - btnWidth);
    const randomY = Math.random() * (viewportHeight - btnHeight);
    btn.style.position = "absolute";
    btn.style.left = randomX + "px";
    btn.style.top = randomY + "px";
}

function moveButtonWithShake(btn) {
    // Ajoute une animation de secousse au bouton
    btn.classList.add("wiggle");
    setTimeout(() => btn.classList.remove("wiggle"), 500);

    // Déplace le bouton vers une position aléatoire
    moveButton(btn);
}

// --------------------------------------
// Fonctions pour jouer les sons click/hover
// --------------------------------------
function getClickSoundPath() {
    if (window.location.pathname.includes("/Folder/")) {
        return "click.mp3";
    } else {
        return "Folder/click.mp3";
    }
}

function playClickSound() {
    var audioPath = getClickSoundPath();
    console.log("Tentative de lecture du son click depuis : " + audioPath);
    var audio = new Audio(audioPath);
    audio.play().catch(e => console.error("Erreur lors de la lecture du son click :", e));
}

function getHoverSoundPath() {
    if (window.location.pathname.includes("/Folder/")) {
        return "hover.mp3";
    } else {
        return "Folder/hover.mp3";
    }
}

function playHoverSound() {
    var audioPath = getHoverSoundPath();
    var audio = new Audio(audioPath);
    audio.play().catch(e => console.error("Erreur lors de la lecture du son hover :", e));
}

// --------------------------------------
// Fonction pour sauvegarder la musique
// --------------------------------------
function saveMusicTime() {
    var audio = document.getElementById("backgroundMusic");
    if (audio) {
        localStorage.setItem("lukremboTime", audio.currentTime);
    }
}

// --------------------------------------
// Redirections (ordinateur)
// --------------------------------------
function nextConfirm() {
    saveMusicTime();
    window.location.href = "Folder/confirm.html";
}

function nextYes() {
    saveMusicTime();
    window.location.href = "yes.html";
}

function goBack() {
    saveMusicTime();
    window.location.href = "../kamilla.html";
}

// --------------------------------------
// Musique de fond (lukrembo)
// --------------------------------------
function getMusicPath() {
    if (window.location.pathname.includes("/Folder/")) {
        return "lukrembo.mp3";
    } else {
        return "Folder/lukrembo.mp3";
    }
}

function initBackgroundMusic() {
    var audio = document.getElementById("backgroundMusic");
    if (!audio) {
        audio = document.createElement("audio");
        audio.id = "backgroundMusic";
        audio.src = getMusicPath();
        audio.loop = true;
        audio.volume = 1.0;
        audio.autoplay = true;
        audio.muted = true;
        audio.setAttribute("playsinline", "true");
        audio.style.display = "none";
        document.body.appendChild(audio);

        audio.addEventListener("playing", function () {
            var playBtn = document.getElementById("playButton");
            if (playBtn) playBtn.innerHTML = " II ";
        });

        audio.addEventListener("pause", function () {
            var playBtn = document.getElementById("playButton");
            if (playBtn) playBtn.innerHTML = "►";
        });
    }

    var savedTime = localStorage.getItem("lukremboTime");
    audio.currentTime = savedTime ? parseFloat(savedTime) : 0;

    audio.play().then(function () {
        setTimeout(() => {
            audio.muted = false;
        }, 500);
    }).catch(function (e) {
        console.error("Erreur de lecture de la musique :", e);
    });
}

// --------------------------------------
// Ajout des interactions pour mobiles
// --------------------------------------
function addMobileInteractions() {
    const noButton = document.getElementById("noButton");
    const backButton = document.getElementById("backButton");

    if (noButton) {
        noButton.addEventListener("touchstart", function (event) {
            event.preventDefault();
            playHoverSound();
            moveButtonWithShake(noButton);
        });
    }

    if (backButton) {
        backButton.addEventListener("touchstart", function (event) {
            event.preventDefault();
            playHoverSound();
            moveButtonWithShake(backButton);
        });
    }
}

// --------------------------------------
// Création d'un bouton de contrôle de la musique
// --------------------------------------
function createPlayButton() {
    if (document.getElementById("playButton")) return;

    var playBtn = document.createElement("button");
    playBtn.id = "playButton";
    playBtn.innerHTML = "►";

    playBtn.style.position = "fixed";
    playBtn.style.bottom = "10px";
    playBtn.style.right = "10px";
    playBtn.style.padding = "10px 15px";
    playBtn.style.backgroundColor = "#ff6b81";
    playBtn.style.color = "white";
    playBtn.style.border = "none";
    playBtn.style.borderRadius = "5px";
    playBtn.style.cursor = "pointer";
    playBtn.style.zIndex = "1000";

    document.body.appendChild(playBtn);

    playBtn.addEventListener("click", function () {
        var audio = document.getElementById("backgroundMusic");
        if (audio) {
            if (audio.paused || audio.muted) {
                audio.muted = false;
                audio.play().then(() => {
                    playBtn.innerHTML = " II ";
                }).catch(e => console.error("Erreur lors de la lecture de la musique :", e));
            } else {
                audio.pause();
                playBtn.innerHTML = "►";
            }
        }
    });
}

// --------------------------------------
// Initialisation globale
// --------------------------------------
window.addEventListener("load", function () {
    initBackgroundMusic();
    createPlayButton();

    // Gestion des interactions mobiles
    if ("ontouchstart" in window) {
        addMobileInteractions();
    }

    // Gestion pour ordinateur (hover avec déplacement)
    const noButton = document.getElementById("noButton");
    const backButton = document.getElementById("backButton");

    if (noButton) {
        noButton.addEventListener("mouseover", function () {
            playHoverSound();
            moveButton(noButton);
        });
    }

    if (backButton) {
        backButton.addEventListener("mouseover", function () {
            playHoverSound();
            moveButton(backButton);
        });
    }

    // Débloquer la musique via un clic global
    document.body.addEventListener("click", function () {
        var audio = document.getElementById("backgroundMusic");
        if (audio && audio.muted) {
            audio.muted = false;
            audio.play();
        }
    }, { once: true });
});
