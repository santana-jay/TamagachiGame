export const modFox = function modFox(state) {
  document.querySelector('.fox').className = `fox fox-${state}`;
}

export const modScene = function modScene(state) {
  document.querySelector('.game').className = `game ${state}`;
}

export function togglePoopBag(show) {
  document.querySelector('.poop-bag').classList.toggle('hidden', !show);
}

export function writeModal(text = '') {
  document.querySelector('.modal').innerHTML = `<div class="modal-inner">${text}</div>`
};

// functions above both work the same way
