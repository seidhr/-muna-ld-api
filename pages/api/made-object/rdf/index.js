import { madeObjects } from "../../../../data";
import blocksToHtml from "@sanity/block-content-to-html";
import { filterObject, removeKey, toJSONids } from "../../../../lib";
import { context } from "../../../../lib/context";
import * as jsonld from "jsonld";
import rename from "deep-rename-keys";

export default async function rdfHandler(req, res) {

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
  const pt2html = madeObjects.map((o) => 
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

  console.log(json)

  const nquads = await jsonld.toRDF(json, { format: "application/n-quads" });

  res.status(200).json(nquads);
}
