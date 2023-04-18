import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { getImages } from './js/getImages';
import { createImageCardMarkup } from './js/createImageCardMarkup';

const form = document.querySelector('#search-form');
form.addEventListener('submit', onSubmit);

const galleryContainer = document.querySelector('.gallery');

const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.addEventListener('click', onLoadMore);

const lightBox = new SimpleLightbox('.gallery a');

let searchQuery = '';
let pageCount = 1;

function onSubmit(e) {
  e.preventDefault();

  searchQuery = e.target.searchQuery.value;

  if (!searchQuery) {
    Notify.failure("We're sorry, but the search string cannot be empty!");
    return;
  }

  galleryContainer.innerHTML = '';

  getImages(searchQuery, pageCount).then(onSuccess).catch(onError);
}

function onSuccess(res) {
  const totalHits = res.totalHits;
  Notify.info(`Hooray! We found ${totalHits} images.`);

  // Створюємо розмітку карток з результату пошуку
  galleryContainer.insertAdjacentHTML(
    'beforeend',
    createImageCardMarkup(res.hits)
  );

  loadMoreBtn.classList.remove('is-hidden');
  pageCount++;

  lightBox.refresh();
}

function onError(err) {
  Notify.failure(`Oops, something went wrong: ${err.message}`);
  console.log(err);
}

function onLoadMore() {
  getImages(searchQuery, pageCount).then(onSuccess).catch(onError);
  pageCount++;
}
