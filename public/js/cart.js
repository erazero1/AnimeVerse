document.addEventListener('DOMContentLoaded', () => {
    const cartItemsTbody = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // 1) Получаем корзину из localStorage (или другого места)
    // Предположим, что в localStorage хранится массив объектов вида:
    // [{_id, title, cover, price}, ...]
    // Если используете другое поле (anime.Price), убедитесь, что поле называется price
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // 2) Функция для отрисовки таблицы корзины
    function renderCart() {
        cartItemsTbody.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const row = document.createElement('tr');

            // Cover
            const coverCell = document.createElement('td');
            if (item.cover) {
                const img = document.createElement('img');
                img.src = item.cover;
                img.alt = item.title;
                img.className = 'cover-img';
                coverCell.appendChild(img);
            } else {
                coverCell.textContent = 'No Cover';
            }
            row.appendChild(coverCell);

            // Title
            const titleCell = document.createElement('td');
            titleCell.textContent = item.title || 'N/A';
            row.appendChild(titleCell);

            // Price
            const priceCell = document.createElement('td');
            priceCell.textContent = item.price ? `$${item.price}` : '$0';
            row.appendChild(priceCell);

            // Remove
            const removeCell = document.createElement('td');
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.textContent = 'Remove';
            removeBtn.addEventListener('click', () => {
                removeFromCart(index);
            });
            removeCell.appendChild(removeBtn);
            row.appendChild(removeCell);

            cartItemsTbody.appendChild(row);

            // Суммируем стоимость
            total += (item.price || 0);
        });

        cartTotalSpan.textContent = total.toFixed(2);
    }

    // 3) Функция удаления элемента из корзины
    function removeFromCart(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    // 4) Обработчик Checkout
    checkoutBtn.addEventListener('click', async () => {
        // Допустим, для заказа нужен userId, а cartItems – это массив аниме
        // В модели Order: animes – массив объектов {anime: _id}
        // Нужно получить userId (например, из токена) – упрощённый вариант:
        const userId = "1234567890abcdef"; // пример

        // Формируем массив { anime: item._id } для каждой позиции
        const animesForOrder = cart.map(item => ({ anime: item._id }));

        // Отправляем на сервер
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token') // если требуется
                },
                body: JSON.stringify({
                    user: userId,
                    animes: animesForOrder
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Order creation failed');
            }
            alert('Order created successfully!');
            // Очищаем корзину
            cart = [];
            localStorage.removeItem('cart');
            renderCart();
        } catch (err) {
            console.error(err);
            alert(`Checkout error: ${err.message}`);
        }
    });

    // Инициализируем рендер
    renderCart();
});
