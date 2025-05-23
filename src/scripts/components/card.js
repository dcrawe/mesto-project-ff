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

    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;

    deleteButton.addEventListener('click', () => handleDeleteCard(cardElement));
    likeButton.addEventListener('click', () => handleLikeClick(likeButton));
    cardImage.addEventListener('click', () => handleCardClick(cardData));

    return cardElement;
}