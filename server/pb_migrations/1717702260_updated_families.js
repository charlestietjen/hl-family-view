/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1y2bvkivzqpxo32")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_tXnn9JQ` ON `families` (`familyName`)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kq2zelow",
    "name": "familyName",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1y2bvkivzqpxo32")

  collection.indexes = []

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kq2zelow",
    "name": "familyName",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
