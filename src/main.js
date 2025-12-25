// Імпорти стилів
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// Імпорти модулів
import { state } from './state.js'
import { fetchPhotos } from './api.js'
import { displayPhotos } from './ui.js'
import { updateFavoritesCount } from './storage.js'
import { setupEventHandlers } from './events.js'

// ========== ІНІЦІАЛІЗАЦІЯ ==========

async function init() {
  // Налаштувати обробники подій
  setupEventHandlers()

  // Оновити лічильник улюблених
  updateFavoritesCount()

  // Завантажити початкові фото
  const photos = await fetchPhotos(state.currentQuery, 1)
  state.photos = photos
  displayPhotos(photos)
}

// Запуск застосунку
init()
