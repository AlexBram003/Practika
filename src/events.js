import { elements } from './dom.js'
import { state } from './state.js'
import { fetchPhotos } from './api.js'
import { displayPhotos, showPhotoModal, showError } from './ui.js'
import { getFavorites, isFavorite, toggleFavorite } from './storage.js'

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

    elements.allTab.classList.add('active')
    elements.favoritesTab.classList.remove('active')

    // Приховати поле мінімальних лайків
    elements.minLikesContainer.classList.add('d-none')

    // Оновити UI елементів керування
    updateLoadingModeUI()

    const photos = await fetchPhotos(query, 1)
    state.photos = photos
    displayPhotos(photos)
  })
}

export function setupGalleryClick() {
  elements.photoGallery.addEventListener('click', (e) => {
    if (e.target.closest('.favorite-btn')) {
      const btn = e.target.closest('.favorite-btn')
      const photoId = btn.dataset.photoId

      let photo = state.photos.find(p => p.id === photoId)
      if (!photo) {
        const favorites = getFavorites()
        photo = favorites.find(p => p.id === photoId)
      }

      if (photo) {
        toggleFavorite(photo)

        const isFav = isFavorite(photoId)
        btn.textContent = isFav ? '❤️' : '🤍'
        btn.classList.toggle('favorited', isFav)
      }
    }
    else if (e.target.closest('.photo-card') && !e.target.closest('.favorite-btn')) {
      const card = e.target.closest('.photo-card')
      const photoId = card.dataset.photoId
      showPhotoModal(photoId)
    }
  })
}

export async function loadMorePhotos() {
  if (state.isLoading || state.currentTab !== 'all') return
  if (state.loadingMode === 'pagination') return 

  state.currentPage++
  const photos = await fetchPhotos(state.currentQuery, state.currentPage)
  state.photos = [...state.photos, ...photos]
  displayPhotos(photos, true)
}

export function setupLoadMoreButton() {
  elements.loadMoreBtn.addEventListener('click', async () => {
    await loadMorePhotos()
  })
}

function isBottomReached() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight
  const clientHeight = document.documentElement.clientHeight

  return scrollTop + clientHeight >= scrollHeight - 300
}

let scrollTimeout
function handleScroll() {
  clearTimeout(scrollTimeout)

  scrollTimeout = setTimeout(async () => {
    if (isBottomReached() && state.currentTab === 'all' && !state.isLoading && state.loadingMode === 'infinite') {
      await loadMorePhotos()
    }
  }, 200) 
}

export function setupInfiniteScroll() {
  window.addEventListener('scroll', handleScroll)
}

export function setupTabs() {
  elements.allTab.addEventListener('click', async () => {
    state.currentTab = 'all'
    elements.allTab.classList.add('active')
    elements.favoritesTab.classList.remove('active')

    // Приховати поле мінімальних лайків для вкладки "Всі фото"
    elements.minLikesContainer.classList.add('d-none')

    // Показати елементи керування завантаженням для "Всі фото"
    updateLoadingModeUI()

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

    // Показати поле мінімальних лайків для вкладки "Улюблені"
    elements.minLikesContainer.classList.remove('d-none')

    // Приховати елементи керування завантаженням для "Улюблені"
    updateLoadingModeUI()

    let favorites = getFavorites()

    // Застосувати сортування
    favorites = sortPhotos(favorites, state.sortOrder)

    // Застосувати фільтр по лайках для улюблених
    if (state.minLikes > 0) {
      favorites = favorites.filter(photo => photo.likes >= state.minLikes)
    }

    displayPhotos(favorites)
  })
}

export function setupCategories() {
  elements.categoryButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      elements.categoryButtons.forEach(b => b.classList.remove('active'))

      btn.classList.add('active')
      const category = btn.dataset.category

      state.currentQuery = category
      state.currentPage = 1
      state.currentTab = 'all'

      elements.allTab.classList.add('active')
      elements.favoritesTab.classList.remove('active')

      // Приховати поле мінімальних лайків
      elements.minLikesContainer.classList.add('d-none')

      // Оновити UI елементів керування
      updateLoadingModeUI()

      const photos = await fetchPhotos(category, 1)
      state.photos = photos
      displayPhotos(photos)
    })
  })
}

