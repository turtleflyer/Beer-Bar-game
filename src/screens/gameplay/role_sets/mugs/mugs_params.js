/* eslint-env browser */
import imgIPAEmpty from './img/IPA/IPA_mug_empty.png';
import imgLGREmpty from './img/LGR/LGR_mug_empty.png';
import imgPTREmpty from './img/PTR/PTR_mug_empty.png';
import { importAll } from '../../../../libs/helpers_lib';
import { beerTypes } from '../../../../stage/gameplay_params';
import emptyGlassImg from './img/whiskeyGlass/glass_empty.png';
import fullGlassImg from './img/whiskeyGlass/glass_full.png';
import { imagesDataURL } from '../../../../libs/session_storage_lib';

imagesDataURL.addElements([imgIPAEmpty, imgLGREmpty, imgPTREmpty, emptyGlassImg, fullGlassImg]);

export const mugTypes = {
  [beerTypes.IPA]: {
    img: {
      width: 63,
      empty: imgIPAEmpty,
      fillingPhasesImgs: importAll(
        require.context('./img/IPA/IPA_filling_states', false, /\.png$/),
      ).map((img) => {
        imagesDataURL.addElement(img);
        return img;
      }),
      overfilledPhasesImgs: importAll(
        require.context('./img/IPA/IPA_overfilled_states', false, /\.png$/),
      ).map((img) => {
        imagesDataURL.addElement(img);
        return img;
      }),
    },
    volume: 6.75,
  },
  [beerTypes.LGR]: {
    img: {
      width: 70,
      empty: imgLGREmpty,
      fillingPhasesImgs: importAll(
        require.context('./img/LGR/LGR_filling_states', false, /\.png$/),
      ).map((img) => {
        imagesDataURL.addElement(img);
        return img;
      }),
      overfilledPhasesImgs: importAll(
        require.context('./img/LGR/LGR_overfilled_states', false, /\.png$/),
      ).map((img) => {
        imagesDataURL.addElement(img);
        return img;
      }),
    },
    volume: 9,
  },
  [beerTypes.PTR]: {
    img: {
      width: 55,
      empty: imgPTREmpty,
      fillingPhasesImgs: importAll(
        require.context('./img/PTR/PTR_filling_states', false, /\.png$/),
      ).map((img) => {
        imagesDataURL.addElement(img);
        return img;
      }),
      overfilledPhasesImgs: importAll(
        require.context('./img/PTR/PTR_overfilled_states', false, /\.png$/),
      ).map((img) => {
        imagesDataURL.addElement(img);
        return img;
      }),
    },
    volume: 4.5,
  },
};

export const mugsParams = {
  overfillPhaseDuration: 800,
};

export const magsCreatingParams = {
  lineBase: 389,
  initialDelay: 1,
  maxDelayToGenerateNext: 8,
};

export const whiskeyGlassParams = {
  img: {
    width: 35,
    empty: emptyGlassImg,
    full: fullGlassImg,
  },
  volume: 2,
};

export const stageWidthAdjustmentCoefficient = 0.6;
