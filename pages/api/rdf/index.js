import rename from "deep-rename-keys";
import { filterObject, pt2html, removeKey, toJSONids, clean } from "../../../lib";
import { context } from "../../../lib/context";
import client from "../../../lib/sanity";
import * as jsonld from "jsonld";
import { getMadeObjects } from "../../../lib/api";

export default async function rdfHandler(req, res) {
  const response = await client.fetch(getMadeObjects);
  const data = await response;

  const html = pt2html(data)
  const fixIDs = toJSONids(html)
  const removedRev = fixIDs.map(o => {return removeKey(o, "_rev")});
  const removeUnderscore = removedRev.map((o) =>
    rename(o, function (key) {
      if (key.startsWith('_')) {
        return key.substring(1)
      };
      return key;
    })
  )
  let result = filterObject(removeUnderscore, "type", "reference");
  result = result.map(o => clean(o))

  const json = {
    ...context,
    "@graph": [...result],
  };

  const nquads = await jsonld.toRDF(json, { format: "application/n-quads" });

  res.status(200).send(nquads);
}
