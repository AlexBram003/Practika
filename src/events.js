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
  if (state.isLoading) return
  if (state.loadingMode === 'pagination') return

  if (state.currentTab === 'all') {
    // Завантажити більше фото з API
    state.currentPage++
    const photos = await fetchPhotos(state.currentQuery, state.currentPage)
    state.photos = [...state.photos, ...photos]
    displayPhotos(photos, true)
  } else if (state.currentTab === 'favorites') {
    // Завантажити більше улюблених локально
    const totalPages = getFavoritesTotalPages()
    if (state.favoritesPage >= totalPages) return // Немає більше фото

    state.favoritesPage++
    const newFavorites = getPagedFavorites(state.favoritesPage)
    state.displayedFavorites = [...state.displayedFavorites, ...newFavorites]
    displayPhotos(newFavorites, true)
  }
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
    if (isBottomReached() && !state.isLoading && state.loadingMode === 'infinite') {
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

    // Оновити елементи керування для "Улюблені"
    updateLoadingModeUI()

    // Ініціалізація улюблених залежно від режиму
    state.favoritesPage = 1

    if (state.loadingMode === 'pagination') {
      // Режим пагінації - показати першу сторінку
      const favorites = getPagedFavorites(1)
      displayPhotos(favorites)
    } else {
      // Режими loadMore і infinite - показати першу порцію
      const favorites = getPagedFavorites(1)
      state.displayedFavorites = favorites
      displayPhotos(favorites)
    }
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
  // Показувати відповідний елемент керування для обох вкладок
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
      updateLoadingModeUI()

      // Перезавантажити відповідно до поточної вкладки
      if (state.currentTab === 'all') {
        loadPagePhotos(state.currentPage)
      } else if (state.currentTab === 'favorites') {
        loadPageFavorites(state.favoritesPage)
      }
    }
  })

  elements.loadMoreModeBtn.addEventListener('change', () => {
    if (elements.loadMoreModeBtn.checked) {
      state.loadingMode = 'loadMore'
      updateLoadingModeUI()

      // Скинути на першу сторінку для режиму loadMore
      if (state.currentTab === 'favorites') {
        state.favoritesPage = 1
        const favorites = getPagedFavorites(1)
        state.displayedFavorites = favorites
        displayPhotos(favorites)
      }
    }
  })

  elements.infiniteScrollModeBtn.addEventListener('change', () => {
    if (elements.infiniteScrollModeBtn.checked) {
      state.loadingMode = 'infinite'
      updateLoadingModeUI()

      // Скинути на першу сторінку для режиму infinite
      if (state.currentTab === 'favorites') {
        state.favoritesPage = 1
        const favorites = getPagedFavorites(1)
        state.displayedFavorites = favorites
        displayPhotos(favorites)
      }
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

function loadPageFavorites(page) {
  state.favoritesPage = page
  const favorites = getPagedFavorites(page)
  displayPhotos(favorites)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function setupPaginationClick() {
  elements.paginationNav.addEventListener('click', async (e) => {
    if (e.target.classList.contains('page-link')) {
      const page = parseInt(e.target.dataset.page)
      if (page && !isNaN(page)) {
        if (state.currentTab === 'all') {
          await loadPagePhotos(page)
        } else if (state.currentTab === 'favorites') {
          loadPageFavorites(page)
        }
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

// Отримати відфільтровані та відсортовані улюблені
function getFilteredFavorites() {
  let favorites = getFavorites()

  // Застосувати сортування
  favorites = sortPhotos(favorites, state.sortOrder)

  // Застосувати фільтр по лайках
  if (state.minLikes > 0) {
    favorites = favorites.filter(photo => photo.likes >= state.minLikes)
  }

  return favorites
}

// Отримати порцію улюблених для конкретної сторінки
function getPagedFavorites(page) {
  const allFavorites = getFilteredFavorites()
  const start = (page - 1) * state.photosPerPage
  const end = start + state.photosPerPage
  return allFavorites.slice(start, end)
}

// Отримати загальну кількість сторінок улюблених
function getFavoritesTotalPages() {
  const allFavorites = getFilteredFavorites()
  return Math.ceil(allFavorites.length / state.photosPerPage)
}

// Обробка зміни сортування
export function setupSortFilter() {
  elements.sortOrderSelect.addEventListener('change', async () => {
    state.sortOrder = elements.sortOrderSelect.value

    if (state.currentTab === 'favorites') {
      // Для улюблених - оновити відповідно до режиму
      state.favoritesPage = 1

      if (state.loadingMode === 'pagination') {
        loadPageFavorites(1)
      } else {
        const favorites = getPagedFavorites(1)
        state.displayedFavorites = favorites
        displayPhotos(favorites)
      }
    } else {
      // Для "Всі фото" - перезавантажити з API з новим сортуванням
      state.currentPage = 1
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
        state.favoritesPage = 1

        if (state.loadingMode === 'pagination') {
          loadPageFavorites(1)
        } else {
          const favorites = getPagedFavorites(1)
          state.displayedFavorites = favorites
          displayPhotos(favorites)
        }
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
