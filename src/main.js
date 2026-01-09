
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { state } from './state.js'
import { fetchPhotos } from './api.js'
import { displayPhotos } from './ui.js'
import { updateFavoritesCount } from './storage.js'
import { setupEventHandlers } from './events.js'

async function init() {
  setupEventHandlers()

  updateFavoritesCount()

  const photos = await fetchPhotos(state.currentQuery, 1)
  state.photos = photos
  displayPhotos(photos)
}

init()
