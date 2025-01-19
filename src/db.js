let db;

export function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('shoppingListApp-db', 1);

        request.onupgradeneeded = (event) => {
            db = event.target.result;

            // Create shoppingList object store
            const shoppingList = db.createObjectStore('shoppingList', { keyPath: 'id', autoIncrement: true });

            // Create indexes for title and createdAt
            shoppingList.createIndex('title', 'title', { unique: false });
            shoppingList.createIndex('createdAt', 'createdAt', { unique: false });

            // Create an index for the items within each list (optional, depends on your use case)
            // This will allow for efficient querying by item id if needed later
            shoppingList.createIndex('itemsId', 'items.id', { unique: false });
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };

        request.onerror = (event) => {
            reject('IndexedDB Error' + event.target.errorCode);
        };
    });
}

function checkDB() {
    if (!db) {
        console.log("Database is not open yet, opening it...");
        return openDatabase().then(() => {
            console.log("Database opened successfully.");
        }).catch((error) => {
            console.error("Failed to open database:", error);
        });
    } else {
        console.log("IndexedDB already exists");
        return Promise.resolve();  // return resolved promise if db is already open
    }
}




export function createShoppingList(title, createdAt, items) {
    return new Promise((resolve, reject) => {

            checkDB();
            const transaction = db.transaction(['shoppingList'], 'readwrite');
            const shoppingList = transaction.objectStore('shoppingList');
            const list = {
                title: title,
                createdAt: new Date(createdAt),
                items: items,
            };

            const request = shoppingList.add(list);

            request.onsuccess = () => {
                console.log("Shopping list saved to IndexedDB");
                resolve();
            };

            request.onerror = (error) => {
                console.error("Error saving shopping list:", error);
                reject(error);
            };

    });
}


export function getAllShoppingList() {
    return checkDB().then(() => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['shoppingList'], 'readonly');
            const shoppingList = transaction.objectStore('shoppingList');
            const list = [];

            shoppingList.openCursor().onsuccess = (event) => {
                const cursor = event.target.result;

                if (cursor) {
                    list.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(list);
                }
            };

            transaction.onerror = (error) => {
                reject('Transaction error: ' + error);
            };
        });
    });
}


