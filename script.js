// Paste the URL you got from Google Apps Script here
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxdZHR0oXN3ScA5E_wXH2k-x_CJC0YOiGJQHY9h6WsIxuWuBWtLq708GMXj2R50xTid/exec'; 
const PEOPLE_PER_TABLE = 3;

document.getElementById('booking-form').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const submitBtn = document.getElementById('submit-btn');
    const formMessage = document.getElementById('form-message');
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const guests = parseInt(document.getElementById('guests').value);
    
    // --- MONDAY CHECK ---
    // We add "T12:00:00" to ensure timezones don't accidentally shift the day backwards
    const selectedDateObject = new Date(date + "T12:00:00");
    const dayOfWeek = selectedDateObject.getDay(); // 0 = Sunday, 1 = Monday, 2 = Tuesday, etc.

    if (dayOfWeek === 1) {
        formMessage.style.color = '#e74c3c';
        formMessage.innerText = 'Sorry! The restaurant is closed on Mondays. Please select another day.';
        return; // Stops the function immediately
    }

    // Calculate tables needed based on 3 people per table
    const tablesNeeded = Math.ceil(guests / PEOPLE_PER_TABLE);

    submitBtn.innerText = 'Checking availability...';
    submitBtn.disabled = true;

    try {
        // 1. ASK GOOGLE SHEET FOR AVAILABILITY
        const response = await fetch(`${GOOGLE_SHEET_URL}?date=${date}&time=${time}`);
        const data = await response.json();
        
        if (tablesNeeded > data.available) {
            formMessage.style.color = '#e74c3c';
            formMessage.innerText = `Sorry! We do not have enough tables left on ${date} at ${time}.`;
            submitBtn.innerText = 'Confirm Booking';
            submitBtn.disabled = false;
            return; // Stop here, don't send the email
        }

        // 2. IF AVAILABLE, SAVE TO GOOGLE SHEET
        submitBtn.innerText = 'Securing Table...';
        await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            body: JSON.stringify({
                date: date,
                time: time,
                name: name,
                guests: guests,
                tablesNeeded: tablesNeeded
            })
        });

        // 3. FINALLY, SEND THE CONFIRMATION EMAIL
        submitBtn.innerText = 'Sending Email...';
        const templateParams = { 
            name: name, 
            email: email, 
            date: date, 
            time: time, 
            guests: guests, 
            restaurant_name: "Restaurante Prueba" 
        };
        
        // Using your exact EmailJS credentials
        await emailjs.send('STLIZE_service', 'template_hhmf1wu', templateParams, '7IsyP95cxD43-8Jcl');

        // Success!
        console.log('SUCCESS!');
        formMessage.style.color = '#27ae60';
        formMessage.innerText = `Booking confirmed! We reserved ${tablesNeeded} table(s) for you. Check your email.`;
        document.getElementById('booking-form').reset();

    } catch (error) {
        console.error('FAILED...', error);
        formMessage.style.color = '#e74c3c';
        formMessage.innerText = 'Oops! A network error occurred. Please try again.';
    } finally {
        // Reset the button state
        submitBtn.innerText = 'Confirm Booking';
        submitBtn.disabled = false;
    }
});
