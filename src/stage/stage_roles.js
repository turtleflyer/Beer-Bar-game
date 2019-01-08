/* eslint-env browser */
import stage, { defineScaleF } from './stage';
import { dragMug } from '../screens/gameplay/role_sets/dragMug/dragMug';
import { setA, resizeEverythingRole } from '../screens/gameplay/supersets/setA';
import { registerActionOfType } from '../libs/actors_and_roles';
import { onPulseTick, onResize } from './role_classes';
import { setD } from '../debug/setD';
import { debugPulse } from '../debug/fps';
import Worker from '../webworkers/pulse.worker';
import { defaultFontSize, stageDimension } from './gameplay_params';
import {
  followMouseRoleDraggable,
  stopDragRoleDraggable,
} from '../screens/gameplay/supersets/draggable';
import { startStopRoles } from '../roles_manipulators';

const pulseWorker = new Worker();

pulseWorker.onmessage = (e) => {
  if (!(stage.state && stage.state.paused)) {
    onPulseTick.fireAndWaitWhenExhausted(setA).then(() => {
      /**
       * Display debugging information
       */
      onPulseTick.fire(setD);
      if (e.data) {
        debugPulse.info = e.data;
      }
      /**
       *
       */
    });
  }
};

registerActionOfType('contextmenu', stage, {
  action({ event }) {
    event.preventDefault();
  },
}).start();

// Prevents default behaviors in Firefox browser
registerActionOfType('dragstart', stage, {
  action({ event }) {
    event.preventDefault();
  },
}).start();

export const dragRole = registerActionOfType('mousemove', stage, {
  action({ event }) {
    event.preventDefault();
    const { clientX, clientY } = event;

    const {
      scaleF,
      origin: { x: originX, y: originY },
    } = stage;
    followMouseRoleDraggable.fire({
      x: (clientX - originX) / scaleF,
      y: (clientY - originY) / scaleF,
    });
  },
});

export const dropMugRole = registerActionOfType('mouseleave', stage, {
  action({ event: { clientX, clientY } }) {
    const {
      scaleF,
      origin: { x: originX, y: originY },
    } = stage;
    const { width: stageWidth, height: stageHeight } = stageDimension;
    if (
      dragMug.size === 1
      && (clientX < originX
        || clientY < originY
        || (clientX - originX) / scaleF >= stageWidth
        || (clientY - originY) / scaleF >= stageHeight)
    ) {
      [...dragMug][0].dropDown();
    }
  },
});

export const stopCarryingRole = registerActionOfType('mouseup', stage, {
  action() {
    stopDragRoleDraggable.fire();
  },
});

const resizeStageRole = onResize
  .registerAction(stage, {
    action({ target, event: { scaleF } }) {
      target.refreshScaleF(scaleF);
      stage.stageNode.style['font-size'] = `${defaultFontSize * scaleF}px`;
    },
  })
  .start();

window.addEventListener('resize', () => {
  const scaleF = defineScaleF();
  if (scaleF !== stage.scaleF) {
    resizeEverythingRole.fire({ scaleF });
    resizeStageRole.fire({ scaleF });
  }
});

startStopRoles.addElements([dragRole, stopCarryingRole, dropMugRole]);
