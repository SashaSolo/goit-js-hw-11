import axios from 'axios';

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async fetchImages() {
    try {
      const response =
        await axios.get(`https://pixabay.com/api/?key=30693396-e1b427b4dccc6c7042daae71f&q=${this.searchQuery}&
    image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.per_page}`);

      const data = response.data;
      this.incrementPage();
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
