import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { getImages } from './js/getImages';

const form = document.querySelector('#search-form');

form.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();
  const searchQuery = e.target.searchQuery.value;

  if (!searchQuery) {
    Notify.failure("We're sorry, but the search string cannot be empty!");
    return;
  }

  getImages(searchQuery).then(onSuccess).catch(onError);

  console.log(e.target.searchQuery.value);
}

function onSuccess(res) {
  const totalHits = res.totalHits;
  Notify.info(`Hooray! We found ${totalHits} images.`);
  console.log(res);
}

function onError() {}
