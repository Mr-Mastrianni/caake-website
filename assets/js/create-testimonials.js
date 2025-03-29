/**
 * Script to generate placeholder testimonial images
 * Run this in the browser to generate and save placeholders
 */
document.addEventListener('DOMContentLoaded', function() {
    // Create a container for our placeholders
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '20px';
    container.style.padding = '20px';
    document.body.appendChild(container);
    
    // Names and colors for testimonials
    const testimonials = [
        { name: 'Sarah Miller', color: '#0066cc', initials: 'SM' },
        { name: 'John Peterson', color: '#4CAF50', initials: 'JP' },
        { name: 'Alex Johnson', color: '#FFC107', initials: 'AJ' }
    ];
    
    // Generate each placeholder
    testimonials.forEach(person => {
        // Create wrapper with name
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';
        
        // Create heading with name
        const heading = document.createElement('h3');
        heading.textContent = person.name;
        wrapper.appendChild(heading);
        
        // Create canvas for the placeholder
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 120;
        canvas.style.borderRadius = '60px';
        canvas.style.marginBottom = '10px';
        
        // Draw the placeholder
        const ctx = canvas.getContext('2d');
        
        // Draw background
        ctx.fillStyle = person.color;
        ctx.fillRect(0, 0, 120, 120);
        
        // Draw initials
        ctx.fillStyle = 'white';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(person.initials, 60, 60);
        
        wrapper.appendChild(canvas);
        
        // Create download button
        const button = document.createElement('button');
        button.textContent = `Download ${person.name.split(' ')[0]} Image`;
        button.style.marginTop = '10px';
        button.style.padding = '8px 16px';
        button.style.backgroundColor = '#333';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        
        button.addEventListener('click', function() {
            const link = document.createElement('a');
            link.download = `testimonial-${person.name.split(' ')[0].toLowerCase()}.jpg`;
            link.href = canvas.toDataURL('image/jpeg', 0.8);
            link.click();
        });
        
        wrapper.appendChild(button);
        container.appendChild(wrapper);
    });
    
    // Instructions
    const instructions = document.createElement('p');
    instructions.innerHTML = 'Click each button to download the placeholder images.<br>Then move them to your <code>assets/images/testimonials</code> folder.';
    instructions.style.marginTop = '20px';
    container.appendChild(instructions);
}); 