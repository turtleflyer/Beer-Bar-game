/* eslint-env browser */
import { ActorsSet } from '../../../libs/actors_and_roles';
import { onPulseTick } from '../../../assets/role_classes';
import { mugsParams } from '../assets/gameplay_params';

export const fillingMugs = new ActorsSet();

fillingMugs.name = 'fillingMugs';

export const fillMugsRole = onPulseTick.registerAction(fillingMugs, {
  action({ target: mug }) {
    if (this.roleSet.size > 0) {
      const {
        params: paramsOfMug,
        params: { volume: volumeOfMug },
        state: stateOfMug,
        state: {
          timeStarted,
          lastTime,
          total: totalBeer,
          beers: fillingBeers,
          faucet: {
            state: stateOfFaucet,
            state: { beer: activeBeer },
          },
        },
      } = mug;
      if (stateOfFaucet.isOpened) {
        const currTime = performance.now();
        if (stateOfMug.overfilled) {
          if (timeStarted) {
            if (currTime - timeStarted > mugsParams.overfillPhaseDuration) {
              stateOfMug.timeStarted = currTime;
              // eslint-disable-next-line
              stateOfMug.overfilledPhase =
                (stateOfMug.overfilledPhase + 1) % paramsOfMug.numberOfOverfilledPhases;
              mug.updateFillRepresentation();
            }
          }
        } else if (lastTime) {
          let beerQuantity = (currTime - lastTime) / (volumeOfMug * 1000);
          if (totalBeer + beerQuantity > 1) {
            beerQuantity = 1 - totalBeer;
            stateOfMug.total = 1;
            stateOfMug.timeStarted = currTime;
            mug.state.overfilled = true;
            mug.state.overfilledPhase = 0;
          } else {
            stateOfMug.total += beerQuantity;
            stateOfMug.lastTime = currTime;
          }
          fillingBeers[activeBeer] = (fillingBeers[activeBeer] || 0) + beerQuantity;
          mug.updateFillRepresentation();
        } else {
          stateOfMug.lastTime = currTime;
          stateOfMug.timeStarted = currTime;
        }
      } else {
        stateOfMug.lastTime = null;
        stateOfMug.timeStarted = null;
      }
    }
  },
});
