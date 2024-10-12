function toggleMenu() {
    var links = document.querySelector('.nav-links');
    links.classList.toggle('active');
}
document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/history')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.getElementById('history-table-body');
            tableBody.innerHTML = ''; // Clear existing content

            data.forEach(item => {
                const row = document.createElement('tr');

                const ohDateCell = document.createElement('td');
                ohDateCell.textContent = item["OH Date"];
                row.appendChild(ohDateCell);

                const descriptionCell = document.createElement('td');
                descriptionCell.textContent = item["Job Description"];
                row.appendChild(descriptionCell);

                const rPhaseCell = document.createElement('td');
                rPhaseCell.textContent = item.R;
                row.appendChild(rPhaseCell);

                const yPhaseCell = document.createElement('td');
                yPhaseCell.textContent = item.Y;
                row.appendChild(yPhaseCell);

                const bPhaseCell = document.createElement('td');
                bPhaseCell.textContent = item.B;
                row.appendChild(bPhaseCell);

                const locationCell = document.createElement('td');
                locationCell.textContent = item.Location;
                row.appendChild(locationCell);

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching history:', error));
});
