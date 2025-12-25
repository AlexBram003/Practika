import { elements } from './dom.js'
import { state } from './state.js'
import { isFavorite, getFavorites } from './storage.js'

// ========== DOM МАНІПУЛЯЦІЇ ==========

// Створити HTML картку фото
export function createPhotoCard(photo) {
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
export function displayPhotos(photos, append = false) {
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

  // Показати відповідні елементи залежно від режиму та вкладки
  if (state.currentTab === 'all') {
    switch (state.loadingMode) {
      case 'pagination':
        elements.paginationContainer.classList.remove('d-none')
        elements.loadMoreBtn.classList.add('d-none')
        elements.scrollHint.classList.add('d-none')
        renderPagination(state.currentPage, state.totalPages)
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
  } else {
    // Для вкладки "Улюблені" приховати всі елементи завантаження
    elements.paginationContainer.classList.add('d-none')
    elements.loadMoreBtn.classList.add('d-none')
    elements.scrollHint.classList.add('d-none')
  }
}

// Показати модальне вікно з повним фото
export function showPhotoModal(photoId) {
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
export function showLoading(show) {
  if (show) {
    elements.loadingSpinner.classList.remove('d-none')
  } else {
    elements.loadingSpinner.classList.add('d-none')
  }
}

// Показати повідомлення про помилку
export function showError(message) {
  elements.errorAlert.textContent = message
  elements.errorAlert.classList.remove('d-none')
}

// Сховати повідомлення про помилку
export function hideError() {
  elements.errorAlert.classList.add('d-none')
}

// Створити HTML пагінації
export function renderPagination(currentPage, totalPages) {
  elements.paginationNav.innerHTML = ''

  const maxVisiblePages = 5
  let startPage = Math.max(1, currentPage - 2)
  let endPage = Math.min(totalPages, currentPage + 2)

  // Коригування діапазону
  if (endPage - startPage < maxVisiblePages - 1) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    } else if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
  }

  // Кнопка "Попередня"
  const prevLi = document.createElement('li')
  prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`
  prevLi.innerHTML = `
    <button class="page-link" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>
      Попередня
    </button>
  `
  elements.paginationNav.appendChild(prevLi)

  // Перша сторінка
  if (startPage > 1) {
    const firstLi = document.createElement('li')
    firstLi.className = 'page-item'
    firstLi.innerHTML = `<button class="page-link" data-page="1">1</button>`
    elements.paginationNav.appendChild(firstLi)

    if (startPage > 2) {
      const dotsLi = document.createElement('li')
      dotsLi.className = 'page-item disabled'
      dotsLi.innerHTML = `<span class="page-link">...</span>`
      elements.paginationNav.appendChild(dotsLi)
    }
  }

  // Сторінки
  for (let i = startPage; i <= endPage; i++) {
    const li = document.createElement('li')
    li.className = `page-item ${i === currentPage ? 'active' : ''}`
    li.innerHTML = `<button class="page-link" data-page="${i}">${i}</button>`
    elements.paginationNav.appendChild(li)
  }

  // Остання сторінка
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const dotsLi = document.createElement('li')
      dotsLi.className = 'page-item disabled'
      dotsLi.innerHTML = `<span class="page-link">...</span>`
      elements.paginationNav.appendChild(dotsLi)
    }

    const lastLi = document.createElement('li')
    lastLi.className = 'page-item'
    lastLi.innerHTML = `<button class="page-link" data-page="${totalPages}">${totalPages}</button>`
    elements.paginationNav.appendChild(lastLi)
  }

  // Кнопка "Наступна"
  const nextLi = document.createElement('li')
  nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`
  nextLi.innerHTML = `
    <button class="page-link" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>
      Наступна
    </button>
  `
  elements.paginationNav.appendChild(nextLi)
}
