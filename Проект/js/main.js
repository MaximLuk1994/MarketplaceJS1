window.addEventListener('DOMContentLoaded', () => {

    function createElement(arr) {
        const goodsWrapper = document.querySelector('.goods');
        arr.forEach(function(item) {
            let card = document.createElement('div');
            card.classList.add('productcard');
            card.innerHTML = `
                <div class="productcard__id"></div>
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

    const cartOpenBtn = document.getElementById('cart'),
        cart = document.querySelector('.cart'),
        cartWrapper = document.querySelector('.cart__wrapper'),
        cartCloseBtn = cart.querySelector('.cart__close'),
        cartEmpty = document.querySelector('.empty'),
        goods = document.querySelectorAll('.productcard'),
        quantity = document.querySelector('#quantity'),
        cleanBtn = document.getElementById('cleanBtn'),
        titles = document.querySelectorAll('.productcard__title');

    let cartTotal = cart.querySelector('.cart__total :first-child span');


    function openCart() {
        cart.classList.remove('is-hidden');
        document.body.style.overflow = "hidden";
    }
    function closeCart() {
        cart.classList.add('is-hidden');
        document.body.style.overflow = "";
    }

    function countCart() {
        const cartGoods = cartWrapper.querySelectorAll('.productcard');
        quantity.innerText = cartGoods.length;
    }

    function countTotal() {
        const cartGoods = cartWrapper.querySelectorAll('.productcard');
        let total = 0;
        cartGoods.forEach(card => {
            const price = card.querySelector('.productcard__price');
            total += +price.textContent;
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
            quantity.classList.remove('is-hidden');
            cleanBtn.classList.remove('is-hidden');
        } else if (!cart.querySelector('.empty')) {
            cartWrapper.appendChild(cartEmpty);
            quantity.classList.add('is-hidden');
            cleanBtn.classList.add('is-hidden');
        }
    }

    goods.forEach(card => {
        const addBtn = card.querySelector('.productcard__btn-buy'),
            addedImg = card.querySelector('.productcard__added');

        addBtn.addEventListener('click', async () => {
            const cardClone = card.cloneNode(true);
            removeBtn = cardClone.querySelector('.productcard__btn-buy');
            addedImgClone = cardClone.querySelector('.productcard__added');
            if (addedImgClone) addedImgClone.remove();
            removeBtn.textContent = 'Удалить';
            removeBtn.addEventListener('click', () => {
                cardClone.remove();
                countCart();
                refreshEmpty();
                countTotal();
            });
            await cartWrapper.appendChild(cardClone);
            countCart();
            refreshEmpty();
            countTotal();

            addedImg.classList.remove('is-hidden');
            setTimeout(() => addedImg.classList.add('is-hidden'), 500);
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