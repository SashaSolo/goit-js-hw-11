import axios from 'axios';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import Notiflix from 'notiflix';
import NewsApiService from './new-apiservice';

const form = document.querySelector('#search-form');
const tracker = document.querySelector('.tracker');
const gallery = document.querySelector('.gallery');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: '250',
});

const newsApiService = new NewsApiService();
console.dir(newsApiService);

form.addEventListener('submit', onSearchImages);

function onSearchImages(event) {
  event.preventDefault();
  onClearGallery();
  newsApiService.resetPage();
  newsApiService.searchQuery = event.currentTarget.elements.searchQuery.value;

  event.currentTarget.elements.searchQuery.value = '';
  newsApiService.fetchImages().then(onFilterSearch);
}

function onFilterSearch(data) {
  console.log(data);

  if (data.totalHits) {
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    onCreateImageDescription(data);
    observer.observe(tracker);
  } else {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && newsApiService.searchQuery !== '') {
      newsApiService.fetchImages().then(onLoadMoreImages);
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '100px',
});

function onLoadMoreImages(data) {
  if (data.totalHits) {
    onCreateImageDescription(data);
  }
  if (data.hits.length == 0) {
    Notiflix.Notify.warning(
      'We are sorry, but you have reached the end of search results'
    );
    observer.unobserve(tracker);
  }
}

function onCreateImageDescription(data) {
  const imageInfo = data.hits
    .map(
      h => `<div class="photo-card">
     
      <a href=${h.largeImageURL}>
       <div class="img-thumb">
  <img src="${h.webformatURL}" alt="${h.tags}" loading="lazy" />
   </div>
  </a>
 
  <div class="info">
    <p class="info-item">
      <b>Likes
      <br>
      ${h.likes}</b>
    </p>
    <p class="info-item">
      <b>Views 
      <br>
      ${h.views}</b>
    </p>
    <p class="info-item">
      <b>Comments
      <br>
      ${h.comments}
      </b>
    </p>
    <p class="info-item">
      <b>Downloads
      <br>
      ${h.downloads}</b>
    </p>
    
  </div>
</div>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', imageInfo);

  lightbox.refresh();
}

function onClearGallery() {
  gallery.innerHTML = '';
}
