import '../styles/pages/index.css';
import {enableValidation, clearValidation} from './utils/validation.js';
import {createCard, handleLikeClick} from './components/card.js';
import {openPopup, closePopup, setPopupEventListeners} from './components/popup.js';
import {
    getUserInfo,
    getInitialCards,
    updateUserProfile,
    addNewCard,
    deleteCard,
    addLike,
    removeLike,
    updateAvatar
} from './utils/api.js';

// DOM-элементы для карточек
const addButton = document.querySelector('.profile__add-button');
const cardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const cardDeletePopup = document.querySelector('.popup_type_delete');
const cardDeleteSubmitButton = cardDeletePopup.querySelector('.popup__button');
const cardForm = document.querySelector('.popup__form[name="new-place"]');
const nameInput = cardForm.querySelector('.popup__input_type_card-name');
const urlInput = cardForm.querySelector('.popup__input_type_url');
const submitButton = cardForm.querySelector('.popup__button');
const cardDeleteForm = document.querySelector('.popup__form[name="card-delete"]');
const cardsList = document.querySelector('.places__list');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

// DOM-элементы для профиля
const editButton = document.querySelector('.profile__edit-button');
const profilePopup = document.querySelector('.popup_type_edit');
const profileForm = document.querySelector('.popup__form[name="edit-profile"]');
const profileTitleInput = profileForm.querySelector('.popup__input_type_name');
const profileDescriptionInput = profileForm.querySelector('.popup__input_type_description');
const profileSubmitButton = profileForm.querySelector('.popup__button');
const profileContainer = document.querySelector('.profile__info');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__avatar');
const profileAvatarContainer = document.querySelector('.profile__image');
const profileAvatarLink = document.querySelector('.profile__image');
const profileAvatarPopup = document.querySelector('.popup_type_avatar');
const profileAvatarForm = document.querySelector('.popup__form[name="profile-avatar"]');
const profileAvatarInput = profileAvatarForm.querySelector('.popup__input_type_avatar');
const profileAvatarSubmitButton = profileAvatarForm.querySelector('.popup__button');


// Объект с настройками для валидации форм
const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
};

// Данные удаляемой карточки
let cardToDeleteData = null;

setPopupEventListeners(cardPopup);
setPopupEventListeners(imagePopup);
setPopupEventListeners(cardDeletePopup);
setPopupEventListeners(profilePopup);
setPopupEventListeners(profileAvatarPopup);

function renderLoading(button, isLoading = false, buttonText = 'Сохранить', loadingText = 'Сохранение...') {
    button.textContent = isLoading ? loadingText : buttonText;
    button.disabled = isLoading;
}

function fillProfileForm() {
    profileTitleInput.value = profileTitle.textContent;
    profileDescriptionInput.value = profileDescription.textContent;
}

function updateProfileInfo({name, about, avatar}) {
    profileContainer.classList.add('hidden');
    profileAvatarContainer.classList.add('hidden');

    if (name || about) {
        profileContainer.classList.remove('hidden');
        profileTitle.textContent = name;
        profileDescription.textContent = about;
    }
    if (avatar) {
        profileAvatar.src = avatar;
        profileAvatar.alt = name;
        profileAvatarContainer.classList.remove('hidden');
    }

    closePopup(profilePopup);
}

function updateProfileAvatar({avatar}) {
    profileAvatar.src = avatar;

    closePopup(profileAvatarPopup);
}

function validateImageUrl(url) {
    return fetch(url, {method: 'HEAD'})
        .then(response => {
            if (!response.ok) {
                throw new Error(`URL недоступен: ${response.status} ${response.statusText}`);
            }

            const contentType = response.headers.get('Content-Type');

            if (!contentType || !contentType.startsWith('image/')) {
                throw new Error(`Указанный URL не является изображением: ${contentType}`);
            }

            return url;
        })
        .catch(error => {
            throw new Error(`Ошибка проверки URL: ${error.message}`);
        });
}

