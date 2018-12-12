import { ActorsSet } from '../../../../libs/actors_and_roles';
import { onPulseTick } from '../../../../stage/role_classes';
import ScoreBoard from './ScoreBoardClass';

// eslint-disable-next-line
export const scoreBoard = new ActorsSet();
scoreBoard.getInitializer(function () {
  const scoreB = new ScoreBoard();
  this.addElement(scoreB);
  scoreB.refreshInformation();
});

scoreBoard.name = 'scoreBoard';

// let lastTime;

export const updateMoneyRole = onPulseTick.registerAction(scoreBoard, {
  action({ target: scoreB }) {
    scoreB.refreshInformation();
    // const currTime = Date.now();
    // if (lastTime) {
    //   stage.state.money -= ((currTime - lastTime) / 1000)
    //     * stage.params.levelParams.loanExpenses;
    //   scoreB.refreshInformation();
    // }
    // lastTime = currTime;
  },
});