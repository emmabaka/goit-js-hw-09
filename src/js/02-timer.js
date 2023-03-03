import Notiflix from 'notiflix';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const timeInput = document.querySelector('#datetime-picker');
const startButton = document.querySelector('button[data-start]');
const daysValue = document.querySelector('.value[data-days]');
const hoursValue = document.querySelector('.value[data-hours]');
const minsValue = document.querySelector('.value[data-minutes]');
const secValue = document.querySelector('.value[data-seconds]');

let counter;
const fp = flatpickr(timeInput, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= Date.now() || selectedDates[0] === undefined) {
      Notiflix.Report.warning(
        'Unfortunately, it doesn`t work',
        'Choose a date in the future, please',
        'Okay'
      );
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
      startButton.addEventListener('click', () => {
        startButton.disabled = true;
        counter = setInterval(() => {
          const timeDifference = selectedDates[0] - Date.now();
          if (timeDifference < 1000) {
            Notiflix.Report.info('Hey!', "Time's up!", 'Okay');
            clearInterval(counter);
            startButton.disabled = false;
          }
          timeUpdate(timeDifference);
        }, 1000);
      });
    }
  },
});

function timeUpdate(time) {
  daysValue.textContent = String(convertMs(time).days).padStart(2, '0');
  hoursValue.textContent = String(convertMs(time).hours).padStart(2, '0');
  minsValue.textContent = String(convertMs(time).minutes).padStart(2, '0');
  secValue.textContent = String(convertMs(time).seconds).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
