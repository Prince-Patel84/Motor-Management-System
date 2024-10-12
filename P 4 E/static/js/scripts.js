function toggleMenu() {
    var links = document.querySelector('.nav-links');
    links.classList.toggle('active');
}

// document.addEventListener('DOMContentLoaded', function () {
//     // Fetch motor stats
//     fetch('/stats')
//         .then(response => response.json())
//         .then(data => {
//             document.getElementById('total-motors').innerText = data.total_motors;
//             document.getElementById('maintenance-due').innerText = data.maintenance_due;
//             document.getElementById('last-serviced').innerText = data.last_serviced;
//         })
//         .catch(error => console.error('Error fetching stats:', error));
// });