import rename from "deep-rename-keys";
import blocksToHtml from "@sanity/block-content-to-html";

const h = blocksToHtml.h;
const serializers = {
  types: {
    code: (props) =>
      h(
        "pre",
        { className: props.node.language },
        h("code", props.node.code)
      ),
  },
  marks: {
    internalLink: props =>
      h("a", { href: "/id/" + props.mark.reference._ref }, props.children)
  }
};
// All PortableText must be converted to html
export const pt2html = (arr) => {
  const html = arr.map((o) => 
  ({
    ...o,
    referredToBy: o.referredToBy?.map(b => ({
      ...b,
      body: blocksToHtml({
        blocks: b.body,
        serializers: serializers,
      }) 
    }))
  }))
  return html
}

export const toJSONids = (arr) => {
  return arr.map((o) =>
    rename(o, function (key) {
      if (key === "_id" || key === "_ref" || key === "_key") return "id";
      return key;
    })
  )
}

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

export const clean = (object) => {
  Object
      .entries(object)
      .forEach(([k, v]) => {
          if (v && typeof v === 'object') {
              clean(v);
          }
          if (v && typeof v === 'object' && !Object.keys(v).length || v === null || v === undefined) {
              if (Array.isArray(object)) {
                  object.splice(k, 1);
              } else {
                  delete object[k];
              }
          }
      });
  return object;
}