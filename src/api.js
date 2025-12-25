import axios from 'axios'
import { UNSPLASH_ACCESS_KEY, UNSPLASH_API_URL } from './config.js'
import { state } from './state.js'
import { showLoading, hideError, showError } from './ui.js'

// ========== РОБОТА З UNSPLASH API ==========

// Завантажити фото з Unsplash (async/await з обробкою помилок)
export async function fetchPhotos(query = 'nature', page = 1) {
  try {
    state.isLoading = true
    showLoading(true)
    hideError()

    const response = await axios.get(`${UNSPLASH_API_URL}/search/photos`, {
      params: {
        query: query,
        page: page,
        per_page: 12,
        client_id: UNSPLASH_ACCESS_KEY
      }
    })

    state.isLoading = false
    showLoading(false)

    return response.data.results
  } catch (error) {
    state.isLoading = false
    showLoading(false)

    // Детальна обробка помилок
    if (error.response) {
      // Сервер відповів з помилкою
      if (error.response.status === 401) {
        showError('Невірний API ключ. Будь ласка, налаштуйте UNSPLASH_ACCESS_KEY в config.js')
      } else if (error.response.status === 403) {
        showError('Перевищено ліміт запитів до API. Спробуйте пізніше.')
      } else {
        showError(`Помилка API: ${error.response.status}`)
      }
    } else if (error.request) {
      // Запит був відправлений, але відповіді не отримано
      showError('Помилка мережі. Перевірте з\'єднання з інтернетом.')
    } else {
      // Інша помилка
      showError('Невідома помилка: ' + error.message)
    }

    return []
  }
}
