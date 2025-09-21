import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from './supakey'
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
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)
  const [updated, setUpdated] = useState(false)
  const [view, setView] = useState('password')
  

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
    const code = getParam('code')
  const type = getParam('type')
    const err = getParam('error') || getParam('error_code')
    const errDesc = getParam('error_description')

    // Handle email confirmation (?code=...) and hash-based signup links
    if (code || type === 'signup' || type === 'magiclink') {
      setView('verifying')
      setStatus('Verifying email...')
      if (supabase) {
        const run = code
          ? supabase.auth.exchangeCodeForSession(code)
          : Promise.resolve({ error: null })
        run
          .then(async ({ error }) => {
            if (error) throw error
            // Confirm we have a user
            const { data, error: uErr } = await supabase.auth.getUser()
            if (uErr) throw uErr
            if (data?.user) {
              setVerified(true)
              setView('verified')
              setStatus('Email verified successfully! You may close this tab or return to the app.')
            } else {
              setView('password')
              setStatus('Email verified. You may close this tab or return to the app.')
            }
          })
          .catch((e) => {
            setView('password')
            setStatus(`Error verifying email: ${e.message}`)
          })
          .finally(() => {
            const newUrl = `${window.location.origin}/`
            safeReplaceUrl(newUrl)
          })
      }
    }

    // Recovery flow: send to dedicated change page so UI is focused
    if (type === 'recovery') {
      const next = `/change${window.location.search}${window.location.hash}`
      window.location.replace(next)
      return
    }

    // Show supabase error params from URL (e.g., otp_expired)
    if (err || errDesc) {
      const readable = decodeURIComponent(errDesc || err || '')
      setView('password')
      setStatus(readable || 'The link is invalid or has expired. Please request a new email.')
    }

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'PASSWORD_RECOVERY') {
          setView('password')
          setStatus('Enter your new password below')
        }
      })
      return () => subscription.unsubscribe()
    }
  }, [])

  const getStatusColor = () => {
    if (status.includes('successfully') || status.includes('✓')) return 'green'
    if (status.toLowerCase().includes('error') || status.includes('not match')) return 'red'
    return 'gray'
  }

  const renderVerification = () => (
    <div style={{ marginTop: '1em' }}>
      <h3>{view === 'verified' ? 'Email Verified' : 'Verifying…'}</h3>
      <p>
        {status || (view === 'verified'
          ? 'Email verified successfully! You may close this tab or return to the app.'
          : 'Verifying email...')}
      </p>
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

  {renderVerification()}

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