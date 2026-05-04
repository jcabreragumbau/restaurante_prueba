document.getElementById('booking-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const submitBtn = document.getElementById('submit-btn');
    const formMessage = document.getElementById('form-message');
    
    // Change button text while sending
    submitBtn.innerText = 'Sending Booking...';
    submitBtn.disabled = true;

    // These parameters must match the variables in your EmailJS template
    const templateParams = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        guests: document.getElementById('guests').value,
        restaurant_name: "Restaurante Prueba"
    };

    // Send the email using EmailJS
    // Parameter order: Service ID, Template ID, Template Params, PUBLIC KEY
    emailjs.send('STLIZE_service', 'template_hhmf1wu', templateParams, 'sKOTPUoUydoZPd-Uc')
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            formMessage.style.color = '#27ae60';
            formMessage.innerText = 'Booking confirmed! Check your email.';
            document.getElementById('booking-form').reset();
        }, function(error) {
            console.log('FAILED...', error);
            formMessage.style.color = '#e74c3c';
            formMessage.innerText = 'Oops! Something went wrong. Please try again.';
        })
        .finally(function() {
            submitBtn.innerText = 'Confirm Booking';
            submitBtn.disabled = false;
        });
});
