window.addEventListener('DOMContentLoaded', () => {

    const loadContent = async (url, callback) => {
        await fetch(url)
            .then(response => response.json())
            .then(json => createElement(json.goods))
            .then(console.log('База загружена'));// Для себя, для проверки

        callback();
    }

    function createElement(arr) {
        const goodsWrapper = document.querySelector('.goods');
        arr.forEach(function(item) {
            let card = document.createElement('div');
            card.classList.add('productcard');
            card.setAttribute("data-id", item.id);
            card.innerHTML = `
                <div class="productcard__sale is-hidden">${item.sale}</div>
                <div class="productcard__img">
                    <img src="${item.img}" alt="image">
                    <div class="productcard__added is-hidden">Добавлено!</div>
                </div>                                                
                <div class="productcard__details">
                    <div class="productcard__price">${item.price}</div>
                    <div class="productcard__category">${item.category}</div>
                    <div class="productcard__title">${item.title}</div>
                </div>                         
                <button class="productcard__btn-buy btn">Купить</button>
            `;
            goodsWrapper.appendChild(card);
        });
    }

    loadContent('db/db.json', () =>{ //? Почему работает только с запуском сервера, а в ином случае ругается?

        const cartOpenBtn = document.getElementById('cart'),
            cart = document.querySelector('.cart'),
            cartWrapper = document.querySelector('.cart__wrapper'),
            cartCloseBtn = cart.querySelector('.cart__close'),
            cartEmpty = document.querySelector('.empty'),
            goods = document.querySelectorAll('.productcard'),
            cartQuantity = document.querySelector('#quantity'),
            cleanBtn = document.getElementById('cleanBtn'),
            titles = document.querySelectorAll('.productcard__title');

        let cartTotal = cart.querySelector('.cart__total :first-child span');

        // Когда объявляю тут эту переменную, при каждом нажатии на кнопку другого товара обнуляются изменения в записанном элементе, заданные нажатием кнопки предыдущего
        // const productQuantity = document.createElement('div');
        // productQuantity.classList.add('productcard__quantity');


        function openCart() {
            cart.classList.remove('is-hidden');
            document.body.style.overflow = "hidden";
        }
        function closeCart() {
            cart.classList.add('is-hidden');
            document.body.style.overflow = "";
        }

        // Количество товаров в корзине:
        function countCart() { // Пересчитать по наполнениям .productcard__quantity
            const cartGoods = cartWrapper.querySelectorAll('.productcard');
            let counter = 0;
            // cartQuantity.innerText = cartGoods.length; // Старый расчёт
            cartGoods.forEach(card => {
                const quantity = card.querySelector('.productcard__quantity');
                counter+= +quantity.textContent;
            });
            cartQuantity.textContent = counter;
        }

        //Общая стоимость в корзине:
        function countTotal() { // Пересчитать с умножением на .productcard__quantity
            const cartGoods = cartWrapper.querySelectorAll('.productcard');
            let total = 0;
            cartGoods.forEach(card => {
                const price = card.querySelector('.productcard__price');
                const quantity = card.querySelector('.productcard__quantity');
                total += +price.textContent * +quantity.textContent;
            });
            cartTotal.textContent = total;
        }

        function cleanCart() {
            const cartGoods = cartWrapper.querySelectorAll('.productcard');
            if (cartGoods.length > 0) {
                let clean = confirm("Вы уверены, что хотите очистить корзину?");
                if (clean) cartWrapper.innerHTML = "";
                countCart();
                refreshEmpty();
            }
        }

        function refreshEmpty() {
            const cartGoods = cartWrapper.querySelectorAll('.productcard');
            if (cartGoods.length > 0) {
                if (cart.querySelector('.empty')) {
                    cart.querySelector('.empty').remove();
                }            
                cartQuantity.classList.remove('is-hidden');
                cleanBtn.classList.remove('is-hidden');
            } else if (!cart.querySelector('.empty')) {
                cartWrapper.appendChild(cartEmpty);
                cartQuantity.classList.add('is-hidden');
                cleanBtn.classList.add('is-hidden');
            }
        }

        function refreshAll() {
            countCart();
            refreshEmpty();
            countTotal();
        }

        function checkProduct(id) {
            const checkedProduct = cartWrapper.querySelector(`[data-id='${id}']`);
            return Boolean(checkedProduct);
        }

        function quantityIncrease(id) {
            const checkedProduct = cartWrapper.querySelector(`[data-id='${id}']`);
            const quantity = checkedProduct.querySelector('.productcard__quantity');   
            quantity.innerText = +quantity.innerText + 1;       
            // console.log(quantity.innerText);
            refreshAll();  
        }

        goods.forEach(card => {
            const addBtn = card.querySelector('.productcard__btn-buy'),
                addedImg = card.querySelector('.productcard__added'),
                productId = card.dataset.id;
                // console.log(productId); // Проверка

            addBtn.addEventListener('click', () => {
                if (checkProduct(productId)) {
                    quantityIncrease(productId);
                } else {
                    const cardClone = card.cloneNode(true),
                        removeBtn = cardClone.querySelector('.productcard__btn-buy'),
                        addedImgClone = cardClone.querySelector('.productcard__added'),
                        detailsWrapper = cardClone.querySelector('.productcard__details');
                    // Удаление картинки "Добавлено", если на кнопку "Купить" нажимали слишком быстро и она осталась в вёрстке^
                    if (addedImgClone) addedImgClone.remove();
                    removeBtn.textContent = 'Удалить';
                    removeBtn.addEventListener('click', () => {
                        cardClone.remove();
                        refreshAll();
                    });
                    const productQuantity = document.createElement('div');
                    productQuantity.classList.add('productcard__quantity');
                    detailsWrapper.appendChild(productQuantity); //! Куда оно исчезает, когда нажимаю на кнопку другого товара??
                    cardClone.querySelector('.productcard__quantity').innerText = '1';
                    cartWrapper.appendChild(cardClone); //? Как правильно записать async-await так, чтобы последующий код выполнился именно после добавления нового элемента?
                    refreshAll();
    
                    addedImg.classList.remove('is-hidden');
                    setTimeout(() => addedImg.classList.add('is-hidden'), 500);
                }

                
            });
        });

        cartOpenBtn.addEventListener('click', openCart);
        cartCloseBtn.addEventListener('click', closeCart);
        cleanBtn.addEventListener('click', cleanCart);

        function sliceTitle() {
            titles.forEach(function(item) {
                if (item.textContent.length <= 70) {
                    return;
                } 
                else {
                    const str = `${item.textContent.slice(0, 67)}...`;
                    item.textContent = str;
                }
            });
        }
        sliceTitle();


    });

    
    

});