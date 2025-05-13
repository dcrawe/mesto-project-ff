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

export function useCard() {
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

    function submitForm() {
        return new Promise((resolve) => {
            const cardTemplate = document.querySelector('#card-template').content;
            const cardElement = cardTemplate.querySelector('.card');
            const newCard = cardElement.cloneNode(true);

            const cardImgNode = newCard.querySelector('.card__image');
            const cardTitleNode = newCard.querySelector('.card__title');
            const deleteButton = newCard.querySelector('.card__delete-button');
            const likeButton = newCard.querySelector('.card__like-button');

            const name = nameInput.value;
            const link = urlInput.value;

            if (name && link) {
                cardImgNode.src = link;
                cardImgNode.alt = name;
                cardTitleNode.textContent = name;

                deleteButton.addEventListener('click', () => newCard.remove());
                likeButton.addEventListener('click', () => likeButton.classList.toggle('card__like-button_is-active'));

                cardsList.prepend(newCard);
            }

            closePopup();
            resolve();
        });
    }

    setCloseCallback(resetCardForm);

    return {
        form,
        submitForm
    }
}
