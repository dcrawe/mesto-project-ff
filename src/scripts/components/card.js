export const initialCards = [
    {
      name: "Архыз",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg",
    },
    {
      name: "Челябинская область",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg",
    },
    {
      name: "Иваново",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg",
    },
    {
      name: "Камчатка",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg",
    },
    {
      name: "Холмогорский район",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg",
    },
    {
      name: "Байкал",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg",
    }
];

export function useCard(options = {}) {
    const config = {
        selectors: {
            addButton: '.profile__add-button',
            popup: '.popup_type_new-card',
            imagePopup: '.popup_type_image',
            form: '.popup__form[name="new-place"]',
            nameInput: '.popup__input_type_card-name',
            urlInput: '.popup__input_type_url',
            cardsList: '.places__list',
            popupImage: '.popup__image',
            popupCaption: '.popup__caption',
            cardTemplate: '#card-template'
        },
        callbacks: {
            onRemoveClick: (deleteButton, card) => card.remove(),
            onLikeClick: (likeButton) => likeButton.classList.toggle('card__like-button_is-active')
        },
        popupModule: null, // будет передан извне
        ...options
    };

    const usePopup = config.popupModule || require('./popup').usePopup;
    const addButton = document.querySelector(config.selectors.addButton);
    const popup = document.querySelector(config.selectors.popup);
    const imagePopup = document.querySelector(config.selectors.imagePopup);
    const form = document.querySelector(config.selectors.form);
    const nameInput = form?.querySelector(config.selectors.nameInput);
    const urlInput = form?.querySelector(config.selectors.urlInput);
    const cardsList = document.querySelector(config.selectors.cardsList);
    const popupImage = imagePopup?.querySelector(config.selectors.popupImage);
    const popupCaption = imagePopup?.querySelector(config.selectors.popupCaption);
    const {
        closePopup,
        initListener: initListenerAddPopup,
    } = usePopup(popup);

    const {on} = initListenerAddPopup(addButton);
    const {
        initListener: initListenerImagePopup,
    } = usePopup(imagePopup);

    const resetCardForm = () => form.reset();
    const createCard = async (name, link) => new Promise((resolve, reject) => {
        const throwReject = (error) => {
            return reject(new Error(error));
        }

        const cardTemplate = document.querySelector(config.selectors.cardTemplate)?.content;

        if (!cardTemplate) {
            return throwReject(`Шаблон карточки не найден: ${config.selectors.cardTemplate}`);
        }

        const cardElement = cardTemplate.querySelector('.card');

        if (!cardElement) {
            return throwReject('Элемент .card не найден в шаблоне');
        }

        const newCard = cardElement.cloneNode(true);
        const cardImgNode = newCard.querySelector('.card__image');

        if (!cardImgNode) {
            return throwReject('Элемент .card__image не найден в карточке');
        }

        const cardTitleNode = newCard.querySelector('.card__title');
        const deleteButton = newCard.querySelector('.card__delete-button');
        const likeButton = newCard.querySelector('.card__like-button');

        if (!name || !link) {
            return reject(new Error('Название или URL карточки отсутствуют'));
        }

        cardImgNode.src = link;
        cardImgNode.alt = name;
        cardTitleNode.textContent = name;

        const { on } = initListenerImagePopup(cardImgNode);

        deleteButton?.addEventListener('click', () => config.callbacks.onRemoveClick(deleteButton, newCard));
        likeButton?.addEventListener('click', () => config.callbacks.onLikeClick(likeButton, newCard));

        on('open', () => {
            if (popupImage && popupCaption) {
                popupImage.src = link;
                popupImage.alt = name;
                popupCaption.textContent = name;
            }
        });

        resolve(newCard);

        closePopup();
    })
    const renderInitialCards = async () => {
        if (!cardsList) return;

        const fragment = document.createDocumentFragment();

        try {
            const cards = await Promise.all(
                initialCards.map(({name, link}) => createCard(name, link))
            );

            cards.forEach(card => {
                if (card) fragment.append(card);
            });

            cardsList.append(fragment);
        } catch (error) {
            console.error('Ошибка при рендеринге начальных карточек:', error);
        }
    }
    const submitForm = async () => {
        if (!cardsList) {
            console.error('Элемент списка карточек не найден');
            return;
        }
        if (!nameInput || !urlInput) {
            console.error('Не все элементы формы найдены');
            return;
        }

        try {
            const name = nameInput.value;
            const link = urlInput.value;
            const card = await createCard(name, link);

            cardsList.prepend(card);
        } catch (error) {
            console.error('Ошибка при добавлении новой карточки:', error);
        }
    }

    on('close', resetCardForm);

    return {
        form,
        submitForm,
        renderInitialCards,
    }
}
