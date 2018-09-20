/* eslint-env browser */
import {
  commonParams,
  getUnit,
  appendPx,
  GameActor,
  parseDescription,
  startModules,
  updateStyle,
} from '../../gamelibrary';
import mugIPA from '../../img/mug1.png';
import { BEER_IPA } from '../../types';
import { fireEvent } from '../../eventswork';

export default parseDescription({
  MugsOnLine: {
    render(type, { left, top }, scaleF) {
      const element = new GameActor(document.createElement('div'), { left, top }, scaleF);
      switch (type) {
        case BEER_IPA: {
          element.setPosition({ width: 50 });
          const img = document.createElement('img');
          img.src = mugIPA;
          updateStyle(img, { width: '100%' });
          element.node.appendChild(img);
          element.img = img;
          commonParams.origin.appendChild(element.node);
          return element;
        }

        default:
          return null;
      }
    },

    startPoint: { top: 220 },

    gap: 5,

    getType() {
      return BEER_IPA;
    },

    mechanism: {
      onTick: {
        type: 'onTick',
        customType: true,
        action({ target, memory }) {
          const curTime = Date.now();
          if (!target) {
            const newB = this.render(
              this.getType(),
              {
                left: commonParams.sceneWidth,
                top: this.startPoint.top,
              },
              commonParams.scaleFactor,
            );
            memory.newborn = memory.foremost = newB;
            newB.lastMove = curTime;
            this.unit.addElement(newB);
          } else {
            const curL = target.left;
            if (target === memory.foremost) {
              memory.speed = commonParams.mugSpeed;
            }
            if (curL <= -target.width) {
              target.node.remove();
              memory.foremost = target.next;
              this.unit.delete(target);
            } else {
              const newL = curL + ((curTime - target.lastMove) * memory.speed) / 1000;
              target.setPosition({ left: newL });
              target.lastMove = curTime;
              if (target === memory.newborn) {
                const possibleP = newL + target.width + this.gap;
                if (possibleP < commonParams.sceneWidth) {
                  const newB = this.render(
                    this.getType(),
                    {
                      left: possibleP,
                      top: this.startPoint.top,
                    },
                    commonParams.scaleFactor,
                  );
                  target.next = memory.newborn = newB;
                  newB.lastMove = curTime;
                  this.unit.addElement(newB);
                }
              }
            }
          }
        },
      },

      startDnD: {
        type: 'mousedown',
        action({ target, event }) {
          event.preventDefault();
          getUnit('DragMug').addElement(target);
        },
      },
    },
  },
});
