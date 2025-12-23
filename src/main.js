// Імпорти
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import * as bootstrap from 'bootstrap'
import axios from 'axios'

// Конфігурація Unsplash API
const UNSPLASH_ACCESS_KEY = 'EyuRTN2cUCiVfSzRT9Us4oc-kHgYsSuqrFrzqvNDumk'
const UNSPLASH_API_URL = 'https://api.unsplash.com'

// Стан застосунку
const state = {
  currentPage: 1,
  currentQuery: 'nature',
  photos: [],
  currentTab: 'all',
  isLoading: false
}

// DOM елементи
const elements = {
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
  downloadPhotoBtn: document.getElementById('downloadPhotoBtn')
}

// ========== РОБОТА З LOCALSTORAGE ==========

// Отримати улюблені фото з localStorage
function getFavorites() {
  try {
    const favorites = localStorage.getItem('favorites')
    return favorites ? JSON.parse(favorites) : []
  } catch (error) {
    console.error('Помилка читання з localStorage:', error)
    return []
  }
}

// Зберегти улюблені фото в localStorage
function saveFavorites(favorites) {
  try {
    localStorage.setItem('favorites', JSON.stringify(favorites))
    updateFavoritesCount()
  } catch (error) {
    console.error('Помилка запису в localStorage:', error)
    showError('Не вдалося зберегти улюблене фото')
  }
}

// Перевірити, чи фото в улюблених
function isFavorite(photoId) {
  const favorites = getFavorites()
  return favorites.some(fav => fav.id === photoId)
}

// Додати/видалити з улюблених
function toggleFavorite(photo) {
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
function updateFavoritesCount() {
  const favorites = getFavorites()
  elements.favoritesCount.textContent = favorites.length
}

// ========== РОБОТА З UNSPLASH API ==========

// Завантажити фото з Unsplash (async/await з обробкою помилок)
async function fetchPhotos(query = 'nature', page = 1) {
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
        showError('Невірний API ключ. Будь ласка, налаштуйте UNSPLASH_ACCESS_KEY в main.js')
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

// ========== DOM МАНІПУЛЯЦІЇ ==========

// Створити HTML картку фото
function createPhotoCard(photo) {
  const col = document.createElement('div')
  col.className = 'col'

  const isFav = isFavorite(photo.id)

  col.innerHTML = `
    <div class="photo-card" data-photo-id="${photo.id}">
      <button class="favorite-btn ${isFav ? 'favorited' : ''}" data-photo-id="${photo.id}">
        ${isFav ? '❤️' : '🤍'}
      </button>
      <img src="${photo.urls.small}" alt="${photo.alt_description || 'Photo'}" loading="lazy" />
      <div class="photo-info">
        <div class="photo-author">📷 ${photo.user.name}</div>
        <div class="photo-likes">❤️ ${photo.likes} вподобань</div>
      </div>
    </div>
  `

  return col
}

// Відобразити фото в галереї
function displayPhotos(photos, append = false) {
  if (!append) {
    elements.photoGallery.innerHTML = ''
  }

  if (photos.length === 0) {
    elements.photoGallery.innerHTML = `
      <div class="col-12">
        <div class="empty-state">
          <div style="font-size: 4rem;">📷</div>
          <h3>Нічого не знайдено</h3>
          <p>Спробуйте інший пошуковий запит</p>
        </div>
      </div>
    `
    elements.loadMoreBtn.classList.add('d-none')
    elements.scrollHint.classList.add('d-none')
    return
  }

  // Використання методів масивів: map, forEach
  photos.forEach(photo => {
    const photoCard = createPhotoCard(photo)
    elements.photoGallery.appendChild(photoCard)
  })

  // Показати підказку та кнопку тільки для вкладки "Всі фото"
  if (state.currentTab === 'all') {
    elements.loadMoreBtn.classList.remove('d-none')
    elements.scrollHint.classList.remove('d-none')
  } else {
    elements.loadMoreBtn.classList.add('d-none')
    elements.scrollHint.classList.add('d-none')
  }
}

// Показати модальне вікно з повним фото
function showPhotoModal(photoId) {
  // Знайти фото за ID (метод find)
  let photo = state.photos.find(p => p.id === photoId)

  // Якщо не знайдено в поточних фото, шукати в улюблених
  if (!photo) {
    const favorites = getFavorites()
    photo = favorites.find(p => p.id === photoId)
  }

  if (!photo) return

  // Заповнити модальне вікно даними
  elements.modalPhotoImg.src = photo.urls.regular
  elements.modalPhotoImg.alt = photo.alt_description || 'Photo'
  elements.modalPhotoTitle.textContent = photo.alt_description || 'Фото'
  elements.modalPhotoDescription.textContent = photo.description || photo.alt_description || ''
  elements.modalPhotoAuthor.innerHTML = `<strong>Автор:</strong> ${photo.user.name} (@${photo.user.username})`
  elements.downloadPhotoBtn.href = photo.links.html

  // Показати модальне вікно
  elements.photoModal.show()
}

// Показати/сховати індикатор завантаження
function showLoading(show) {
  if (show) {
    elements.loadingSpinner.classList.remove('d-none')
  } else {
    elements.loadingSpinner.classList.add('d-none')
  }
}

// Показати повідомлення про помилку
function showError(message) {
  elements.errorAlert.textContent = message
  elements.errorAlert.classList.remove('d-none')
}

// Сховати повідомлення про помилку
function hideError() {
  elements.errorAlert.classList.add('d-none')
}

// ========== ОБРОБНИКИ ПОДІЙ ==========

// Обробка відправки форми пошуку
elements.searchForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  const query = elements.searchInput.value.trim()

  if (!query) {
    showError('Будь ласка, введіть пошуковий запит')
    return
  }

  state.currentQuery = query
  state.currentPage = 1
  state.currentTab = 'all'

  // Активувати вкладку "Всі фото"
  elements.allTab.classList.add('active')
  elements.favoritesTab.classList.remove('active')

  const photos = await fetchPhotos(query, 1)
  state.photos = photos
  displayPhotos(photos)
})

