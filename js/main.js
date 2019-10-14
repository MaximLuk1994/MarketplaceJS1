window.addEventListener('DOMContentLoaded', () => {

    class ProductCard {
        constructor(id, sale, img, price, category, title) {
            this.params = {id, sale, img, price, category, title};
            this.template = `
                <div class="productcard__img">
                    <img src="${img}" alt="image">
                    <div class="productcard__added is-hidden">Добавлено!</div>
                </div>
                <div class="productcard__sale is-hidden">sale!</div>                                                
                <div class="productcard__details">
                    <div class="productcard__price">${price}</div>
                    <div class="productcard__category">${category}</div>
                    <div class="productcard__title">${title}</div>
                </div>                         
                <button class="productcard__btn-buy btn">Купить</button>
            `;
            this.elems = {};
            this.elems.card = {};
            this.elems.shortcard = {};
            this.cartInfo = {inCart: 0}; // Сюда потом могу вытягивать инфу из куков
        }
        create() {
            let card = document.createElement('div');
            card.classList.add('productcard');
            card.setAttribute("data-id", this.params.id);
            card.setAttribute("data-sale", this.params.sale);
            card.innerHTML = this.template;
            this.card = card;

            this.elems.card.addBtn = this.card.querySelector('.productcard__btn-buy');
            this.elems.card.addBtn.addEventListener('click', () => {
                addToCart(this);
            });
        }
        checkSale() {
            if (this.params.sale) this.card.querySelector('.productcard__sale').classList.remove('is-hidden'); // отдельная функция, потому что не могу обращаться к тегу "распродажи" пока карточка не создана
        }
    }

    // Функция добавляет в объект товара вёрстку карточки для корзины и пересчитывает счётчики
    function addToCart(elem) {
        // console.log(elem); // Проверка
        const addedImg = elem.card.querySelector('.productcard__added');
        if (elem.cartInfo.inCart > 0) {
            elem.cartInfo.inCart++;
            elem.shortcard.querySelector('.productcard__quantity').value = elem.cartInfo.inCart;
            refreshAll();
        } else {
            // Меняем вёрстку карточки
            elem.shortcard = elem.card.cloneNode(true);
            const removeBtn = elem.shortcard.querySelector('.productcard__btn-buy'),
                addedImgClone = elem.shortcard.querySelector('.productcard__added');
            if (addedImgClone) addedImgClone.remove(); // Удаление картинки "Добавлено", если на кнопку "Купить" нажимали слишком быстро и она осталась в вёрстке
            removeBtn.textContent = 'Удалить';
            removeBtn.classList.remove('productcard__btn-buy');
            removeBtn.classList.add('productcard__btn-remove');
            removeBtn.addEventListener('click', () => {
                elem.shortcard.remove();
                elem.cartInfo.inCart = 0;
                // console.log(elem.cartInfo.inCart);
                refreshAll();
            });
            // Добавляем количество товара
            elem.cartInfo.inCart += 1;
            const productQuantity = document.createElement('input'),
                detailsWrapper = elem.shortcard.querySelector('.productcard__details');
            productQuantity.setAttribute('type', 'number');
            productQuantity.setAttribute('min', 1);
            productQuantity.value = elem.cartInfo.inCart;
            productQuantity.classList.add('productcard__quantity');
            productQuantity.addEventListener('change', () => {
                elem.cartInfo.inCart = productQuantity.value;
                // console.log(elem.cartInfo.inCart);
                refreshAll();
            });
            detailsWrapper.appendChild(productQuantity);
            
            //Создаём селекты
            const productSelect = document.createElement('input');
            productSelect.setAttribute('type', 'checkbox');
            productSelect.classList.add('productcard__to-clean');
            elem.shortcard.appendChild(productSelect);

            cartWrapper.appendChild(elem.shortcard); //? Как правильно записать async-await так, чтобы последующий код выполнился именно после добавления нового элемента?
            refreshAll();
        }

        // console.log(elem.cartInfo.inCart);
        addedImg.classList.remove('is-hidden');
        setTimeout(() => addedImg.classList.add('is-hidden'), 500);
    }

    //* 1. Обновление счётчика количества товаров в корзине, общей стоимости и надписи "Корзина пуста"
    function refreshAll() {

        const cartWrapper = document.querySelector('.cart__wrapper'),
            cartGoods = cartWrapper.querySelectorAll('.productcard'),
            cartQuantity = document.querySelector('#quantity'),
            cart = document.querySelector('.cart');
        // 1.1. Количество товаров в корзине:
        function countCart() {
            let counter = 0;
            cartGoods.forEach(card => {
                const quantity = card.querySelector('.productcard__quantity');
                counter+= +quantity.value;
            });
            cartQuantity.textContent = counter;
            if (counter == 0) {
                cartQuantity.classList.add('is-hidden');
            } else {
                cartQuantity.classList.remove('is-hidden');
            }
        }

        // 1.2. Общая стоимость в корзине:
        function countTotal() {
            const cartTotal = cart.querySelector('.cart__total :first-child span');
            let total = 0;
            cartGoods.forEach(card => {
                const price = card.querySelector('.productcard__price');
                const quantity = card.querySelector('.productcard__quantity');
                total += +price.textContent * quantity.value;
            });
            cartTotal.textContent = total;
        }

        // 1.3. Надпись "Корзина пуста"
        function refreshEmpty() {
            const cartSelect = cart.querySelector('.cart__select'),
                cleanBtn = document.getElementById('cleanBtn'),
                carEmpty = cart.querySelector('.empty');
            if (cartGoods.length > 0) {
                carEmpty.classList.add('is-hidden');
                cleanBtn.classList.remove('is-hidden');
                cartSelect.classList.remove('is-hidden');
            } else {
                carEmpty.classList.remove('is-hidden');
                cleanBtn.classList.add('is-hidden');
                cartSelect.classList.add('is-hidden');
            }
        }
        countCart();
        refreshEmpty();
        countTotal();        
    }

    // let cart = {};

    // Нужно будет засунуть инициализацию блока goods до инициализации карточек товаров
    let goodsContainer = {
        page: {},
        goods: [],
        pagination: {},        
        setGoods(container) {
            this.goods = document.querySelector(container).querySelectorAll('.productcard');
        },
        createPages(quantity, container) {
            this.page.template = document.createElement('div');
            this.page.template.classList.add('goods__page');
            for (let i = 1; i <= quantity; i++) {
                const page = this.page.template.cloneNode(true);
                page.setAttribute('data-page', i);
                document.querySelector(container).appendChild(page);
            }
        },
        paginationTemplateIni() {
            this.pagination.template = document.createElement('nav');
            this.pagination.template.classList.add('my-pages');
            this.pagination.template.innerHTML = `<ul class="pagination">
                    <li class="page-item">
                        <a class="page-link" href="#" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" href="#" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>`
        },
        countPages(perPage) {
            this.page.perPage = perPage; // Количество товаров на странице, будем вытягивать из вёрстки
            this.page.count = Math.ceil(this.goods.length / this.page.perPage);
        },
        spreadPages(arr, container) {
            for (let i = 1; i <=goodsContainer.page.count; i++) {
                const pagesWrapper = document.querySelector(container);
                const page = pagesWrapper.querySelector(`[data-page="${i}"]`);
                for (let j = goodsContainer.page.perPage*(i-1)+1; j <= goodsContainer.page.perPage*i && j <= arr.length; j++) {
                    let product = new ProductCard(arr[j-1].id, arr[j-1].sale, arr[j-1].img, arr[j-1].price, arr[j-1].category, arr[j-1].title);
                    product.create();
                    product.checkSale();
                    page.appendChild(product.card);
                }
    
            }
        },
        pageNumbers(container) {
            if (this.page.count > 1) {                
                document.querySelector(container).appendChild(this.pagination.template);                

                // console.log(count);
                for (let i = 1; i <= this.page.count; i++) {
                    const insertOne = document.createElement('li');
                    insertOne.classList.add('page-item');
                    insertOne.innerHTML = `<a class="page-link" href="${i}">${i}</a>`;
                    this.pagination.template.querySelectorAll('li')[i-1].after(insertOne);
                }
            }
        }
    };



 
    const loadContent = async (url, callback) => {
        await fetch(url)
            .then(response => response.json())
            .then(json => createElement(json.goods))
            .then(console.log('База загружена'));// Для себя, для проверки

        callback();
    }

    function createElement(arr) {
        goodsContainer.goods = arr;
        goodsContainer.paginationTemplateIni();
        goodsContainer.countPages(5);
        // const goodsWrapper = document.querySelector('.goods');
        goodsContainer.createPages(goodsContainer.page.count, '.goods');
        goodsContainer.spreadPages(arr,'.goods');
        goodsContainer.pageNumbers('.content-right');
    }

    loadContent('db/db.json', () =>{ 

        //* Общие элементы, которые будут удаляться и возвращаться:
        // cartEmpty = document.querySelector('.empty');
        // Сюда же можно добавить все счётчики, чтобы они не были скрытыми элементами в вёрстке

        function toggleSettings() {
            // const searchBtn = document.getElementById('search');
            // searchBtn.parentElement.addEventListener('submit', (e) => {
            //     event.preventDefault();
            //     return false; //? Нужно ли это?
            // });
        }
        
        function toggleCart() {
            const cartOpenBtn = document.getElementById('cart'),
                cart = document.querySelector('.cart')
                cartCloseBtn = cart.querySelector('.cart__close'),
                cartWrapper = cart.querySelector('.cart__wrapper'),
                cleanBtn = document.getElementById('cleanBtn'),
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
                const cardsSelected = cartWrapper.querySelectorAll('.productcard__to-clean:checked'),
                    cartGoods = cartWrapper.querySelectorAll('.productcard');
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
                const cartGoods = cartWrapper.querySelectorAll('.productcard');
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

        // Сокращение названий
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

        function toggleCategory() {
            const catSelect = document.querySelector('.filter-category_select'),
                goodsWrapper = document.querySelector('.goods'),
                categories = goodsWrapper.querySelectorAll('.productcard__category');
                // categories.forEach(cat => {
                //     const catOption = document.createElement('option');
                //     catOption.setAttribute('value', cat.textContent);
                //     catOption.textContent = cat.textContent;
                //     catSelect.appendChild(catOption);
                // });
                categories.forEach(cat => {
                    if (catSelect.querySelector(`option[value = '${cat.textContent}']`)) {
                        // return false; //? Надо ли это?
                    } else {
                        const catOption = document.createElement('option');
                        catOption.setAttribute('value', cat.textContent);
                        catOption.textContent = cat.textContent;
                        catSelect.appendChild(catOption);
                    }                    
                });
        }

        function toggleFilter() {
            const goodsWrapper = document.querySelector('.goods'),
                goods = goodsWrapper.querySelectorAll('.productcard'),
                discountCheckbox = document.querySelector('#discount-checkbox'),
                min = document.getElementById('min'),
                max = document.getElementById('max'),
                searchBtn = document.querySelector('#search'),
                searchInput = searchBtn.previousElementSibling,
                catSelect = document.querySelector('.filter-category_select');
        
            function checkDiscount(toFilter) {
                // const goods = document.querySelectorAll('.productcard');
                toFilter.forEach(el => {
                    const isSale = el.getAttribute("data-sale");
                    if (discountCheckbox.checked){ //? а могли бы использовать this с обычной функцией? - Да
                        // console.log(el)
                        if (isSale=='false') {
                            el.remove();
                        }        
                    } else {
                        goodsWrapper.appendChild(el);
                    }
                });
            }

            function checkPrice(toFilter) {
                // const goods = document.querySelectorAll('.productcard');
                toFilter.forEach((el) => {
                    const cardPrice = el.querySelector('.productcard__price');
                    const price = parseFloat(cardPrice.textContent);
                    // console.log(price);
                    if ((min.value && price <= min.value) || (max.value && price >= max.value)) {
                        el.remove();
                    } else {
                        goodsWrapper.appendChild(el);
                    }
                });
            }

            function checkSearch(toFilter) {
                const searchText = new RegExp(searchInput.value.trim(), 'i'); //? регулярное выражение https://regexr.com/
                // const goods = document.querySelectorAll('.productcard');
                // метод trim() убирает лишние пробелы по бокам
                // console.log(searchText);
                toFilter.forEach((el) => {
                    const title = el.querySelector('.productcard__title');
                    if (!searchText.test(title.textContent)) { // Проверяем, есть ли регулярное выражение searchText в тексте title.textContent. Возвращает булевое значение
                        el.remove();
                    } else {
                        goodsWrapper.appendChild(el);
                    }
                });
            }

            function checkCategory(toFilter) {
                toFilter.forEach(el =>{
                    const cardCategory = el.querySelector('.productcard__category');
                    if (cardCategory.innerText !== catSelect.value && catSelect.value !== "all") {
                        el.remove();
                    } else {
                        goodsWrapper.appendChild(el);
                    }
                });
            }

            function checkAll() {
                checkDiscount(goods);
                checkPrice(goodsWrapper.querySelectorAll('.productcard'));
                checkSearch(goodsWrapper.querySelectorAll('.productcard'));
                checkCategory(goodsWrapper.querySelectorAll('.productcard'));
            }

            discountCheckbox.addEventListener('change', () => {
                checkAll();
            });
        
            min.addEventListener('change', checkAll);
            max.addEventListener('change', checkAll);
        
            searchBtn.parentElement.addEventListener('submit', (e) => {
                event.preventDefault();
                checkAll();
                // return false; // Надо ли? - НЕТ
            });

            catSelect.addEventListener('change', () => {
                checkAll();
            });

        }


        toggleCart();
        toggleCheckbox();
        sliceTitle();
        toggleSettings();
        toggleCategory();
        toggleFilter();
    });

    
    

});