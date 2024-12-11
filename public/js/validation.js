const adminForm = document.getElementById('adminLoginForm');

    adminForm.addEventListener('submit', function (event) {
        let valid = true;

        // Username validation
        const username = document.getElementById('adminUsername');
        const usernameError = document.getElementById('usernameError');
        if (username.value.trim() === '') {
            usernameError.textContent = 'Username is required.';
            usernameError.style.display = 'block';
            valid = false;
        } else {
            usernameError.style.display = 'none';
        }

        // Password validation
        const password = document.getElementById('adminPassword');
        const passwordError = document.getElementById('passwordError');
        if (password.value.trim() === '') {
            passwordError.textContent = 'Password is required.';
            passwordError.style.display = 'block';
            valid = false;
        } else {
            passwordError.style.display = 'none';
        }

        // If invalid, prevent form submission
        if (!valid) {
            event.preventDefault();
        }
    });

    // Remove message query parameter from URL
    if (window.location.search.indexOf('message=') > -1) {
        const url = new URL(window.location);
        url.searchParams.delete('message');
        window.history.replaceState({}, document.title, url.href);
    }