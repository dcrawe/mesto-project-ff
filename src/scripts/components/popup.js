export function usePopup(popup) {
    const events = {
        open: new Map(),
        close: new Map(),
    };

    const emit = (event, data, activator) => {
        if (activator && events[event].has(activator)) {
            events[event].get(activator).forEach(callback => callback(data));
        } else if (!activator) {
            events[event].forEach(callbacks => callbacks.forEach(cb => cb(data)));
        }
    };
    const on = (event, callback, activator) => {
        if (!events[event].has(activator)) {
            events[event].set(activator, []);
        }

        events[event].get(activator).push(callback);

        return () => {
            const callbacks = events[event].get(activator);
            const index = callbacks.indexOf(callback);
            if (index !== -1) callbacks.splice(index, 1);
        };
    };

    function openPopup(activator) {
        emit('open', popup, activator);
        popup.classList.add('popup_is-opened');
    }

    function closePopup() {
        emit('close', popup);
        popup.classList.remove('popup_is-opened');
    }

    function initListener(button, closeButton) {
        const resultCloseButtons = closeButton ?? popup.querySelector('.popup__close');

        button.addEventListener('click', () => {
            openPopup(button);
        });

        resultCloseButtons.addEventListener('click', () => closePopup());
        popup.addEventListener('mousedown', (evt) => {
            if (evt.target === popup) closePopup();
        });
        document.addEventListener('keydown', (evt) => {
            if (evt.key === 'Escape') closePopup();
        });

        return {
            on: (event, callback) => on(event, callback, button),
        };
    }

    return {
        openPopup,
        closePopup,
        initListener,
    };
}