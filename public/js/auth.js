document.addEventListener('DOMContentLoaded', function() {
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const loginForm = document.querySelector('.login-form');
    const registerForm = document.querySelector('.register-form');
  
    if (!registerForm.classList.contains('active')) {
      registerForm.classList.add('hidden');
    }
  
    showRegisterLink.addEventListener('click', function(e) {
      e.preventDefault();
      loginForm.classList.remove('active');
      loginForm.classList.add('hidden');
      registerForm.classList.remove('hidden');
      registerForm.classList.add('active');
    });
  
    showLoginLink.addEventListener('click', function(e) {
      e.preventDefault();
      registerForm.classList.remove('active');
      registerForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
      loginForm.classList.add('active');
    });
  });


  document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
  
        if (!username || !password) {
          alert('Please fill out both username and password.');
          return;
        }
  
        fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('Login successful!');
            window.location.href = "/";
          } else {
            alert('Login failed: ' + data.message);
          }
        })
        .catch(error => {
          console.error('Error during login:', error);
        });
      });
    }
  
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', function(e) {
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
  
        fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, username, password, verification })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('Registration successful!');
          } else {
            alert('Registration failed: ' + data.message);
          }
        })
        .catch(error => {
          console.error('Error during registration:', error);
        });
      });
    }
  
    const getCodeBtn = document.getElementById('getVerificationCode');
    if (getCodeBtn) {
      getCodeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const email = document.getElementById('registerEmail').value.trim();
        if (!email) {
          alert('Please enter your email first.');
          return;
        }
        fetch('/api/verification?email=' + encodeURIComponent(email))
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              alert('Verification code sent to your email.');
            } else {
              alert('Failed to send verification code: ' + data.message);
            }
          })
          .catch(error => {
            console.error('Error during verification code request:', error);
          });
      });
    }
  });
  
  