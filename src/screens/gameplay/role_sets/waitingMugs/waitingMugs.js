/* eslint-env browser */
import { ActorsSet } from '../../../../libs/actors_and_roles';
import { onPulseTick } from '../../../../stage/role_classes';
import stage from '../../../../stage/stage';
import { customersReactions } from '../customersReactions/customersReactions';
import { waitingMugParams } from './waitingMugs_params';
import { removeAfterAnimationEnds } from '../../../../libs/helpers_lib';
import { hookPlace } from '../hookPlace/hookPlace';
import './styles.css';
import { startStopRoles } from '../../../../roles_manipulators';
import { setA } from '../../supersets/setA';
import { folk } from '../folk/folk';

export const waitingMugs = new ActorsSet();

waitingMugs.name = 'waitingMugs';

removeAfterAnimationEnds(waitingMugs);

waitingMugs.onAddActorEvent(({ target: mug }) => {
  mug.setPositionXY([...hookPlace][0].whereToPlaceMug(mug));
  mug.state.waitingSince = performance.now();
  mug.setZIndex(75);
});

export const waitMugDisappearRole = onPulseTick.registerAction(waitingMugs, {
  action({ target: mug, event }) {
    if (this.roleSet.size > 0) {
      if (event && event.beenOnPause) {
        mug.state.waitingSince += event.beenOnPause;
      }
      const currTime = performance.now();
      const { waitingSince } = mug.state;
      if (currTime - waitingSince >= waitingMugParams.timeWhenMoneyFly) {
        mug.state.waitingSince = Infinity;
        mug.attachClassName('waitingMug');
        const { money, reaction } = mug.turnIntoMoney();
        stage.state.money += money;
        customersReactions.createNew(reaction);
        folk.checkProgress();
      }
    }
  },
});

startStopRoles.addElement(waitMugDisappearRole);
setA.addElement(waitingMugs);
