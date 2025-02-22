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

  // Контейнер для кнопок (зависит от того, авторизован пользователь или нет)
  let container;
  if (token) {
    // Если пользователь авторизован
    container = document.createElement('div');
    container.className = 'user-menu';

    // Ссылка на Orders (доступно всем авторизованным)
    const ordersLink = document.createElement('a');
    ordersLink.href = '/cart'; // Замените на реальный путь
    ordersLink.className = 'btn orders-btn';
    ordersLink.textContent = 'Cart';
    container.appendChild(ordersLink);

    // Кнопка Logout
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

  // Если пользователь админ, добавляем ссылку на Admin Panel и Analytics
  if (userRole === 'admin') {
    const liAdmin = document.createElement('li');
    const adminLink = document.createElement('a');
    adminLink.href = '/admin-panel'; 
    adminLink.textContent = 'Admin Panel';
    liAdmin.appendChild(adminLink);
    navList.appendChild(liAdmin);

    const liAnalytics = document.createElement('li');
    const analyticsLink = document.createElement('a');
    analyticsLink.href = '/analytics'; // Замените на реальный путь
    analyticsLink.textContent = 'Analytics';
    liAnalytics.appendChild(analyticsLink);
    navList.appendChild(liAnalytics);
  }

  // Вставляем header в начало body
  document.body.prepend(header);
});
