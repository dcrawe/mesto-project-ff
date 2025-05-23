import '../styles/pages/index.css';
import {createCard} from './components/card.js';
import {initialCards} from './data/cards.js';
import {openPopup, closePopup, setPopupEventListeners} from './components/popup.js';

// DOM-элементы для карточек
const addButton = document.querySelector('.profile__add-button');
const cardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const cardForm = document.querySelector('.popup__form[name="new-place"]');
const nameInput = cardForm.querySelector('.popup__input_type_card-name');
const urlInput = cardForm.querySelector('.popup__input_type_url');
const cardsList = document.querySelector('.places__list');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

// DOM-элементы для профиля
const editButton = document.querySelector('.profile__edit-button');
const profilePopup = document.querySelector('.popup_type_edit');
const profileForm = document.querySelector('.popup__form[name="edit-profile"]');
const profileNameInput = profileForm.querySelector('.popup__input_type_name');
const profileJobInput = profileForm.querySelector('.popup__input_type_description');
const profileName = document.querySelector('.profile__title');
const profileJob = document.querySelector('.profile__description');

setPopupEventListeners(cardPopup);
setPopupEventListeners(imagePopup);
setPopupEventListeners(profilePopup);

function fillProfileForm() {
    profileNameInput.value = profileName.textContent;
    profileJobInput.value = profileJob.textContent;
}
function updateProfileInfo() {
    profileName.textContent = profileNameInput.value;
    profileJob.textContent = profileJobInput.value;

    closePopup(profilePopup);
}
function handleProfileFormSubmit(evt) {
    evt.preventDefault();

    try {
        updateProfileInfo();
    } catch (error) {
        console.error(error);
    }
}
function handleDeleteCard(card) {
    card.remove();
}
function handleLikeClick(likeButton) {
    likeButton.classList.toggle('card__like-button_is-active');
}
function handleCardClick({name, link}) {
    popupImage.src = link;
    popupImage.alt = name;
    popupCaption.textContent = name;

    openPopup(imagePopup);
}
function renderInitialCards(cards) {
    const fragment = document.createDocumentFragment();

    cards.forEach(cardData => {
        fragment.append(
            createCard(
                cardData,
                handleDeleteCard,
                handleLikeClick,
                handleCardClick
            )
        );
    });

    cardsList.append(fragment);
}
function submitCardForm(evt) {
    evt.preventDefault();
    try {
        const name = nameInput.value;
        const link = urlInput.value;

        const card = createCard(
            {name, link},
            handleDeleteCard,
            handleLikeClick,
            handleCardClick
        );

        cardsList.prepend(card);
        cardForm.reset();
        closePopup(cardPopup);
    } catch (error) {
        console.error(error);
    }
}

addButton.addEventListener('click', () => {
    cardForm.reset();
    openPopup(cardPopup);
});
editButton.addEventListener('click', () => {
    fillProfileForm();
    openPopup(profilePopup);
});
profileForm.addEventListener('submit', handleProfileFormSubmit);
cardForm.addEventListener('submit', submitCardForm);

renderInitialCards(initialCards);