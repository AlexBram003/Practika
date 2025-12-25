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

// Функція для завантаження додаткових фото (для loadMore та infinite)
export async function loadMorePhotos() {
  if (state.isLoading || state.currentTab !== 'all') return
  if (state.loadingMode === 'pagination') return // Пагінація використовує окрему логіку

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
    // Перевіряємо умови для завантаження (тільки якщо режим infinite scroll)
    if (isBottomReached() && state.currentTab === 'all' && !state.isLoading && state.loadingMode === 'infinite') {
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

// ========== КАТЕГОРІЇ ==========

// Обробка кліків на категорії
export function setupCategories() {
  elements.categoryButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      // Видалити активний клас з усіх кнопок
      elements.categoryButtons.forEach(b => b.classList.remove('active'))

      // Додати активний клас до поточної
      btn.classList.add('active')

      // Отримати категорію
      const category = btn.dataset.category

      // Оновити стан і завантажити фото
      state.currentQuery = category
      state.currentPage = 1
      state.currentTab = 'all'

      // Активувати вкладку "Всі фото"
      elements.allTab.classList.add('active')
      elements.favoritesTab.classList.remove('active')

      const photos = await fetchPhotos(category, 1)
      state.photos = photos
      displayPhotos(photos)
    })
  })
}

// ========== РЕЖИМ ЗАВАНТАЖЕННЯ ==========

// Оновити видимість елементів залежно від режиму
function updateLoadingModeUI() {
  if (state.currentTab !== 'all') return

  switch (state.loadingMode) {
    case 'pagination':
      elements.paginationContainer.classList.remove('d-none')
      elements.loadMoreBtn.classList.add('d-none')
      elements.scrollHint.classList.add('d-none')
      break
    case 'loadMore':
      elements.paginationContainer.classList.add('d-none')
      elements.loadMoreBtn.classList.remove('d-none')
      elements.scrollHint.classList.add('d-none')
      break
    case 'infinite':
      elements.paginationContainer.classList.add('d-none')
      elements.loadMoreBtn.classList.add('d-none')
      elements.scrollHint.classList.remove('d-none')
      break
  }
}

// Обробка перемикання режиму завантаження
export function setupLoadingModeToggle() {
  elements.paginationModeBtn.addEventListener('change', () => {
    if (elements.paginationModeBtn.checked) {
      state.loadingMode = 'pagination'
      // При переході на пагінацію - завантажити поточну сторінку
      loadPagePhotos(state.currentPage)
      updateLoadingModeUI()
    }
  })

  elements.loadMoreModeBtn.addEventListener('change', () => {
    if (elements.loadMoreModeBtn.checked) {
      state.loadingMode = 'loadMore'
      updateLoadingModeUI()
    }
  })

  elements.infiniteScrollModeBtn.addEventListener('change', () => {
    if (elements.infiniteScrollModeBtn.checked) {
      state.loadingMode = 'infinite'
      updateLoadingModeUI()
    }
  })
}

// Завантажити конкретну сторінку (для пагінації)
async function loadPagePhotos(page) {
  state.currentPage = page
  const photos = await fetchPhotos(state.currentQuery, page)
  state.photos = photos
  displayPhotos(photos)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Обробка кліків на пагінацію
export function setupPaginationClick() {
  elements.paginationNav.addEventListener('click', async (e) => {
    if (e.target.classList.contains('page-link')) {
      const page = parseInt(e.target.dataset.page)
      if (page && !isNaN(page)) {
        await loadPagePhotos(page)
      }
    }
  })
}

// Ініціалізація всіх обробників подій
export function setupEventHandlers() {
  setupSearchForm()
  setupGalleryClick()
  setupLoadMoreButton()
  setupInfiniteScroll()
  setupTabs()
  setupCategories()
  setupLoadingModeToggle()
  setupPaginationClick()
}
