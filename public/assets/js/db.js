let db;
let budgetVersion;

let request = indexedDB.open(`budgetDB`, 1);

request.onupgradeneeded = function (e) {
    console.log('Upgrade needed in IndexDB');
  
    let { oldVersion } = e;
    let newVersion = e.newVersion || db.version;
  
    console.log(`DB Updated from version ${oldVersion} to ${newVersion}`);
  
    db = e.target.result;
  
    if (db.objectStoreNames.length === 0) {
      db.createObjectStore('BudgetStore', { autoIncrement: true });
    }
  };

request.onsuccess = event => {
    console.log(`Success!`)
    db = event.target.result;
    // check if app is online before reading from db
    if (navigator.onLine) {
        checkDatabase();
    }
};


function checkDatabase() {

    let transaction = db.transaction(['BudgetStore'], 'readwrite');

  // access your BudgetStore object
  let store = transaction.objectStore('BudgetStore');

  // Get all records from store and set to a variable
  let getAll = store.getAll();

    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            fetch(`/api/transaction/bulk`, {
                method: `POST`,
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: `application/json, text/plain, */*`,
                    "Content-Type": `application/json`
                }
            })
                .then(response => response.json())
                .then(() => {
                    // if successful, open a transaction on your pending db
                    transaction = db.transaction(['BudgetStore'], 'readwrite');

                    let currentStore = transaction.objectStore('BudgetStore');

                    currentStore.clear();

                    fetch("/api/transaction")
                    .then((response) => {
                        return response.json();
                    })
                        .then((data) => {
                    // save db data on global variable
                    transactions = data;

    let();
                    populateTable();
                    populateChart();
                    })
                });
        }
    };
}

// eslint-disable-next-line no-unused-vars
let saveRecord = (record) => {
    console.log('Save record invoked');
    // Create a transaction on the BudgetStore db with readwrite access
    let transaction = db.transaction(['BudgetStore'], 'readwrite');
  
    // Access your BudgetStore object store
    let store = transaction.objectStore('BudgetStore');
  
    // Add record to your store with add method.
    store.add(record);

    populateTotal();
    populateTable();
    populateChart();


  };
  
//   // Listen for app coming back online
//   window.addEventListener('online', checkDatabase);