document.addEventListener('DOMContentLoaded', () => {
    const propertyContainer = document.getElementById('propertyContainer');
    const addPropertyButton = document.getElementById('addProperty');
    let propertyCount = 0;

    // Define the available property keys
    const propertyKeys = [
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
                            <button class="delete-card-button" data-id="${motor['Serial No.']}}">Delete</button>
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

    function createPropertyField(id) {
        const propertyGroup = document.createElement('div');
        propertyGroup.className = 'property-group';
        propertyGroup.dataset.id = id; // Set a data attribute for identifying the property
        const selectOptions = propertyKeys.map(key => `<option value="${key}">${key}</option>`).join('');
        propertyGroup.innerHTML = `
            <select name="propertyKey_${id}">
                <option value="" disabled selected>Select Property Key</option>
                ${selectOptions}
            </select>
            <input type="text" name="propertyValue_${id}" placeholder="Property Value">
            <button type="button" class="remove-property" data-id="${id}">Remove</button>
        `;
        propertyContainer.appendChild(propertyGroup);
        loadMotors();
    }

    // Remove property field
    function removeProperty(id) {
        const propertyGroup = document.querySelector(`.property-group[data-id='${id}']`);
        if (propertyGroup) {
            propertyContainer.removeChild(propertyGroup);
        }
        loadMotors();
    }

    // Handle remove property button clicks
    propertyContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-property')) {
            const id = event.target.dataset.id;
            removeProperty(id);
        }
        loadMotors();
    });

    // Add initial property field
    createPropertyField(++propertyCount);

    // Handle adding new property fields
    addPropertyButton.addEventListener('click', () => {
        createPropertyField(++propertyCount);
    });

    // Handle form submit
    document.getElementById('addMotorForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const motor = {};
        formData.forEach((value, key) => {
            if (key.startsWith('propertyValue_') && value) {
                const propertyKey = key.replace('propertyValue_', 'propertyKey_');
                const propertyName = formData.get(propertyKey);
                if (propertyName) {
                    motor[propertyName] = value;
                }
            }
        });

        fetch('/add-motor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(motor),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Motor added successfully!');
                // Optionally, redirect or clear form
                window.location.reload();
            } else {
                alert('Error adding motor.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error adding motor.');
        });
    });
    loadMotors();
});
