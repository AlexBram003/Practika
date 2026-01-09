import axios from 'axios'
import { UNSPLASH_ACCESS_KEY, UNSPLASH_API_URL } from './config.js'
import { state } from './state.js'
import { showLoading, hideError, showError } from './ui.js'

export async function fetchPhotos(query = 'nature', page = 1) {
  try {
    state.isLoading = true
    showLoading(true)
    hideError()

    // Параметри запиту
    const params = {
      query: query,
      page: page,
      per_page: 12,
      client_id: UNSPLASH_ACCESS_KEY
    }

    // Додати order_by якщо не relevant
    if (state.sortOrder !== 'relevant') {
      params.order_by = state.sortOrder
    }

    const response = await axios.get(`${UNSPLASH_API_URL}/search/photos`, { params })
    const photos = response.data.results

    state.isLoading = false
    showLoading(false)

    return photos
  } catch (error) {
    state.isLoading = false
    showLoading(false)

    if (error.response) {
      if (error.response.status === 401) {
        showError('Невірний API ключ. Будь ласка, налаштуйте UNSPLASH_ACCESS_KEY в config.js')
      } else if (error.response.status === 403) {
        showError('Перевищено ліміт запитів до API. Спробуйте пізніше.')
      } else {
        showError(`Помилка API: ${error.response.status}`)
      }
    } else if (error.request) {
      showError('Помилка мережі. Перевірте з\'єднання з інтернетом.')
    } else {
      showError('Невідома помилка: ' + error.message)
    }

    return []
  }
}
