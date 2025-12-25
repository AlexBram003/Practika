import { elements } from './dom.js'
import { state } from './state.js'
import { fetchPhotos } from './api.js'
import { displayPhotos, showPhotoModal, showError } from './ui.js'
import { getFavorites, isFavorite, toggleFavorite } from './storage.js'

// ========== ОБРОБНИКИ ПОДІЙ ==========

// Обробка відправки форми пошуку
export function setupSearchForm() {
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
}

// Обробка кліків на галереї (делегування подій)
export function setupGalleryClick() {
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
}

// Функція для завантаження додаткових фото
export async function loadMorePhotos() {
  if (state.isLoading || state.currentTab !== 'all') return

  state.currentPage++
  const photos = await fetchPhotos(state.currentQuery, state.currentPage)
  state.photos = [...state.photos, ...photos]
  displayPhotos(photos, true)
}

// Кнопка "Завантажити ще" (пагінація)
export function setupLoadMoreButton() {
  elements.loadMoreBtn.addEventListener('click', async () => {
    await loadMorePhotos()
  })
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

// Ініціалізація нескінченного скролу
export function setupInfiniteScroll() {
  window.addEventListener('scroll', handleScroll)
}

// ========== ВКЛАДКИ ==========

// Перемикання вкладок
export function setupTabs() {
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
}

// Ініціалізація всіх обробників подій
export function setupEventHandlers() {
  setupSearchForm()
  setupGalleryClick()
  setupLoadMoreButton()
  setupInfiniteScroll()
  setupTabs()
}
