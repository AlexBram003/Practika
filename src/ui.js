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
