/* eslint-env browser */
import { ActorsSet, RoleClass } from '../../../libs/actors_and_roles';
import { percentOverlap, updateStyle } from '../../../libs/helpers_lib';
import { pourOutArea } from '../role_sets/pourOutArea/pourOutArea';
import { hookPlace } from '../role_sets/hookPlace/hookPlace';
import { mugPlaces } from '../role_sets/mugPlaces/mugPlaces';
import { pouringMug } from '../role_sets/pouringMug/pouringMug';
import { glassPlaceSet } from '../role_sets/glassPlace/glassPlace';
import Mug from '../role_sets/mugs/MugClass';
import WhiskeyGlass from '../role_sets/mugs/WhiskeyGlassClass';
import { fillingGlass } from '../role_sets/fillingGlass/fillingGlass';
import { setA } from './setA';
import debugFlags from '../../../debug/debug_flags';
import {
  highlightPlaces,
  highlightAction,
} from '../../../debug/debugPanel/highlightZonesCheck_lib';

const signalSet = new ActorsSet();

signalSet.name = 'signalSet';

export const dropPlaces = new ActorsSet([
  hookPlace,
  mugPlaces,
  pourOutArea,
  glassPlaceSet,
  signalSet,
]);

dropPlaces.name = 'dropPlaces';

export const placeMugRole = new RoleClass(Symbol('placeMug'))
  .registerAction(dropPlaces, {
    action({ target: place, roleSet, event: { mug, gotToPlace } }) {
      const placeRect = place.node && place.node.getBoundingClientRect();
      const mugRect = mug.getBoundingRect();
      const {
        state: stateOfMug,
        state: { place: wherePlaced, pouring },
      } = mug;

      if (gotToPlace) {
        // Check if the mug was tested to be placed in all the possible places
        if (roleSet === signalSet) {
          if (!wherePlaced) {
            mug.dropDown();
          }
        } else if (percentOverlap(placeRect, mugRect) > 0.75) {
          switch (roleSet) {
            case mugPlaces:
              if (mug instanceof Mug) {
                if (!place.state.placedMug) {
                  mug.setPositionXY(place.whereToPlaceMug());
                  mug.placedToBeFilled(place);
                }
              }
              break;

            case hookPlace:
              mug.carriedToCustomer();
              break;

            case glassPlaceSet:
              if (mug instanceof WhiskeyGlass && fillingGlass.size === 0) {
                mug.setPositionXY(place.whereToPlaceMug());
                mug.placedToBeFilled();
              }
              break;

            default:
              break;
          }
        }
      } else if (
        roleSet === pourOutArea
        && !pouring
        && mug instanceof Mug
        && stateOfMug.total
        && percentOverlap(placeRect, mugRect) > 0.75
      ) {
        pouringMug.addElement(mug);
      }

      if (debugFlags.HIGHLIGHT_DROP_ZONES && roleSet !== signalSet) {
        if (percentOverlap(placeRect, mugRect) > 0.75) {
          updateStyle(place.node, { 'background-color': 'rgba(255, 0, 0, 0.2)' });
        } else {
          updateStyle(place.node, { 'background-color': 'rgba(255, 255, 255, 0.2)' });
        }
      }
    },
  })
  .start();

export const highlightPlacesRole = highlightPlaces
  .registerAction(dropPlaces, {
    action: highlightAction,
  })
  .start();

setA.addElement(dropPlaces);
