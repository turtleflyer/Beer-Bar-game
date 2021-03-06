/* eslint-env browser */
import debugFlags from '../debug_flags';
import { highlightPlacesRole } from '../../screens/gameplay/supersets/dropPlaces';
import { highlightHandlesRole } from '../../screens/gameplay/role_sets/faucetHandles/faucetHandles';

const highlightZonesCheck = document.createElement('form');

highlightZonesCheck.innerHTML = `
    <input type="checkbox" name="highlight-drop-zones">
      Highlight drop zones
`;

highlightZonesCheck.querySelector('input').onchange = function (e) {
  debugFlags.HIGHLIGHT_DROP_ZONES = e.target.checked;
  highlightPlacesRole.fire();
  highlightHandlesRole.fire();
};

export default highlightZonesCheck;
