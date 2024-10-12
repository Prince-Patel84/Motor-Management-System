document.addEventListener('DOMContentLoaded', () => {
    const motorCards = document.getElementById('motorCards');
    const filterForm = document.getElementById('filterForm');

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
                } else {
                    motorCards.innerHTML = '<p>No motors found.</p>';
                }
            })
            .catch(error => console.error('Error loading motors:', error));
    }

    // Load motors on page load
    loadMotors();

    // Apply filters on form submit
    filterForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(filterForm);
        const filters = Object.fromEntries(formData.entries());
        loadMotors(filters);
    });
});
