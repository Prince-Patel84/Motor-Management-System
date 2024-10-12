document.addEventListener('DOMContentLoaded', () => {
    const addMotorForm = document.getElementById('addMotorForm');

    addMotorForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(addMotorForm);
        const data = Object.fromEntries(formData.entries());

        fetch('/add-motor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(() => {
            addMotorForm.reset();
            alert('Motor added successfully!');
        })
        .catch(error => console.error('Error adding motor:', error));
    });
});
