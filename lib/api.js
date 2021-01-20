export const getID = `
  *[_id == $id] {
    ...,
    mainRepresentation{
      "_id": asset->._id
    },
    hasCurrentOwner[]->{
      _id,
      label
    },
    hasType[]->{
      _id,
      label
    }
  }`

export const getMadeObjects = `
  *[][0...100] {
    ...,
    mainRepresentation{
      "_id": asset->._id
    },
    hasCurrentOwner[]->{
      _id,
      label
    },
    hasType[]->{
      _id,
      label
    }
  }`
