document.addEventListener('DOMContentLoaded', () => {
    const motorCards = document.getElementById('motorCards');
    const filterForm = document.getElementById('filterForm');
    const filterContainer = document.getElementById('filterContainer');
    const addFilterButton = document.getElementById('addFilter');
    const cardCount = document.getElementById('cardCount');
    let filterCount = 0;

    // Define the available filter keys
    const filterKeys = [
        'Equipment ID No', 'Location', 'Use Of Motor', 'Serial No.', 'SPM No.', 'KW',
        'FLC', 'RPM', 'Volt', 'Frame Size', 'Fan Details', 'Make', 'Duty', 'Insulation',
        'Bearing (DE)', 'Bearing (NDE)', 'Cooling Fan', 'IP', 'Oil Seal', 'TB Box',
        'Fan Cover', 'TB Block', 'Mounting', 'OH Date', 'Job Description', 'R', 'Y', 'B'
    ];

    function loadMotors(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        fetch(`/get-motors?${queryString}`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const cards = data.map(motor => `
                        <div class="card">
    <h3>JINDAL SAW LTD (IPU) SINTER PLANT - E & I</h3>
    <table>
        <tr>
            <td><strong>Equipment ID No:</strong></td>
            <td>${motor['Equipment ID No'] || 'N/A'}</td>
            <td><strong>SPM No:</strong></td>
            <td>${motor['SPM No.'] || 'N/A'}</td>
        </tr>
        <tr>
            <td><strong>Power KW:</strong></td>
            <td>${motor['KW'] || 'N/A'}</td>
            <td><strong>Use Of Motor:</strong></td>
            <td>${motor['Use Of Motor'] || 'N/A'}</td>
        </tr>
        <tr>
            <td><strong>RPM:</strong></td>
            <td>${motor['RPM'] || 'N/A'}</td>
            <td><strong>Bearing (DE):</strong></td>
            <td>${motor['Bearing (DE)'] || 'N/A'}</td>
        </tr>
        <tr>
            <td><strong>Current (FLC):</strong></td>
            <td>${motor['FLC'] || 'N/A'}</td>
            <td><strong>Bearing (NDE):</strong></td>
            <td>${motor['Bearing (NDE)'] || 'N/A'}</td>
        </tr>
        <tr>
            <td><strong>Volt:</strong></td>
            <td>${motor['Volt'] || 'N/A'}</td>
            <td><strong>Mounting:</strong></td>
            <td>${motor['Mounting'] || 'N/A'}</td>
        </tr>
        <tr>
            <td><strong>Frame Size:</strong></td>
            <td>${motor['Frame Size'] || 'N/A'}</td>
            <td><strong>Duty:</strong></td>
            <td>${motor['Duty'] || 'N/A'}</td>
        </tr>
        <tr>
            <td><strong>Serial No:</strong></td>
            <td>${motor['Serial No.'] || 'N/A'}</td>
            <td><strong>Insulation:</strong></td>
            <td>${motor['Insulation'] || 'N/A'}</td>
        </tr>
        <tr>
            <td><strong>Make:</strong></td>
            <td>${motor['Make'] || 'N/A'}</td>
            <td><strong>IP:</strong></td>
            <td>${motor['IP'] || 'N/A'}</td>
        </tr>
        <tr>
            <td><strong>Fan Details:</strong></td>
            <td>${motor['Fan Details'] || 'N/A'}</td>
            <td><strong>Oil Seal:</strong></td>
            <td>${motor['Oil Seal'] || 'N/A'}</td>
        </tr>
        <tr>
            <td><strong>TB Block:</strong></td>
            <td>${motor['TB Block'] || 'N/A'}</td>
            <td><strong>TB Box:</strong></td>
            <td>${motor['TB Box'] || 'N/A'}</td>
        </tr>
    </table>

    <h4>HISTORY CARD OF MOTOR</h4>
    <table class="history-table">
        <tr>
            <td><strong>O/H Date</strong></td>
            <td><strong>Description of Job</strong></td>
            <td><strong>R</strong></td>
            <td><strong>Y</strong></td>
            <td><strong>B</strong></td>
            <td><strong>Location</strong></td>
        </tr>
        <tr>
            <td>${motor['OH Date'] || 'N/A'}</td>
            <td>${motor['Job Description'] || 'N/A'}</td>
            <td>${motor['R'] || 'N/A'}</td>
            <td>${motor['Y'] || 'N/A'}</td>
            <td>${motor['B'] || 'N/A'}</td>
            <td>${motor['Location'] || 'N/A'}</td>
        </tr>
    </table>
</div>
                    `).join('');
                    motorCards.innerHTML = cards;
                    cardCount.textContent = `Number of cards: ${data.length}`;
                } else {
                    motorCards.innerHTML = '<p>No motors found.</p>';
                    cardCount.textContent = 'Number of cards: 0';
                }
            })
            .catch(error => {
                console.error('Error loading motors:', error);
                cardCount.textContent = 'Number of cards: 0';
            });
    }

    // Function to create a new filter field
    function createFilterField(id) {
        const filterGroup = document.createElement('div');
        filterGroup.className = 'filter-group';
        filterGroup.dataset.id = id; // Set a data attribute for identifying the filter
        const selectOptions = filterKeys.map(key => `<option value="${key}">${key}</option>`).join('');
        filterGroup.innerHTML = `
            <select name="filterKey_${id}">
                <option value="" disabled selected>Select Filter Key</option>
                ${selectOptions}
            </select>
            <input type="text" name="filterValue_${id}" placeholder="Filter Value">
            <button type="button" class="remove-filter" data-id="${id}">Remove</button>
        `;
        filterContainer.appendChild(filterGroup);
    }

    // Remove filter field
    function removeFilter(id) {
        const filterGroup = document.querySelector(`.filter-group[data-id='${id}']`);
        if (filterGroup) {
            filterContainer.removeChild(filterGroup);
        }
    }

    // Handle remove filter button clicks
    filterContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('remove-filter')) {
            const id = event.target.dataset.id;
            removeFilter(id);
        }
    });

    // Add initial filter field
    createFilterField(++filterCount);

    // Handle adding new filter fields
    addFilterButton.addEventListener('click', () => {
        createFilterField(++filterCount);
    });

    // Apply filters on form submit
    filterForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(filterForm);
        const filters = {};
        formData.forEach((value, key) => {
            if (key.startsWith('filterValue_') && value) {
                const filterKey = key.replace('filterValue_', 'filterKey_');
                const filterName = formData.get(filterKey);
                if (filterName) {
                    filters[filterName] = value;
                }
            }
        });
        loadMotors(filters);
    });

    // Load motors on page load
    loadMotors();
});