// Обробка кліків на галереї (делегування подій)
elements.photoGallery.addEventListener('click', (e) => {
  // Клік на кнопку улюбленого
  if (e.target.closest('.favorite-btn')) {
    const btn = e.target.closest('.favorite-btn')
    const photoId = btn.dataset.photoId

    // Знайти фото
    let photo = state.photos.find(p => p.id === photoId)
    if (!photo) {
      const favorites = getFavorites()
      photo = favorites.find(p => p.id === photoId)
    }

    if (photo) {
      toggleFavorite(photo)

      // Оновити вигляд кнопки
      const isFav = isFavorite(photoId)
      btn.textContent = isFav ? '❤️' : '🤍'
      btn.classList.toggle('favorited', isFav)
    }
  }
  // Клік на картку фото (але не на кнопку)
  else if (e.target.closest('.photo-card') && !e.target.closest('.favorite-btn')) {
    const card = e.target.closest('.photo-card')
    const photoId = card.dataset.photoId
    showPhotoModal(photoId)
  }
})

// Кнопка "Завантажити ще" (пагінація)
elements.loadMoreBtn.addEventListener('click', async () => {
  await loadMorePhotos()
})

// Функція для завантаження додаткових фото
async function loadMorePhotos() {
  if (state.isLoading || state.currentTab !== 'all') return

  state.currentPage++
  const photos = await fetchPhotos(state.currentQuery, state.currentPage)
  state.photos = [...state.photos, ...photos]
  displayPhotos(photos, true)
}

// ========== НЕСКІНЧЕННИЙ СКРОЛ ==========

// Перевірка, чи користувач досяг низу сторінки
function isBottomReached() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight
  const clientHeight = document.documentElement.clientHeight

  // Завантажуємо, коли користувач за 300px до низу
  return scrollTop + clientHeight >= scrollHeight - 300
}

// Дебаунсинг для оптимізації
let scrollTimeout
function handleScroll() {
  // Очищуємо попередній таймер
  clearTimeout(scrollTimeout)

  // Встановлюємо новий таймер
  scrollTimeout = setTimeout(async () => {
    // Перевіряємо умови для завантаження
    if (isBottomReached() && state.currentTab === 'all' && !state.isLoading) {
      await loadMorePhotos()
    }
  }, 200) // Затримка 200мс
}

// Додаємо обробник події scroll
window.addEventListener('scroll', handleScroll)

// Перемикання вкладок
elements.allTab.addEventListener('click', async () => {
  state.currentTab = 'all'
  elements.allTab.classList.add('active')
  elements.favoritesTab.classList.remove('active')

  if (state.photos.length === 0) {
    const photos = await fetchPhotos(state.currentQuery, 1)
    state.photos = photos
  }
  displayPhotos(state.photos)
})

elements.favoritesTab.addEventListener('click', () => {
  state.currentTab = 'favorites'
  elements.favoritesTab.classList.add('active')
  elements.allTab.classList.remove('active')

  const favorites = getFavorites()
  displayPhotos(favorites)
})

// ========== ІНІЦІАЛІЗАЦІЯ ==========

async function init() {
  // Оновити лічильник улюблених
  updateFavoritesCount()

  // Завантажити початкові фото
  const photos = await fetchPhotos(state.currentQuery, 1)
  state.photos = photos
  displayPhotos(photos)
}

// Запуск застосунку
init()
