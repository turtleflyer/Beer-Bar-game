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
import { folkIllustration } from '../folk/folk';

export const waitingMugs = new ActorsSet();

waitingMugs.name = 'waitingMugs';

removeAfterAnimationEnds(waitingMugs);

waitingMugs.onAddActorEvent(({ target: mug }) => {
  mug.setPositionXY([...hookPlace][0].whereToPlaceMug());
  mug.state.waitingSince = Date.now();
  mug.setZIndex(75);
  mug.attachClassName('waitingMug');
});

export const waitMugDisappearRole = onPulseTick.registerAction(waitingMugs, {
  action({ target: mug }) {
    if (this.roleSet.size > 0) {
      const currTime = Date.now();
      const { waitingSince } = mug.state;
      if (currTime - waitingSince >= waitingMugParams.timeWhenMoneyFly) {
        mug.state.waitingSince = Infinity;
        const { money, reaction } = mug.turnIntoMoney();
        stage.state.money += money;
        customersReactions.createNew(reaction);
        folkIllustration.checkProgress();
      }
    }
  },
});

startStopRoles.addElement(waitMugDisappearRole);
setA.addElement(waitingMugs);
