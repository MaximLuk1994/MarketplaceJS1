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
                <div class="productcard__img">
                    <img src="${item.img}" alt="image">
                    <div class="productcard__added is-hidden">Добавлено!</div>
                </div>
                <div class="productcard__sale is-hidden">sale!</div>                                                
                <div class="productcard__details">
                    <div class="productcard__price">${item.price}</div>
                    <div class="productcard__category">${item.category}</div>
                    <div class="productcard__title">${item.title}</div>
                </div>                         
                <button class="productcard__btn-buy btn">Купить</button>
            `;
            goodsWrapper.appendChild(card);
            if (item.sale) card.querySelector('.productcard__sale').classList.remove('is-hidden');
        });
    }

    loadContent('db/db.json', () =>{ //? Почему работает только с запуском сервера, а в ином случае ругается?

        const cart = document.querySelector('.cart'),
            cartWrapper = document.querySelector('.cart__wrapper'),
            cartQuantity = document.querySelector('#quantity'),
            cleanBtn = document.getElementById('cleanBtn');

        // Когда объявляю тут эту переменную, при каждом нажатии на кнопку другого товара обнуляются изменения в записанном элементе, заданные нажатием кнопки предыдущего
        // const productQuantity = document.createElement('div');
        // productQuantity.classList.add('productcard__quantity');


        

        // Количество товаров в корзине:
        function countCart() {
            const cartGoods = cartWrapper.querySelectorAll('.productcard');
            let counter = 0;
            cartGoods.forEach(card => {
                const quantity = card.querySelector('.productcard__quantity');
                counter+= +quantity.value;
            });
            cartQuantity.textContent = counter;
        }

        //Общая стоимость в корзине:
        function countTotal() {
            const cartGoods = cartWrapper.querySelectorAll('.productcard'),
                cartTotal = cart.querySelector('.cart__total :first-child span');
            let total = 0;
            cartGoods.forEach(card => {
                const price = card.querySelector('.productcard__price');
                const quantity = card.querySelector('.productcard__quantity');
                total += +price.textContent * quantity.value;
            });
            cartTotal.textContent = total;
        }

        function refreshEmpty() {
            const cartGoods = cartWrapper.querySelectorAll('.productcard'),
                cartSelect = cart.querySelector('.cart__select'),
                cartEmpty = document.querySelector('.empty');
            if (cartGoods.length > 0) {
                if (cart.querySelector('.empty')) {
                    cart.querySelector('.empty').remove();
                }            
                cartQuantity.classList.remove('is-hidden');
                cleanBtn.classList.remove('is-hidden');
                cartSelect.classList.remove('is-hidden');
            } else if (!cart.querySelector('.empty')) {
                cartWrapper.appendChild(cartEmpty);
                cartQuantity.classList.add('is-hidden');
                cleanBtn.classList.add('is-hidden');
                cartSelect.classList.add('is-hidden');
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
            quantity.value++;       
            // console.log(quantity.innerText);
            refreshAll();  
        }

        function addToCart() {
            const goods = document.querySelectorAll('.productcard');
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
                            addedImgClone = cardClone.querySelector('.productcard__added');
                        if (addedImgClone) addedImgClone.remove(); // Удаление картинки "Добавлено", если на кнопку "Купить" нажимали слишком быстро и она осталась в вёрстке
                        removeBtn.textContent = 'Удалить';
                        removeBtn.addEventListener('click', () => {
                            cardClone.remove();
                            refreshAll();
                        });
                        // Добавляем количество товара
                        const productQuantity = document.createElement('input'),
                            detailsWrapper = cardClone.querySelector('.productcard__details');
                        productQuantity.setAttribute('type', 'number');
                        productQuantity.setAttribute('min', 1);
                        productQuantity.classList.add('productcard__quantity');
                        productQuantity.addEventListener('change', refreshAll);
                        detailsWrapper.appendChild(productQuantity);
                        
                        //Создаём селекты
                        const productSelect = document.createElement('input');
                        productSelect.setAttribute('type', 'checkbox');
                        productSelect.classList.add('productcard__to-clean');
                        cardClone.appendChild(productSelect);
    
                        cardClone.querySelector('.productcard__quantity').value = 1;
                        cartWrapper.appendChild(cardClone); //? Как правильно записать async-await так, чтобы последующий код выполнился именно после добавления нового элемента?
                        refreshAll();
                    }
    
                    addedImg.classList.remove('is-hidden');
                    setTimeout(() => addedImg.classList.add('is-hidden'), 500);
                    
                });
            });
        }
        
        function toggleCart() {
            const cartOpenBtn = document.getElementById('cart'),
                cartCloseBtn = cart.querySelector('.cart__close'),
                cleanBtn = document.getElementById('cleanBtn'),
                cartGoods = cartWrapper.querySelectorAll('.productcard'),
                selectAllCheckbox = document.getElementById('selectAll');

            function openCart() {
                cart.classList.remove('is-hidden');
                document.body.style.overflow = "hidden";
            }
            function closeCart() {
                cart.classList.add('is-hidden');
                document.body.style.overflow = "";
            }

            function cleanCart() {
                const cardsSelected = cartWrapper.querySelectorAll('.productcard__to-clean:checked');
                if (cardsSelected.length > 0) {
                    let clean = confirm("Вы уверены, что хотите удалить выбранные товары?");
                    if (clean) {
                        cartGoods.forEach(card => {
                            toClean = card.querySelector('.productcard__to-clean');
                            if(toClean.checked) card.remove();
                        });
                        refreshAll();         
                    }
                } else {
                    alert("Выберите, какие товары удалить из корзины");
                }
            }
            
            function selectAll() {
                if (selectAllCheckbox.checked) {
                    cartGoods.forEach(card => {
                        card.querySelector('.productcard__to-clean').checked = true;
                    });
                } else {
                    cartGoods.forEach(card => {
                        card.querySelector('.productcard__to-clean').checked = false;
                    });
                }
            }

            cartOpenBtn.addEventListener('click', openCart);
            cartCloseBtn.addEventListener('click', closeCart);
            cleanBtn.addEventListener('click', cleanCart);
            selectAllCheckbox.addEventListener('change', selectAll);
        }

        
        

        function sliceTitle() {
            const titles = document.querySelectorAll('.productcard__title');
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

        // Чекбоксы
        function toggleCheckbox() {
            let checkboxes = document.querySelectorAll('.filter-check_checkbox');            
            for(let el of checkboxes) { // Вместо этого можно forEach
                el.addEventListener('change', function() {
                    if (this.checked) {
                        this.nextElementSibling.classList.add('checked'); // следующему элементу в вёрстке добавили класс
                    } else {
                        this.nextElementSibling.classList.remove('checked');
                    }
                });
            }
        }

        toggleCart();
        toggleCheckbox();
        addToCart();
        sliceTitle();

    });

    
    

});