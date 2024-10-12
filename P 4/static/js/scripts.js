function toggleMenu() {
    var links = document.querySelector('.nav-links');
    links.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', () => {
    function updateTotalMotors() {
        fetch('/get-motors') // Update this path according to your API
            .then(response => response.json())
            .then(data => {
                const totalMotorsCount = document.getElementById('totalMotorsCount');
                totalMotorsCount.textContent = `${data.length}`; // Update the count
            })
            .catch(error => console.error('Error fetching total motors:', error));
    }

    updateTotalMotors(); // Call the function to load the data on page load
});

