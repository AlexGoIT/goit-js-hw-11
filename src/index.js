import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { getImages } from './js/getImages';
import { createImageCardMarkup } from './js/createImageCardMarkup';
import simpleLightbox from 'simplelightbox';

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

  lightBox.refresh();

  const markup = createImageCardMarkup(res.hits); // Створюємо розмітку карток з результату пошуку

  galleryContainer.insertAdjacentHTML('beforeend', markup);
}

function onError(err) {
  Notify.failure(`Oops, something went wrong: ${err.message}`);
  console.log(err);
}
