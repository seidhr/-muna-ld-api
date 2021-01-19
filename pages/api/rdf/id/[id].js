import rename from "deep-rename-keys";
import { filterObject, pt2html, removeKey, toJSONids } from "../../../../lib";
import { context } from "../../../../lib/context";
import client from "../../../../lib/sanity";
import * as jsonld from "jsonld";
import { getID } from "../../../../lib/api";

export default async function rdfIdHandler(req, res) {
  const {
    query: {id}
  } = req

  const response = await client.fetch(getID, {id});
  const data = await response;

  const html = pt2html(data)
  const fixIDs = toJSONids(html)
  const removedRev = fixIDs?.map(o => {return removeKey(o, "_rev")});
  const removeUnderscore = removedRev.map((o) =>
    rename(o, function (key) {
      if (key.startsWith('_')) {
        return key.substring(1)
      };
      return key;
    })
  )
  const product = filterObject(removeUnderscore, "type", "reference");

  const result = {
    ...context,
    ...product[0],
  };

  const nquads = await jsonld.toRDF(result, { format: "application/n-quads" });

  // User with id exists
  if (nquads) {
    res.status(200).send(nquads);
  } else {
    res.status(404).json({ message: `Document with id: ${id} not found.` });
  }
}
