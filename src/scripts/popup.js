export function usePopup(popup) {
    function openPopup() {
        popup.classList.add('popup_is-opened');
    }
    function closePopup() {
        popup.classList.remove('popup_is-opened');
    }

    function initListener(button, closeButton) {
        const resultCloseButtons = closeButton ?? popup.querySelector('.popup__close');
        const openCallbacks = [];
        const closeCallbacks = [];

        function executeCallbacks(callbacks, popup) {
            callbacks.forEach(callback => callback(popup));
        }
        function executeOpenCallbacks() {
            executeCallbacks(openCallbacks, popup);
        }
        function executeCloseCallbacks() {
            executeCallbacks(closeCallbacks, popup);
        }

        button.addEventListener('click', () => {
            openPopup(popup);
            executeOpenCallbacks();
        });
        resultCloseButtons.addEventListener('click', () => {
            closePopup(popup);
            executeCloseCallbacks();
        });
        popup.addEventListener('mousedown', (evt) => {
            if (evt.target === popup) {
                closePopup(popup);
                executeCloseCallbacks();
            }
        });
        document.addEventListener('keydown', function (evt) {
            if (evt.key === 'Escape') {
                closePopup(popup);
                executeCloseCallbacks();
            }
        });

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
        openPopup,
        closePopup,
        initListener,
    }
}