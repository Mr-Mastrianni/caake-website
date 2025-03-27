// CAAKE AI Strategy Assessment JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const form = document.getElementById('ai-assessment-form');
    const questions = document.querySelectorAll('.question-slide');
    const nextButtons = document.querySelectorAll('.next-btn');
    const backButtons = document.querySelectorAll('.back-btn');
    const submitButton = document.getElementById('submit-assessment');
    const progressSteps = document.querySelectorAll('.progress-step');
    const currentStepIndicator = document.getElementById('current-step');
    const resultsSection = document.getElementById('assessment-results');
    const keyFindings = document.getElementById('key-findings');
    const recommendations = document.getElementById('recommendations');
    const emailResultsButton = document.getElementById('email-results');
    
    // Current question index
    let currentQuestion = 0;
    
    // Initialize form
    function initForm() {
        // Hide all questions except the first one
        questions.forEach((question, index) => {
            if (index !== 0) {
                question.classList.remove('active');
            }
        });
        
        // Add event listeners to next buttons
        nextButtons.forEach(button => {
            button.addEventListener('click', nextQuestion);
        });
        
        // Add event listeners to back buttons
        backButtons.forEach(button => {
            button.addEventListener('click', previousQuestion);
        });
        
        // Add event listener to submit button
        if (submitButton) {
            submitButton.addEventListener('click', submitAssessment);
        }
        
        // Add event listener to email results button
        if (emailResultsButton) {
            emailResultsButton.addEventListener('click', emailResults);
        }
        
        // Add event listeners to "Other" checkboxes and radio buttons
        addOtherInputListeners();
        
        // Add event listener to consultation button
        document.querySelectorAll('.result-cta a[href*="contact.html"]').forEach(link => {
            link.addEventListener('click', unblurResults);
        });
        
        // Update progress bar
        updateProgress(0);
    }
    
    // Function to reveal all blurred items
    function unblurResults(e) {
        // Don't prevent default as we want the user to go to the contact page
        
        // Remove blur from all blurred items
        document.querySelectorAll('.blur-item').forEach(item => {
            item.classList.remove('blur-item');
        });
        
        // Remove blur notices
        document.querySelectorAll('.blur-notice').forEach(notice => {
            notice.style.display = 'none';
        });
        
        // Store in localStorage that the user has seen the full results
        localStorage.setItem('caake_assessment_unlocked', 'true');
        
        // Note: We're not preventing default, so the user will still navigate to the contact page
    }
    
    // Function to handle "Other" input fields
    function addOtherInputListeners() {
        // For checkboxes with "Other" option
        const otherCheckboxes = document.querySelectorAll('input[type="checkbox"][id$="other"]');
        otherCheckboxes.forEach(checkbox => {
            const textInput = document.getElementById(checkbox.id + '-text');
            if (textInput) {
                // Enable/disable text input based on checkbox state
                checkbox.addEventListener('change', function() {
                    textInput.disabled = !this.checked;
                    if (this.checked) {
                        textInput.focus();
                    }
                });
                
                // Initially disable text input
                textInput.disabled = !checkbox.checked;
            }
        });
        
        // For radio buttons with "Other" option
        const otherRadios = document.querySelectorAll('input[type="radio"][id$="other"]');
        otherRadios.forEach(radio => {
            const textInput = document.getElementById(radio.id + '-text');
            if (textInput) {
                // Enable/disable text input based on radio state
                radio.addEventListener('change', function() {
                    textInput.disabled = !this.checked;
                    if (this.checked) {
                        textInput.focus();
                    }
                });
                
                // Check all radios with the same name and disable text input if needed
                const radios = document.querySelectorAll(`input[type="radio"][name="${radio.name}"]`);
                radios.forEach(r => {
                    r.addEventListener('change', function() {
                        if (r !== radio) {
                            textInput.disabled = true;
                        }
                    });
                });
                
                // Initially disable text input
                textInput.disabled = !radio.checked;
            }
        });
    }
    
    // Function to go to the next question
    function nextQuestion() {
        // Validate current question
        if (!validateQuestion(currentQuestion)) {
            return;
        }
        
        // Hide current question
        questions[currentQuestion].classList.remove('active');
        
        // Go to next question
        currentQuestion++;
        
        // Show next question
        questions[currentQuestion].classList.add('active');
        
        // Update progress
        updateProgress(currentQuestion);
        
        // Scroll to top of question
        scrollToQuestion();
    }
    
    // Function to go to the previous question
    function previousQuestion() {
        // Hide current question
        questions[currentQuestion].classList.remove('active');
        
        // Go to previous question
        currentQuestion--;
        
        // Show previous question
        questions[currentQuestion].classList.add('active');
        
        // Update progress
        updateProgress(currentQuestion);
        
        // Scroll to top of question
        scrollToQuestion();
    }
    
    // Function to validate the current question
    function validateQuestion(questionIndex) {
        const question = questions[questionIndex];
        
        // Skip validation for the results slide
        if (question.id === 'assessment-results') {
            return true;
        }
        
        // Check if any option is selected
        let isValid = false;
        
        // For radio buttons (single choice questions)
        if (question.querySelectorAll('input[type="radio"]').length > 0) {
            const radioName = question.querySelector('input[type="radio"]').getAttribute('name');
            isValid = question.querySelector(`input[name="${radioName}"]:checked`) !== null;
        }
        
        // For checkboxes (multiple choice questions)
        if (question.querySelectorAll('input[type="checkbox"]').length > 0) {
            isValid = question.querySelector('input[type="checkbox"]:checked') !== null;
        }
        
        // If no option is selected, show error
        if (!isValid) {
            showError(question, 'Please select at least one option.');
            return false;
        }
        
        // Check if "Other" option is selected but no text is provided
        const otherChecked = question.querySelector('input[id$="other"]:checked');
        if (otherChecked) {
            const otherText = document.getElementById(otherChecked.id + '-text');
            if (otherText && otherText.value.trim() === '') {
                showError(question, 'Please specify "Other" option.');
                otherText.focus();
                return false;
            }
        }
        
        // Remove error message if validation passes
        removeError(question);
        return true;
    }
    
    // Function to show error message
    function showError(question, message) {
        // Remove existing error message
        removeError(question);
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = 'red';
        errorElement.style.marginTop = '10px';
        
        // Add error message to the navigation buttons section
        const navButtons = question.querySelector('.navigation-buttons');
        navButtons.insertBefore(errorElement, navButtons.firstChild);
    }
    
    // Function to remove error message
    function removeError(question) {
        const errorElement = question.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    // Function to update progress
    function updateProgress(step) {
        // Update progress steps
        progressSteps.forEach((progressStep, index) => {
            if (index <= step) {
                progressStep.classList.add('active');
            } else {
                progressStep.classList.remove('active');
            }
        });
        
        // Update step text
        if (currentStepIndicator) {
            currentStepIndicator.textContent = step + 1;
        }
    }
    
    // Function to scroll to the top of the current question
    function scrollToQuestion() {
        const questionTop = questions[currentQuestion].getBoundingClientRect().top;
        const offset = window.pageYOffset;
        const navHeight = document.querySelector('.navbar').offsetHeight;
        
        window.scrollTo({
            top: offset + questionTop - navHeight - 20,
            behavior: 'smooth'
        });
    }
    
    // Function to submit the assessment
    function submitAssessment() {
        // Validate the last question
        if (!validateQuestion(currentQuestion)) {
            return;
        }
        
        // Collect all form data
        const formData = collectFormData();
        
        // Generate results
        generateResults(formData);
        
        // Hide current question
        questions[currentQuestion].classList.remove('active');
        
        // Show results
        resultsSection.classList.add('active');
        
        // Check if the user has previously unlocked results
        const resultsUnlocked = localStorage.getItem('caake_assessment_unlocked') === 'true';
        if (resultsUnlocked) {
            // Unblur all items if the user has previously unlocked results
            document.querySelectorAll('.blur-item').forEach(item => {
                item.classList.remove('blur-item');
            });
            document.querySelectorAll('.blur-notice').forEach(notice => {
                notice.style.display = 'none';
            });
        }
        
        // Scroll to top of results
        scrollToQuestion();
    }
    
    // Function to collect all form data
    function collectFormData() {
        const formData = {
            roles: getSelectedValues('roles'),
            painPoints: getSelectedValues('pain-points'),
            scalingChallenges: getSelectedValues('scaling-challenges'),
            repetitiveTasks: getSelectedValues('repetitive-tasks'),
            aiReadiness: getRadioValue('ai-readiness'),
            businessGoals: getSelectedValues('business-goals'),
            biggestIssue: getRadioValue('biggest-issue')
        };
        
        return formData;
    }
    
    // Function to get selected values for checkboxes
    function getSelectedValues(name) {
        const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
        const values = Array.from(checkboxes).map(checkbox => {
            if (checkbox.value === 'Other') {
                const otherText = document.getElementById(checkbox.id + '-text');
                return otherText.value.trim() ? `Other: ${otherText.value.trim()}` : 'Other';
            }
            return checkbox.value;
        });
        
        return values;
    }
    
    // Function to get selected radio value
    function getRadioValue(name) {
        const radio = document.querySelector(`input[name="${name}"]:checked`);
        if (!radio) return '';
        
        if (radio.value === 'Other') {
            const otherText = document.getElementById(radio.id + '-text');
            return otherText.value.trim() ? `Other: ${otherText.value.trim()}` : 'Other';
        }
        
        return radio.value;
    }
    
    // Function to generate assessment results
    function generateResults(formData) {
        // Clear existing results
        keyFindings.innerHTML = '';
        recommendations.innerHTML = '';
        
        // Generate key findings
        generateKeyFindings(formData);
        
        // Generate recommendations
        generateRecommendations(formData);
    }
    
    // Function to generate key findings
    function generateKeyFindings(formData) {
        const findings = [];
        
        // Add finding about roles
        if (formData.roles.length > 0) {
            findings.push({
                html: `<strong>Roles for AI Support:</strong> Your ${formData.roles.join(', ')} could benefit from AI support.`,
                blur: false
            });
        }
        
        // Add finding about pain points
        if (formData.painPoints.length > 0) {
            findings.push({
                html: `<strong>Process Pain Points:</strong> Your team is experiencing frustration with ${formData.painPoints.join(', ')}.`,
                blur: false
            });
        }
        
        // Add finding about scaling challenges
        if (formData.scalingChallenges.length > 0) {
            findings.push({
                html: `<strong>Scaling Challenges:</strong> Your ${formData.scalingChallenges.join(', ')} department(s) are struggling to scale operations.`,
                blur: true
            });
        }
        
        // Add finding about repetitive tasks
        if (formData.repetitiveTasks.length > 0) {
            findings.push({
                html: `<strong>Repetitive Tasks:</strong> Your employees are spending time on repetitive tasks like ${formData.repetitiveTasks.join(', ')}.`,
                blur: false
            });
        }
        
        // Add finding about AI readiness
        if (formData.aiReadiness) {
            findings.push({
                html: `<strong>AI Readiness:</strong> Your organization is currently at the "${formData.aiReadiness}" stage.`,
                blur: true
            });
        }
        
        // Add finding about business goals
        if (formData.businessGoals.length > 0) {
            findings.push({
                html: `<strong>Business Goals:</strong> Your primary goals for AI adoption are ${formData.businessGoals.join(', ')}.`,
                blur: true
            });
        }
        
        // Add finding about biggest issue
        if (formData.biggestIssue) {
            findings.push({
                html: `<strong>Biggest Issue:</strong> The most pressing challenge your company faces is "${formData.biggestIssue}".`,
                blur: false
            });
        }
        
        // Add all findings to the list
        findings.forEach(finding => {
            const findingElement = document.createElement('li');
            findingElement.innerHTML = finding.html;
            
            if (finding.blur) {
                findingElement.classList.add('blur-item');
            }
            
            keyFindings.appendChild(findingElement);
        });
        
        // Add blur notice if there are blurred items
        if (findings.some(finding => finding.blur)) {
            const blurNotice = document.createElement('div');
            blurNotice.className = 'blur-notice';
            blurNotice.innerHTML = '<strong>Note:</strong> Some findings are blurred. Schedule a consultation to unlock the complete assessment results.';
            keyFindings.parentNode.appendChild(blurNotice);
        }
    }
    
    // Function to generate recommendations
    function generateRecommendations(formData) {
        const recs = [];
        
        // Recommendation based on roles and pain points
        if (formData.roles.includes('Customer Service Representatives') || 
            formData.painPoints.includes('Customer support response times')) {
            recs.push({
                html: `<strong>Implement AI Chatbots:</strong> To improve customer support response times and assist your customer service representatives.`,
                blur: false
            });
        }
        
        // Recommendation based on repetitive tasks
        if (formData.repetitiveTasks.includes('Data collection and organization') || 
            formData.repetitiveTasks.includes('Email sorting and responses')) {
            recs.push({
                html: `<strong>Deploy AI Assistants:</strong> To automate repetitive tasks like ${
                    formData.repetitiveTasks.includes('Data collection and organization') ? 'data collection' : 'email management'
                }, freeing up your team for higher-value work.`,
                blur: false
            });
        }
        
        // Recommendation based on scaling challenges
        if (formData.scalingChallenges.length > 0) {
            recs.push({
                html: `<strong>Explore AI-Driven Scaling Solutions:</strong> For your ${formData.scalingChallenges.join(', ')} department(s) to handle increased workload without proportional staff increases.`,
                blur: true
            });
        }
        
        // Recommendation based on AI readiness
        if (formData.aiReadiness) {
            let readinessHtml = '';
            
            if (formData.aiReadiness.includes('Not ready')) {
                readinessHtml = `<strong>Begin with AI Education:</strong> Schedule an AI fundamentals workshop for your leadership team to build understanding and identify initial use cases.`;
            } else if (formData.aiReadiness.includes('Somewhat ready')) {
                readinessHtml = `<strong>Conduct AI Readiness Assessment:</strong> Work with our consultants to develop a comprehensive AI roadmap tailored to your business needs.`;
            } else if (formData.aiReadiness.includes('Ready')) {
                readinessHtml = `<strong>Pilot AI Implementation:</strong> Start with a focused AI project in a high-impact area to demonstrate value and build momentum.`;
            } else if (formData.aiReadiness.includes('Already using')) {
                readinessHtml = `<strong>Optimize Existing AI Solutions:</strong> Let our experts review your current AI implementations and identify opportunities for enhancement and expansion.`;
            }
            
            recs.push({
                html: readinessHtml,
                blur: true
            });
        }
        
        // Recommendation based on biggest issue
        if (formData.biggestIssue) {
            let issueHtml = '';
            
            if (formData.biggestIssue.includes('High operational costs')) {
                issueHtml = `<strong>Cost Reduction Strategy:</strong> Our AI automation solutions can help reduce operational costs by streamlining processes and reducing manual effort.`;
            } else if (formData.biggestIssue.includes('Lack of scalability')) {
                issueHtml = `<strong>Scalability Enhancement:</strong> Our AI agents and solutions can help your business scale operations without proportionally increasing headcount or costs.`;
            } else if (formData.biggestIssue.includes('Inefficient processes')) {
                issueHtml = `<strong>Process Optimization:</strong> Our AI consultants can identify inefficiencies and implement automation solutions to streamline your workflows.`;
            } else if (formData.biggestIssue.includes('Poor customer satisfaction')) {
                issueHtml = `<strong>Customer Experience Enhancement:</strong> Our AI chatbots and virtual assistants can provide 24/7 support and personalized experiences to improve customer satisfaction.`;
            } else if (formData.biggestIssue.includes('Difficulty retaining talent')) {
                issueHtml = `<strong>Employee Experience Improvement:</strong> Our AI assistants can help reduce mundane tasks, allowing your team to focus on meaningful work that increases job satisfaction and retention.`;
            } else {
                issueHtml = `<strong>Custom Solution:</strong> Based on your unique challenge, our team would like to schedule a consultation to discuss tailored AI solutions for your specific needs.`;
            }
            
            recs.push({
                html: issueHtml,
                blur: false
            });
        }
        
        // Add general recommendation
        recs.push({
            html: `<strong>Schedule AI Strategy Consultation:</strong> Meet with our AI specialists to discuss these findings in detail and develop a comprehensive plan for your organization.`,
            blur: false
        });
        
        // Add all recommendations to the list
        recs.forEach(rec => {
            const recElement = document.createElement('li');
            recElement.innerHTML = rec.html;
            
            if (rec.blur) {
                recElement.classList.add('blur-item');
            }
            
            recommendations.appendChild(recElement);
        });
        
        // Add blur notice if there are blurred items
        if (recs.some(rec => rec.blur)) {
            const blurNotice = document.createElement('div');
            blurNotice.className = 'blur-notice';
            blurNotice.innerHTML = '<strong>Note:</strong> Some recommendations are blurred. Schedule a consultation to unlock the complete assessment results.';
            recommendations.parentNode.appendChild(blurNotice);
        }
    }
    
    // Function to handle sending results by email
    function emailResults() {
        const emailForm = document.createElement('div');
        emailForm.className = 'email-form';
        emailForm.innerHTML = `
            <h3>Enter your email to receive your assessment results</h3>
            <div class="form-group">
                <input type="email" id="email-input" placeholder="Your email address" required>
                <button type="button" id="send-email" class="btn btn-primary">Send</button>
                <button type="button" id="cancel-email" class="btn btn-secondary">Cancel</button>
            </div>
        `;
        
        // Add form after the CTA buttons
        const ctaButtons = document.querySelector('.result-cta .cta-buttons');
        ctaButtons.insertAdjacentElement('afterend', emailForm);
        
        // Hide the email button
        emailResultsButton.style.display = 'none';
        
        // Add event listeners
        document.getElementById('send-email').addEventListener('click', function() {
            const email = document.getElementById('email-input').value.trim();
            if (!email || !isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Simulate sending email
            alert(`Thank you! Your assessment results have been sent to ${email}.`);
            
            // Remove email form and show button again
            emailForm.remove();
            emailResultsButton.style.display = 'inline-block';
        });
        
        document.getElementById('cancel-email').addEventListener('click', function() {
            // Remove email form and show button again
            emailForm.remove();
            emailResultsButton.style.display = 'inline-block';
        });
        
        // Focus on email input
        document.getElementById('email-input').focus();
    }
    
    // Function to validate email
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Initialize the form
    initForm();
});