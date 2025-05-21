import '../styles/pages/index.css'; // добавьте импорт главного файла стилей
import { useCard } from './components/card.js';
import { useProfile } from './components/profile.js';
import { initialCards } from './data/cards.js';

const { form: profileForm, submitForm: submitProfileForm } = useProfile();
const { form: cardForm, submitForm: submitCardForm, renderInitialCards } = useCard();

profileForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    try {
        submitProfileForm();
    } catch (error) {
        console.error(error);
    }
});
cardForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    try {
        submitCardForm();
    } catch (error) {
        console.error(error);
    }
});

renderInitialCards(initialCards);