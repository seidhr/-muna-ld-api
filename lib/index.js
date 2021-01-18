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