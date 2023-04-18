import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { getImages } from './js/getImages';
import { createImageCardMarkup } from './js/createImageCardMarkup';

const form = document.querySelector('#search-form');

const galleryContainer = document.querySelector('.gallery');

const lightBox = new SimpleLightbox('.gallery a');

form.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();
  const searchQuery = e.target.searchQuery.value;

  if (!searchQuery) {
    Notify.failure("We're sorry, but the search string cannot be empty!");
    return;
  }

  getImages(searchQuery).then(onSuccess).catch(onError);
}

function onSuccess(res) {
  const totalHits = res.totalHits;
  Notify.info(`Hooray! We found ${totalHits} images.`);
  console.log(res);

  // Створюємо розмітку карток з результату пошуку
  galleryContainer.insertAdjacentHTML(
    'beforeend',
    createImageCardMarkup(res.hits)
  );

  lightBox.refresh();
}

function onError(err) {
  Notify.failure(`Oops, something went wrong: ${err.message}`);
  console.log(err);
}
