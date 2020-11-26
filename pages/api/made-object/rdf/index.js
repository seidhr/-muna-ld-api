import { madeObjects } from "../../../../data";
import rename from "deep-rename-keys";
import blocksToHtml from "@sanity/block-content-to-html";
import { filterObject, removeKey } from "../../../../lib";
import { context } from "../../../../lib/context";
import * as jsonld from "jsonld";

export default async function rdfHandler(req, res) {
  let clean = madeObjects.map((o) =>
    rename(o, function (key) {
      if (key === "_id" || key === "_ref" || key === "_key") return "@id";
      return key;
    })
  );

  function findKeyValueRecursively(input, keyOfTheValue, valueToFind) {
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

  const path = findKeyValueRecursively(clean, "_type", "reference");

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
  };

  // ONLY for testing! All PortableText must be converted to html
  clean[0].referredToBy[0].body = blocksToHtml({
    blocks: clean[0].referredToBy[0].body,
    serializers: serializers,
  });

  clean = removeKey(clean, "_rev");
  clean = filterObject(clean, "_type", "reference");

  const json = {
    ...context,
    "@graph": [...clean],
  };

  const nquads = await jsonld.toRDF(json, { format: "application/n-quads" });

  res.status(200).json(nquads);
}
