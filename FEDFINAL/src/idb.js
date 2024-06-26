function openCaloriesDB(databaseName, version) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(databaseName, version);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('calories')) {
                const store = db.createObjectStore('calories', { keyPath: 'id', autoIncrement: true });
                // Create indexes for month and year
                store.createIndex("month_year", ["month", "year"], { unique: false });
            }
        };

        request.onsuccess = () => {
            const db = request.result;

            // Function to add calories with date and time
            db.addCalories = (data) => {
                // Get current date
                const currentDate = new Date();
                // Extract day, month, and year as numeric values
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1; // January is 0, so add 1
                const year = currentDate.getFullYear();

                // Create the final object
                const mergedDate = {
                    day,
                    month,  // Extracted month without leading zeros
                    year,
                    time: currentDate.toLocaleTimeString('en-IL', { hour: 'numeric', minute: 'numeric', second: 'numeric', fractionalSecondDigits: 2 })
                };

                return new Promise((resolve, reject) => {
                    // Merge data with formatted date and time
                    const mergedData = { ...data, ...mergedDate };

                    // Start transaction to add data to the "calories" object store
                    const transaction = db.transaction("calories", "readwrite");
                    const store = transaction.objectStore("calories");

                    // Add mergedData to the object store
                    const addRequest = store.add(mergedData);

                    // Resolve promise when transaction completes successfully
                    transaction.oncomplete = () => {
                        resolve('Calories added successfully!');
                    };

                    // Handle errors during transaction
                    transaction.onerror = () => {
                        reject(new Error('Error adding calories to database!'));
                    };
                });
            };

            // Resolve the promise once the database is ready
            resolve(db);
        };

        request.onerror = () => {
            // Reject the promise if there's an error opening the database
            reject(new Error('Error opening database!'));
        };
    });
}

export default { openCaloriesDB };