function handleProfileFormSubmit(evt) {
    evt.preventDefault();

    renderLoading(profileSubmitButton, true);
    updateUserProfile(profileTitleInput.value, profileDescriptionInput.value)
        .then(updateProfileInfo)
        .catch((err) => {
            console.log(`Ошибка при обновлении профиля: ${err}`);
        })
        .finally(() => {
            renderLoading(profileSubmitButton);
        });
}

function handleProfileAvatarFormSubmit(evt) {
    evt.preventDefault();

    const avatarUrl = profileAvatarInput.value;

    renderLoading(profileAvatarSubmitButton, true);
    validateImageUrl(avatarUrl)
        .then(() => updateAvatar(avatarUrl))
        .then(updateProfileAvatar)
        .catch((err) => {
            console.log(`Ошибка при обновлении аватара: ${err}`);
        })
        .finally(() => {
            renderLoading(profileAvatarSubmitButton);
        });
}

function handleDeleteCard(cardElement, card) {
    cardToDeleteData = {cardElement, card};

    openPopup(cardDeletePopup);
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
    const name = nameInput.value;
    const link = urlInput.value;
    const defaultText = 'Создать';
    const loadingText = 'Создание...';

    renderLoading(submitButton, true, defaultText, loadingText);
    validateImageUrl(link)
        .then(() => addNewCard(name, link))
        .then((cardData) => {
            const card = createCard(
                {...cardData, myCard: true},
                handleDeleteCard,
                handleLikeClick,
                handleCardClick
            );

            cardsList.prepend(card);
            cardForm.reset();
            clearValidation(cardForm, validationConfig);
            closePopup(cardPopup);
        })
        .catch((err) => {
            console.log(`Ошибка при добавлении карточки: ${err}`);
        })
        .finally(() => {
            renderLoading(submitButton, false, defaultText, loadingText);
        });
}

function submitCardDeleteForm(evt) {
    evt.preventDefault();

    if (!cardToDeleteData?.card?._id) {
        console.log('Не указан ID карточки для удаления');
        return;
    }

    const defaultText = 'Да';
    const loadingText = 'Удаление...';

    renderLoading(cardDeleteSubmitButton, true, defaultText, loadingText);
    deleteCard(cardToDeleteData.card._id)
        .then(() => {
            if (cardToDeleteData.cardElement) {
                cardToDeleteData.cardElement.remove();
            }
            closePopup(cardDeletePopup);

            cardToDeleteData = null;
        })
        .catch((err) => {
            console.log(`Ошибка при удалении карточки: ${err}`);
        })
        .finally(() => {
            renderLoading(cardDeleteSubmitButton, false, defaultText, loadingText);
        });
}

addButton.addEventListener('click', () => {
    cardForm.reset();
    clearValidation(cardForm, validationConfig);
    openPopup(cardPopup);
});
profileAvatarLink.addEventListener('click', (e) => {
    e.preventDefault();
    profileAvatarForm.reset();
    clearValidation(profileAvatarForm, validationConfig);
    openPopup(profileAvatarPopup);
});
editButton.addEventListener('click', () => {
    fillProfileForm();
    clearValidation(profileForm, validationConfig);
    openPopup(profilePopup);
});
profileForm.addEventListener('submit', handleProfileFormSubmit);
cardForm.addEventListener('submit', submitCardForm);
cardDeleteForm.addEventListener('submit', submitCardDeleteForm);
profileAvatarForm.addEventListener('submit', handleProfileAvatarFormSubmit);


Promise.all([getUserInfo(), getInitialCards()])
    .then(([userData, cardsData]) => {
        const userId = userData._id;

        updateProfileInfo(userData);

        renderInitialCards(cardsData.map(card => ({
            ...card,
            myCard: card.owner._id === userId,
            liked: card.likes.some(like => like._id === userId)
        })));
    })
    .catch((err) => {
        console.log(`Ошибка при загрузке данных: ${err}`);
    });

enableValidation(validationConfig);
