// Telegram Web App
const tg = window.Telegram.WebApp;

// ID администраторов (замените на реальные ID)
const ADMIN_IDS = [8248768964]; // Ваш ID, добавьте ID друзей через запятую

// Проверка, является ли пользователь админом
function isAdmin() {
    const user = tg.initDataUnsafe?.user;
    return user && ADMIN_IDS.includes(user.id);
}

// Каталог товаров
const products = [
    // Pod-системы
    {
        id: 1,
        name: "VOOPOO Drag Nano 2",
        category: "pods",
        price: 2490,
        stock: "В наличии",
        emoji: "💨",
        description: "Компактная pod-система с мощностью 20W",
        nicotine: "Под жидкость"
    },
    {
        id: 2,
        name: "Vaporesso XROS 3",
        category: "pods",
        price: 1990,
        stock: "В наличии",
        emoji: "💨",
        description: "Популярная pod-система с регулировкой обдува",
        nicotine: "Под жидкость"
    },
    
    // Одноразки
    {
        id: 3,
        name: "ELF BAR 5000",
        category: "disposable",
        price: 890,
        stock: "В наличии",
        emoji: "🍓",
        description: "5000 затяжек, клубника-банан",
        nicotine: "20mg"
    },
    {
        id: 4,
        name: "HQD CUVIE Plus",
        category: "disposable",
        price: 790,
        stock: "В наличии",
        emoji: "🍑",
        description: "1200 затяжек, персик-манго",
        nicotine: "20mg"
    },
    {
        id: 5,
        name: "LOST MARY BM5000",
        category: "disposable",
        price: 990,
        stock: "В наличии",
        emoji: "🍇",
        description: "5000 затяжек, виноград-лед",
        nicotine: "20mg"
    },
    
    // Жидкости
    {
        id: 6,
        name: "Brusko Salt - Малина",
        category: "liquids",
        price: 390,
        stock: "В наличии",
        emoji: "🍇",
        description: "Солевой никотин 20mg, 30мл",
        nicotine: "20mg"
    },
    {
        id: 7,
        name: "Husky Premium - Манго",
        category: "liquids",
        price: 450,
        stock: "В наличии",
        emoji: "🥭",
        description: "Премиум жидкость, 30мл",
        nicotine: "20mg"
    },
    {
        id: 8,
        name: "Chaser Black - Табак",
        category: "liquids",
        price: 420,
        stock: "В наличии",
        emoji: "🚬",
        description: "Табачная линейка, 30мл",
        nicotine: "12mg"
    },
    
    // Устройства
    {
        id: 9,
        name: "GeekVape Aegis Legend 2",
        category: "devices",
        price: 4990,
        stock: "В наличии",
        emoji: "⚡",
        description: "Мощный бокс-мод 200W, защита IP68",
        nicotine: "Без никотина"
    },
    {
        id: 10,
        name: "Vaporesso GEN 200",
        category: "devices",
        price: 3990,
        stock: "В наличии",
        emoji: "⚡",
        description: "Двухаккумуляторный мод с чипсетом AXON",
        nicotine: "Без никотина"
    },
    
    // Аксессуары
    {
        id: 11,
        name: "Испаритель VOOPOO PnP",
        category: "accessories",
        price: 290,
        stock: "В наличии",
        emoji: "🔧",
        description: "Сменный испаритель 0.3 Ом",
        nicotine: "Без никотина"
    },
    {
        id: 12,
        name: "Аккумулятор 18650",
        category: "accessories",
        price: 590,
        stock: "В наличии",
        emoji: "🔋",
        description: "Высокотоковый аккумулятор 3000mAh",
        nicotine: "Без никотина"
    }
];

// Корзина
let cart = [];
let currentCategory = 'all';
let ageVerified = false;

// Инициализация
function init() {
    tg.expand();
    tg.enableClosingConfirmation();
    
    // Проверяем, прошел ли пользователь проверку возраста
    const verified = localStorage.getItem('ageVerified');
    if (verified === 'true') {
        ageVerified = true;
        showMainContent();
    }
}

