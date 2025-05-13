export function usePopup(popup) {
    function openPopup() {
        popup.classList.add('popup_is-opened');
    }
    function closePopup() {
        popup.classList.remove('popup_is-opened');
    }
    function handleEscapeKey(evt) {
        if (evt.key === 'Escape') {
            closePopup(popup);
        }
    }

    function initListener(button, closeButton) {
        const resultCloseButtons = closeButton ?? popup.querySelector('.popup__close');
        const openCallbacks = [];
        const closeCallbacks = [];

        button.addEventListener('click', () => {
            openPopup(popup);
            openCallbacks.forEach(callback => callback(popup));
        });
        resultCloseButtons.addEventListener('click', () => {
            closePopup(popup);
            closeCallbacks.forEach(callback => callback(popup));
        });
        popup.addEventListener('mousedown', (evt) => {
            if (evt.target === popup) {
                closePopup(popup);
            }
        });
        document.addEventListener('keydown', handleEscapeKey);

        function setOpenCallback(callback) {
            openCallbacks.push(callback);
        }
        function setCloseCallback(callback) {
            closeCallbacks.push(callback);
        }

        return {
            setOpenCallback,
            setCloseCallback,
        }
    }

    return {
        initListener,
    }
}