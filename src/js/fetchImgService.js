
import axios from 'axios';
import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '24722659-718c1d8bf5a51ddaf817fd145';
const per_page = 40;
const searchParams = new URLSearchParams({
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page,
});

export default class SearchImgService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.numberImg = 0;
        this.totalHits = 0;
    };

    async fetchImg() {
        const url = `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&${searchParams}&page=${this.page}`
    
        try {
            const response = await axios.get(url)
            if (response.data.hits.length === 0) {
                return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            }

            if (this.page === 1) {
                Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
            }

            this.totalHits = response.data.totalHits
            return response.data.hits
            
        } catch (error) {
            console.error(error)
        }
    }

    incrementNumberImg() {
        this.numberImg += per_page;
    }

    resetNumberImg() {
        this.numberImg = 0;
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


