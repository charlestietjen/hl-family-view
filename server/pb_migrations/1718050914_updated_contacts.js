/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ltl4tsxoic81svg")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hbloubs6",
    "name": "orders",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "zno2pf5hjvpqspe",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ltl4tsxoic81svg")

  // remove
  collection.schema.removeField("hbloubs6")

  return dao.saveCollection(collection)
})
