import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import StorageUnavailable from './components/StorageUnavailable.jsx'
import { checkStorageAvailability } from './utils/storage.js'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

function renderApp() {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

function renderStorageUnavailable(result) {
  root.render(
    <StrictMode>
      <StorageUnavailable initialResult={result} />
    </StrictMode>,
  )
}

const storageResult = checkStorageAvailability()

if (storageResult.ok) {
  renderApp()
} else {
  renderStorageUnavailable(storageResult)
}
