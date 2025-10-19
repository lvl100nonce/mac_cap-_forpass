import { useEffect, useState } from 'react'
import './App.css'
import logo from '../assets/logo.png'
import { supabase, SUPABASE_READY } from './supakey'

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
  const [showResend, setShowResend] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [sendingReset, setSendingReset] = useState(false)

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
      const lower = (readable || '').toLowerCase()
      setStatus(readable || 'The link is invalid or has expired. Please request a new email.')
      // show a resend form automatically when the token/otp expired
      if (lower.includes('expired') || (err && String(err).toLowerCase().includes('expired'))) {
        setShowResend(true)
      }
    }
  }, [])

  const sendResetEmail = async (email) => {
    if (!SUPABASE_READY || !supabase) {
      setStatus('App is not configured to send reset emails. Contact support.')
      return
    }
    if (!email) {
      setStatus('Please enter your email address')
      return
    }
    try {
      setSendingReset(true)
      setStatus('')
      const redirectTo = `${window.location.origin}/change`
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
      if (error) {
        setStatus(`Error sending reset email: ${error.message}`)
      } else {
        setStatus('Reset email sent — check your inbox.')
        setShowResend(false)
      }
    } catch (err) {
      setStatus(`Error: ${err.message}`)
    }
    setSendingReset(false)
  }

  const getStatusColor = () => {
    if (status.includes('successfully') || status.includes('✓')) return 'green'
    if (status.toLowerCase().includes('error') || status.includes('not match')) return 'red'
    return 'gray'
  }

  const renderWelcome = () => (
    <div style={{ marginTop: '1em' }}>
      <h3 style={{ color: 'green' }}>Welcome</h3>
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

        {showResend && (
          <div style={{ marginTop: '1em', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <p style={{ margin: 0 }}>Enter your email to receive a new reset link:</p>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ padding: '8px 10px', width: '260px', borderRadius: '6px', border: '1px solid #ddd' }}
            />
            <div>
              <button
                onClick={() => sendResetEmail(resetEmail)}
                disabled={sendingReset}
                style={{ marginTop: '6px', background: '#4CAF50', color: 'white' }}
              >
                {sendingReset ? 'Sending...' : 'Send reset email'}
              </button>
            </div>
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