// Проверка возраста
function verifyAge(isAdult) {
    if (isAdult) {
        ageVerified = true;
        localStorage.setItem('ageVerified', 'true');
        document.getElementById('age-verification').classList.add('hidden');
        showMainContent();
        tg.HapticFeedback.notificationOccurred('success');
    } else {
        tg.showAlert('Доступ запрещен. Продажа никотинсодержащей продукции лицам младше 18 лет запрещена.');
        tg.close();
    }
}

// Показать основной контент
function showMainContent() {
    document.getElementById('main-content').classList.remove('hidden');
    displayProducts();
    updateCartBadge();
    
    // Показываем админ-панель если пользователь админ
    if (isAdmin()) {
        document.getElementById('admin-nav').style.display = 'block';
    }
}

// Фильтрация по категориям
function filterCategory(category) {
    currentCategory = category;
    
    // Обновляем активную кнопку
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    displayProducts();
    tg.HapticFeedback.impactOccurred('light');
}

// Поиск товаров
function searchProducts(query) {
    const filtered = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    displayProducts(filtered);
}

// Отображение товаров
function displayProducts(productsToShow = null) {
    const container = document.getElementById('products');
    container.innerHTML = '';
    
    let filtered = productsToShow || products;
    
    if (!productsToShow && currentCategory !== 'all') {
        filtered = products.filter(p => p.category === currentCategory);
    }
    
    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">${product.price} ₽</div>
                <div class="product-stock">${product.stock} • ${product.nicotine}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    В корзину
                </button>
            </div>
        `;
        container.appendChild(card);
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
    
    updateCartBadge();
    tg.HapticFeedback.notificationOccurred('success');
    
    // Показываем уведомление
    showNotification(`${product.name} добавлен в корзину`);
}

// Обновить значок корзины
function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (count > 0) {
        badge.textContent = count;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

// Показать уведомление
function showNotification(message) {
    tg.showPopup({
        title: '✅ Успешно',
        message: message,
        buttons: [{id: 'ok', type: 'default', text: 'OK'}]
    });
}

// Переключение страниц
function showPage(page) {
    // Проверка доступа к админ-панели
    if (page === 'admin' && !isAdmin()) {
        tg.showAlert('Доступ запрещен! Требуются права администратора.');
        return;
    }
    
    // Обновляем активную кнопку навигации
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');
    
    tg.HapticFeedback.impactOccurred('light');
    
    switch(page) {
        case 'catalog':
            displayProducts();
            break;
        case 'cart':
            showCart();
            break;
        case 'orders':
            showOrders();
            break;
        case 'profile':
            showProfile();
            break;
        case 'admin':
            showAdminPanel();
            break;
    }
}

// Показать корзину
function showCart() {
    const container = document.getElementById('products');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">
                <div style="font-size: 50px; margin-bottom: 20px;">🛒</div>
                <h3>Корзина пуста</h3>
                <p>Добавьте товары из каталога</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Товары в корзине
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.style.gridColumn = '1/-1';
        cartItem.className = 'product-card';
        cartItem.innerHTML = `
            <div style="padding: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div class="product-name">${item.emoji} ${item.name}</div>
                        <div style="color: #888; font-size: 14px; margin: 5px 0;">${item.nicotine}</div>
                        <div class="product-price">${item.price * item.quantity} ₽</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <button onclick="changeQuantity(${item.id}, -1)" style="width: 30px; height: 30px; border: none; background: #3a3a3a; color: white; border-radius: 5px;">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${item.id}, 1)" style="width: 30px; height: 30px; border: none; background: #3a3a3a; color: white; border-radius: 5px;">+</button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(cartItem);
    });
    
    // Итого и кнопка заказа
    const summary = document.createElement('div');
    summary.style.gridColumn = '1/-1';
    summary.innerHTML = `
        <div style="background: #2a2a2a; padding: 20px; border-radius: 15px; margin-top: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                <span>Итого:</span>
                <span style="font-size: 24px; font-weight: bold; color: #4CAF50;">${total} ₽</span>
            </div>
            <button onclick="checkout()" style="width: 100%; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: bold;">
                Оформить заказ
            </button>
        </div>
    `;
    container.appendChild(summary);
}

// Изменить количество
function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    }
    
    updateCartBadge();
    showCart();
    tg.HapticFeedback.impactOccurred('light');
}

