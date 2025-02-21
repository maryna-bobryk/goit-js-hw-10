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

refs.btn.disabled = true;
let userSelectedDate = null;

//!==================================================

const toastOptions = {
  titleColor: '#fff',
  titleSize: '16px',
  messageColor: '#fff',
  messageSize: '16px',
  position: 'topRight',
  transitionIn: 'flipInX',
  timeout: 2000,
  closeOnClick: true,
};

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

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onReady(selectedDates, dateStr, instance) {
    instance.calendarContainer.style.backgroundColor = '#f0f0f0';
  },

  onClose(selectedDates) {
    userSelectedDate = selectedDates[0].getTime();
    if (userSelectedDate < new Date()) {
      iziToast.show({
        ...toastOptions,
        title: 'Error',
        message: 'Please choose a date in the future',
        backgroundColor: '#EF4040',
      });
      refs.btn.disabled = true;
    } else {
      iziToast.show({
        ...toastOptions,
        title: 'Ok',
        message: 'The timer is set and ready to start',
        color: '#59A10D',
      });
      refs.btn.disabled = false;
    }
  },
};
const calender = flatpickr(refs.input, options);

let intervalID = null;

function startTimer(userSelectedDate) {
  refs.btn.disabled = true;
  refs.input.disabled = true;

  intervalID = setInterval(() => {
    const currentTime = new Date();
    let diff = userSelectedDate - currentTime;

    if (diff <= 0) {
      clearInterval(intervalID);
      diff = 0;
      refs.btn.disabled = true;
      refs.input.disabled = false;

      iziToast.show({
        ...toastOptions,
        message: 'Time is up!',
        color: '#59A10D',
      });
    }
    updateTimerDisplay(diff);
  }, 1000);
}

function updateTimerDisplay(diff) {
  const { days, hours, minutes, seconds } = convertMs(diff);
  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

refs.btn.addEventListener('click', () => {
  if (userSelectedDate && userSelectedDate > new Date()) {
    startTimer(userSelectedDate);
  }
});
