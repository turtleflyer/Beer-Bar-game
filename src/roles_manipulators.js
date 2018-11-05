import { RolesManipulator } from './libs/actors_and_roles';
import { sendPulse, fallDownMug, drag } from './role_sets/stage/stage_roles';
import { draggingMug, stopDrag } from './screens/gameplay/role_sets/dragMug';
import { dropMug } from './screens/gameplay/supersets/dropPlaces';
import generateMugs from './screens/gameplay/role_sets/mugsOnLine/roles/generateMugs';
import { startDrag } from './screens/gameplay/supersets/mugs';

export const startGame = new RolesManipulator([sendPulse, draggingMug, stopDrag, dropMug]);
export const startStopLevel = new RolesManipulator([startDrag, drag, fallDownMug, generateMugs]);
