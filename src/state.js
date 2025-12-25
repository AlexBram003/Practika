// Стан застосунку
export const state = {
  currentPage: 1,
  currentQuery: 'nature',
  photos: [],
  currentTab: 'all',
  isLoading: false,
  loadingMode: 'infinite', // 'pagination' | 'loadMore' | 'infinite'
  totalPages: 10 // Приблизна кількість сторінок (для пагінації)
}