function toggleMenu() {
    var links = document.querySelector('.nav-links');
    links.classList.toggle('active');
}        

// document.addEventListener('DOMContentLoaded', () => {
//     const motorCards = document.getElementById('motorCards');
//     const filterForm = document.getElementById('filterForm');
//     const filterContainer = document.getElementById('filterContainer');
//     const addFilterButton = document.getElementById('addFilter');
//     const cardCount = document.getElementById('cardCount');
//     const totalMotors = document.getElementById('totalMotors');
//     const maintenanceDue = document.getElementById('maintenanceDue');
//     const lastServiced = document.getElementById('lastServiced');
//     let filterCount = 0;

//     // Define the available filter keys
//     const filterKeys = [
//         'Equipment ID No', 'Location', 'Use Of Motor', 'Serial No.', 'SPM No.', 'KW',
//         'FLC', 'RPM', 'Volt', 'Frame Size', 'Fan Details', 'Make', 'Duty', 'Insulation',
//         'Bearing (DE)', 'Bearing (NDE)', 'Cooling Fan', 'IP', 'Oil Seal', 'TB Box',
//         'Fan Cover', 'TB Block', 'Mounting', 'OH Date', 'Job Description', 'R', 'Y', 'B'
//     ];

//     function calculateStatistics(motors) {
//         const now = new Date();
//         let totalMotorsCount = motors.length;
//         let maintenanceDueCount = 0;
//         let lastServicedCount = 0;

