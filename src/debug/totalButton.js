/* eslint-env browser */
import { ActorsSet, Actor, registerActionOfType } from '../libs/actors_and_roles';
import { totalsOnTable } from '../screens/gameplay/role_sets/totalsOnTable';

const button = new Actor(document.createElement('button'), { width: 100, height: 50 });
document.querySelector('body').appendChild(button.node);
button.node.style.margin = '10px';
button.node.innerText = 'get total';

const totalButton = new ActorsSet([button]);

let isPositive = true;

registerActionOfType('click', totalButton, {
  action() {
    totalsOnTable.createNew(isPositive, 500);
    isPositive = !isPositive;
  },
}).start();