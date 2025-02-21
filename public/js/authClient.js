document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('loginContainer');
    const registerContainer = document.getElementById('registerContainer');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
  
    // Показываем только форму логина по умолчанию
    if (loginContainer) loginContainer.classList.add('active');
    if (registerContainer) registerContainer.classList.add('hidden');
  
    // Переключение между формами (используем классы)
    if (showRegisterLink && loginContainer && registerContainer) {
      showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginContainer.classList.remove('active');
        loginContainer.classList.add('hidden');
        registerContainer.classList.remove('hidden');
        registerContainer.classList.add('active');
      });
    }
  
    if (showLoginLink && loginContainer && registerContainer) {
      showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerContainer.classList.remove('active');
        registerContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
        loginContainer.classList.add('active');
      });
    }
  
    // Обработка логина
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
  
        if (!username || !password) {
          alert('Please fill out both username and password.');
          return;
        }
  
        try {
          const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          const data = await res.json();
          if (data.success) {
            localStorage.setItem('token', data.token);
            window.location.href = '/';
          } else {
            alert('Login failed: ' + (data.error || data.message));
          }
        } catch (err) {
          console.error(err);
          alert('An error occurred during login');
        }
      });
    }
  
    // Обработка регистрации
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('registerEmail').value.trim();
        const username = document.getElementById('registerUsername').value.trim();
        const password = document.getElementById('registerPassword').value.trim();
        const confirmPassword = document.getElementById('registerPasswordConfirm').value.trim();
        const verification = document.getElementById('registerVerification').value.trim();
  
        if (!email || !username || !password || !confirmPassword || !verification) {
          alert('Please fill out all fields.');
          return;
        }
        if (password !== confirmPassword) {
          alert('Passwords do not match.');
          return;
        }
  
        try {
          const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password, verification })
          });
          const data = await res.json();
          if (data.success) {
            alert('Registration successful! Please login.');
            registerForm.classList.remove('active');
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
            loginForm.classList.add('active');
          } else {
            alert('Registration failed: ' + (data.message || data.error));
          }
        } catch (err) {
          console.error(err);
          alert('An error occurred during registration');
        }
      });
    }
  
    // Обработка запроса верификационного кода
    const getCodeBtn = document.getElementById('getVerificationCode');
    if (getCodeBtn) {
      getCodeBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('registerEmail').value.trim();
        if (!email) {
          alert('Please enter your email');
          return;
        }
        try {
          const res = await fetch(`/api/verification?email=${encodeURIComponent(email)}`);
          const data = await res.json();
          if (data.success) {
            alert('Verification code sent to your email');
          } else {
            alert('Failed to send verification code: ' + (data.message || data.error));
          }
        } catch (err) {
          console.error(err);
          alert('Error sending verification code');
        }
      });
    }
  });
  