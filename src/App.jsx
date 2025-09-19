import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from './supakey'

function App() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Request reset, 2: Enter new password
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (_event === 'PASSWORD_RECOVERY') {
        setStep(2) // User clicked reset link, show password form
        setStatus('Enter your new password below')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Step 1: Send password reset email
  const handleResetRequest = async (e) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setStatus('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `http://localhost:5173/`,
      })

      if (error) {
        setStatus(`Error: ${error.message}`)
      } else {
        setStatus('Password reset email sent! Check your inbox.')
        setStep(1.5) // Waiting for email click
      }
    } catch (err) {
      setStatus(`Error: ${err.message}`)
    }

    setLoading(false)
  }

  // Step 2: Update password
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
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        setStatus(`Error: ${error.message}`)
      } else {
        setStatus('Password updated successfully! ✓')
        setNewPassword('')
        setConfirmPassword('')
        // Reset to initial state after successful update
        setTimeout(() => {
          setStep(1)
          setStatus('')
        }, 3000)
      }
    } catch (err) {
      setStatus(`Error: ${err.message}`)
    }

    setLoading(false)
  }

  const getStatusColor = () => {
    if (status.includes('successfully') || status.includes('✓')) return 'green'
    if (status.includes('sent')) return 'blue'
    if (status.includes('Error') || status.includes('not match')) return 'red'
    return 'gray'
  }

  const renderStep1 = () => (
    <div style={{ marginTop: "1em" }}>
      <h3>Reset Your Password</h3>
      <p>Enter your email address to receive a password reset link.</p>
      <form onSubmit={handleResetRequest}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          style={{ 
            padding: '8px', 
            marginRight: '10px', 
            width: '250px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            background: '#4CAF50',
            color: 'white',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  )

  const renderStep15 = () => (
    <div style={{ marginTop: "1em" }}>
      <h3>Check Your Email</h3>
      <p>We've sent a password reset link to <strong>{email}</strong></p>
      <p>Click the link in the email to continue with resetting your password.</p>
      <button 
        onClick={() => {setStep(1); setStatus(''); setEmail('')}}
        style={{
          padding: '8px 16px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          background: 'white',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        Try Different Email
      </button>
    </div>
  )

  const renderStep2 = () => (
    <div style={{ marginTop: "1em" }}>
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
              marginBottom: '8px'
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
              display: 'block'
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
            cursor: loading ? 'not-allowed' : 'pointer'
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
        <img className="brainlogo" src="../assets/logo.png" alt="Logo" />
        <h1>
          <span style={{ color: "black" }}>MIND</span>
          <span style={{ color: "green" }}>CONNECT</span>
          <sup style={{ fontSize: "0.6em", marginLeft: "4px", color: "green" }}>™</sup>
        </h1>
        
        {step === 1 && renderStep1()}
        {step === 1.5 && renderStep15()}
        {step === 2 && renderStep2()}

        {status && (
          <div style={{ marginTop: "1em" }}>
            <p style={{ color: getStatusColor(), fontWeight: 'bold' }}>
              {status}
            </p>
          </div>
        )}

        {/* Quick test section for development */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ marginTop: "1em", opacity: 0.7 }}>
            <h4>Development Controls:</h4>
            <button onClick={() => setStep(1)} style={{ marginRight: '5px' }}>
              Step 1: Email
            </button>
            <button onClick={() => setStep(2)} style={{ marginRight: '5px' }}>
              Step 2: Password
            </button>
            <button onClick={() => setEmail('test@example.com')}>
              Fill Test Email
            </button>
          </div>
        )}
      </div>
      <footer className="footer-bg">
        <p><span style={{ color: "white" }}>MindConnect</span></p>
      </footer>
    </>
  )
}

export default App