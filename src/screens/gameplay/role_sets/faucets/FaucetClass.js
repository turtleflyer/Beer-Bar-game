/* eslint-env browser */
import { Actor } from '../../../../libs/actors_and_roles';
import { setImg } from '../../../../libs/helpers_lib';
import jetImg from './img/jet.gif';
import stage from '../../../../stage/stage';
import { faucetParams, switchTypes, brokenSwitchTimeToTry } from './faucets_params';
import { imagesDataURL, getDataURL } from '../../../../libs/session_storage_lib';

imagesDataURL.addElement(jetImg);

function switchNormalFaucet() {
  const {
    state,
    params: { jet },
  } = this;
  state.phase = 1 - state.phase;
  this.switchState();
  state.isOpened = !state.isOpened;
  if (state.isOpened) {
    jet.getAppendedAsChild(this);
  } else {
    jet.remove();
  }
}

function switchBrokenFaucet() {
  const {
    state,
    params: { jet },
  } = this;
  if (state.phase === 0) {
    state.phase = 1;
    this.switchState();
    state.isOpened = true;
    jet.getAppendedAsChild(this);
  } else {
    state.phase = 0;
    this.switchState();
    window.setTimeout(() => {
      state.phase = 1;
      this.switchState();
    }, brokenSwitchTimeToTry);
  }
}

export default class Faucet extends Actor {
  constructor(model, horizontalPosition) {
    const {
      size,
      imgPhases,
      beerTypes,
      switchType,
      mugPlacePosition,
      handlePlacePosition,
      jetPlacePosition,
    } = model;
    super('div', Object.assign({ left: horizontalPosition }, size, faucetParams.position), {
      scaleF: stage.scaleF,
      zIndex: 68,
    });
    setImg(this, getDataURL(imgPhases[0]), { bottom: '0px', width: '100%' });
    this.params = {
      imgPhases,
      beerTypes,
      switchType,
      mugPlacePosition,
      handlePlacePosition,
    };
    this.state = { beer: beerTypes[0], phase: 0, isOpened: false };
    if (switchType === switchTypes.NORMAL || switchType === switchTypes.BROKEN) {
      const jet = new Actor('div', jetPlacePosition, { scaleF: stage.scaleF });
      setImg(jet, getDataURL(jetImg), { height: '100%' });
      this.linkActor(jet);
      Object.assign(this.params, { jet });
      if (switchType === switchTypes.NORMAL) {
        this.switch = switchNormalFaucet;
      } else {
        this.switch = switchBrokenFaucet;
      }
    }
    this.getAppendedAsChild(stage);
  }

  switchState() {
    setImg(this, getDataURL(this.params.imgPhases[this.state.phase]));
  }

  /**
   *
   * Life Cycles
   */

  placeMug(mug) {
    this.state.placedMug = mug;
  }

  releaseMug() {
    this.state.placedMug = null;
  }
}
