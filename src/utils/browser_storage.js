// Import other utils
import { ObjectUtils } from "./object";

/**
 * Use this function to get data from storage.
 * @param key
 * @returns
 */
function __getItem(storage, key) {
  const dataString = storage.getItem(key);

  if (!dataString) return null;

  return JSON.parse(dataString);
}

/**
 * __Use Local Storage__
 *
 * Use this function to save data in storage.
 * @param key
 * @param data
 */
function __setItem(storage, key, data) {
  data = JSON.stringify(data);
  storage.setItem(key, data);
}

/**
 * Use this function to remove data from storage.
 * @param key
 * @returns
 */
function __removeItem(storage, key) {
  storage.removeItem(key);
  return true;
}

/**
 * Use this function to update an item in storage.
 * @param key
 * @param data
 * @returns
 */
function __updateItem(storage, key, data, opt) {
  if (!data) return;

  let storedData = __getItem < T > (storage, key);

  if (!storedData) {
    __setItem(storage, key, data);
    return data;
  }

  storedData = ObjectUtils.updateObject(storedData, data, opt);

  // Set new item
  __setItem(storage, key, storedData);

  return storedData;
}

// /**
//  * Give `index` to this function and receive the `index`-th item's name.
//  * @param index
//  * @returns
//  */
// function __keyName(storage: Storage, index: number) {
//   return storage.key(index);
// }

/**
 * Use this function to clear all items in storage.
 */
function __clearAll(storage) {
  storage.clear();
}

/**
 * Use this function to get length of local storage.
 * @returns
 */
function __getLength(storage) {
  return storage.length;
}

/**
 * __Use Local Storage__
 *
 * Use this function to save data in local storage.
 * @param key
 * @param data
 */
function setItem(key, data) {
  __setItem(localStorage, key, data);
}

/**
 * __Use Session Storage__
 *
 * Use this function to save data in session storage.
 * @param key
 * @param data
 */
function setTempItem(key, data) {
  __setItem(sessionStorage, key, data);
}

/**
 * __Use Local Storage__
 *
 * Use this function to get data from local storage.
 * @param key
 * @returns
 */
function getItem(key) {
  return __getItem(localStorage, key);
}

/**
 * __Use Session Storage__
 *
 * Use this function to get data from session storage.
 * @param key
 * @returns
 */
function getTempItem(key) {
  return __getItem(sessionStorage, key);
}

/**
 * __Use Local Storage__
 *
 * Use this function to remove data from local storage.
 * @param key
 * @returns
 */
function removeItem(key) {
  return __removeItem(localStorage, key);
}

/**
 * __Use Session Storage__
 *
 * Use this function to remove data from session storage.
 * @param key
 * @returns
 */
function removeTempItem(key) {
  return __removeItem(sessionStorage, key);
}

/**
 * __Use Local Storage__
 *
 * Use this function to clear all items in local storage.
 */
function clearAllItem() {
  __clearAll(localStorage);
}

/**
 * __Use Session Storage__
 *
 * Use this function to clear all items in session storage.
 */
function clearAllTempItem() {
  __clearAll(sessionStorage);
}

/**
 * __Use Local Storage__
 *
 * Use this function to update an item in local storage.
 * @param key
 * @param data
 * @returns
 */
function updateItem(key, data, opt) {
  opt = ObjectUtils.setDefaultValues(opt, { canOverrideValues: true });
  return __updateItem(localStorage, key, data, opt);
}

/**
 * __Use Local Storage__
 *
 * Use this function to update an item in local storage.
 * @param key
 * @param data
 * @returns
 */
function updateTempItem(key, data, opt) {
  opt = ObjectUtils.setDefaultValues(opt, { canOverrideValues: true });
  return __updateItem(sessionStorage, key, data, opt);
}

/**
 * __Use Local Storage__
 *
 * Use this function to get length of local storage.
 * @returns
 */
function countItem() {
  return __getLength(localStorage);
}

/**
 * __Use Session Storage__
 *
 * Use this function to get length of session storage.
 * @returns
 */
function countTempItem() {
  return __getLength(sessionStorage);
}

export const BrowserStorageUtils = {
  setItem,
  setTempItem,
  getItem,
  getTempItem,
  removeItem,
  removeTempItem,
  updateItem,
  updateTempItem,
  clearAllItem,
  clearAllTempItem,
  countItem,
  countTempItem,
};
