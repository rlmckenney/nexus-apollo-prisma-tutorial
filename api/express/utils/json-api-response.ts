interface PrismaModel {
  id: number
}

export function formatObject<
  Resource extends PrismaModel,
  Key extends keyof Resource
>({
  sourceObject,
  type,
  relations
}: {
  sourceObject: Resource
  type: string
  relations?: Key[]
}): any {
  let relationships
  if (relations) {
    Array.from(new Set(relations)).forEach(relation => {
      if (typeof sourceObject[relation] === 'object') {
        const relatedObject = {...sourceObject[relation]} as unknown as Resource
        relationships = {
          [relation]: {
            data: formatObject({
              sourceObject: relatedObject,
              type: relation as string
            })
          }
        }
        delete sourceObject[relation]
        delete sourceObject[`${relation}Id` as Key]
      }
    })
  }
  const {id, ...attributes} = sourceObject
  return {id, type, attributes, relationships}
}

export function formatCollection<Model extends PrismaModel>({
  sourceCollection,
  type
}: {
  sourceCollection: Model[]
  type: string
}) {
  return sourceCollection.map(sourceObject =>
    formatObject({sourceObject, type})
  )
}
