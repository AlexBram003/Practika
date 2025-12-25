import { elements } from './dom.js'
import { state } from './state.js'
import { displayPhotos } from './ui.js'

// ========== РОБОТА З LOCALSTORAGE ==========

// Отримати улюблені фото з localStorage
export function getFavorites() {
  try {
    const favorites = localStorage.getItem('favorites')
    return favorites ? JSON.parse(favorites) : []
  } catch (error) {
    console.error('Помилка читання з localStorage:', error)
    return []
  }
}

// Зберегти улюблені фото в localStorage
export function saveFavorites(favorites) {
  try {
    localStorage.setItem('favorites', JSON.stringify(favorites))
    updateFavoritesCount()
  } catch (error) {
    console.error('Помилка запису в localStorage:', error)
    showError('Не вдалося зберегти улюблене фото')
  }
}

// Перевірити, чи фото в улюблених
export function isFavorite(photoId) {
  const favorites = getFavorites()
  return favorites.some(fav => fav.id === photoId)
}

// Додати/видалити з улюблених
export function toggleFavorite(photo) {
  const favorites = getFavorites()
  const index = favorites.findIndex(fav => fav.id === photo.id)

  if (index > -1) {
    // Видалити з улюблених
    favorites.splice(index, 1)
  } else {
    // Додати до улюблених
    favorites.push(photo)
  }

  saveFavorites(favorites)

  // Якщо відкрита вкладка улюблених, оновити відображення
  if (state.currentTab === 'favorites') {
    displayPhotos(favorites)
  }
}

// Оновити лічильник улюблених
export function updateFavoritesCount() {
  const favorites = getFavorites()
  elements.favoritesCount.textContent = favorites.length
}

// Показати повідомлення про помилку (потрібно для saveFavorites)
function showError(message) {
  elements.errorAlert.textContent = message
  elements.errorAlert.classList.remove('d-none')
}
