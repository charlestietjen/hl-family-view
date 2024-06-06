/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ltl4tsxoic81svg")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_RkNLov6` ON `contacts` (`remote_id`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ltl4tsxoic81svg")

  collection.indexes = []

  return dao.saveCollection(collection)
})
