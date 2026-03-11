import { useState } from 'react'
import './App.css'

function getInitialPermission(): 'idle' | 'granted' | 'denied' {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    const perm = Notification.permission
    return perm === 'default' ? 'idle' : perm
  }
  return 'idle'
}

function showNotification(
  title: string,
  body: string,
  onPermissionChange?: (granted: boolean) => void
) {
  if (!('Notification' in window)) {
    alert('Уведомления не поддерживаются в этом браузере')
    return
  }

  if (Notification.permission === 'granted') {
    new Notification(title, { body })
    onPermissionChange?.(true)
  } else if (Notification.permission === 'denied') {
    onPermissionChange?.(false)
  } else {
    Notification.requestPermission().then((permission) => {
      onPermissionChange?.(permission === 'granted')
      if (permission === 'granted') {
        new Notification(title, { body })
      }
    })
  }
}

function App() {
  const [status, setStatus] = useState<'idle' | 'granted' | 'denied'>(getInitialPermission)

  const sendNow = () => {
    showNotification('Сейчас!', 'Это уведомление показано сразу', (granted) => {
      setStatus(granted ? 'granted' : 'denied')
    })
  }

  const sendDelayed = () => {
    showNotification('Через 2 секунды', 'Это уведомление показано с задержкой', (granted) => {
      setStatus(granted ? 'granted' : 'denied')
    })
  }

  const requestPermission = () => {
    if (!('Notification' in window)) return
    Notification.requestPermission().then((permission) => {
      setStatus(permission === 'default' ? 'idle' : permission)
    })
  }

  return (
    <div className="app">
      <h1>Push Test</h1>
      <p className="subtitle">Тест PWA и уведомлений на телефоне</p>

      <div className="buttons">
        <button className="btn btn-now" onClick={sendNow}>
          Уведомление сейчас
        </button>
        <button
          className="btn btn-delayed"
          onClick={() => setTimeout(sendDelayed, 2000)}
        >
          Уведомление через 2 сек
        </button>
      </div>

      {status === 'idle' && (
        <p className="hint">При первом нажатии появится запрос разрешения</p>
      )}

      {status === 'denied' && (
        <p className="status denied">
          Уведомления заблокированы. Разрешите в настройках браузера.
        </p>
      )}

      {(status === 'denied' || status === 'granted') && (
        <button className="btn btn-secondary" onClick={requestPermission}>
          Изменить разрешение
        </button>
      )}
    </div>
  )
}

export default App
