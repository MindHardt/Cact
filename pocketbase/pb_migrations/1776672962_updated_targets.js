/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1041261049")

  // update collection data
  unmarshal({
    "createRule": "user.id = @request.auth.id",
    "deleteRule": "user.id = @request.auth.id",
    "indexes": [
      "CREATE INDEX `idx_5n8OiokANF` ON `targets` (\n  `user`,\n  `activeFrom`\n)"
    ],
    "listRule": "user.id = @request.auth.id",
    "updateRule": "user.id = @request.auth.id",
    "viewRule": "user.id = @request.auth.id"
  }, collection)

  // add field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation2375276105",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "user",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1041261049")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "indexes": [],
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  // remove field
  collection.fields.removeById("relation2375276105")

  return app.save(collection)
})
