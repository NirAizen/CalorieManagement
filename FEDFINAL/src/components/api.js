import idb from '../idb';

export function fetchData(selectedMonth=null, selectedYear=null) {
    return new Promise(async (resolve, reject) => {
        try {
            // Open the IndexedDB database
            const indexdb = await idb.openCaloriesDB("caloriesdb", 1);

            // Check if the IndexedDB database is opened correctly
            if (!indexdb) {
                reject(new Error("Failed to open IndexedDB database"));
                return;
            }

            const transaction = indexdb.transaction("calories", "readwrite");
            const objectStore = transaction.objectStore("calories");

            let getAllReq;

            if (selectedMonth !== null && selectedYear !== null) {
                // Define the key range for the selected month and year
                const keyRange = IDBKeyRange.bound([selectedYear, selectedMonth], [selectedYear, selectedMonth, Infinity]);

                // Use the index to open a cursor within the specified range
                const index = objectStore.index("month_year");
                getAllReq = index.openCursor(keyRange);
            } else {
                // Fetch all data if month and year are not selected
                getAllReq = objectStore.openCursor();
            }

            const dataArray = [];

            getAllReq.onsuccess = (e) => {
                const cursor = e.target.result;

                if (cursor) {
                    // Process the current cursor data
                    dataArray.push(cursor.value);

                    // Move to the next item in the cursor
                    cursor.continue();
                } else {
                    // Filter the data array if month and year are specified
                    if (selectedMonth !== null && selectedYear !== null) {
                        const filteredData = dataArray.filter(item => item.year === selectedYear && item.month === selectedMonth);
                        resolve(filteredData);
                    } else {
                        // Resolve with the fetched data array
                        resolve(dataArray);
                    }
                }
            };

            getAllReq.onerror = (e) => {
                reject(e.target.error);
            };
        } catch (error) {
            reject(error);
        }
    });
}
