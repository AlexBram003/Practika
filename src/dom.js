import * as bootstrap from 'bootstrap'

export const elements = {
  searchForm: document.getElementById('searchForm'),
  searchInput: document.getElementById('searchInput'),
  photoGallery: document.getElementById('photoGallery'),
  loadingSpinner: document.getElementById('loadingSpinner'),
  errorAlert: document.getElementById('errorAlert'),
  loadMoreBtn: document.getElementById('loadMoreBtn'),
  scrollHint: document.getElementById('scrollHint'),
  allTab: document.getElementById('all-tab'),
  favoritesTab: document.getElementById('favorites-tab'),
  favoritesCount: document.getElementById('favoritesCount'),
  photoModal: new bootstrap.Modal(document.getElementById('photoModal')),
  modalPhotoImg: document.getElementById('modalPhotoImg'),
  modalPhotoTitle: document.getElementById('modalPhotoTitle'),
  modalPhotoDescription: document.getElementById('modalPhotoDescription'),
  modalPhotoAuthor: document.getElementById('modalPhotoAuthor'),
  downloadPhotoBtn: document.getElementById('downloadPhotoBtn'),
  categoryButtons: document.querySelectorAll('.category-btn'),
  paginationModeBtn: document.getElementById('paginationMode'),
  loadMoreModeBtn: document.getElementById('loadMoreMode'),
  infiniteScrollModeBtn: document.getElementById('infiniteScrollMode'),
  paginationContainer: document.getElementById('paginationContainer'),
  paginationNav: document.getElementById('paginationNav')
}
