import { RoleSet, setActionOnAddElement } from 'drama-core';

/* eslint-env browser */
const xhr = new XMLHttpRequest();
const fileReader = new FileReader();

async function retrieveDataURL(src) {
  let dataURL = sessionStorage.getItem(src);
  if (dataURL) {
    return dataURL;
  }

  xhr.open('GET', src);
  xhr.responseType = 'blob';

  let response;
  try {
    response = await new Promise((resolve, reject) => {
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(xhr.status);
        }
      });

      xhr.send();
    });
  } catch (e) {
    throw new Error(e);
  }

  try {
    dataURL = await new Promise((resolve, reject) => {
      fileReader.onload = (event) => {
        resolve(event.target.result);
      };

      fileReader.onerror = (event) => {
        reject(event);
      };

      fileReader.readAsDataURL(response);
    });
  } catch (e) {
    throw new Error(e);
  }

  try {
    sessionStorage.setItem(src, dataURL);
  } catch (e) {
    throw new Error(e);
  }

  return dataURL;
}

export const imagesDataURL = new RoleSet();

let retrievingPromises = Promise.resolve();

setActionOnAddElement(imagesDataURL, ({ target: src }) => {
  retrievingPromises = retrievingPromises.then(() => retrieveDataURL(src));
});

export function whenAllURLRetrieved() {
  return retrievingPromises;
}

export function getDataURL(src) {
  return sessionStorage.getItem(src);
}
