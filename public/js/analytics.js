document.addEventListener('DOMContentLoaded', () => {
    // Пример: получаем данные с сервера (можно адаптировать под ваш эндпоинт /api/analytics)
    // Здесь имитируем fetch:
    mockFetchAnalyticsData().then(data => {
      // Заполняем метрики
      document.getElementById('totalSales').textContent = data.totalSales;
      document.getElementById('mostViewed').textContent = data.mostViewedAnime.title;
      document.getElementById('totalViews').textContent = data.totalViews;
  
      // Инициализируем графики
      createPurchasesChart(data.monthlyPurchases);
      createViewsChart(data.topViewedAnime);
    });
  });
  
  // Пример функции для Chart.js: График покупок (ежемесячные)
  function createPurchasesChart(monthlyData) {
    const ctx = document.getElementById('purchasesChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: monthlyData.map(item => item.month),
        datasets: [{
          label: 'Purchases',
          data: monthlyData.map(item => item.count),
          backgroundColor: '#1e1e2f'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  // Пример функции для Chart.js: График самых популярных аниме
  function createViewsChart(topViewed) {
    const ctx = document.getElementById('viewsChart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: topViewed.map(item => item.title),
        datasets: [{
          label: 'Views',
          data: topViewed.map(item => item.views),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#2ecc71', '#9b59b6']
        }]
      },
      options: {
        responsive: true
      }
    });
  }
  
  // Пример имитации данных
  function mockFetchAnalyticsData() {
    // В реальном коде используйте fetch('/api/analytics') и верните response.json().
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          totalSales: 1234,
          totalViews: 9999,
          mostViewedAnime: { title: 'One Piece', views: 5000 },
          monthlyPurchases: [
            { month: 'Jan', count: 50 },
            { month: 'Feb', count: 80 },
            { month: 'Mar', count: 65 },
            { month: 'Apr', count: 90 },
            { month: 'May', count: 40 },
            { month: 'Jun', count: 110 },
          ],
          topViewedAnime: [
            { title: 'One Piece', views: 5000 },
            { title: 'Naruto', views: 3200 },
            { title: 'Bleach', views: 1800 },
            { title: 'Attack on Titan', views: 1500 },
            { title: 'My Hero Academia', views: 1200 },
          ]
        });
      }, 500);
    });
  }
  