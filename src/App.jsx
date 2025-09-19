import { useEffect, useState } from 'react'
import './App.css'
import { supabase, SUPABASE_READY } from './supakey'
import logo from '../assets/logo.png'

function App() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [inRecovery, setInRecovery] = useState(false)

  useEffect(() => {
    // Detect recovery mode from URL
    const hash = window.location.hash
    const search = window.location.search
    const params = new URLSearchParams(search || (hash.startsWith('#') ? hash.slice(1) : ''))
    const type = params.get('type')
    if (type === 'recovery') {
      setInRecovery(true)
      setStatus('Enter your new password below')
    }

    // Show any Supabase error coming from the link
    const error = params.get('error') || params.get('error_code')
    const errorDesc = params.get('error_description')
    if (error || errorDesc) {
      const readable = decodeURIComponent(errorDesc || error || '')
      setStatus(readable || 'The link is invalid or has expired. Please request a new reset email.')
    }

    // Fallback: listen for auth state changes
    if (supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'PASSWORD_RECOVERY') {
          setInRecovery(true)
          setStatus('Enter your new password below')
        }
      })
      return () => subscription.unsubscribe()
    }
  }, [])

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setStatus('Passwords do not match!')
      return
    }

    if (newPassword.length < 6) {
      setStatus('Password must be at least 6 characters long!')
      return
    }

    setLoading(true)
    setStatus('')

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) {
        setStatus(`Error: ${error.message}`)
      } else {
        setStatus('Password updated successfully! ✓')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (err) {
      setStatus(`Error: ${err.message}`)
    }

    setLoading(false)
  }

  const getStatusColor = () => {
    if (status.includes('successfully') || status.includes('✓')) return 'green'
    if (status.toLowerCase().includes('error') || status.includes('not match')) return 'red'
    return 'gray'
  }

  const renderChangePassword = () => (
    <div style={{ marginTop: '1em' }}>
      <h3>Set New Password</h3>
      <p>Enter your new password below.</p>
      <form onSubmit={handlePasswordUpdate}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            required
            style={{
              padding: '8px',
              width: '250px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              display: 'block',
              marginBottom: '8px',
            }}
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            style={{
              padding: '8px',
              width: '250px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              display: 'block',
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            background: '#4CAF50',
            color: 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
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

        {!SUPABASE_READY ? (
          <div style={{ marginTop: '1em' }}>
            <h3>Environment Not Configured</h3>
            <p>
              Please create <code>.env.local</code> with:
            </p>
            <pre style={{ background: '#f7f7f7', padding: '8px', borderRadius: '4px' }}>
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_anon_key
            </pre>
            <p>Then restart the dev server.</p>
          </div>
        ) : inRecovery ? (
          renderChangePassword()
        ) : (
          <div style={{ marginTop: '1em' }}>
            <h3>Open the email link to continue</h3>
            <p>
              To change your password, open the reset link sent to your email.
              This page will automatically show the Change Password form from that link.
            </p>
          </div>
        )}

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