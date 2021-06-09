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

export const getDump = `
  *[] {
    ...,
    mainRepresentation{
      "_id": asset->._id
    }
  }`