function updateLoadingModeUI() {
  // Для вкладки "Улюблені" приховати всі елементи керування завантаженням
  if (state.currentTab !== 'all') {
    elements.paginationContainer.classList.add('d-none')
    elements.loadMoreBtn.classList.add('d-none')
    elements.scrollHint.classList.add('d-none')
    return
  }

  // Для вкладки "Всі фото" показувати відповідний елемент
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

export function setupLoadingModeToggle() {
  elements.paginationModeBtn.addEventListener('change', () => {
    if (elements.paginationModeBtn.checked) {
      state.loadingMode = 'pagination'
      // Завантажити фото тільки якщо на вкладці "Всі фото"
      if (state.currentTab === 'all') {
        loadPagePhotos(state.currentPage)
      }
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

async function loadPagePhotos(page) {
  state.currentPage = page
  const photos = await fetchPhotos(state.currentQuery, page)
  state.photos = photos
  displayPhotos(photos)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function setupPaginationClick() {
  elements.paginationNav.addEventListener('click', async (e) => {
    // Пагінація працює тільки для вкладки "Всі фото"
    if (state.currentTab !== 'all') return

    if (e.target.classList.contains('page-link')) {
      const page = parseInt(e.target.dataset.page)
      if (page && !isNaN(page)) {
        await loadPagePhotos(page)
      }
    }
  })
}

// ========== ФІЛЬТРИ ==========

// Функція для сортування масиву фотографій
function sortPhotos(photos, sortOrder) {
  const sorted = [...photos] // Копія для immutability

  if (sortOrder === 'popular') {
    // Сортування від найпопулярніших (більше лайків)
    return sorted.sort((a, b) => b.likes - a.likes)
  } else if (sortOrder === 'latest') {
    // Сортування від найновіших (за created_at якщо є)
    return sorted.sort((a, b) => {
      const dateA = new Date(a.created_at || 0)
      const dateB = new Date(b.created_at || 0)
      return dateB - dateA
    })
  }

  // relevant або за замовчуванням - без зміни порядку
  return sorted
}

// Обробка зміни сортування
export function setupSortFilter() {
  elements.sortOrderSelect.addEventListener('change', async () => {
    state.sortOrder = elements.sortOrderSelect.value
    state.currentPage = 1

    // Перевірити поточну вкладку
    if (state.currentTab === 'favorites') {
      // Для улюблених - сортувати локально
      let favorites = getFavorites()

      // Застосувати сортування
      favorites = sortPhotos(favorites, state.sortOrder)

      // Застосувати фільтр по лайках якщо встановлено
      if (state.minLikes > 0) {
        favorites = favorites.filter(photo => photo.likes >= state.minLikes)
      }

      displayPhotos(favorites)
    } else {
      // Для "Всі фото" - перезавантажити з API з новим сортуванням
      const photos = await fetchPhotos(state.currentQuery, 1)
      state.photos = photos
      displayPhotos(photos)
    }
  })
}

// Обробка зміни мінімальних лайків (тільки для улюблених)
let likesTimeout
export function setupLikesFilter() {
  elements.minLikesInput.addEventListener('input', () => {
    clearTimeout(likesTimeout)

    likesTimeout = setTimeout(() => {
      const value = parseInt(elements.minLikesInput.value) || 0
      state.minLikes = value

      // Застосувати фільтр тільки якщо відкрита вкладка "Улюблені"
      if (state.currentTab === 'favorites') {
        let favorites = getFavorites()

        // Застосувати сортування
        favorites = sortPhotos(favorites, state.sortOrder)

        // Застосувати фільтр по лайках
        if (state.minLikes > 0) {
          favorites = favorites.filter(photo => photo.likes >= state.minLikes)
        }

        displayPhotos(favorites)
      }
    }, 500) // Затримка 500мс після останнього введення
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
  setupSortFilter()
  setupLikesFilter()
}
