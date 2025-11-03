// Товары вашего магазина
const products = [
    {
        id: 1,
        name: "Кроссовки Nike Air",
        price: 4990,
        emoji: "",
        location: "м. Проспект Мира\nСамовывоз после 18:00",
        description: "Стильные кроссовки для повседневной носки"
    },
    {
        id: 2,
        name: "Футболка Basic", 
        price: 1990,
        emoji: "",
        location: "м. Проспект Мира\nСамовывоз после 18:00",
        description: "Хлопковая футболка премиум качества"
    },
    {
        id: 3,
        name: "Джинсы Slim",
        price: 3590,
        emoji: "",
        location: "м. Проспект Мира\nСамовывоз после 18:00", 
        description: "Классические джинсы прямого покроя"
    },
    {
        id: 4,
        name: "Куртка Демисезон",
        price: 6990,
        emoji: "",
        location: "м. Проспект Мира\nСамовывоз после 18:00",
        description: "Теплая куртка для межсезонья"
    }
];

let cart = [];
const tg = window.Telegram.WebApp;

// Инициализация приложения
function init() {
    tg.expand(); // Раскрыть на весь экран
    tg.enableClosingConfirmation(); // Подтверждение закрытия
    displayProducts();
    updateCart();
    displayCart();
    checkUserStatus();
}

// Проверить статус аккаунта пользователя
function checkUserStatus() {
    const user = tg.initDataUnsafe?.user;
    
    if (user) {
        console.log('Данные пользователя:', user);
        
        // Показываем информацию в консоли для отладки
        console.log('ID:', user.id);
        console.log('Имя:', user.first_name);
        console.log('Фамилия:', user.last_name);
        console.log('Username:', user.username);
        console.log('Язык:', user.language_code);
        console.log('Premium:', user.is_premium);
        
        // Можно показать пользователю его статус
        const userName = user.first_name + (user.last_name ? ' ' + user.last_name : '');
        const userStatus = user.is_premium ? 'Premium' : 'Обычный';
        
        // Обновляем заголовок с именем пользователя
        document.querySelector('h1').textContent = `Мой Магазин - ${userName}`;
    } else {
        console.log('Пользователь не авторизован');
        showAlert('Пожалуйста, откройте приложение через Telegram');
    }
}

// Показать детальную информацию о пользователе
function showUserInfo() {
    const user = tg.initDataUnsafe?.user;
    
    if (!user) {
        showAlert('Информация о пользователе недоступна');
        return;
    }
    
    const userName = user.first_name + (user.last_name ? ' ' + user.last_name : '');
    const userStatus = user.is_premium ? '✅ Premium' : '👤 Обычный';
    const userInfo = `
👤 Имя: ${userName}
🆔 ID: ${user.id}
🔗 Username: @${user.username || 'не указан'}
🌐 Язык: ${user.language_code || 'неизвестен'}
💎 Статус: ${userStatus}
    `.trim();
    
    tg.showPopup({
        title: 'Статус аккаунта',
        message: userInfo,
        buttons: [
            {id: 'ok', type: 'default', text: 'OK'}
        ]
    });
}

// Переключение вкладок
function switchTab(tab) {
    // Убираем активный класс у всех кнопок и вкладок
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Добавляем активный класс выбранной вкладке
    if (tab === 'products') {
        document.querySelector('.tab-btn:first-child').classList.add('active');
        document.getElementById('products-tab').classList.add('active');
    } else if (tab === 'cart') {
        document.querySelector('.tab-btn:last-child').classList.add('active');
        document.getElementById('cart-tab').classList.add('active');
        displayCart(); // Обновляем корзину при переключении
    }
}

// Показать товары
function displayProducts() {
    const container = document.getElementById('products');
    
    products.forEach(product => {
        const productEl = document.createElement('div');
        productEl.className = 'product-card';
        productEl.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">${product.price} руб.</div>
            <div class="product-location">${product.location}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                Добавить в корзину
            </button>
        `;
        container.appendChild(productEl);
    });
}

// Добавить в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    tg.HapticFeedback.impactOccurred('light'); // Вибрация
    updateCart();
    displayCart();
    showAlert(` ${product.name} добавлен в корзину!`);
}

// Обновить корзину
function updateCart() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.getElementById('cart-total').textContent = total;
    document.getElementById('cart-count').textContent = `${count} товар(ов)`;
}

// Показать корзину
function displayCart() {
    const container = document.getElementById('cart-items');
    const emptyMessage = document.getElementById('cart-empty');
    const summary = document.getElementById('cart-summary');
    
    container.innerHTML = '';
    
    if (cart.length === 0) {
        emptyMessage.style.display = 'block';
        summary.style.display = 'none';
        return;
    }
    
    emptyMessage.style.display = 'none';
    summary.style.display = 'block';
    
    cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-header">
                <div class="cart-item-name">${item.emoji} ${item.name}</div>
                <div class="cart-item-price">${item.price * item.quantity} руб.</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                <span style="margin-left: auto; color: #666; font-size: 14px;">${item.price} руб./шт.</span>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Удалить</button>
            </div>
        `;
        container.appendChild(itemEl);
    });
}

// Изменить количество товара
function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    tg.HapticFeedback.impactOccurred('light');
    updateCart();
    displayCart();
}

// Удалить товар из корзины
function removeFromCart(productId) {
    const item = cart.find(item => item.id === productId);
    cart = cart.filter(item => item.id !== productId);
    
    tg.HapticFeedback.impactOccurred('medium');
    updateCart();
    displayCart();
    showAlert(` ${item.name} удален из корзины`);
}

// Оформление заказа
function checkout() {
    if (cart.length === 0) {
        showAlert(' Корзина пуста!');
        return;
    }
    
    const orderText = generateOrderText();
    
    tg.showPopup({
        title: ' Заказ оформлен!',
        message: `Ваш заказ:\n${orderText}\n\n Самовывоз: м. Проспект Мира\n С вами свяжутся для подтверждения`,
        buttons: [
            {id: 'ok', type: 'default', text: 'Отлично!'}
        ]
    }, (btnId) => {
        // Заказ можно отправить на сервер или боту
        sendOrderToBot(orderText);
        cart = [];
        updateCart();
        displayCart();
    });
}

// Текст заказа
function generateOrderText() {
    let text = '';
    cart.forEach(item => {
        text += ` ${item.name} - ${item.quantity}шт. = ${item.price * item.quantity} руб.\n`;
    });
    text += `\n Итого: ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)} руб.`;
    return text;
}

// Отправить заказ боту (упрощенная версия)
function sendOrderToBot(orderText) {
    const user = tg.initDataUnsafe?.user;
    const userName = user?.first_name || 'Пользователь';
    
    // В реальном приложении здесь будет отправка на сервер
    console.log(`Новый заказ от ${userName}:\n${orderText}`);
}

// Показать уведомление
function showAlert(message) {
    tg.showPopup({
        title: 'Уведомление',
        message: message,
        buttons: [{id: 'ok', type: 'default', text: 'OK'}]
    });
}

// Запуск при загрузке
tg.ready();
init();
