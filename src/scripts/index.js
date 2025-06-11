import '../styles/pages/index.css';
import {enableValidation, clearValidation} from './utils/validation.js';
import {createCard} from './components/card.js';
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
const cardForm = document.querySelector('.popup__form[name="new-place"]');
const nameInput = cardForm.querySelector('.popup__input_type_card-name');
const urlInput = cardForm.querySelector('.popup__input_type_url');
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
const profileContainer = document.querySelector('.profile__info');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__avatar');
const profileAvatarContainer = document.querySelector('.profile__image');
const profileAvatarLink = document.querySelector('.profile__image');
const profileAvatarPopup = document.querySelector('.popup_type_avatar');
const profileAvatarForm = document.querySelector('.popup__form[name="profile-avatar"]');
const profileAvatarInput = profileAvatarForm.querySelector('.popup__input_type_avatar');

// Объект с настройками для валидации форм
const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
};

setPopupEventListeners(cardPopup);
setPopupEventListeners(imagePopup);
setPopupEventListeners(cardDeletePopup);
setPopupEventListeners(profilePopup);
setPopupEventListeners(profileAvatarPopup);

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
    return new Promise((resolve, reject) => {
        fetch(url, { method: 'HEAD' })
            .then(response => {
                if (!response.ok) {
                    reject(new Error(`URL недоступен: ${response.status} ${response.statusText}`));
                    return;
                }

                const contentType = response.headers.get('Content-Type');

                if (!contentType || !contentType.startsWith('image/')) {
                    reject(new Error(`Указанный URL не является изображением: ${contentType}`));
                    return;
                }

                resolve(url);
            })
            .catch(error => {
                reject(new Error(`Ошибка проверки URL: ${error.message}`));
            });
    });
}

function handleProfileFormSubmit(evt) {
    evt.preventDefault();

    const nameInput = document.querySelector('.popup__input_type_name');
    const descriptionInput = document.querySelector('.popup__input_type_description');
    const submitButton = evt.target.querySelector('.popup__button');

    submitButton.textContent = 'Сохранение...';

    updateUserProfile(nameInput.value, descriptionInput.value)
        .then(updateProfileInfo)
        .catch((err) => {
            console.log(`Ошибка при обновлении профиля: ${err}`);
        })
        .finally(() => {
            submitButton.textContent = 'Сохранить';
        });
}

function handleProfileAvatarFormSubmit(evt) {
    evt.preventDefault();

    const avatarUrl = profileAvatarInput.value;
    const submitButton = evt.target.querySelector('.popup__button');

    submitButton.textContent = 'Сохранение...';
    submitButton.disabled = true;

    validateImageUrl(avatarUrl)
        .then(() => updateAvatar(avatarUrl))
        .then(updateProfileAvatar)
        .catch((err) => {
            console.log(`Ошибка при обновлении аватара: ${err}`);
        })
        .finally(() => {
            submitButton.textContent = 'Сохранить';
            submitButton.disabled = false;
        });
}

function handleDeleteCard(cardElement, card) {
    cardDeleteForm.dataset.cardId = card._id;

    openPopup(cardDeletePopup);
}

function handleLikeClick(cardElement, card) {
    const likeButton = cardElement.querySelector('.card__like-button');
    const likeCount = cardElement.querySelector('.card__like-count');

    if (likeButton.classList.contains('card__like-button_is-active')) {
        removeLike(card._id)
            .then((updatedCard) => {
                likeCount.textContent = updatedCard.likes.length;
                likeButton.classList.remove('card__like-button_is-active');

                if (!updatedCard.likes.length) {
                    likeCount.classList.add('hidden');
                }
            })
            .catch((err) => {
                console.log(`Ошибка при удалении лайка: ${err}`);
            })
    } else {
        addLike(card._id)
            .then((updatedCard) => {
                likeCount.textContent = updatedCard.likes.length;
                likeButton.classList.add('card__like-button_is-active');

                if (updatedCard.likes.length) {
                    likeCount.classList.remove('hidden');
                }
            })
            .catch((err) => {
                console.log(`Ошибка при добавлении лайка: ${err}`);
            })
    }
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
        const submitButton = evt.target.querySelector('.popup__button');
        const name = nameInput.value;
        const link = urlInput.value;

        submitButton.textContent = 'Создание...';
        submitButton.disabled = true;

        validateImageUrl(link)
            .then(() =>  addNewCard(name, link))
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
                submitButton.textContent = 'Создать';
                submitButton.disabled = false;
            });

    } catch (error) {
        console.error(error);
    }
}

function submitCardDeleteForm(evt) {
    evt.preventDefault();

    if (!cardDeleteForm.dataset.cardId) {
        console.log('Не указан ID карточки для удаления');
        return;
    }

    const cardId = cardDeleteForm.dataset.cardId;
    const submitButton = evt.target.querySelector('.popup__button');

    submitButton.textContent = 'Удаление...';
    submitButton.disabled = true;

    deleteCard(cardId)
        .then(() => {
            const cardToDelete = document.querySelector(`.card[data-card-id="${cardId}"]`);
            if (cardToDelete) {
                cardToDelete.remove();
            }
            closePopup(cardDeletePopup);

            delete cardDeleteForm.dataset.cardId;
        })
        .catch((err) => {
            console.log(`Ошибка при удалении карточки: ${err}`);
        })
        .finally(() => {
            submitButton.textContent = 'Да';
            submitButton.disabled = false;
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
