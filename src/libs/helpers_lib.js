import stage from '../stage/stage';
import { Actor } from './actors_and_roles';

/* eslint-env browser */
export function importAll(r) {
  const a = [];
  r.keys().forEach((p) => {
    a.push(r(p));
  });
  return a;
}

export function updateStyle(node, style) {
  Object.assign(node.style, style);
}

export function setImg(element, newImg, style) {
  if (!element.img) {
    const img = document.createElement('img');
    img.src = newImg;
    updateStyle(img, style);
    element.node.appendChild(img);
    element.img = img;
  } else {
    element.img.src = newImg;
    updateStyle(element.img, style);
  }
  return element;
}

export function percentOverlap(targetBound, dragBound) {
  function linearOverlap(s1, e1, s2, e2) {
    const c = Math.min(e1 - s2, e2 - s1);
    return c < 0 ? 0 : c;
  }

  const {
    left: tLeft, top: tTop, right: tRight, bottom: tBottom,
  } = targetBound;
  const {
    left: dLeft, top: dTop, right: dRight, bottom: dBottom, width, height,
  } = dragBound;
  const dragArea = width * height;
  // prettier-ignore
  const overlapArea = linearOverlap(tLeft, tRight, dLeft, dRight)
    * linearOverlap(tTop, tBottom, dTop, dBottom);
  return overlapArea / dragArea;
}

export function removeElementWhenAnimationEnds({ roleSet, target }) {
  roleSet.deleteElement(target);
  target.remove();
}

export function addWhereToPlaceMugMethod(obj, params) {
  obj.whereToPlaceMug = function () {
    {
      const { x: originX, y: originY } = stage.origin;
      const { scaleF } = this.position;
      const {
        left, top, width, height,
      } = this.node.getBoundingClientRect();
      return {
        x: (left - originX + width / 2) / scaleF,
        y: (top - originY + height * params.mugLine) / scaleF,
      };
    }
  };
}

export function addSetPositionXYMethod(obj) {
  Object.defineProperties(obj, {
    getBoundingRect: {
      value() {
        return this.node.querySelector('img').getBoundingClientRect();
      },
    },
    rectHeight: {
      get() {
        return this.getBoundingRect().height / this.position.scaleF;
      },
    },
    setPositionXY: {
      value(position) {
        const { x, y, width } = position;
        Object.assign(this.position, { x: x || this.position.x, y: y || this.position.y });
        Actor.prototype.setPosition.call(this, {
          left: this.position.x - (width || this.position.width) / 2,
          top: this.position.y,
          width,
        });
      },
    },
  });
}
