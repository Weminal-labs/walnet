/**
 * Use this function to set default values for `o` using `ext`.
 * @param o
 * @param s
 */
function setDefaultValues(o, ext) {
  if (!o) return ext;
  for (const key in ext) {
    if (o[key] === undefined) {
      o[key] = ext[key];
    }
  }
  return o;
}

/**
 * Use this function to convert an object to string.
 * @param o
 * @example
 * ```
 * let obj = {
 *   name: "Nguyen Anh Tuan",
 *   age: 19
 * };
 *
 * let str = ObjectUtils.toString(obj);
 *
 * // Output: name=Nguyen Anh Tuan;age=19
 * console.log(str);
 * ```
 */
function toString(o, opt) {
  let str = "";

  opt = setDefaultValues(opt, { kvSeperator: "=", seperator: "&" });

  for (const key in o) {
    if (
      Boolean(o[key]) &&
      typeof o[key] !== "object" &&
      typeof o[key] !== "function" &&
      typeof o[key] !== "symbol"
    ) {
      const propStr = key + opt?.kvSeperator + o[key];
      str += propStr + opt?.seperator;
    }
  }
  return str;
}

/**
 * Use this function to update deeply a object.
 * @param o
 * @param data
 * @param opt
 * @returns
 */
function updateObject(o, data, opt) {
  for (const key in data) {
    if (typeof data[key] === "object" && typeof o[key] === "object") {
      updateObject(o[key], data[key], opt);
      continue;
    }

    if (opt && opt.canOverrideValues === true) o[key] = data[key];
    else if (!o[key]) {
      o[key] = data[key];
    }
  }

  return o;
}

/**
 * Use this function to lock an object. It uses `freeze` and `seal` to perform this operation
 * @param o
 * @returns
 */
function lock(o) {
  if (typeof o !== "object" || Array.isArray(o)) return;
  Object.seal(o);
  Object.freeze(o);
}

export const ObjectUtils = {
  toString,
  setDefaultValues,
  updateObject,
  lock,
};
