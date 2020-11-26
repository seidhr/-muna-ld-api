import { madeObjects } from "../../../data";
import rename from "deep-rename-keys";
import blocksToHtml from "@sanity/block-content-to-html";
import { filterObject, removeKey } from "../../../lib";
import { context } from "../../../lib/context";

export default function handler(req, res) {
  let clean = madeObjects.map((o) =>
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

  const json = {
    ...context,
    "@graph": [...clean],
  };

  res.status(200).json(json);
}
