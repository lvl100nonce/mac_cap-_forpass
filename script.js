document.addEventListener('DOMContentLoaded', function() {
    const passwordForm = document.getElementById('passwordForm');
    const messageDiv = document.getElementById('message');
    const toggleButtons = document.querySelectorAll('.toggle-password');

    // Password visibility toggle functionality
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            const eyeIcon = this.querySelector('.eye-icon');

            if (targetInput.type === 'password') {
                targetInput.type = 'text';
                eyeIcon.textContent = '🙈';
                this.setAttribute('aria-label', 'Hide password');
            } else {
                targetInput.type = 'password';
                eyeIcon.textContent = '👁️';
                this.setAttribute('aria-label', 'Show password');
            }
        });
    });

    // Form submission handling
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Clear previous messages
        hideMessage();

        // Basic validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showMessage('New passwords do not match.', 'error');
            return;
        }

        if (newPassword.length < 6) {
            showMessage('New password must be at least 6 characters long.', 'error');
            return;
        }

        if (currentPassword === newPassword) {
            showMessage('New password must be different from current password.', 'error');
            return;
        }

        // Simulate password change (in a real app, this would make an API call)
        showMessage('Password changed successfully!', 'success');
        
        // Clear the form after successful submission
        setTimeout(() => {
            passwordForm.reset();
            hideMessage();
        }, 3000);
    });

    // Show message function
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
    }

    // Hide message function
    function hideMessage() {
        messageDiv.style.display = 'none';
        messageDiv.className = 'message';
    }

    // Real-time password matching validation
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    function validatePasswordMatch() {
        if (confirmPasswordInput.value && newPasswordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity('Passwords do not match');
        } else {
            confirmPasswordInput.setCustomValidity('');
        }
    }

    newPasswordInput.addEventListener('input', validatePasswordMatch);
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);
});