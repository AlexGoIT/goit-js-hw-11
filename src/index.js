import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { getImages } from './js/getImages';
import { createImageCardMarkup } from './js/createImageCardMarkup';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const PER_PAGE = 40;
let searchQuery = '';
let pageCount = 1;

refs.searchForm.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

const lightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function onSubmit(e) {
  e.preventDefault();

  searchQuery = e.target.searchQuery.value.trim();

  if (!searchQuery) {
    Notify.failure("We're sorry, but the search string cannot be empty!");
    return;
  }

  refs.gallery.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');

  e.target.reset();
  pageCount = 1;

  renderUI();
}

async function renderUI() {
  try {
    const res = await getImages(searchQuery, pageCount);
  
    const { totalHits } = res;

    if (totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else if (pageCount === 1) {
      Notify.info(`Hooray! We found ${totalHits} images.`);
    }

    // Створюємо розмітку карток з результату пошуку
    refs.gallery.insertAdjacentHTML('beforeend', createImageCardMarkup(res.hits));

    if (pageCount * PER_PAGE < totalHits) {
      refs.loadMoreBtn.classList.remove('is-hidden');
      scroll();
    }
  
    lightBox.refresh();
  } catch (error) {
    console.log(error);
    Notify.failure(`Oops, something went wrong: ${error.message}`);
  }
}

function onLoadMore() {
  pageCount++;
  renderUI();
}

function scroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  if (pageCount > 1) {
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}