//         motors.forEach(motor => {
//             // Calculate maintenance due
//             const ohDate = new Date(motor['OH Date']);
//             const lastServicedDate = new Date(motor['Last OH Date']);
//             const diffInYears = (now - ohDate) / (1000 * 60 * 60 * 24 * 365);
//             const diffInDays = (now - lastServicedDate) / (1000 * 60 * 60 * 24);

//             if (diffInYears >= 1) {
//                 maintenanceDueCount++;
//             }

//             if (diffInDays <= 365) { // Serviced within the last year
//                 lastServicedCount++;
//             }
//         });

//         // Update the stats on the page
//         totalMotors.textContent = `Total Motors: ${totalMotorsCount}`;
//         maintenanceDue.textContent = `Maintenance Due: ${maintenanceDueCount}`;
//         lastServiced.textContent = `Last Serviced: ${lastServicedCount}`;
//     }

//     function loadMotors(filters = {}) {
//         const queryString = new URLSearchParams(filters).toString();
//         fetch(`/get-motors?${queryString}`)
//             .then(response => response.json())
//             .then(data => {
//                 if (Array.isArray(data)) {
//                     calculateStatistics(data); // Calculate and update stats
//                     const cards = data.map(motor => `
//                         <div class="card">
//                             <h3>JINDAL SAW LTD (IPU) SINTER PLANT - E & I</h3>
//     <table>
//     <tr>
//         <td><strong>Equipment ID No:</strong></td>
//         <td>${motor['Equipment ID No'] || 'N/A'}</td>
//         <td><strong>SPM No:</strong></td>
//         <td>${motor['SPM No.'] || 'N/A'}</td>
//     </tr>
//     <tr>
//         <td><strong>Power KW:</strong></td>
//         <td>${motor['KW'] || 'N/A'}</td>
//         <td><strong>Use Of Motor:</strong></td>
//         <td>${motor['Use Of Motor'] || 'N/A'}</td>
//     </tr>
//     <tr>
//         <td><strong>RPM:</strong></td>
//         <td>${motor['RPM'] || 'N/A'}</td>
//         <td><strong>Bearing (DE):</strong></td>
//         <td>${motor['Bearing (DE)'] || 'N/A'}</td>
//     </tr>
//     <tr>
//         <td><strong>Current (FLC):</strong></td>
//         <td>${motor['FLC'] || 'N/A'}</td>
//         <td><strong>Bearing (NDE):</strong></td>
//         <td>${motor['Bearing (NDE)'] || 'N/A'}</td>
//     </tr>
//     <tr>
//         <td><strong>Volt:</strong></td>
//         <td>${motor['Volt'] || 'N/A'}</td>
//         <td><strong>Mounting:</strong></td>
//         <td>${motor['Mounting'] || 'N/A'}</td>
//     </tr>
//     <tr>
//         <td><strong>Frame Size:</strong></td>
//         <td>${motor['Frame Size'] || 'N/A'}</td>
//         <td><strong>Duty:</strong></td>
//         <td>${motor['Duty'] || 'N/A'}</td>
//     </tr>
//     <tr>
//         <td><strong>Serial No:</strong></td>
//         <td>${motor['Serial No.'] || 'N/A'}</td>
//         <td><strong>Insulation:</strong></td>
//         <td>${motor['Insulation'] || 'N/A'}</td>
//     </tr>
//     <tr>
//         <td><strong>Make:</strong></td>
//         <td>${motor['Make'] || 'N/A'}</td>
//         <td><strong>IP:</strong></td>
//         <td>${motor['IP'] || 'N/A'}</td>
//     </tr>
//     <tr>
//         <td><strong>Fan Details:</strong></td>
//         <td>${motor['Fan Details'] || 'N/A'}</td>
//         <td><strong>Oil Seal:</strong></td>
//         <td>${motor['Oil Seal'] || 'N/A'}</td>
//     </tr>
//     <tr>
//         <td><strong>TB Block:</strong></td>
//         <td>${motor['TB Block'] || 'N/A'}</td>
//         <td><strong>TB Box:</strong></td>
//         <td>${motor['TB Box'] || 'N/A'}</td>
//     </tr>
// </table>

