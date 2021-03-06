/* eslint-env browser */
import './styles.css';
import { formTypes } from './formSet';

export default function formToAcceptValue(name, valueKeeper, key) {
  const form = document.createElement('form');
  form.className = 'level-form';
  form.innerHTML = `
    <label>${name}&nbsp&nbsp</label>
    <input type="number" name="${name}" ${
  valueKeeper[key] ? `value="${valueKeeper[key]}"` : ''
} class="level-form__input">
  `;

  return {
    form,
    set value(v) {
      valueKeeper[key] = Number(v);
    },
    type: formTypes.FORM_TO_ACCEPT_VALUE,
  };
}
