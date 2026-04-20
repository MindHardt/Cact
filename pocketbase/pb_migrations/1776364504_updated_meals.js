/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_695162881")

  // update collection data
  unmarshal({
    "createRule": "user.id = @request.auth.id",
    "deleteRule": "user.id = @request.auth.id",
    "listRule": "user.id = @request.auth.id",
    "updateRule": "user.id = @request.auth.id",
    "viewRule": "user.id = @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_695162881")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
