/* =========================================================
   TECHSPARK 2.0  —  script.js
   Plain JavaScript only. No libraries.
   ---------------------------------------------------------
   1.  Event date  <-- change the date here
   2.  Hamburger menu
   3.  Navbar shadow on scroll
   4.  Countdown timer
   5.  Active menu link
   6.  Smooth scrolling
   7.  Event rows open and close
   8.  Schedule day tabs
   9.  Reveal on scroll
   10. Counting figures
   11. Form validation
   12. Back to top
   13. Footer year
   ========================================================= */


/* =========================================================
   1. EVENT DATE
   Format: Year, Month - 1, Day, Hour, Minute
   Months start at 0, so 11 = December and 0 = January.
   ========================================================= */
var EVENT_DATE = new Date(2026, 9, 16, 9, 0, 0);    // 16 October 2026, 9:00 AM
var EVENT_OVER = "TechSpark 2.0 is under way. See you on campus.";


/* =========================================================
   2. HAMBURGER MENU
   ========================================================= */
var burger = document.getElementById('burger');
var menu = document.getElementById('menu');

burger.addEventListener('click', function () {
  var open = menu.classList.toggle('open');
  burger.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

// Close the menu after tapping a link inside it
var menuLinks = menu.querySelectorAll('a');
for (var i = 0; i < menuLinks.length; i++) {
  menuLinks[i].addEventListener('click', closeMenu);
}

// Close it with the Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeMenu();
});

function closeMenu() {
  menu.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Open menu');
}


/* =========================================================
   3. NAVBAR SHADOW ON SCROLL
   ========================================================= */
var nav = document.getElementById('nav');

function updateNav() {
  if (window.scrollY > 30) {
    nav.classList.add('stuck');
  } else {
    nav.classList.remove('stuck');
  }
}


/* =========================================================
   4. COUNTDOWN TIMER
   ========================================================= */
var dd = document.getElementById('dd');
var hh = document.getElementById('hh');
var mm = document.getElementById('mm');
var ss = document.getElementById('ss');
var clockNote = document.getElementById('clockNote');

function updateClock() {
  var gap = EVENT_DATE.getTime() - new Date().getTime();   // milliseconds left

  if (gap <= 0) {
    dd.textContent = '00';
    hh.textContent = '00';
    mm.textContent = '00';
    ss.textContent = '00';
    clockNote.textContent = EVENT_OVER;
    return;
  }

  var days = Math.floor(gap / (1000 * 60 * 60 * 24));
  var hours = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var mins = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
  var secs = Math.floor((gap % (1000 * 60)) / 1000);

  dd.textContent = pad(days);
  hh.textContent = pad(hours);
  mm.textContent = pad(mins);
  ss.textContent = pad(secs);
}

// Turns 7 into "07" so the digits do not jump about
function pad(n) { return n < 10 ? '0' + n : '' + n; }

updateClock();
setInterval(updateClock, 1000);


/* =========================================================
   5. ACTIVE MENU LINK
   ========================================================= */
var links = document.querySelectorAll('.menu-link');

function updateActive() {
  var pos = window.scrollY + 150;

  for (var i = 0; i < links.length; i++) {
    var id = links[i].getAttribute('href').replace('#', '');
    var sec = document.getElementById(id);
    if (!sec) continue;

    var top = sec.offsetTop;
    var bottom = top + sec.offsetHeight;

    if (pos >= top && pos < bottom) {
      links[i].classList.add('active');
    } else {
      links[i].classList.remove('active');
    }
  }
}


/* =========================================================
   6. SMOOTH SCROLLING
   The CSS already does this. This is a backup for old browsers.
   ========================================================= */
var anchors = document.querySelectorAll('a[href^="#"]');

for (var a = 0; a < anchors.length; a++) {
  anchors[a].addEventListener('click', function (e) {
    var id = this.getAttribute('href');
    if (id === '#' || id.length < 2) return;

    var target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    var top = target.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });
}


/* =========================================================
   7. EVENT CARDS OPEN AND CLOSE
   ========================================================= */
var rows = document.querySelectorAll('.card-btn');

for (var r = 0; r < rows.length; r++) {
  rows[r].addEventListener('click', function () {
    var item = this.closest('.card');
    var open = item.classList.toggle('open');
    this.setAttribute('aria-expanded', open);
    this.querySelector('.ct').textContent = open ? 'Hide details' : 'View details';
  });
}


/* =========================================================
   8. SCHEDULE DAY TABS
   ========================================================= */
var days = document.querySelectorAll('.day');
var panels = document.querySelectorAll('[data-panel]');

