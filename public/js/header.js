document.addEventListener('DOMContentLoaded', () => {
    // Получаем токен из localStorage
    const token = localStorage.getItem('token');
  
    // Элементы, которые будем менять
    const authButtonsContainer = document.querySelector('.auth-buttons');
    let userMenuContainer = document.querySelector('.user-menu');
    const adminLink = document.querySelector('.nav-links li a[href="admin.html"]');
  
    if (token) {
      // Если токен есть, декодируем его payload (предполагается JWT)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Скрываем блок с кнопками авторизации
        if (authButtonsContainer) {
          authButtonsContainer.style.display = 'none';
        }
        
        // Если блока user-menu нет, создаем его и вставляем в навигацию
        if (!userMenuContainer) {
          userMenuContainer = document.createElement('div');
          userMenuContainer.className = 'user-menu';
          userMenuContainer.innerHTML = `
            <a href="profile.html" class="btn profile-btn">Profile</a>
            <a href="mylist.html" class="btn my-list-btn">My List</a>
            <a href="#" class="btn logout-btn">Logout</a>
          `;
          const nav = document.querySelector('.main-nav');
          nav.appendChild(userMenuContainer);
        } else {
          userMenuContainer.style.display = 'flex';
        }
  
        // Обработчик выхода
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            location.reload();
          });
        }
        
        // Если роль admin, показываем ссылку на Admin Panel, иначе скрываем её
        if (payload.role && payload.role === 'admin') {
          if (adminLink) {
            adminLink.style.display = 'block';
          }
        } else {
          if (adminLink) {
            adminLink.style.display = 'none';
          }
        }
      } catch (err) {
        console.error('Error decoding token:', err);
        // Если произошла ошибка декодирования – считаем, что пользователь не авторизован
        if (authButtonsContainer) {
          authButtonsContainer.style.display = 'flex';
        }
        if (userMenuContainer) {
          userMenuContainer.style.display = 'none';
        }
        if (adminLink) {
          adminLink.style.display = 'none';
        }
      }
    } else {
      // Если токена нет, показываем кнопки Login/Sign Up и скрываем меню пользователя и Admin Panel
      if (authButtonsContainer) {
        authButtonsContainer.style.display = 'flex';
      }
      if (userMenuContainer) {
        userMenuContainer.style.display = 'none';
      }
      if (adminLink) {
        adminLink.style.display = 'none';
      }
    }
  });
  