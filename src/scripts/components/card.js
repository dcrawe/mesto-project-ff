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
            cardTemplate: '#card-template',
            cardElement: '.card',
            cardImage: '.card__image',
            cardTitle: '.card__title',
            deleteButton: '.card__delete-button',
            likeButton: '.card__like-button'
        },
        callbacks: {
            onRemoveClick: (deleteButton, card) => card.remove(),
            onLikeClick: (likeButton) => likeButton.classList.toggle('card__like-button_is-active')
        },
        popupModule: null,
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
    const validatedElements = () => {
        const error = (error) => {throw new Error(error)}
        const cardTemplate = document.querySelector(config.selectors.cardTemplate)?.content;

        if (!cardTemplate) {
            error(`Шаблон карточки не найден: ${config.selectors.cardTemplate}`);
        }

        const cardElement = cardTemplate.querySelector(config.selectors.cardElement);

        if (!cardElement) {
            error(`Элемент ${config.selectors.cardElement} не найден в шаблоне`);
        }

        const newCard = cardElement.cloneNode(true);
        const cardImgNode = newCard.querySelector(config.selectors.cardImage);

        if (!cardImgNode) {
            error(`Элемент ${config.selectors.cardImage} не найден в карточке`);
        }

        const cardTitleNode = newCard.querySelector(config.selectors.cardTitle);
        const deleteButton = newCard.querySelector(config.selectors.deleteButton);
        const likeButton = newCard.querySelector(config.selectors.likeButton);

        return {
            cardTemplate,
            cardElement,
            newCard,
            cardImgNode,
            cardTitleNode,
            deleteButton,
            likeButton
        }
    }
    const createCard = async (name, link) => new Promise((resolve, reject) => {
        if (!name || !link) {
            return reject(new Error('Название или URL карточки отсутствуют'));
        }

        try {
            const {
                newCard,
                cardImgNode,
                cardTitleNode,
                deleteButton,
                likeButton,
            } = validatedElements();

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
        } catch (error) {
            return reject(error);
        }
    })
    const renderInitialCards = async (cardsData) => {
        if (!cardsList) return;

        const fragment = document.createDocumentFragment();

        try {
            const cards = await Promise.all(
                cardsData.map(({name, link}) => createCard(name, link))
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
        createCard,
    }
}