for (var d = 0; d < days.length; d++) {
  days[d].addEventListener('click', function () {
    var day = this.getAttribute('data-day');

    for (var j = 0; j < days.length; j++) {
      days[j].classList.remove('active');
      days[j].setAttribute('aria-selected', 'false');
    }
    this.classList.add('active');
    this.setAttribute('aria-selected', 'true');

    for (var k = 0; k < panels.length; k++) {
      panels[k].classList.toggle('active', panels[k].getAttribute('data-panel') === day);
    }
  });
}


/* =========================================================
   9. REVEAL ON SCROLL
   IntersectionObserver tells us when something enters the screen.
   ========================================================= */
var reveals = document.querySelectorAll('.rv');

var revealWatcher = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('seen');
      revealWatcher.unobserve(entry.target);   // animate once only
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(function (el) { revealWatcher.observe(el); });


/* =========================================================
   10. COUNTING FIGURES IN THE ABOUT SECTION
   ========================================================= */
var figs = document.querySelectorAll('.stat-n');

var figWatcher = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      countUp(entry.target);
      figWatcher.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

figs.forEach(function (el) { figWatcher.observe(el); });

function countUp(el) {
  var target = parseInt(el.getAttribute('data-target'), 10);
  var prefix = el.getAttribute('data-prefix') || '';
  var suffix = el.getAttribute('data-suffix') || '';

  var current = 0;
  var step = target / 40;          // 40 frames from zero to the target

  var timer = setInterval(function () {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = prefix + Math.floor(current) + suffix;
  }, 24);
}


/* =========================================================
   11. FORM VALIDATION
   ========================================================= */
var form = document.getElementById('form');
var ok = document.getElementById('ok');

form.addEventListener('submit', function (e) {
  e.preventDefault();            // stop the page reloading
  var valid = true;

  // Name: at least 3 characters
  var name = document.getElementById('name');
  if (name.value.trim().length < 3) {
    fail(name, 'nameErr', 'Enter your full name, at least 3 letters.');
    valid = false;
  } else { pass(name, 'nameErr'); }

  // Email: must look like something@something.com
  var email = document.getElementById('email');
  var pattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  if (email.value.trim() === '') {
    fail(email, 'emailErr', 'Email is required.');
    valid = false;
  } else if (!pattern.test(email.value.trim())) {
    fail(email, 'emailErr', 'Enter a valid email, e.g. name@example.com');
    valid = false;
  } else { pass(email, 'emailErr'); }

  // Phone: exactly 10 digits
  var phone = document.getElementById('phone');
  var digits = phone.value.replace(/\D/g, '');     // strip spaces, +, - and so on
  if (phone.value.trim() === '') {
    fail(phone, 'phoneErr', 'Phone number is required.');
    valid = false;
  } else if (digits.length !== 10) {
    fail(phone, 'phoneErr', 'Enter a 10-digit mobile number.');
    valid = false;
  } else { pass(phone, 'phoneErr'); }

  // Event: one option must be chosen
  var event = document.getElementById('event');
  if (event.value === '') {
    fail(event, 'eventErr', 'Please choose an event.');
    valid = false;
  } else { pass(event, 'eventErr'); }

  // Message: at least 10 characters
  var message = document.getElementById('message');
  if (message.value.trim().length < 10) {
    fail(message, 'messageErr', 'Tell us a little more, at least 10 characters.');
    valid = false;
  } else { pass(message, 'messageErr'); }

  if (valid) {
    ok.hidden = false;
    form.reset();
    setTimeout(function () { ok.hidden = true; }, 6000);
  }
});

function fail(field, errId, text) {
  field.classList.add('bad');
  document.getElementById(errId).textContent = text;
}

function pass(field, errId) {
  field.classList.remove('bad');
  document.getElementById(errId).textContent = '';
}

// Clear the red underline as soon as the student starts fixing the field
var fields = form.querySelectorAll('input, select, textarea');
for (var f = 0; f < fields.length; f++) {
  fields[f].addEventListener('input', function () { this.classList.remove('bad'); });
}


/* =========================================================
   12. BACK TO TOP
   ========================================================= */
var topBtn = document.getElementById('topBtn');

function updateTopBtn() {
  if (window.scrollY > 500) {
    topBtn.classList.add('show');
  } else {
    topBtn.classList.remove('show');
  }
}

topBtn.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* =========================================================
   13. FOOTER YEAR + one shared scroll listener
   ========================================================= */
document.getElementById('year').textContent = new Date().getFullYear();

window.addEventListener('scroll', function () {
  updateNav();
  updateActive();
  updateTopBtn();
});

updateNav();
updateActive();
updateTopBtn();
