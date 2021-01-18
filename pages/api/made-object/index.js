import rename from "deep-rename-keys";
import blocksToHtml from "@sanity/block-content-to-html";
import { filterObject, removeKey, toJSONids } from "../../../lib";
import { context } from "../../../lib/context";
import client from "../../../lib/sanity";

const postQuery = `
  *[_type == "madeObject"][0...10] {
    ...,
  }`

export default async function handler(req, res) {
  const response = await client.fetch(postQuery);
  const data = await response;

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
  // All PortableText must be converted to html
  const pt2html = data.map((o) => 
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
  const fixIDs = toJSONids(pt2html)
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
    "@graph": [...result],
  };

  res.status(200).json(json);
}
