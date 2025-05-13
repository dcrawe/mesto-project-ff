import { usePopup } from "./popup";


export function useProfile() {
    const editButton = document.querySelector('.profile__edit-button');
    const profilePopup = document.querySelector('.popup_type_edit');
    const formElement = document.querySelector('.popup__form[name="edit-profile"]');
    const nameInput = formElement.querySelector('.popup__input_type_name');
    const jobInput = formElement.querySelector('.popup__input_type_description');
    const profileName = document.querySelector('.profile__title');
    const profileJob = document.querySelector('.profile__description');
    const fillNameInput = (value) => nameInput.value = value;
    const fillAvatarInput = (value) => jobInput.value = value;
    const setNameInput = (value) => profileName.textContent = value;
    const setAvatarInput = (value) => profileJob.textContent = value;
    const {
        closePopup,
        initListener,
    } = usePopup(profilePopup);
    const {setOpenCallback: setOpenCallbackEdit, setCloseCallback: setCloseCallbackEdit} = initListener(editButton);

    function fillProfileForm() {
        fillNameInput(profileName.textContent);
        fillAvatarInput(profileJob.textContent);
    }

    function resetProfileForm() {
        formElement.reset();
    }

    function submitForm() {
        closePopup();

        return new Promise((resolve) => {
            setNameInput(nameInput.value);
            setAvatarInput(jobInput.value);
            resolve();
        });
    }

    setOpenCallbackEdit(fillProfileForm);
    setCloseCallbackEdit(resetProfileForm);

    return {
        formElement,
        submitForm
    }
}