// <h4>HISTORY CARD OF MOTOR</h4>
// <table class="history-table">
//     <tr>
//         <td><strong>O/H Date</strong></td>
//         <td><strong>Description of Job</strong></td>
//         <td><strong>R</strong></td>
//         <td><strong>Y</strong></td>
//         <td><strong>B</strong></td>
//         <td><strong>Location</strong></td>
//     </tr>
//     <tr>
//         <td>${motor['OH Date'] || 'N/A'}</td>
//         <td>${motor['Job Description'] || 'N/A'}</td>
//         <td>${motor['R'] || 'N/A'}</td>
//         <td>${motor['Y'] || 'N/A'}</td>
//         <td>${motor['B'] || 'N/A'}</td>
//         <td>${motor['Location'] || 'N/A'}</td>
//     </tr>
// </table>
//                         </div>
//                     `).join('');
//                     motorCards.innerHTML = cards;
//                     cardCount.textContent = `Number of cards: ${data.length}`;
//                 } else {
//                     motorCards.innerHTML = '<p>No motors found.</p>';
//                     cardCount.textContent = 'Number of cards: 0';
//                 }
//             })
//             .catch(error => {
//                 console.error('Error loading motors:', error);
//                 cardCount.textContent = 'Number of cards: 0';
//             });
//     }

//     // Function to create a new filter field
//     function createFilterField(id) {
//         const filterGroup = document.createElement('div');
//         filterGroup.className = 'filter-group';
//         filterGroup.dataset.id = id; // Set a data attribute for identifying the filter
//         const selectOptions = filterKeys.map(key => `<option value="${key}">${key}</option>`).join('');
//         filterGroup.innerHTML = `
//             <select name="filterKey_${id}">
//                 <option value="" disabled selected>Select Filter Key</option>
//                 ${selectOptions}
//             </select>
//             <input type="text" name="filterValue_${id}" placeholder="Filter Value">
//             <button type="button" class="remove-filter" data-id="${id}">Remove</button>
//         `;
//         filterContainer.appendChild(filterGroup);
//     }

//     // Remove filter field
//     function removeFilter(id) {
//         const filterGroup = document.querySelector(`.filter-group[data-id='${id}']`);
//         if (filterGroup) {
//             filterContainer.removeChild(filterGroup);
//         }
//     }

//     // Handle remove filter button clicks
//     filterContainer.addEventListener('click', function (event) {
//         if (event.target.classList.contains('remove-filter')) {
//             const id = event.target.dataset.id;
//             removeFilter(id);
//         }
//     });

//     // Add initial filter field
//     createFilterField(++filterCount);

//     // Handle adding new filter fields
//     addFilterButton.addEventListener('click', () => {
//         createFilterField(++filterCount);
//     });

//     // Apply filters on form submit
//     filterForm.addEventListener('submit', function (event) {
//         event.preventDefault();
//         const formData = new FormData(filterForm);
//         const filters = {};
//         formData.forEach((value, key) => {
//             if (key.startsWith('filterValue_') && value) {
//                 const filterKey = key.replace('filterValue_', 'filterKey_');
//                 const filterName = formData.get(filterKey);
//                 if (filterName) {
//                     filters[filterName] = value;
//                 }
//             }
//         });
//         loadMotors(filters);
//     });

//     // Load motors on page load
//     loadMotors();
// });

// function toggleMenu() {
//     var links = document.querySelector('.nav-links');
//     links.classList.toggle('active');
// }
