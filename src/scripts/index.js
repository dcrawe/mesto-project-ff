import '../styles/pages/index.css'; // добавьте импорт главного файла стилей
import { useCard } from './cards.js';
import { useProfile } from './profile.js';

const { form: profileForm, submitForm } = useProfile();
const { form: cardForm, submitForm: submitCardForm, renderInitialCards } = useCard();

profileForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    submitForm();
});
cardForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    submitCardForm();
});

renderInitialCards();