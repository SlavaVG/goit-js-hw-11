import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import SearchImgService from './js/fetchImgService'
import getRefs from './js/refs';
import markupGallery from './templates/img-card.hbs' 


const searchImgService = new SearchImgService();
const refs = getRefs();
const optionsLightBox = {
    captions: true,
    captionDelay: 250,
};
const lightbox  = new SimpleLightbox(".gallery a", optionsLightBox);

refs.searchForm.addEventListener('submit', onSubmitSearch)
refs.loadMoreBtn.addEventListener('click', onBtnClick)

function onSubmitSearch(event) {
    event.preventDefault();
    refs.loadMoreBtn.classList.add('visually-hidden');
    
    const searchQuery = event.currentTarget.elements.searchQuery.value.replaceAll(' ', '+');

    searchImgService.query = searchQuery;

    remove()
    render()
}

function galleryRender(imgArray) {
    if (!imgArray) {
        return
    }  
    refs.gallery.insertAdjacentHTML('beforeend', markupGallery(imgArray))
}

function onBtnClick() {
    refs.loadMoreBtn.classList.add('visually-hidden');

    render()
}

function smoothScroll() {
    const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
}

async function render() {
    const imgArray = await searchImgService.fetchImg();

    if (!imgArray) {
        return
    }

    galleryRender(imgArray);
    searchImgService.incrementNumberImg();
    searchImgService.incrementPage();
    lightbox.refresh();
    smoothScroll();

   

    if (searchImgService.numberImg >= searchImgService.totalHits) {
        return Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
    }
    
    refs.loadMoreBtn.classList.remove('visually-hidden');
}

function remove() {
    searchImgService.resetNumberImg();
    searchImgService.resetPage();
    refs.gallery.innerHTML = ""
}