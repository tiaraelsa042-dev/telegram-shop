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
    showAlert(` ${product.name} добавлен в корзину!`);
}

// Обновить корзину
function updateCart() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.getElementById('cart-total').textContent = total;
    document.getElementById('cart-count').textContent = `${count} товар(ов)`;
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
