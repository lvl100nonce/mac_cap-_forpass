import { useEffect, useState } from 'react'
import './App.css'
import logo from '../assets/logo.png'

// Small helpers to keep try/catch noise out of JSX logic
function safeReplaceUrl(newUrl) {
  try {
    window.history.replaceState({}, '', newUrl)
  } catch {
    // no-op: URL replacement failed (e.g., older browsers or CSP)
  }
}

function normalizePath() {
  try {
    const rawPath = window.location.pathname || '/'
    const decodedPath = decodeURIComponent(rawPath)
    if (!decodedPath || decodedPath === '/%20' || decodedPath === '/ ' || decodedPath.trim() === '') {
      const newUrl = `${window.location.origin}/${window.location.search}${window.location.hash}`
      safeReplaceUrl(newUrl)
    }
  } catch {
    // no-op: best-effort path normalization only
  }
}

function App() {
  const [status, setStatus] = useState('')

  useEffect(() => {
    // Normalize accidental whitespace path like '/%20'
    normalizePath()

    const searchParams = new URLSearchParams(window.location.search || '')
    const hashParams = new URLSearchParams(
      window.location.hash && window.location.hash.startsWith('#')
        ? window.location.hash.slice(1)
        : ''
    )

    const getParam = (k) => searchParams.get(k) || hashParams.get(k)
    const type = getParam('type')
    const err = getParam('error') || getParam('error_code')
    const errDesc = getParam('error_description')

    // Recovery flow: send to dedicated change page so UI is focused
    if (type === 'recovery') {
      const next = `/change${window.location.search}${window.location.hash}`
      window.location.replace(next)
      return
    }

    // Show supabase error params from URL (e.g., otp_expired)
    if (err || errDesc) {
      const readable = decodeURIComponent(errDesc || err || '')
      setStatus(readable || 'The link is invalid or has expired. Please request a new email.')
    }
  }, [])

  const getStatusColor = () => {
    if (status.includes('successfully') || status.includes('✓')) return 'green'
    if (status.toLowerCase().includes('error') || status.includes('not match')) return 'red'
    return 'gray'
  }

  const renderWelcome = () => (
    <div style={{ marginTop: '1em' }}>
      <h3>Welcome</h3>
      <p>Click the links in your email to verify your account or reset your password.</p>
    </div>
  )

  return (
    <>
      <div className="transparent-rounded-container">
        <img className="brainlogo" src={logo} alt="Logo" />
        <h1>
          <span style={{ color: 'black' }}>MIND</span>
          <span style={{ color: 'green' }}>CONNECT</span>
          <sup style={{ fontSize: '0.6em', marginLeft: '4px', color: 'green' }}>™</sup>
        </h1>

        {renderWelcome()}

        {status && (
          <div style={{ marginTop: '1em' }}>
            <p style={{ color: getStatusColor(), fontWeight: 'bold' }}>{status}</p>
          </div>
        )}
      </div>
      <footer className="footer-bg">
        <p>
          <span style={{ color: 'white' }}>MindConnect</span>
        </p>
      </footer>
    </>
  )
}

export default App