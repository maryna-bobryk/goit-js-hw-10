import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  formElem: document.querySelector('.form'),
};

function creatPromise(delay, state) {
  const promis = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
  return promis;
}

refs.formElem.addEventListener('submit', e => {
  e.preventDefault();

  const delay = refs.formElem.delay.value;
  const state = refs.formElem.state.value;

  const promis = creatPromise(delay, state);
  promis
    .then(delay => {
      iziToast.success({
        title: 'OK',
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: 'topRight',
      });
    })
    .catch(delay => {
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${delay}ms`,
        position: 'topRight',
        class: 'js-success-toast',
      });
    });
});
