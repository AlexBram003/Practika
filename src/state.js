
export const state = {
  currentPage: 1,
  currentQuery: 'nature',
  photos: [],
  currentTab: 'all',
  isLoading: false,
  loadingMode: 'infinite', // 'pagination' | 'loadMore' | 'infinite'
  totalPages: 10, // Приблизна кількість сторінок (для пагінації)
  sortOrder: 'relevant', // 'relevant' | 'popular' | 'latest'
  minLikes: 0, // Мінімальна кількість лайків для фільтрації
  photosPerPage: 12, // Кількість фото на сторінку
  favoritesPage: 1, // Поточна сторінка для улюблених
  displayedFavorites: [] // Відображені улюблені (для режимів loadMore і infinite)
}
