import { addLike, removeLike } from '../utils/api.js';

export function createCard(cardData, handleDeleteCard, handleLikeClick, handleCardClick) {
    const cardElement = document
        .querySelector('#card-template')
        .content
        .querySelector('.card')
        .cloneNode(true);

    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');
    const likeCountElement = cardElement.querySelector('.card__like-count');

    deleteButton.classList.add('hidden');
    likeCountElement.classList.add('hidden');

    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;

    if (cardData.liked) {
        likeButton.classList.add('card__like-button_is-active');
    }
    if (cardData.likes?.length) {
        likeCountElement.textContent = cardData.likes.length;
        likeCountElement.classList.remove('hidden');
    }
    if (cardData.myCard) {
        deleteButton.addEventListener('click', () => handleDeleteCard(cardElement, cardData));
        deleteButton.classList.remove('hidden');
    }

    likeButton.addEventListener('click', () => handleLikeClick(cardData, likeButton, likeCountElement));
    cardImage.addEventListener('click', () => handleCardClick(cardData));

    return cardElement;
}

export function handleLikeClick(card, likeButton, likeCount) {
    const isLiked = likeButton.classList.contains('card__like-button_is-active');
    const likeAction = isLiked ? removeLike : addLike;

    likeAction(card._id)
        .then((updatedCard) => {
            likeCount.textContent = updatedCard.likes.length;
            likeButton.classList.toggle('card__like-button_is-active');

            if (updatedCard.likes.length) {
                likeCount.classList.remove('hidden');
            } else {
                likeCount.classList.add('hidden');
            }
        })
        .catch((err) => {
            console.log(`Ошибка при ${isLiked ? 'удалении' : 'добавлении'} лайка: ${err}`);
        });
}