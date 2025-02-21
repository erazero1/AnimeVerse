document.addEventListener('DOMContentLoaded', () => {
  // Создаём header
  const header = document.createElement('header');
  header.className = 'site-header';

  // Логотип
  const logo = document.createElement('div');
  logo.className = 'logo';
  logo.textContent = 'AnimeVerse';
  header.appendChild(logo);

  // Навигация
  const nav = document.createElement('nav');
  nav.className = 'main-nav';
  header.appendChild(nav);

  // Список навигационных ссылок
  const navList = document.createElement('ul');
  navList.className = 'nav-links';
  nav.appendChild(navList);

  // Ссылка на главную страницу "All Anime"
  const liAll = document.createElement('li');
  const allLink = document.createElement('a');
  allLink.href = '/';
  allLink.textContent = 'All Anime';
  liAll.appendChild(allLink);
  navList.appendChild(liAll);

  // Проверяем наличие токена в localStorage
  const token = localStorage.getItem('token');
  let userRole = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userRole = payload.role;
    } catch (err) {
      console.error('Error decoding token:', err);
    }
  }

  let container;
  if (token) {
    container = document.createElement('div');
    container.className = 'user-menu';
    
    const profileLink = document.createElement('a');
    profileLink.href = 'profile.html';
    profileLink.className = 'btn profile-btn';
    profileLink.textContent = 'Profile';
    container.appendChild(profileLink);
    
    const myListLink = document.createElement('a');
    myListLink.href = 'mylist.html';
    myListLink.className = 'btn my-list-btn';
    myListLink.textContent = 'My List';
    container.appendChild(myListLink);
    
    const logoutLink = document.createElement('a');
    logoutLink.href = '#';
    logoutLink.className = 'btn logout-btn';
    logoutLink.textContent = 'Logout';
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      location.reload();
    });
    container.appendChild(logoutLink);
  } else {
    // Если пользователь не авторизован – создаем кнопки авторизации
    container = document.createElement('div');
    container.className = 'auth-buttons';
    
    const loginLink = document.createElement('a');
    loginLink.href = '/auth';
    loginLink.className = 'btn login-btn';
    loginLink.textContent = 'Login/Registration';
    container.appendChild(loginLink);
  }
  
  nav.appendChild(container);

  // Если пользователь админ, добавляем ссылку на Admin Panel
  if (userRole === 'admin') {
    const liAdmin = document.createElement('li');
    const adminLink = document.createElement('a');
    adminLink.href = '/admin-panel';
    adminLink.textContent = 'Admin Panel';
    liAdmin.appendChild(adminLink);
    navList.appendChild(liAdmin);
  }

  // Вставляем header в начало body
  document.body.prepend(header);
});
