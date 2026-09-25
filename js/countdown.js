/* Countdown to the Nikah — Nov 29, 2026, after Magrib ~6:00 PM (IST = UTC+5:30) */
(function () {
  'use strict';

  // 6:00 PM IST = 12:30 UTC on 2026-11-29
  var WEDDING_UTC = new Date('2026-11-29T12:30:00Z');

  var els = {
    days:    document.getElementById('count-days'),
    hours:   document.getElementById('count-hours'),
    minutes: document.getElementById('count-minutes'),
    seconds: document.getElementById('count-seconds')
  };

  if (!els.days) return;

  /* Cache previous values to trigger flip animation only on change */
  var prev = { days: null, hours: null, minutes: null, seconds: null };

  function pad(n) {
    return String(Math.max(0, n)).padStart(2, '0');
  }

  function calcRemaining() {
    var now   = Date.now();
    var diff  = WEDDING_UTC.getTime() - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
    }

    var totalSec = Math.floor(diff / 1000);
    var seconds  = totalSec % 60;
    var totalMin = Math.floor(totalSec / 60);
    var minutes  = totalMin % 60;
    var totalHr  = Math.floor(totalMin / 60);
    var hours    = totalHr % 24;
    var days     = Math.floor(totalHr / 24);

    return { days: days, hours: hours, minutes: minutes, seconds: seconds, done: false };
  }

  function flipEl(el, value) {
    var padded = pad(value);
    if (el.textContent === padded) return; /* no change, skip */
    el.textContent = padded;
    el.classList.remove('is-flipping');
    /* Force reflow to restart animation */
    void el.offsetWidth;
    el.classList.add('is-flipping');
    el.addEventListener('animationend', function handler() {
      el.classList.remove('is-flipping');
      el.removeEventListener('animationend', handler);
    });
  }

  function render() {
    var t = calcRemaining();

    if (t.done) {
      /* Wedding day! Show celebration text */
      Object.values(els).forEach(function (el) {
        if (el) el.textContent = '00';
      });
      return;
    }

    flipEl(els.days,    t.days);
    flipEl(els.hours,   t.hours);
    flipEl(els.minutes, t.minutes);
    flipEl(els.seconds, t.seconds);

    // Update hero section days counter badge if present
    var heroDaysTo = document.getElementById('hero-days-to-go');
    if (heroDaysTo) {
      heroDaysTo.textContent = t.days;
    }
  }

  /* Initial render immediately */
  render();

  /* Then tick every second */
  setInterval(render, 1000);
})();
