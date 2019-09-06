window.addEventListener('DOMContentLoaded', () => {
    const cartOpenBtn = document.getElementById('cart'),
        cart = document.querySelector('.cart'),
        cartWrapper = document.querySelector('.cart__wrapper'),
        cartCloseBtn = cart.querySelector('.cart__close'),
        cartEmpty = document.querySelector('.empty'),
        goods = document.querySelectorAll('.productcard'),
        quantity = document.querySelector('#quantity'),
        cleanBtn = document.getElementById('cleanBtn');


    function openCart() {
        cart.classList.remove('is-hidden');
        document.body.style.overflow = "hidden";
    }
    function closeCart() {
        cart.classList.add('is-hidden');
        document.body.style.overflow = "";
    }

    function countCart() {
        count = cartWrapper.querySelectorAll('.productcard');
        quantity.innerText = count.length;
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
            });
            await cartWrapper.appendChild(cardClone);
            countCart();
            refreshEmpty();

            addedImg.classList.remove('is-hidden');
            setTimeout(() => addedImg.classList.add('is-hidden'), 500);
        });
    });

    cartOpenBtn.addEventListener('click', openCart);
    cartCloseBtn.addEventListener('click', closeCart);
    cleanBtn.addEventListener('click', cleanCart);
    

});