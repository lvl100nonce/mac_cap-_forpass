import { useEffect, useState } from 'react'
import './App.css'
import { supabase, SUPABASE_READY } from './supakey'
import logo from '../assets/logo.png'

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [updated, setUpdated] = useState(false)

  useEffect(() => {
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

    if (type === 'recovery') {
      setStatus('Enter your new password below')
    }
    if (err || errDesc) {
      const readable = decodeURIComponent(errDesc || err || '')
      setStatus(readable || 'The link is invalid or has expired. Please request a new email.')
    }
  }, [])

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    if (!SUPABASE_READY || !supabase) {
      setStatus('App is not configured for password updates. Please try again later or contact support.')
      return
    }
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
        setStatus('Password updated successfully! ✓ You may close this tab or return to the app.')
        setNewPassword('')
        setConfirmPassword('')
        setUpdated(true)
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

  return (
    <>
      <div className="transparent-rounded-container">
        <img className="brainlogo" src={logo} alt="Logo" />
        <h1>
          <span style={{ color: 'black' }}>MIND</span>
          <span style={{ color: 'green' }}>CONNECT</span>
          <sup style={{ fontSize: '0.6em', marginLeft: '4px', color: 'green' }}>™</sup>
        </h1>

        <div style={{ marginTop: '1em' }}>
          <h3>{updated ? 'Password Updated' : 'Set New Password'}</h3>
          {updated ? (
            <p>{status || 'Password updated successfully! You may close this tab or return to the app.'}</p>
          ) : (
            <>
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
            </>
          )}
        </div>

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
