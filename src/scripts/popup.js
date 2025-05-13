export function usePopup(popup) {
    const openCallbacks = [];
    const closeCallbacks = [];

    const executeCallbacks = (callbacks, popup) => callbacks.forEach(callback => callback(popup));
    const executeOpenCallbacks = () => executeCallbacks(openCallbacks, popup);
    const executeCloseCallbacks = () => executeCallbacks(closeCallbacks, popup);

    function openPopup() {
        popup.classList.add('popup_is-opened');
        executeOpenCallbacks();
    }
    function closePopup() {
        popup.classList.remove('popup_is-opened');
        executeCloseCallbacks();
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