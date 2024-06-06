/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "1y2bvkivzqpxo32",
    "created": "2024-06-06 18:31:18.788Z",
    "updated": "2024-06-06 18:31:18.788Z",
    "name": "families",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "4bs9hyhu",
        "name": "members",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "ltl4tsxoic81svg",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": null
        }
      },
      {
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
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("1y2bvkivzqpxo32");

  return dao.deleteCollection(collection);
})
