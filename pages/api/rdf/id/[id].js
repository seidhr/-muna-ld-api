import rename from "deep-rename-keys";
import blocksToHtml from "@sanity/block-content-to-html";
import { filterObject, removeKey, toJSONids } from "../../../../lib";
import { context } from "../../../../lib/context";
import { groq } from "next-sanity";
import client from "../../../../lib/sanity";
import * as jsonld from "jsonld";

const postQuery = groq`
  *[_type == "madeObject" && _id == $id] {
    ...,
    //hasCurrentOwner[]->{...},
    //hasType[]->{...}
  }`

export default async function rdfIdHandler(req, res) {
  const {
    query: {id}
  } = req

  const response = await client.fetch(postQuery, {id});
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
    marks: {
      internalLink: props =>
        h("a", { href: "/id/" + props.mark.reference._ref }, props.children)
    }
  }

  const pt2html = data?.map((o) => 
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
