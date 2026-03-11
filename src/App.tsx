import { useState } from 'react'
import './App.css'

function showNotification(title: string, body: string) {
  if (!('Notification' in window)) {
    alert('Уведомления не поддерживаются в этом браузере')
    return
  }

  if (Notification.permission === 'granted') {
    new Notification(title, { body })
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification(title, { body })
      }
    })
  }
}

function getInitialPermission(): 'idle' | 'requesting' | 'granted' | 'denied' {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    const perm = Notification.permission
    return perm === 'default' ? 'idle' : perm
  }
  return 'idle'
}

function App() {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>(getInitialPermission)

  const requestPermission = () => {
    if (!('Notification' in window)) return
    setStatus('requesting')
    Notification.requestPermission().then((permission) => {
      setStatus(permission === 'default' ? 'idle' : permission)
    })
  }

  const sendNow = () => {
    showNotification('Сейчас!', 'Это уведомление показано сразу')
  }

  const sendDelayed = () => {
    showNotification('Через 2 секунды', 'Это уведомление показано с задержкой')
  }

  return (
    <div className="app">
      <h1>Push Test</h1>
      <p className="subtitle">Тест PWA и уведомлений на телефоне</p>

      {status === 'idle' && (
        <button className="btn btn-primary" onClick={requestPermission}>
          Разрешить уведомления
        </button>
      )}

      {status === 'requesting' && <p className="status">Ожидаем ответ...</p>}

      {status === 'granted' && (
        <div className="buttons">
          <button className="btn btn-now" onClick={sendNow}>
            Уведомление сейчас
          </button>
          <button
            className="btn btn-delayed"
            onClick={() => {
              setTimeout(sendDelayed, 2000)
            }}
          >
            Уведомление через 2 сек
          </button>
        </div>
      )}

      {status === 'denied' && (
        <p className="status denied">
          Уведомления заблокированы. Разрешите их в настройках браузера.
        </p>
      )}

      {status !== 'idle' && status !== 'requesting' && (
        <button className="btn btn-secondary" onClick={requestPermission}>
          Изменить разрешение
        </button>
      )}
    </div>
  )
}

export default App
