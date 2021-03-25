function getErrorContainer(inputNode) {
  const previousSibling = inputNode.previousElementSibling;

  return previousSibling.classList.contains('form__error') === true
    ? previousSibling
    : null;
}

function createErrorNode(errorMessage) {
  const errorNode = document.createElement('span');
  const textNode = document.createTextNode(errorMessage);
  errorNode.classList.add('form__error');

  errorNode.appendChild(textNode);
  return errorNode;
}

function appendError(inputNode, errorMessage) {
  const errorNodeExists = getErrorContainer(inputNode);

  if (errorNodeExists !== null) {
    errorNodeExists.innerHTML = errorMessage;
    return;
  }

  const errorNode = createErrorNode(errorMessage);
  inputNode.parentNode.insertBefore(errorNode, inputNode);
}

function removeError(inputNode) {
  const errorNodeExists = getErrorContainer(inputNode);

  if (errorNodeExists !== null) {
    errorNodeExists.remove();
  }
}

function loginHandler(event) {
  event.preventDefault();

  let errors = false;

  const validateNodes = document.querySelectorAll('[js-hook-validate]');

  validateNodes.forEach((node) => {
    switch (node.name) {
      case 'email': {
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const valid = regex.test(node.value);

        if (valid === false) {
          appendError(node, 'Provided email is not a valid email adress');
          errors = true;
        } else {
          removeError(node);
        }

        break;
      }
      case 'password': {
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        const valid = regex.test(node.value);

        if (valid === false) {
          appendError(node, 'Password does not match our patern criteria');
          errors = true;
        } else {
          removeError(node);
        }

        break;
      }
      case 'repeatPassword': {
        const password = [...validateNodes].find(
          (node) => node.name === 'password',
        );

        if (node.value !== password.value) {
          appendError(node, 'Passwords are not the same');
          errors = true;
        } else {
          removeError(node);
        }

        break;
      }
      default: {
        break;
      }
    }
  });

  errors === false && event.target.submit();
}

function initFormValidation() {
  document
    .querySelector('[js-hook-module-form-validation]')
    .addEventListener('submit', loginHandler);
}

export default initFormValidation;
