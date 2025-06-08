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
    const likeCount = cardElement.querySelector('.card__like-count');

    deleteButton.classList.add('hidden');
    likeCount.classList.add('hidden');

    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;

    if (cardData.liked) {
        likeButton.classList.add('card__like-button_is-active');
    }
    if (cardData.likes?.length) {
        likeCount.textContent = cardData.likes.length;
        likeCount.classList.remove('hidden');
    }
    if (cardData.myCard) {
        deleteButton.addEventListener('click', () => handleDeleteCard(cardElement, cardData));
        deleteButton.classList.remove('hidden');
    }

    likeButton.addEventListener('click', () => handleLikeClick(cardElement, cardData));
    cardImage.addEventListener('click', () => handleCardClick(cardData));

    return cardElement;
}