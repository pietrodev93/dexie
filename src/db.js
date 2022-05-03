import Dexie from "dexie";

export const db = new Dexie('myDatabase');

db.version(1).stores({
    item: 'item', // Primary key and indexed props
  });