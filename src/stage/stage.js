/* eslint-env browser */
import { ActorsSet, Actor } from '../libs/actors_and_roles';
import './styles.css';
import { defaultFontSize, stageDimension } from './gameplay_params';
import { levelsDescription, commonInitState } from './levels_description';

export function defineScaleF() {
  const innerSize = document.querySelector('body').getBoundingClientRect();
  let scaleF = 1;
  if (innerSize.width < stageDimension.width) {
    scaleF = innerSize.width / stageDimension.width;
  }
  const viewPortHeight = window.innerHeight - innerSize.top;
  if (viewPortHeight < stageDimension.height) {
    const altScaleF = viewPortHeight / stageDimension.height;
    if (altScaleF < scaleF) {
      scaleF = altScaleF;
    }
  }
  return scaleF;
}

class Stage extends ActorsSet {
  constructor() {
    const stageNode = document.querySelector('#scene');
    const scaleF = defineScaleF();
    super([new Actor(stageNode, stageDimension, { scaleF, zIndex: 10 })]);
    stageNode.style['font-size'] = `${defaultFontSize * scaleF}px`;
    this.stageNode = stageNode;
    const { left, top } = this.getBoundingRect();
    this.origin = { x: left, y: top };
    Object.assign(this, stageDimension);
    this.params = {};
    this.defineLevel(0);
  }

  get scaleF() {
    return [...this][0].position.scaleF;
  }

  getBoundingRect() {
    return this.stageNode.getBoundingClientRect();
  }

  defineLevel(level) {
    const levelEntry = levelsDescription[level];
    const {
      params: { mugsDistribution },
    } = levelEntry;
    const totalDistributionCap = Object.values(mugsDistribution).reduce(
      (total, next) => total + next,
    );
    const calculatedDistribution = {};
    let currentCup = 0;
    Object.keys(mugsDistribution).forEach((key) => {
      currentCup += mugsDistribution[key] / totalDistributionCap;
      calculatedDistribution[key] = currentCup;
    });

    this.state = { ...commonInitState, ...levelEntry.initState, paused: false };
    this.params.levelParams = { ...levelEntry.params, mugsDistribution: calculatedDistribution };
  }

  pause() {
    this.state.paused = true;
  }

  resume() {
    this.state.paused = false;
  }
}

const stage = new Stage();

stage.name = 'stage';

export default stage;