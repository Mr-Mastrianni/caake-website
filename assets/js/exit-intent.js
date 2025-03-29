/**
 * CAAKE Exit Intent Popup
 */

document.addEventListener('DOMContentLoaded', function() {
    const popupContainer = document.getElementById('exit-intent-popup');
    
    if (!popupContainer) {
        console.error('Exit intent popup container not found');
        return;
    }
    
    let popupShown = false;
    const cookieName = 'caake_exit_popup_shown';

    // Check if popup was shown recently (using session storage for simplicity, use cookies for persistence)
    if (sessionStorage.getItem(cookieName)) {
        return;
    }

    // Function to show the popup
    function showPopup() {
        if (popupShown) return;
        
        popupShown = true;
        
        // Set cookie/session storage
        sessionStorage.setItem(cookieName, 'true');
        
        // Populate popup content
        popupContainer.innerHTML = `
            <div class="popup-content">
                <button class="popup-close" aria-label="Close Popup">&times;</button>
                <h2>Wait! Before You Go...</h2>
                <p>Get our exclusive guide on <strong>'5 Ways AI Can Boost Your Business Efficiency'</strong> for FREE!</p>
                <form class="popup-form">
                    <input type="email" placeholder="Enter your email" required aria-label="Email address">
                    <button type="submit" class="btn btn-primary">Get Free Guide</button>
                </form>
                <p class="popup-small-text">We respect your privacy. Unsubscribe anytime.</p>
            </div>
        `;
        
        popupContainer.style.display = 'flex';
        
        // Add animation
        setTimeout(() => {
            popupContainer.classList.add('visible');
        }, 10);

        // Handle close button
        const closeButton = popupContainer.querySelector('.popup-close');
        closeButton.addEventListener('click', hidePopup);
        
        // Handle form submission
        const form = popupContainer.querySelector('.popup-form');
        form.addEventListener('submit', handleFormSubmit);
    }

    // Function to hide the popup
    function hidePopup() {
        popupContainer.classList.remove('visible');
        
        setTimeout(() => {
            popupContainer.style.display = 'none';
        }, 300); // Wait for animation
    }

    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();
        const emailInput = popupContainer.querySelector('input[type="email"]');
        const submitButton = popupContainer.querySelector('button[type="submit"]');
        
        // Basic validation
        if (!emailInput.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Simulate submission
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        console.log('Simulating signup for:', emailInput.value);
        
        setTimeout(() => {
            // Show thank you message
            const content = popupContainer.querySelector('.popup-content');
            content.innerHTML = `
                <button class="popup-close" aria-label="Close Popup">&times;</button>
                <h2>Thank You!</h2>
                <p>Your free guide is on its way to your inbox.</p>
            `;
            
            // Re-add close functionality
            const closeButton = popupContainer.querySelector('.popup-close');
            closeButton.addEventListener('click', hidePopup);
            
            // Optionally auto-close after a few seconds
            setTimeout(hidePopup, 3000);
            
        }, 1500);
    }

    // Exit intent detection
    document.addEventListener('mouseout', function(e) {
        // If the mouse leaves the viewport top area
        if (e.clientY <= 0 && !popupShown) {
            // Add some buffer to avoid triggering if mouse just brushes the top
            // Check if the movement is actually upwards (optional, but can help)
            if (e.relatedTarget == null) { // Mouse left the window entirely
                showPopup();
            }
        }
    });

    // Add a delay before enabling exit intent to avoid accidental triggering on load
    let exitIntentEnabled = false;
    setTimeout(() => {
        exitIntentEnabled = true;
        console.log('Exit intent popup enabled.');
    }, 5000); // Enable after 5 seconds

    // Modified exit intent detection that considers the enabled flag
    document.addEventListener('mouseout', function(e) {
        if (!exitIntentEnabled || popupShown) return;

        // Check if mouse leaves the viewport top edge
        if (e.clientY <= 0) {
           showPopup();
        }
    }, { passive: true }); // Use passive listener for performance

}); 