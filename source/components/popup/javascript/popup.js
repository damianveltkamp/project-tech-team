export default function closePopup() {
  const closeButton = document.querySelector('[js-hook-popup-close]');
  const popupContainer = document.querySelector('[js-hook-module-popup]');

  closeButton.addEventListener('click', () => {
    popupContainer.classList.add('hide');

    fetch(`${window.location.origin}/popup`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
}
