function showInputError(formElement, inputElement, errorMessage) {
    const errorElement = formElement.querySelector(`.popup__error_${inputElement.name}`);

    inputElement.classList.add('popup__input_type_error');

    if (inputElement.validity.patternMismatch) {
        errorElement.textContent = 'Разрешены только латинские и кириллические буквы, знаки дефиса и пробелы';
    } else {
        errorElement.textContent = errorMessage;
    }

    errorElement.classList.add('popup__error_visible');
}

function hideInputError(formElement, inputElement) {
    const errorElement = formElement.querySelector(`.popup__error_${inputElement.name}`);

    inputElement.classList.remove('popup__input_type_error');

    if (errorElement) {
        errorElement.classList.remove('popup__error_visible');
        errorElement.textContent = '';
    }
}

function checkInputValidity(formElement, inputElement) {
    if (!inputElement.validity.valid) {
        showInputError(formElement, inputElement, inputElement.validationMessage);
    } else {
        hideInputError(formElement, inputElement);
    }
}

function hasInvalidInput(inputList) {
    return inputList.some((inputElement) => !inputElement.validity.valid);
}

function toggleButtonState(inputList, buttonElement) {
    if (hasInvalidInput(inputList)) {
        buttonElement.classList.add('popup__button_disabled');
        buttonElement.disabled = true;
    } else {
        buttonElement.classList.remove('popup__button_disabled');
        buttonElement.disabled = false;
    }
}

function setEventListeners(formElement) {
    const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
    const buttonElement = formElement.querySelector('.popup__button');

    toggleButtonState(inputList, buttonElement);

    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', function () {
            checkInputValidity(formElement, inputElement);
            toggleButtonState(inputList, buttonElement);
        });
    });
}

function resetFormValidation(formName) {
    const formElement = document.forms[formName];
    const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
    const buttonElement = formElement.querySelector('.popup__button');

    inputList.forEach((inputElement) => {
        hideInputError(formElement, inputElement);
    });

    toggleButtonState(inputList, buttonElement);
}

function enableValidation(formElement) {
    formElement.addEventListener('submit', function (evt) {
        evt.preventDefault();
    });
    setEventListeners(formElement);
}

export {enableValidation, resetFormValidation};