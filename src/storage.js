import { elements } from './dom.js'
import { state } from './state.js'
import { displayPhotos } from './ui.js'

export function getFavorites() {
  try {
    const favorites = localStorage.getItem('favorites')
    return favorites ? JSON.parse(favorites) : []
  } catch (error) {
    console.error('Помилка читання з localStorage:', error)
    return []
  }
}

export function saveFavorites(favorites) {
  try {
    localStorage.setItem('favorites', JSON.stringify(favorites))
    updateFavoritesCount()
  } catch (error) {
    console.error('Помилка запису в localStorage:', error)
    showError('Не вдалося зберегти улюблене фото')
  }
}

export function isFavorite(photoId) {
  const favorites = getFavorites()
  return favorites.some(fav => fav.id === photoId)
}

export function toggleFavorite(photo) {
  const favorites = getFavorites()
  const index = favorites.findIndex(fav => fav.id === photo.id)

  if (index > -1) {
    favorites.splice(index, 1)
  } else {
    favorites.push(photo)
  }

  saveFavorites(favorites)

  if (state.currentTab === 'favorites') {
    displayPhotos(favorites)
  }
}

export function updateFavoritesCount() {
  const favorites = getFavorites()
  elements.favoritesCount.textContent = favorites.length
}

function showError(message) {
  elements.errorAlert.textContent = message
  elements.errorAlert.classList.remove('d-none')
}
