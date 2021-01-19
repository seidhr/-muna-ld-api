import rename from "deep-rename-keys";
import blocksToHtml from "@sanity/block-content-to-html";
import { filterObject, pt2html, removeKey, toJSONids } from "../../../lib";
import { context } from "../../../lib/context";
import client from "../../../lib/sanity";
import { getMadeObjects } from "../../../lib/api";

export default async function handler(req, res) {
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
  const result = filterObject(removeUnderscore, "type", "reference");

  const json = {
    ...context,
    "@graph": result,
  };

  res.status(200).json(json);
}
