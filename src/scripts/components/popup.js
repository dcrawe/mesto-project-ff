export function usePopup(popup, options = {}) {
    const config = {
        classNames: {
            openedPopup: 'popup_is-opened',
        },
        selectors: {
            closeButton: '.popup__close',
        },
        keyboard: {
            enabled: true,
            closeKeys: ['Escape'],
        },
        overlay: {
            closeOnClick: true,
        },
        ...options
    };
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
    const openPopup = (activator) => {
        document.addEventListener('keydown', keydownHandler);
        emit('open', popup, activator);
        popup.classList.add(config.classNames.openedPopup);
    }
    const closePopup = () => {
        document.removeEventListener('keydown', keydownHandler);
        emit('close', popup);
        popup.classList.remove(config.classNames.openedPopup);
    }
    const keydownHandler = (evt) => {
        if (config.keyboard.enabled && config.keyboard.closeKeys.includes(evt.key)) {
            closePopup();
        }
    };
    const initListener = (button, closeButton) => {
        const resultCloseButtons = closeButton ?? popup.querySelector(config.selectors.closeButton);

        if (button) {
            button.addEventListener('click', () => {
                openPopup(button);
            });
        }
        if (resultCloseButtons) {
            resultCloseButtons.addEventListener('click', () => closePopup());
        }
        if (config.overlay.closeOnClick) {
            popup.addEventListener('mousedown', (evt) => {
                if (evt.target === popup) closePopup();
            });
        }

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