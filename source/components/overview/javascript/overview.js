import EmblaCarousel from 'embla-carousel';

function parseFormData(inputs) {
  const formData = {};

  [...inputs].forEach((input) => {
    formData[`${input.name}`] = input.value;
  });

  return formData;
}

async function postRequestHandler(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data),
  });

  return response;
}

function bindEvents(nodes, carousel) {
  [...nodes].forEach((node) => {
    node.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = parseFormData(node.querySelectorAll('input'));
      const response = await postRequestHandler(
        `${window.location.origin}/overview`,
        formData,
      );

      if (response.status === 200) {
        carousel.scrollNext();
      }
    });
  });
}

export default function initslider() {
  const overviewContainer = document.querySelector('[js-hook-module-overview]');
  const options = { loop: false, draggable: false };
  const matchingForms = document.querySelectorAll('[js-hook-matching-form]');

  const carousel = EmblaCarousel(overviewContainer, options);

  bindEvents(matchingForms, carousel);
}
