export function usePopup(popup) {
    const events = {
        open: new Set(),
        close: new Set()
    };

    const emit = (event, data) => events[event].forEach(callback => callback(data));
    const on = (event, callback) => {
        events[event].add(callback);
        return () => events[event].delete(callback);
    }

    function openPopup() {
        emit('open', popup);
        popup.classList.add('popup_is-opened');
    }
    function closePopup() {
        emit('close', popup);
        popup.classList.remove('popup_is-opened');
    }

    function initListener(button, closeButton) {
        const resultCloseButtons = closeButton ?? popup.querySelector('.popup__close');

        button.addEventListener('click', () => {
            openPopup(popup);
        });
        resultCloseButtons.addEventListener('click', () => {
            closePopup(popup);
        });
        popup.addEventListener('mousedown', (evt) => {
            if (evt.target === popup) {
                closePopup(popup);
            }
        });
        document.addEventListener('keydown', function (evt) {
            if (evt.key === 'Escape') {
                closePopup(popup);
            }
        });

        return {
            on,
        }
    }

    return {
        openPopup,
        closePopup,
        initListener,
    }
}