// Оформление заказа
function checkout() {
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let orderText = 'Заказ:\n\n';
    
    cart.forEach(item => {
        orderText += `${item.name} x${item.quantity} = ${item.price * item.quantity} ₽\n`;
    });
    
    orderText += `\nИтого: ${total} ₽`;
    
    tg.showPopup({
        title: '📦 Оформление заказа',
        message: orderText + '\n\nПодтвердить заказ?',
        buttons: [
            {id: 'confirm', type: 'default', text: 'Подтвердить'},
            {id: 'cancel', type: 'cancel', text: 'Отмена'}
        ]
    }, (btnId) => {
        if (btnId === 'confirm') {
            // Отправляем данные боту
            tg.sendData(JSON.stringify({
                type: 'order',
                items: cart,
                total: total
            }));
            
            cart = [];
            updateCartBadge();
            showNotification('Заказ успешно оформлен! С вами свяжется менеджер.');
            showPage('catalog');
        }
    });
}

// Показать заказы
function showOrders() {
    const container = document.getElementById('products');
    container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">
            <div style="font-size: 50px; margin-bottom: 20px;">📦</div>
            <h3>История заказов</h3>
            <p>Здесь будут отображаться ваши заказы</p>
        </div>
    `;
}

// Показать профиль
function showProfile() {
    const user = tg.initDataUnsafe?.user;
    const container = document.getElementById('products');
    
    container.innerHTML = `
        <div style="grid-column: 1/-1; padding: 20px;">
            <div style="background: #2a2a2a; padding: 20px; border-radius: 15px; margin-bottom: 15px;">
                <h3 style="margin-bottom: 15px;">👤 Профиль</h3>
                <p style="color: #888; margin-bottom: 10px;">Имя: ${user?.first_name || 'Гость'} ${user?.last_name || ''}</p>
                <p style="color: #888; margin-bottom: 10px;">ID: ${user?.id || 'Не определен'}</p>
                <p style="color: #888;">Username: @${user?.username || 'не указан'}</p>
            </div>
            
            <div style="background: #2a2a2a; padding: 20px; border-radius: 15px;">
                <h3 style="margin-bottom: 15px;">⚙️ Настройки</h3>
                <button onclick="clearAge()" style="width: 100%; padding: 12px; background: #3a3a3a; color: white; border: none; border-radius: 10px; margin-bottom: 10px;">
                    Сбросить проверку возраста
                </button>
                <button onclick="contactSupport()" style="width: 100%; padding: 12px; background: #3a3a3a; color: white; border: none; border-radius: 10px;">
                    📞 Связаться с поддержкой
                </button>
            </div>
        </div>
    `;
}

// Сбросить проверку возраста
function clearAge() {
    localStorage.removeItem('ageVerified');
    location.reload();
}

// Связаться с поддержкой
function contactSupport() {
    tg.openLink('https://t.me/support');
}

// Админ-панель
function showAdminPanel() {
    const container = document.getElementById('products');
    container.innerHTML = `
        <div style="grid-column: 1/-1; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px; margin-bottom: 15px; text-align: center;">
                <h3 style="color: white; margin-bottom: 10px;">⚙️ Админ-панель</h3>
                <p style="color: rgba(255,255,255,0.9);">Управление вейп-магазином</p>
            </div>
            
            <!-- Статистика -->
            <div style="background: #2a2a2a; padding: 20px; border-radius: 15px; margin-bottom: 15px;">
                <h4 style="margin-bottom: 15px;">📊 Статистика</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div style="background: #3a3a3a; padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 24px; font-weight: bold; color: #4CAF50;">${products.length}</div>
                        <div style="color: #888; font-size: 14px;">Товаров</div>
                    </div>
                    <div style="background: #3a3a3a; padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 24px; font-weight: bold; color: #2196F3;">${cart.length}</div>
                        <div style="color: #888; font-size: 14px;">В корзине</div>
                    </div>
                </div>
            </div>
            
            <!-- Управление товарами -->
            <div style="background: #2a2a2a; padding: 20px; border-radius: 15px; margin-bottom: 15px;">
                <h4 style="margin-bottom: 15px;">📦 Управление товарами</h4>
                <button onclick="addProduct()" style="width: 100%; padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 10px; margin-bottom: 10px;">
                    ➕ Добавить товар
                </button>
                <button onclick="editProducts()" style="width: 100%; padding: 12px; background: #2196F3; color: white; border: none; border-radius: 10px; margin-bottom: 10px;">
                    ✏️ Редактировать товары
                </button>
                <button onclick="viewOrders()" style="width: 100%; padding: 12px; background: #FF9800; color: white; border: none; border-radius: 10px;">
                    📋 Просмотреть заказы
                </button>
            </div>
            
            <!-- Управление пользователями -->
            <div style="background: #2a2a2a; padding: 20px; border-radius: 15px; margin-bottom: 15px;">
                <h4 style="margin-bottom: 15px;">👥 Управление пользователями</h4>
                <button onclick="viewUsers()" style="width: 100%; padding: 12px; background: #9C27B0; color: white; border: none; border-radius: 10px; margin-bottom: 10px;">
                    👤 Список пользователей
                </button>
                <button onclick="addAdmin()" style="width: 100%; padding: 12px; background: #673AB7; color: white; border: none; border-radius: 10px;">
                    ➕ Добавить админа
                </button>
            </div>
            
            <!-- Настройки -->
            <div style="background: #2a2a2a; padding: 20px; border-radius: 15px;">
                <h4 style="margin-bottom: 15px;">⚙️ Настройки</h4>
                <button onclick="exportData()" style="width: 100%; padding: 12px; background: #607D8B; color: white; border: none; border-radius: 10px; margin-bottom: 10px;">
                    💾 Экспорт данных
                </button>
                <button onclick="clearCache()" style="width: 100%; padding: 12px; background: #f44336; color: white; border: none; border-radius: 10px;">
                    🗑️ Очистить кэш
                </button>
            </div>
        </div>
    `;
}

// Функции админ-панели
function addProduct() {
    tg.showPopup({
        title: '➕ Добавить товар',
        message: 'Функция добавления товара будет доступна в следующей версии',
        buttons: [{id: 'ok', type: 'default', text: 'OK'}]
    });
}

function editProducts() {
    showNotification('Редактирование товаров в разработке');
}

function viewOrders() {
    showNotification('Заказов пока нет');
}

function viewUsers() {
    const user = tg.initDataUnsafe?.user;
    tg.showPopup({
        title: '👥 Пользователи',
        message: `Текущий пользователь:\n👤 ${user?.first_name} ${user?.last_name || ''}\n🆔 ID: ${user?.id}`,
        buttons: [{id: 'ok', type: 'default', text: 'OK'}]
    });
}

function addAdmin() {
    tg.showPopup({
        title: '➕ Добавить админа',
        message: 'Введите ID пользователя для добавления в админы:\n\nТекущие админы:\n' + ADMIN_IDS.join(', '),
        buttons: [{id: 'ok', type: 'default', text: 'OK'}]
    });
}

function exportData() {
    const data = {
        products: products,
        cart: cart,
        admins: ADMIN_IDS,
        timestamp: new Date().toISOString()
    };
    
    tg.sendData(JSON.stringify(data));
    showNotification('Данные отправлены');
}

function clearCache() {
    if (confirm('Вы уверены, что хотите очистить весь кэш?')) {
        localStorage.clear();
        showNotification('Кэш очищен');
        setTimeout(() => location.reload(), 1000);
    }
}

// Запуск приложения
tg.ready();
init();

// Показать главные кнопки при старте
function showMainButtons() {
    if (tg.MainButton) {
        tg.MainButton.text = '🚬 Открыть магазин';
        tg.MainButton.color = '#667eea';
        tg.MainButton.onClick(() => {
            tg.expand();
            showPage('catalog');
        });
        tg.MainButton.show();
    }
    
    // Дополнительные кнопки
    if (tg.SecondaryButton) {
        tg.SecondaryButton.text = '🛒 Корзина';
        tg.SecondaryButton.color = '#4CAF50';
        tg.SecondaryButton.onClick(() => {
            showPage('cart');
        });
        tg.SecondaryButton.show();
    }
}

// Обработка команды /start для автоматического открытия
if (window.location.search.includes('startapp')) {
    tg.expand();
    tg.HapticFeedback.notificationOccurred('success');
    showMainButtons();
} else {
    showMainButtons();
}
