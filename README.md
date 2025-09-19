# Password Change Interface

A modern, user-friendly password change interface that allows users to see their password input when needed.

## Features

- **Visible Password Input**: Toggle password visibility using the eye icon (👁️/🙈)
- **Form Validation**: Client-side validation for password matching and requirements
- **Responsive Design**: Works on both desktop and mobile devices
- **User-Friendly Interface**: Clean, modern design with visual feedback

## How to Use

1. Open `index.html` in a web browser
2. Fill in your current password
3. Enter your new password
4. Confirm your new password
5. Use the eye icons (👁️) next to each field to toggle password visibility
6. Click "Change Password" to submit the form

## Password Requirements

- New password must be at least 6 characters long
- New password must be different from current password
- New password and confirmation must match

## Files

- `index.html` - Main HTML structure
- `styles.css` - CSS styling and responsive design
- `script.js` - JavaScript functionality for password visibility toggle and form validation

## Key Functionality

The main feature requested - **showing the input to change passwords** - is implemented through:

1. **Password Visibility Toggle**: Each password field has an eye icon that allows users to see their typed password
2. **Real-time Input Display**: When the eye icon is clicked, the password field changes from `type="password"` to `type="text"`, making the input visible
3. **Visual Feedback**: The eye icon changes from 👁️ (show) to 🙈 (hide) to indicate the current state

This solves the problem of users not being able to see what they're typing when changing passwords.