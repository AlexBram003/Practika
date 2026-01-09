import { elements } from './dom.js'
import { state } from './state.js'
import { isFavorite, getFavorites } from './storage.js'

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

export function displayPhotos(photos, append = false) {
  if (!append) {
    elements.photoGallery.innerHTML = ''
  }

  // Видалити повідомлення про кінець, якщо є нові фото
  if (photos.length > 0) {
    const existingEndMessage = elements.photoGallery.querySelector('.end-message')
    if (existingEndMessage) {
      existingEndMessage.remove()
    }
  }

  if (photos.length === 0) {
    // Якщо це режим довантаження (append) - не очищаємо існуючі фото
    if (append) {
      // Простоховаємо кнопки завантаження, фото залишаються
      elements.loadMoreBtn.classList.add('d-none')
      elements.scrollHint.classList.add('d-none')

      // Можна показати повідомлення що більше фото немає
      const existingEndMessage = elements.photoGallery.querySelector('.end-message')
      if (!existingEndMessage) {
        const endMessage = document.createElement('div')
        endMessage.className = 'col-12 end-message'
        endMessage.innerHTML = `
          <div class="text-center text-muted py-4">
            <p>📷 Це всі фото за вашим запитом</p>
          </div>
        `
        elements.photoGallery.appendChild(endMessage)
      }
      return
    }

    // Якщо це новий пошук (не append) - показуємо empty state
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

  photos.forEach(photo => {
    const photoCard = createPhotoCard(photo)
    elements.photoGallery.appendChild(photoCard)
  })

  // Показувати елементи керування для обох вкладок
  switch (state.loadingMode) {
    case 'pagination':
      elements.paginationContainer.classList.remove('d-none')
      elements.loadMoreBtn.classList.add('d-none')
      elements.scrollHint.classList.add('d-none')

      if (state.currentTab === 'all') {
        renderPagination(state.currentPage, state.totalPages)
      } else if (state.currentTab === 'favorites') {
        // Підрахувати кількість сторінок для улюблених з врахуванням фільтрів
        let allFavorites = getFavorites()

        // Застосувати фільтр по лайках
        if (state.minLikes > 0) {
          allFavorites = allFavorites.filter(photo => photo.likes >= state.minLikes)
        }

        const totalFavPages = Math.max(1, Math.ceil(allFavorites.length / state.photosPerPage))
        renderPagination(state.favoritesPage, totalFavPages)
      }
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

export function showPhotoModal(photoId) {
  let photo = state.photos.find(p => p.id === photoId)

  if (!photo) {
    const favorites = getFavorites()
    photo = favorites.find(p => p.id === photoId)
  }

  if (!photo) return

  elements.modalPhotoImg.src = photo.urls.regular
  elements.modalPhotoImg.alt = photo.alt_description || 'Photo'
  elements.modalPhotoTitle.textContent = photo.alt_description || 'Фото'
  elements.modalPhotoDescription.textContent = photo.description || photo.alt_description || ''
  elements.modalPhotoAuthor.innerHTML = `<strong>Автор:</strong> ${photo.user.name} (@${photo.user.username})`
  elements.downloadPhotoBtn.href = photo.links.html

  elements.photoModal.show()
}

export function showLoading(show) {
  if (show) {
    elements.loadingSpinner.classList.remove('d-none')
  } else {
    elements.loadingSpinner.classList.add('d-none')
  }
}

export function showError(message) {
  elements.errorAlert.textContent = message
  elements.errorAlert.classList.remove('d-none')
}

export function hideError() {
  elements.errorAlert.classList.add('d-none')
}

export function renderPagination(currentPage, totalPages) {
  elements.paginationNav.innerHTML = ''

  const maxVisiblePages = 5
  let startPage = Math.max(1, currentPage - 2)
  let endPage = Math.min(totalPages, currentPage + 2)

  if (endPage - startPage < maxVisiblePages - 1) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    } else if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
  }

  const prevLi = document.createElement('li')
  prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`
  prevLi.innerHTML = `
    <button class="page-link" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>
      Попередня
    </button>
  `
  elements.paginationNav.appendChild(prevLi)

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

  for (let i = startPage; i <= endPage; i++) {
    const li = document.createElement('li')
    li.className = `page-item ${i === currentPage ? 'active' : ''}`
    li.innerHTML = `<button class="page-link" data-page="${i}">${i}</button>`
    elements.paginationNav.appendChild(li)
  }

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

  const nextLi = document.createElement('li')
  nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`
  nextLi.innerHTML = `
    <button class="page-link" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>
      Наступна
    </button>
  `
  elements.paginationNav.appendChild(nextLi)
}
