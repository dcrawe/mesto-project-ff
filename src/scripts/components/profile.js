import { usePopup } from "./popup";

export function useProfile(options = {}) {
    const config = {
        selectors: {
            editButton: '.profile__edit-button',
            popup: '.popup_type_edit',
            form: '.popup__form[name="edit-profile"]',
            nameInput: '.popup__input_type_name',
            jobInput: '.popup__input_type_description',
            profileName: '.profile__title',
            profileJob: '.profile__description',
        },
        popupModule: usePopup,
        domElements: {},
        ...options
    };

    const getElement = (key, selector) => config.domElements[key] || document.querySelector(selector);

    const editButton = getElement('editButton', config.selectors.editButton);
    const popup = getElement('popup', config.selectors.popup);
    const form = getElement('form', config.selectors.form);
    const nameInput = form?.querySelector(config.selectors.nameInput);
    const jobInput = form?.querySelector(config.selectors.jobInput);
    const profileName = getElement('profileName', config.selectors.profileName);
    const profileJob = getElement('profileJob', config.selectors.profileJob);

    const fillNameInput = (value) => nameInput && (nameInput.value = value);
    const fillJobInput = (value) => jobInput && (jobInput.value = value);
    const setNameInput = (value) => profileName && (profileName.textContent = value);
    const setJobInput = (value) => profileJob && (profileJob.textContent = value);

    const {
        closePopup,
        initListener,
    } = config.popupModule(popup);
    const { on } = initListener(editButton);

    const fillProfileForm = () => {
        if (profileName) fillNameInput(profileName.textContent);
        if (profileJob) fillJobInput(profileJob.textContent);
    }
    const resetProfileForm = () => {
        form?.reset();
    }
    const submitForm = async () => {
        try {
            setNameInput(nameInput?.value);
            setJobInput(jobInput?.value);
            closePopup();
        } catch (error) {
            throw new Error(`Ошибка при отправке формы: ${error.message}`);
        }
    }

    on('open', fillProfileForm);
    on('close', resetProfileForm);

    return {
        form,
        submitForm
    }
}