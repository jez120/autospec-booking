import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyDCKszurqk3GwAjAHBkMa-607dKuuSuv4",
    authDomain: "autospec-booking-form.firebaseapp.com",
    projectId: "autospec-booking-form",
    storageBucket: "autospec-booking-form.appspot.com",
    messagingSenderId: "304519910858",
    appId: "1:304519910858:web:1a01b1913f6346c2930b33"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('bookingForm');
    const submitBtn = document.getElementById('submitBtn');
    const buttonText = document.getElementById('buttonText');
    const buttonSpinner = document.getElementById('buttonSpinner');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = errorMessage?.querySelector('span');
    
    if (bookingForm && submitBtn && buttonText && buttonSpinner && successMessage && errorMessage && errorText) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Hide feedback messages
            successMessage.classList.add('hidden');
            errorMessage.classList.add('hidden');
            successMessage.style.opacity = '0';
            errorMessage.style.opacity = '0';
            
            // --- VALIDATION ---
            const formData = new FormData(bookingForm);
            const fullName = formData.get('fullName')?.toString().trim();
            const email = formData.get('email')?.toString().trim();
            const reg = formData.get('reg')?.toString().trim();
            const preferredDate = formData.get('preferredDate')?.toString();
            const consent = formData.get('consent') === 'on';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!fullName || !email || !reg || !preferredDate || !consent) {
                errorText.textContent = 'Please make sure all required fields are filled out.';
                errorMessage.classList.remove('hidden');
                setTimeout(() => errorMessage.style.opacity = '1', 10);
                return;
            }

            if (!emailRegex.test(email)) {
                errorText.textContent = 'Please enter a valid email address.';
                errorMessage.classList.remove('hidden');
                setTimeout(() => errorMessage.style.opacity = '1', 10);
                return;
            }


            // Start loading state
            submitBtn.disabled = true;
            buttonText.classList.add('hidden');
            buttonSpinner.classList.remove('hidden');
            
            const data = Object.fromEntries(formData.entries());

            try {
                await addDoc(collection(db, "bookings"), {
                    fullName: data.fullName || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    reg: data.reg || "",
                    preferredDate: data.preferredDate || "",
                    motDue: data.motDue || "",
                    details: data.details || "",
                    consent: data.consent === 'on', // Checkbox value is 'on' when checked
                    createdAt: serverTimestamp(),
                    status: 'New', // Add a status field for tracking
                });
                
                successMessage.classList.remove('hidden');
                setTimeout(() => successMessage.style.opacity = '1', 10);
                bookingForm.reset();

                // Auto-hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.opacity = '0';
                    setTimeout(() => successMessage.classList.add('hidden'), 300);
                }, 5000);

            } catch (err) {
                console.error("Error adding document: ", err);
                errorText.textContent = 'Sorry, something went wrong. Please try again.';
                errorMessage.classList.remove('hidden');
                setTimeout(() => errorMessage.style.opacity = '1', 10);

            } finally {
                // End loading state
                submitBtn.disabled = false;
                buttonText.classList.remove('hidden');
                buttonSpinner.classList.add('hidden');
            }
        });
    } else {
        console.error("A critical form element could not be found. Form submission will not work.");
    }
});