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
    // Завантажуємо більше фото якщо активний фільтр по лайках
    const perPage = state.minLikes > 0 ? 30 : 12
    const params = {
      query: query,
      page: page,
      per_page: perPage,
      client_id: UNSPLASH_ACCESS_KEY
    }

    // Додати order_by якщо не relevant
    if (state.sortOrder !== 'relevant') {
      params.order_by = state.sortOrder
    }

    const response = await axios.get(`${UNSPLASH_API_URL}/search/photos`, { params })
    let photos = response.data.results

    // Клієнтська фільтрація по мінімальній кількості лайків
    if (state.minLikes > 0) {
      photos = photos.filter(photo => photo.likes >= state.minLikes)

      // Якщо після фільтрації фото замало і є ще сторінки, спробувати завантажити ще
      if (photos.length < 12 && response.data.total_pages > page) {
        try {
          const nextPageParams = { ...params, page: page + 1 }
          const nextResponse = await axios.get(`${UNSPLASH_API_URL}/search/photos`, { params: nextPageParams })
          const nextPhotos = nextResponse.data.results.filter(photo => photo.likes >= state.minLikes)
          photos = [...photos, ...nextPhotos]
        } catch (e) {
          // Якщо не вдалося завантажити додаткові фото, просто ігноруємо помилку
          console.warn('Не вдалося завантажити додаткові фото:', e)
        }
      }
    }

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
