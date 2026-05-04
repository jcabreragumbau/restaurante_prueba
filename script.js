// 1. The Translation Dictionary
const translations = {
    en: {
        // Navigation & Footer
        nav_home: "Home",
        nav_menu: "Menu",
        nav_location: "Location",
        nav_book: "Book a Table",
        footer_text: "© 2026 Restaurante Prueba. All rights reserved.",
        
        // Homepage
        hero_title: "Welcome to Restaurante Prueba",
        hero_subtitle: "Experience the finest culinary delights in a cozy atmosphere.",
        hero_btn: "Reserve Now",
        book_title: "Book Your Table",
        book_subtitle: "Reserve your spot and we will send you a confirmation email.",
        form_name: "Full Name",
        form_email: "Email Address",
        form_date: "Date",
        form_time: "Time",
        form_time_select: "Select a time",
        form_guests: "Number of Guests",
        form_btn: "Confirm Booking",

        // Menu Page
        menu_title: "Our Menu",
        menu_subtitle: "Discover our carefully crafted dishes",
        cat_starters: "Starters",
        item_bruschetta: "Garlic Bruschetta",
        desc_bruschetta: "Toasted bread with tomatoes, garlic, and fresh basil.",
        item_calamari: "Crispy Calamari",
        desc_calamari: "Served with our homemade tartar sauce.",
        cat_mains: "Main Courses",
        item_salmon: "Grilled Salmon",
        desc_salmon: "Wild-caught salmon with asparagus and lemon butter.",
        item_risotto: "Truffle Mushroom Risotto",
        desc_risotto: "Creamy arborio rice with wild mushrooms and parmesan.",

        // Location Page
        loc_title: "Find Us",
        loc_subtitle: "Come visit our restaurant in the heart of the city.",
        loc_address_lbl: "Address:",
        loc_address_val: "123 Culinary Street, Food District, City 10001",
        loc_phone_lbl: "Phone:",
        loc_email_lbl: "Email:",
        loc_hours_title: "Opening Hours",
        loc_hours_val1: "Tuesday - Sunday: 12:00 - 15:30 & 19:30 - 23:00",
        loc_hours_val2: "Monday: Closed"
    },
    es: {
        // Navigation & Footer
        nav_home: "Inicio",
        nav_menu: "Menú",
        nav_location: "Ubicación",
        nav_book: "Reservar",
        footer_text: "© 2026 Restaurante Prueba. Todos los derechos reservados.",
        
        // Homepage
        hero_title: "Bienvenido a Restaurante Prueba",
        hero_subtitle: "Experimente las mejores delicias culinarias en un ambiente acogedor.",
        hero_btn: "Reservar Ahora",
        book_title: "Reserva Tu Mesa",
        book_subtitle: "Reserva tu lugar y te enviaremos un correo de confirmación.",
        form_name: "Nombre Completo",
        form_email: "Correo Electrónico",
        form_date: "Fecha",
        form_time: "Hora",
        form_time_select: "Selecciona una hora",
        form_guests: "Número de Personas",
        form_btn: "Confirmar Reserva",

        // Menu Page
        menu_title: "Nuestro Menú",
        menu_subtitle: "Descubra nuestros platos cuidadosamente elaborados",
        cat_starters: "Entrantes",
        item_bruschetta: "Bruschetta de Ajo",
        desc_bruschetta: "Pan tostado con tomate, ajo y albahaca fresca.",
        item_calamari: "Calamares Crujientes",
        desc_calamari: "Servidos con nuestra salsa tártara casera.",
        cat_mains: "Platos Principales",
        item_salmon: "Salmón a la Parrilla",
        desc_salmon: "Salmón salvaje con espárragos y mantequilla de limón.",
        item_risotto: "Risotto de Setas y Trufa",
        desc_risotto: "Cremoso arroz arborio con setas silvestres y parmesano.",

        // Location Page
        loc_title: "Encuéntrenos",
        loc_subtitle: "Venga a visitar nuestro restaurante en el corazón de la ciudad.",
        loc_address_lbl: "Dirección:",
        loc_address_val: "123 Calle Culinaria, Distrito Gastronómico, Ciudad 10001",
        loc_phone_lbl: "Teléfono:",
        loc_email_lbl: "Correo:",
        loc_hours_title: "Horario de Apertura",
        loc_hours_val1: "Martes - Domingo: 12:00 - 15:30 y 19:30 - 23:00",
        loc_hours_val2: "Lunes: Cerrado"
    }
};
// 2. The Language Switching Function
function setLanguage(languageCode) {
    // Find every element that has a 'data-i18n' attribute
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const translationKey = element.getAttribute('data-i18n');
        // Update the text to match the dictionary
        element.innerText = translations[languageCode][translationKey];
    });

    // Save the user's preference to their browser memory
    localStorage.setItem('preferredLanguage', languageCode);
    document.getElementById('language-selector').value = languageCode;
}

// 3. Event Listener for the Dropdown
document.getElementById('language-selector').addEventListener('change', function(event) {
    setLanguage(event.target.value);
});

// 4. On Page Load: Check if they already picked a language previously
document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en'; // Default to English
    setLanguage(savedLanguage);
});

// Paste the URL you got from Google Apps Script here
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxgcF4vfc210i8m1z4Y13GnXjt9Pe6qbEo0GVlOHBJfxYTEvWE5a9jV2VX57gp0VLKJLA/exec'; 
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
