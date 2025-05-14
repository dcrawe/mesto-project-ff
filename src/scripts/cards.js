import { usePopup } from "./popup";

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
    const addButton = document.querySelector('.profile__add-button');
    const popup = document.querySelector('.popup_type_new-card');
    const form = document.querySelector('.popup__form[name="new-place"]');
    const nameInput = form.querySelector('.popup__input_type_card-name');
    const urlInput = form.querySelector('.popup__input_type_url');
    const cardsList = document.querySelector('.places__list');
    const {
        closePopup,
        initListener,
    } = usePopup(popup);
    const {setCloseCallback} = initListener(addButton);
    const resetCardForm = () => form.reset();
    const createCard = async (name, link) => new Promise((resolve, reject) => {
        const cardTemplate = document.querySelector('#card-template').content;
        const cardElement = cardTemplate.querySelector('.card');
        const newCard = cardElement.cloneNode(true);

        const cardImgNode = newCard.querySelector('.card__image');
        const cardTitleNode = newCard.querySelector('.card__title');
        const deleteButton = newCard.querySelector('.card__delete-button');
        const likeButton = newCard.querySelector('.card__like-button');

        const {
            onRemoveClick = (deleteButton, newCard) => newCard.remove(),
            onLikeClick = (likeButton) => likeButton.classList.toggle('card__like-button_is-active'),
        } = options;

        if (name && link) {
            cardImgNode.src = link;
            cardImgNode.alt = name;
            cardTitleNode.textContent = name;

            deleteButton.addEventListener('click', () => onRemoveClick(likeButton, newCard));
            likeButton.addEventListener('click', () => onLikeClick(likeButton, newCard));

            resolve(newCard);
        } else {
            reject();
        }

        closePopup();
    })
    const renderInitialCards = async () => {
        const fragment = document.createDocumentFragment();
        const cards = await Promise.all(
            initialCards.map(({name, link}) => createCard(name, link))
        );

        cards.forEach(card => {
            if (card) fragment.append(card);
        });
        cardsList.append(fragment);
    }
    const submitForm = async () => {
        const name = nameInput.value;
        const link = urlInput.value;
        const card = await createCard(name, link);

        cardsList.prepend(card);
    }

    setCloseCallback(resetCardForm);

    return {
        form,
        submitForm,
        renderInitialCards,
    }
}
