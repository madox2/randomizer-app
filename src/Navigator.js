const listeners = new Set();
const history = [];

const navigateTo = Screen => [...listeners.values()].forEach(l => l(Screen))

export function addListener(l) {
  listeners.add(l)
}

export function removeListener(l) {
  listeners.delete(l)
}

export function navigate(Screen) {
  history.push(Screen)
  navigateTo(Screen)
}

export function back() {
  history.pop();
  navigateTo(history[history.length -1])
}

export default { navigate, back, addListener, removeListener }
