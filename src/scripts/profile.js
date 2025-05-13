import { usePopup } from "./popup";


export function useProfile() {
    const editButton = document.querySelector('.profile__edit-button');
    const addButton = document.querySelector('.profile__add-button');
    const profilePopup = document.querySelector('.popup_type_new-card');

    const formElement = document.querySelector('.popup__form[name="new-place"]');
    const nameInput = formElement.querySelector('.popup__input_type_card-name');
    const avatarInput = formElement.querySelector('.popup__input_type_url');
    const profileName = document.querySelector('.profile__title');
    const profileAvatar = document.querySelector('.profile__avatar');

    function fillProfileForm() {
        nameInput.value = profileName.textContent;
        avatarInput.value = profileAvatar.src;
    }

    const {
        initListener,
    } = usePopup(profilePopup);
    const { setOpenCallback: setOpenCallbackAdd, setCloseCallback: setCloseCallbackAdd } = initListener(addButton);
    const { setOpenCallback: setOpenCallbackEdit, setCloseCallback: setCloseCallbackEdit } = initListener(editButton);
    setOpenCallbackEdit(fillProfileForm);

    return {

    }
}
