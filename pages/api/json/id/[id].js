import { toJSONLD } from "../../../../lib";
import client from "../../../../lib/sanity";
import { getID } from "../../../../lib/api";


export default async function idHandler(req, res) {
  const {
    query: {id}
  } = req

  const response = await client.fetch(getID, {id});
  const data = await response;

  const result = toJSONLD(data)

  // User with id exists
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: `Document with id: ${id} not found.` });
  }
}
