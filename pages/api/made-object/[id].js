// import { madeObjects } from "../../../data";
import rename from "deep-rename-keys";
import blocksToHtml from "@sanity/block-content-to-html";
import { filterObject, removeKey } from "../../../lib";
import { context } from "../../../lib/context";
import { groq } from "next-sanity";
import {
  getClient,
  usePreviewSubscription,
  urlFor,
  PortableText,
} from "../../../lib/sanity";
const postQuery = groq`
    *[_type == "madeObject" && _id == $id][0] {
      ...
      },
      "id": id
    }`;

export default async function idHandler({ query: { id } }, res) {
  const getID = id;
  // const filtered = madeObjects.filter((p) => p._id === id);

  const preview = false;
  const result = await getClient(preview).fetch(postQuery, {
    id: getID,
  });

  const post = await result;
  /* 
  let clean = rename(post, function (key) {
    if (key === "_id" || key === "_ref" || key === "_key") return "@id";
    return key;
  });

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

  const jsonld = {
    ...context,
    ...clean[0],
  }; */

  // User with id exists
  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404).json({ message: `Document with id: ${id} not found.` });
  }
}
