document.addEventListener('DOMContentLoaded', () => {
    const motorCards = document.getElementById('motorCards');
    const filterForm = document.getElementById('filterForm');
    const filterContainer = document.getElementById('filterContainer');
    const addFilterButton = document.getElementById('addFilter');
    const cardCount = document.getElementById('cardCount');
    let filterCount = 0;

    // Define the available filter keys
    const filterKeys = [
        'Location', 'Use Of Motor', 'Serial No.', 'SPM No.', 'KW', 'FLC', 'RPM',
        'Fr. Size', 'Make', 'Bearing (DE)', 'Bearing (NDE)', 'Cooling Fan',
        'Fan Cover', 'Terminal Block', 'Mounting', 'O/H (DATE)'
    ];

    function loadMotors(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        fetch(`/get-motors?${queryString}`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const cards = data.map(motor => `
                        <div class="card">
                            <h2>${motor['Location'] || 'N/A'}</h2>
                            <p><strong>Use Of Motor:</strong> ${motor['Use Of Motor'] || 'N/A'}</p>
                            <p><strong>Serial No.:</strong> ${motor['Serial No.'] || 'N/A'}</p>
                            <p><strong>SPM No.:</strong> ${motor['SPM No.'] || 'N/A'}</p>
                            <p><strong>KW:</strong> ${motor['KW'] || 'N/A'}</p>
                            <p><strong>FLC:</strong> ${motor['FLC'] || 'N/A'}</p>
                            <p><strong>RPM:</strong> ${motor['RPM'] || 'N/A'}</p>
                            <p><strong>Fr. Size:</strong> ${motor['Fr. Size'] || 'N/A'}</p>
                            <p><strong>Make:</strong> ${motor['Make'] || 'N/A'}</p>
                            <p><strong>Bearing (DE):</strong> ${motor['Bearing (DE)'] || 'N/A'}</p>
                            <p><strong>Bearing (NDE):</strong> ${motor['Bearing (NDE)'] || 'N/A'}</p>
                            <p><strong>Cooling Fan:</strong> ${motor['Cooling Fan'] || 'N/A'}</p>
                            <p><strong>Fan Cover:</strong> ${motor['Fan Cover'] || 'N/A'}</p>
                            <p><strong>Terminal Block:</strong> ${motor['Terminal Block'] || 'N/A'}</p>
                            <p><strong>Mounting:</strong> ${motor['Mounting'] || 'N/A'}</p>
                            <p><strong>O/H (DATE):</strong> ${motor['O/H (DATE)'] || 'N/A'}</p>
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
    filterContainer.addEventListener('click', function(event) {
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
    filterForm.addEventListener('submit', function(event) {
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
