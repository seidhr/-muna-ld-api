import rename from "deep-rename-keys";

export const removeKey = (obj, key) =>
  obj !== Object(obj)
    ? obj
    : Array.isArray(obj)
    ? obj.map((item) => removeKey(item, key))
    : Object.keys(obj)
        .filter((k) => k !== key)
        .reduce(
          (acc, x) => Object.assign(acc, { [x]: removeKey(obj[x], key) }),
          {}
        );

export const filterObject = (obj, key, value) => {
  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    if (typeof obj[i] == "object") {
      filterObject(obj[i], key, value);
    } else if (i == key && obj[key] === value) {
      delete obj[key];
    }
  }
  return obj;
};

export const toJSONids = arr => {
  return arr.map((o) =>
    rename(o, function (key) {
      if (key === "_id" || key === "_ref" || key === "_key") return "id";
      return key;
    })
  )
}

export const findKeyValueRecursively = (input, keyOfTheValue, valueToFind) => {
  //Some validation
  if (typeof keyOfTheValue !== "string") {
    throw new Error("Invalid parameter: keyOfTheValue has to be a string.");
  }

  //Accepts arrays of objects.
  if (Array.isArray(input)) {
    return input.reduce(function (result, element) {
      if (result === true) {
        return true;
      }

      //Recursive call.
      return findKeyValueRecursively(element, keyOfTheValue, valueToFind);
    }, false);
  }

  //Process objects.
  if (input !== null && typeof input === "object") {
    //IMPORTANT: typeof null === 'object', this is a known JavaScript bug [1].

    if (keyOfTheValue in input && input[keyOfTheValue] === valueToFind) {
      //See [2].
      //We found it!
      return input;
    }

    //Check for other nested objects or arrays.
    for (let key in input) {
      //The hasOwnProperty function is used to exclude properties found in the prototype chain.
      if (input.hasOwnProperty(key)) {
        //Recursive call: iterates through all the object properties.
        if (findKeyValueRecursively(input[key], keyOfTheValue, valueToFind)) {
          return input[key];
        }
      }
    }
  }

  return false;
}