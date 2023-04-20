import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

import { getImages } from './js/getImages';
import { createImageCardMarkup } from './js/createImageCardMarkup';

const PER_PAGE = 40;
let searchQuery = '';
let pageCount = 1;
let isLoading = false;
let totalPages = 0;

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreAuto: document.querySelector('.load-more-auto'),
};

refs.searchForm.addEventListener('submit', onSubmit);

refs.loadMoreAuto.classList.add('is-hidden');
window.addEventListener('scroll', debounce(onScroll, 300));

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

  e.target.reset();
  pageCount = 1;

  renderUI();
}

async function renderUI() {
  isLoading = true;

  try {
    const response = await getImages(searchQuery, pageCount);

    const { totalHits, hits } = response;

    if (totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else if (pageCount === 1) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
      totalPages = Math.ceil(totalHits / PER_PAGE);
    }

    // Створюємо розмітку карток з результату пошуку
    refs.gallery.insertAdjacentHTML('beforeend', createImageCardMarkup(hits));
    refs.loadMoreAuto.classList.add('is-hidden');
    isLoading = false;
    scroll();

    lightBox.refresh();
  } catch (error) {
    console.log(error.message);
    Notify.failure(`Oops, something went wrong: ${error.message}`);
  }
}

function onLoadMore() {
  pageCount++;
  refs.loadMoreAuto.classList.remove('is-hidden');
  renderUI();
}

function scroll() {
  if (pageCount <= 1) {
    return;
  }

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function onScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading) {
    if (pageCount < totalPages) {
      onLoadMore();
    } else {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  }
}
