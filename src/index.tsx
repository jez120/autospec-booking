import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { db } from './firebaseConfig'; // Make sure this path is correct
import { collection, addDoc } from "firebase/firestore";
import './style.css'; // Your global styles

const App = () => {
    // A single state object to hold all form data
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        reg: '',
        preferredDate: '',
        motDue: '',
        details: '',
        consent: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' }); // For success/error messages

    // Handles changes for all text inputs and textareas
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Special handler for the checkbox
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, consent: e.target.checked }));
    };

    // Special handler for the registration input to make it uppercase
    const handleRegChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, reg: e.target.value.toUpperCase() }));
    };

    // Handles the form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fullName || !formData.email || !formData.reg || !formData.preferredDate || !formData.consent) {
            setFeedback({ type: 'error', message: 'Please fill in all required fields.' });
            return;
        }

        setIsLoading(true);
        setFeedback({ type: '', message: '' });

        try {
            await addDoc(collection(db, "bookings"), {
                ...formData,
                bookingTimestamp: new Date(),
            });
            setFeedback({ type: 'success', message: 'Thank you! Your booking request has been sent.' });
            // Reset form after successful submission
            setFormData({
                fullName: '', email: '', phone: '', reg: '', preferredDate: '', motDue: '', details: '', consent: false,
            });
        } catch (error) {
            console.error("Error submitting booking: ", error);
            setFeedback({ type: 'error', message: 'Sorry, something went wrong. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <section className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl p-6 sm:p-8">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-4">
                        <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">Auto Spec Booking</h1>
                    <p className="text-base text-gray-500 dark:text-gray-400 mb-8">Request a slot and we'll be in touch to confirm.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    {/* All form fields are now controlled by React state */}
                    <input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full name" required className="w-full rounded-lg border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 p-3 pl-10 text-sm text-gray-900 dark:text-gray-200 focus:border-blue-500 focus:ring-blue-500" />
                    <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required className="w-full rounded-lg border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 p-3 pl-10 text-sm text-gray-900 dark:text-gray-200 focus:border-blue-500 focus:ring-blue-500" />
                    <input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="Phone (optional)" className="w-full rounded-lg border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 p-3 pl-10 text-sm text-gray-900 dark:text-gray-200 focus:border-blue-500 focus:ring-blue-500" />
                    <input name="reg" value={formData.reg} onChange={handleRegChange} placeholder="Vehicle Reg (e.g., BD10 SVS)" required className="w-full rounded-lg border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 p-3 pl-10 text-sm text-gray-900 dark:text-gray-200 uppercase focus:border-blue-500 focus:ring-blue-500" />
                    <input name="preferredDate" type="date" value={formData.preferredDate} onChange={handleInputChange} required className="mt-1 w-full rounded-lg border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 p-3 text-sm text-gray-900 dark:text-gray-200 focus:border-blue-500 focus:ring-blue-500" />
                    <input name="motDue" type="date" value={formData.motDue} onChange={handleInputChange} className="mt-1 w-full rounded-lg border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 p-3 text-sm text-gray-900 dark:text-gray-200 focus:border-blue-500 focus:ring-blue-500" />
                    <textarea name="details" value={formData.details} onChange={handleInputChange} rows={3} placeholder="Tell us what you need…" className="w-full rounded-lg border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 p-3 text-sm text-gray-900 dark:text-gray-200 focus:border-blue-500 focus:ring-blue-500"></textarea>

                    <div className="flex items-start gap-3 pt-2">
                        <input type="checkbox" name="consent" id="consent" checked={formData.consent} onChange={handleCheckboxChange} required className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <label htmlFor="consent" className="font-medium text-gray-700 dark:text-gray-300">I agree to be contacted about my booking and reminders.</label>
                    </div>

                    {/* Feedback Messages */}
                    {feedback.type === 'success' && (
                        <div className="!mt-6 p-4 bg-green-100 text-green-800 rounded-lg"><span>{feedback.message}</span></div>
                    )}
                    {feedback.type === 'error' && (
                        <div className="!mt-6 p-4 bg-red-100 text-red-800 rounded-lg"><span>{feedback.message}</span></div>
                    )}

                    <button type="submit" disabled={isLoading} className="!mt-8 w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 text-sm hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 disabled:cursor-not-allowed flex items-center justify-center">
                        {isLoading ? 'Sending...' : 'Send booking'}
                    </button>
                </form>
            </section>
        </main>
    );
};

// Find the root element and render the App
const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error("Fatal Error: The root element with id 'root' was not found in the DOM.");
}
