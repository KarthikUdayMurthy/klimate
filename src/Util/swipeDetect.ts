import { TouchEvent } from 'react';

let xDown = null;
let yDown = null;

function getTouches(evt: TouchEvent) {
  return evt.touches;
}

export function addSwipeListeners(
  onSwipeLeft: () => void = () => {},
  onSwipeRight: () => void = () => {},
  excludeSelectors: string = ''
) {
  const rootDiv = document.getElementById('root');
  rootDiv.addEventListener(
    'touchstart',
    evt => {
      handleTouchStart(evt, excludeSelectors);
    },
    false
  );
  rootDiv.addEventListener(
    'touchmove',
    evt => {
      handleTouchMove(evt, onSwipeLeft, onSwipeRight, excludeSelectors);
    },
    false
  );
}

export function removeSwipeListeners() {
  const rootDiv = document.getElementById('root');
  rootDiv.removeEventListener('touchstart', handleTouchStart, false);
  rootDiv.removeEventListener('touchmove', handleTouchMove, false);
}

export function handleTouchStart(evt, excludeSelectors: string = '') {
  if (evt.target.closest(excludeSelectors)) {
    return;
  }
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

export function handleTouchMove(
  evt,
  onSwipeLeft: () => void = () => {},
  onSwipeRight: () => void = () => {},
  excludeSelectors: string = ''
) {
  if (!xDown || !yDown) {
    return;
  }

  if (evt.target.closest(excludeSelectors)) {
    return;
  }

  let xUp = evt.touches[0].clientX;
  let yUp = evt.touches[0].clientY;

  let xDiff = xDown - xUp;
  let yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff > 0) {
      /* right swipe */
      onSwipeRight();
    } else {
      /* left swipe */
      onSwipeLeft();
    }
  } else {
    if (yDiff > 0) {
      /* down swipe */
    } else {
      /* up swipe */
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
}
