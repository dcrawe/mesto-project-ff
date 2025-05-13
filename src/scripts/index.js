import '../styles/pages/index.css'; // добавьте импорт главного файла стилей
import { initialCards, useCard } from './cards.js';
import { useProfile } from './profile.js';

const { form: profileForm, submitForm } = useProfile();

const { form: cardForm, submitForm: submitCardForm } = useCard();

const cardTemplate = document.querySelector('#card-template').content;
const cardElement = cardTemplate.querySelector('.card');
const container = document.querySelector('.places__list');

profileForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    submitForm();
});
cardForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    submitCardForm();
});

const createCard = ({ name, link }) => {
    if (!name || !link) return;

    const cardNode = cardElement.cloneNode(true);
    const cardImgNode = cardNode.querySelector('.card__image');
    const cardTitleNode = cardNode.querySelector('.card__title');
    const deleteButton = cardNode.querySelector('.card__delete-button');
    const likeButton = cardNode.querySelector('.card__like-button');

    cardImgNode.src = link;
    cardImgNode.alt = name;
    cardTitleNode.textContent = name;

    deleteButton.addEventListener('click', () => deleteCard(cardNode));
    likeButton.addEventListener('click', () => likeButton.classList.toggle('card__like-button_is-active'));

    return cardNode;
}
const deleteCard = (card) => card.remove();
const renderInitialCards = () => {
    container.append(
        initialCards.reduce(
            (acc, cardData) => {
                const card = createCard(cardData);

                if (card) {
                    acc.append(card);
                }

                return acc;
            },
            document.createDocumentFragment()
        )
    );
}

renderInitialCards();