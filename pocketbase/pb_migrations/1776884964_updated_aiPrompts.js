/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1730257498")

  // remove field
  collection.fields.removeById("select2063623452")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1730257498")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select2063623452",
    "maxSelect": 1,
    "name": "status",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "new",
      "inProgress",
      "finished"
    ]
  }))

  return app.save(collection)
})
