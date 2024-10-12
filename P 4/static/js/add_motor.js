document.addEventListener('DOMContentLoaded', () => {
    const propertyContainer = document.getElementById('propertyContainer');
    const addPropertyButton = document.getElementById('addProperty');
    let propertyCount = 0;

    // Define the available property keys
    const propertyKeys = [
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
    propertyContainer.addEventListener('click', function (event) {
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
    document.getElementById('addMotorForm').addEventListener('submit', function (event) {
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
                    alert('Motor added successfully!');
                    // Optionally, redirect or clear form
                    window.location.reload();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error adding motor.');
            });
    });
    loadMotors();
});

function toggleMenu() {
    var links = document.querySelector('.nav-links');
    links.classList.toggle('active');
}
