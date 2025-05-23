export function openPopup(popup) {
    popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', handleEscClose);
}

export function closePopup(popup) {
    popup.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', handleEscClose);
}

function handleEscClose(evt) {
    if (evt.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        if (openedPopup) closePopup(openedPopup);
    }
}

export function setPopupEventListeners(popup) {
    popup.addEventListener('mousedown', (evt) => {
        if (evt.target === popup) {
            closePopup(popup);
        }
    });

    const closeButton = popup.querySelector('.popup__close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            closePopup(popup);
        });
    }
}