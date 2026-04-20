/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_695162881")

  // remove field
  collection.fields.removeById("relation939757725")

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "json939757725",
    "maxSize": 0,
    "name": "foods",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_695162881")

  // add field
  collection.fields.addAt(8, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_4081397366",
    "hidden": false,
    "id": "relation939757725",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "foods",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("json939757725")

  return app.save(collection)
})
