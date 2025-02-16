import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

//!==================================================

const refs = {
  btn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
  input: document.querySelector('#datetime-picker'),
};

//!==================================================

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
// console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
// console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
// console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

let userSelectedDate = null;
refs.btn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onReady(selectedDates, dateStr, instance) {
    instance.calendarContainer.style.backgroundColor = '#f0f0f0';
  },
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate < new Date()) {
      iziToast.error({
        title: 'Oops...',
        message: 'the day is in the past',
        iconColor: '#fff',
        titleColor: '#fff',
        messageColor: '#fff',
        backgroundColor: '#EF4040',
        position: 'topRight',
        transitionIn: 'flipInX',
      });
      refs.btn.disabled = true;
    } else {
      refs.btn.disabled = false;
    }
  },
};

const calender = flatpickr(refs.input, options);

const countdownTimer = {
  intervalID: null,

  start() {
    clearInterval(this.intervalID);

    refs.btn.disabled = true;
    refs.input.disabled = true;

    this.intervalID = setInterval(() => {
      const currentTime = new Date();
      const diff = userSelectedDate - currentTime;

      if (diff <= 0) {
        clearInterval(this.intervalID);
        diff = 0;
        refs.btn.disabled = true;
        refs.input.disabled = false;

        iziToast.success({
          message: 'Time is up!',
          iconColor: '#fff',
          titleColor: '#fff',
          messageColor: '#fff',
          backgroundColor: '#94D5DB',
          position: 'topRight',
          transitionIn: 'flipInX',
        });
      }
      this.displayTimeLeft(diff);
    }, 1000);
    iziToast.info({
      message: 'Timer started!',
      iconColor: '#fff',
      titleColor: '#fff',
      messageColor: '#fff',
      backgroundColor: '#89C757',
      position: 'topRight',
      transitionIn: 'flipInX',
    });
  },

  displayTimeLeft(diff) {
    const { days, hours, minutes, seconds } = convertMs(diff);
    refs.days.textContent = this.addLeadingZero(days);
    refs.hours.textContent = this.addLeadingZero(hours);
    refs.minutes.textContent = this.addLeadingZero(minutes);
    refs.seconds.textContent = this.addLeadingZero(seconds);
  },

  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  },
};

refs.btn.addEventListener('click', () => {
  countdownTimer.start();
});
