import { usePopup } from "./popup";


export function useProfile() {
    const editButton = document.querySelector('.profile__edit-button');
    const popup = document.querySelector('.popup_type_edit');
    const form = document.querySelector('.popup__form[name="edit-profile"]');
    const nameInput = form.querySelector('.popup__input_type_name');
    const jobInput = form.querySelector('.popup__input_type_description');
    const profileName = document.querySelector('.profile__title');
    const profileJob = document.querySelector('.profile__description');
    const fillNameInput = (value) => nameInput.value = value;
    const fillAvatarInput = (value) => jobInput.value = value;
    const setNameInput = (value) => profileName.textContent = value;
    const setAvatarInput = (value) => profileJob.textContent = value;
    const {
        closePopup,
        initListener,
    } = usePopup(popup);
    const {on} = initListener(editButton);

    function fillProfileForm() {
        fillNameInput(profileName.textContent);
        fillAvatarInput(profileJob.textContent);
    }

    function resetProfileForm() {
        form.reset();
    }

    function submitForm() {
        return new Promise((resolve) => {
            setNameInput(nameInput.value);
            setAvatarInput(jobInput.value);
            closePopup();
            resolve();
        });
    }

    on('open', fillProfileForm);
    on('close', resetProfileForm);

    return {
        form,
        submitForm
    }
}
