import { madeObjects } from "../../../data";
import rename from "deep-rename-keys";
import blocksToHtml from "@sanity/block-content-to-html";
import { filterObject, removeKey } from "../../../lib";
import { context } from "../../../lib/context";

export default function idHandler({ query: { id } }, res) {
  const filtered = madeObjects.filter((p) => p._id === id);

  let clean = filtered.map((o) =>
    rename(o, function (key) {
      if (key === "_id" || key === "_ref" || key === "_key") return "@id";
      return key;
    })
  );

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
  };

  // User with id exists
  if (filtered.length > 0) {
    res.status(200).json(jsonld);
  } else {
    res.status(404).json({ message: `Document with id: ${id} not found.` });
  }
}
