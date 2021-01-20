import { toJSONLD } from "../../../../lib";
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

  const result = toJSONLD(data)

  const json = {
    ...context,
    ...result[0],
  };

  const nquads = await jsonld.toRDF(json, { format: "application/n-quads" });

  // User with id exists
  if (nquads) {
    res.status(200).send(nquads);
  } else {
    res.status(404).json({ message: `Document with id: ${id} not found.` });
  }
}
