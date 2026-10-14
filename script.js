const weddingDate = new Date("2026-12-10T19:30:00").getTime();

const intro = document.getElementById("intro");
const invite = document.getElementById("invite");
const bgm = document.getElementById("bgm");
const musicBtn = document.getElementById("musicBtn");

const daysElement = document.getElementById("d");
const hoursElement = document.getElementById("h");
const minutesElement = document.getElementById("m");
const secondsElement = document.getElementById("s");

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

let inviteOpened = false;
let revealObserver = null;

function syncMusicButton(isPlaying) {
  if (isPlaying) {
    musicBtn.textContent = "♫";
    musicBtn.setAttribute("aria-label", "Pause background music");
    musicBtn.classList.add("is-playing");
  } else {
    musicBtn.textContent = "▷";
    musicBtn.setAttribute("aria-label", "Play background music");
    musicBtn.classList.remove("is-playing");
  }
}

function revealHero() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  requestAnimationFrame(() => {
    hero.classList.add("is-revealed");
  });
}

function initScrollReveals() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!revealElements.length) return;

  if (prefersReducedMotion) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
    return;
  }

  if (revealObserver) {
    revealObserver.disconnect();
  }

  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

function openInvite() {
  if (inviteOpened || !document.body.contains(intro)) return;

  inviteOpened = true;
  invite.hidden = false;
  invite.classList.add("is-open");

  intro.classList.add("hide");

  revealHero();
  initScrollReveals();

  setTimeout(() => {
    if (intro.parentNode) {
      intro.remove();
    }
  }, 1000);

  bgm
    .play()
    .then(() => {
      syncMusicButton(true);
    })
    .catch(() => {
      syncMusicButton(false);
    });
}

function toggleMusic() {
  if (bgm.paused) {
    bgm
      .play()
      .then(() => {
        syncMusicButton(true);
      })
      .catch(() => {
        syncMusicButton(false);
      });
  } else {
    bgm.pause();
    syncMusicButton(false);
  }
}

function addLeadingZero(number) {
  return String(number).padStart(2, "0");
}

function updateCountdown() {
  const now = Date.now();
  const timeRemaining = weddingDate - now;

  if (timeRemaining <= 0) {
    daysElement.textContent = "00";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";
    return;
  }

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

  const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);

  const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);

  const seconds = Math.floor((timeRemaining / 1000) % 60);

  daysElement.textContent = addLeadingZero(days);
  hoursElement.textContent = addLeadingZero(hours);
  minutesElement.textContent = addLeadingZero(minutes);
  secondsElement.textContent = addLeadingZero(seconds);
}

updateCountdown();

setInterval(updateCountdown, 1000);

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && document.body.contains(intro)) {
    openInvite();
  }
});

if (prefersReducedMotion && intro) {
  intro.style.animation = "none";
}
