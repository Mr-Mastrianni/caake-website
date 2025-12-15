/**
 * Site Search Functionality for CAAKE website
 * This script implements a comprehensive search feature that crawls pages
 * and allows users to search site content.
 */

class SiteSearch {
    constructor(options = {}) {
        this.options = Object.assign({
            searchInputSelector: '#search-input',
            searchButtonSelector: '#search-button',
            searchResultsSelector: '#search-results',
            searchModalSelector: '#search-modal',
            searchToggleSelector: '.search-toggle',
            closeButtonSelector: '.search-close',
            indexUrl: '/search-index.json',
            minQueryLength: 2,
            maxResults: 10,
            highlightClass: 'search-highlight',
            debounceTime: 300
        }, options);
        
        this.searchData = null;
        this.isLoading = false;
        this.debounceTimer = null;
        
        this.init();
    }
    
    /**
     * Initialize the search functionality
     */
    init() {
        // Get DOM elements
        this.searchInput = document.querySelector(this.options.searchInputSelector);
        this.searchButton = document.querySelector(this.options.searchButtonSelector);
        this.searchResults = document.querySelector(this.options.searchResultsSelector);
        this.searchModal = document.querySelector(this.options.searchModalSelector);
        this.searchToggles = document.querySelectorAll(this.options.searchToggleSelector);
        this.closeButton = document.querySelector(this.options.closeButtonSelector);
        
        if (!this.searchInput || !this.searchResults) {
            console.error('Search elements not found on page');
            return;
        }
        
        // Load search index
        this.loadSearchData();
        
        // Set up event listeners
        this.searchInput.addEventListener('input', this.handleSearchInput.bind(this));
        
        if (this.searchButton) {
            this.searchButton.addEventListener('click', this.handleSearchClick.bind(this));
        }
        
        if (this.searchToggles.length > 0) {
            this.searchToggles.forEach(toggle => {
                toggle.addEventListener('click', this.openSearchModal.bind(this));
            });
        }
        
        if (this.closeButton && this.searchModal) {
            this.closeButton.addEventListener('click', this.closeSearchModal.bind(this));
        }
        
        // Close modal when clicking outside
        if (this.searchModal) {
            this.searchModal.addEventListener('click', (e) => {
                if (e.target === this.searchModal) {
                    this.closeSearchModal();
                }
            });
            
            // Close modal on escape key
            document.addEventListener('keyup', (e) => {
                if (e.key === 'Escape' && this.searchModal.classList.contains('active')) {
                    this.closeSearchModal();
                }
            });
        }
        
        // Handle form submission
        const searchForm = this.searchInput.closest('form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.search(this.searchInput.value);
            });
        }
    }
    
    /**
     * Load search data from the search index file
     */
    async loadSearchData() {
        try {
            this.isLoading = true;
            const response = await fetch(this.options.indexUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.searchData = await response.json();
            this.isLoading = false;
            
            // If there's a query in the URL, perform the search
            const urlParams = new URLSearchParams(window.location.search);
            const query = urlParams.get('q');
            if (query && this.searchInput) {
                this.searchInput.value = query;
                this.search(query);
            }
        } catch (error) {
            console.error('Error loading search data:', error);
            this.showError('Failed to load search data. Please try again later.');
            this.isLoading = false;
        }
    }
    
    /**
     * Handle input in the search field with debounce
     */
    handleSearchInput(e) {
        clearTimeout(this.debounceTimer);
        
        const query = e.target.value.trim();
        
        if (query.length === 0) {
            this.clearResults();
            return;
        }
        
        if (query.length < this.options.minQueryLength) {
            this.showMessage(`Please enter at least ${this.options.minQueryLength} characters to search`);
            return;
        }
        
        this.debounceTimer = setTimeout(() => {
            this.search(query);
        }, this.options.debounceTime);
    }
    
    /**
     * Handle clicking the search button
     */
    handleSearchClick() {
        const query = this.searchInput.value.trim();
        if (query.length >= this.options.minQueryLength) {
            this.search(query);
        }
    }
    
    /**
     * Perform search on the indexed data
     */
    search(query) {
        if (this.isLoading) {
            this.showMessage('Loading search data...');
            return;
        }
        
        if (!this.searchData) {
            this.showError('Search data not loaded. Please try again later.');
            return;
        }
        
        query = query.toLowerCase();
        
        // Update URL with search query
        const url = new URL(window.location);
        url.searchParams.set('q', query);
        window.history.replaceState({}, '', url);
        
        // Show loading state
        this.showMessage('Searching...');
        
        // Simulate a brief delay for better UX
        setTimeout(() => {
            // Perform the search
            const results = this.getSearchResults(query);
            
            if (results.length === 0) {
                this.showMessage(`No results found for "${query}"`);
                return;
            }
            
            this.displayResults(results, query);
        }, 300);
    }
    
    /**
     * Get search results for the query
     */
    getSearchResults(query) {
        const results = [];
        
        // Split query into words for better matching
        const queryWords = query.split(/\s+/).filter(word => word.length > 1);
        
        // Search each page in the index
        this.searchData.forEach(page => {
            let score = 0;
            
            // Check title
            if (page.title && page.title.toLowerCase().includes(query)) {
                score += 10;
            }
            
            // Check description
            if (page.description && page.description.toLowerCase().includes(query)) {
                score += 5;
            }
            
            // Check content
            if (page.content) {
                const content = page.content.toLowerCase();
                
                // Exact phrase match
                if (content.includes(query)) {
                    score += 3;
                    
                    // Boost score based on how many times the query appears
                    const occurrences = (content.match(new RegExp(query, 'g')) || []).length;
                    score += occurrences * 0.5;
                }
                
                // Individual word matches
                queryWords.forEach(word => {
                    if (content.includes(word)) {
                        score += 1;
                    }
                });
            }
            
            // Check categories and tags
            if (page.categories) {
                page.categories.forEach(category => {
                    if (category.toLowerCase().includes(query)) {
                        score += 2;
                    }
                });
            }
            
            if (page.tags) {
                page.tags.forEach(tag => {
                    if (tag.toLowerCase().includes(query)) {
                        score += 2;
                    }
                });
            }
            
            // If page has any relevance, add to results
            if (score > 0) {
                results.push({
                    ...page,
                    score
                });
            }
        });
        
        // Sort by relevance score
        results.sort((a, b) => b.score - a.score);
        
        // Limit number of results
        return results.slice(0, this.options.maxResults);
    }
    
    /**
     * Display search results
     */
    displayResults(results, query) {
        this.clearResults();
        
        const resultsList = document.createElement('ul');
        resultsList.className = 'search-results-list';
        
        results.forEach(result => {
            const item = document.createElement('li');
            item.className = 'search-result-item';
            
            const link = document.createElement('a');
            link.href = result.url;
            
            const title = document.createElement('h3');
            title.className = 'result-title';
            title.innerHTML = this.highlightText(result.title, query);
            
            const description = document.createElement('p');
            description.className = 'result-description';
            
            // Use description if available, otherwise extract from content
            if (result.description) {
                description.innerHTML = this.highlightText(this.truncateText(result.description, 150), query);
            } else if (result.content) {
                // Find a relevant excerpt from content that includes the query
                description.innerHTML = this.getRelevantExcerpt(result.content, query);
            }
            
            const categories = document.createElement('div');
            categories.className = 'result-categories';
            
            if (result.categories && result.categories.length > 0) {
                result.categories.forEach(category => {
                    const categoryTag = document.createElement('span');
                    categoryTag.className = 'result-category';
                    categoryTag.textContent = category;
                    categories.appendChild(categoryTag);
                });
            }
            
            link.appendChild(title);
            item.appendChild(link);
            item.appendChild(description);
            
            if (categories.childNodes.length > 0) {
                item.appendChild(categories);
            }
            
            resultsList.appendChild(item);
        });
        
        // Create header with result count
        const resultsHeader = document.createElement('div');
        resultsHeader.className = 'search-results-header';
        resultsHeader.innerHTML = `<h2>Search Results</h2><p>${results.length} ${results.length === 1 ? 'result' : 'results'} for "${query}"</p>`;
        
        this.searchResults.appendChild(resultsHeader);
        this.searchResults.appendChild(resultsList);
    }
    
    /**
     * Highlight search terms in text
     */
    highlightText(text, query) {
        if (!text) return '';
        
        const queryWords = query.split(/\s+/).filter(word => word.length > 1);
        let highlightedText = text;
        
        // Highlight exact phrase
        highlightedText = highlightedText.replace(new RegExp(query, 'gi'), match => {
            return `<span class="${this.options.highlightClass}">${match}</span>`;
        });
        
        // Highlight individual words if they're not already highlighted
        queryWords.forEach(word => {
            highlightedText = highlightedText.replace(new RegExp(`(?<!<span class="${this.options.highlightClass}">.*?)(${word})(?!.*?</span>)`, 'gi'), match => {
                return `<span class="${this.options.highlightClass}">${match}</span>`;
            });
        });
        
        return highlightedText;
    }
    
    /**
     * Get a relevant excerpt from content that includes the search query
     */
    getRelevantExcerpt(content, query) {
        const maxExcerptLength = 150;
        const queryPosition = content.toLowerCase().indexOf(query.toLowerCase());
        
        if (queryPosition === -1) {
            // If query isn't found in content, just return the first part
            return this.highlightText(this.truncateText(content, maxExcerptLength), query);
        }
        
        // Calculate the start position for the excerpt
        let startPos = Math.max(0, queryPosition - Math.floor(maxExcerptLength / 2));
        
        // Adjust start position to start at the beginning of a word
        if (startPos > 0) {
            while (startPos > 0 && content[startPos] !== ' ' && content[startPos] !== '.') {
                startPos--;
            }
            startPos++; // Move past the space or period
        }
        
        // Get the excerpt
        let excerpt = content.substr(startPos, maxExcerptLength);
        
        // Trim to complete words
        if (excerpt.length === maxExcerptLength) {
            const lastSpacePos = excerpt.lastIndexOf(' ');
            if (lastSpacePos !== -1) {
                excerpt = excerpt.substr(0, lastSpacePos) + '...';
            }
        }
        
        // Add ellipsis at the beginning if needed
        if (startPos > 0) {
            excerpt = '...' + excerpt;
        }
        
        return this.highlightText(excerpt, query);
    }
    
    /**
     * Truncate text to a specified length
     */
    truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        
        return text.substr(0, maxLength - 3) + '...';
    }
    
    /**
     * Clear search results
     */
    clearResults() {
        if (this.searchResults) {
            this.searchResults.innerHTML = '';
        }
    }
    
    /**
     * Show a message in the results area
     */
    showMessage(message) {
        this.clearResults();
        
        const messageEl = document.createElement('div');
        messageEl.className = 'search-message';
        messageEl.textContent = message;
        
        this.searchResults.appendChild(messageEl);
    }
    
    /**
     * Show an error message
     */
    showError(message) {
        this.clearResults();
        
        const errorEl = document.createElement('div');
        errorEl.className = 'search-error';
        errorEl.textContent = message;
        
        this.searchResults.appendChild(errorEl);
    }
    
    /**
     * Open the search modal
     */
    openSearchModal() {
        if (this.searchModal) {
            this.searchModal.classList.add('active');
            
            // Focus the search input
            setTimeout(() => {
                this.searchInput.focus();
            }, 100);
            
            // Prevent body scrolling
            document.body.style.overflow = 'hidden';
        }
    }
    
    /**
     * Close the search modal
     */
    closeSearchModal() {
        if (this.searchModal) {
            this.searchModal.classList.remove('active');
            
            // Restore body scrolling
            document.body.style.overflow = '';
            
            // Clear search input and results
            this.searchInput.value = '';
            this.clearResults();
        }
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const siteSearch = new SiteSearch();
});

// Generate search index (this would normally be done as part of the build process)
class SearchIndexBuilder {
    constructor(options = {}) {
        this.options = Object.assign({
            outputPath: '/search-index.json',
            urlsToInclude: ['/', '/pages/', '/blog/'],
            excludePatterns: ['/admin/', '/login/', '/assets/'],
            elementsToIndex: ['main', 'article', '.content', '.page-content'],
            excludeElements: ['script', 'style', 'nav', 'footer', '.comment', '.sidebar']
        }, options);
    }
    
    /**
     * Generate the search index
     * Note: In a real implementation, this would be run at build time, not in the browser
     */
    async generateIndex() {
        console.log('Generating search index...');
        
        // In a real implementation, this would scan all pages
        // For demo purposes, we'll create a mock index
        const mockIndex = [
            {
                title: 'Home - CAAKE',
                url: '/',
                description: 'CAAKE provides cutting-edge AI automation solutions to streamline operations, increase efficiency, and drive growth for businesses of all sizes.',
                content: 'AI automation solutions for business growth. Transform your business with cutting-edge AI automation solutions. Our services include AI consulting, automations, AI solutions, AI agents, AI assistants, and chatbots.',
                categories: ['Home'],
                tags: ['AI', 'Automation', 'Business']
            },
            {
                title: 'AI Consulting Services - CAAKE',
                url: '/pages/services/consulting.html',
                description: 'Expert AI consulting services to help your business implement intelligent automation solutions.',
                content: 'Our AI consulting services help businesses understand and implement artificial intelligence solutions. We assess your needs, develop AI strategies, and guide implementation. Our experienced consultants work with businesses of all sizes.',
                categories: ['Services'],
                tags: ['AI Consulting', 'Strategy', 'Implementation']
            },
            {
                title: 'Automations - CAAKE',
                url: '/pages/services/automations.html',
                description: 'Streamline your business processes with intelligent automation solutions.',
                content: 'Automate repetitive tasks and workflows with our intelligent automation solutions. Reduce errors, save time, and improve efficiency. Our automation services integrate with your existing systems and can be customized to your specific business needs.',
                categories: ['Services'],
                tags: ['Automation', 'Workflow', 'Efficiency']
            },
            {
                title: 'AI Solutions - CAAKE',
                url: '/pages/services/solutions.html',
                description: 'Custom AI solutions tailored to your business challenges and goals.',
                content: 'We develop custom AI solutions that address your specific business challenges. Our solutions include predictive analytics, computer vision, natural language processing, and recommendation systems. All solutions are built with scalability and ROI in mind.',
                categories: ['Services'],
                tags: ['AI Solutions', 'Custom Development', 'Machine Learning']
            },
            {
                title: 'AI Agents - CAAKE',
                url: '/pages/services/agents.html',
                description: 'Intelligent AI agents that automate tasks and make decisions.',
                content: 'AI agents are intelligent software entities that can perform tasks autonomously. Our AI agents can handle customer inquiries, process data, make recommendations, and even make decisions based on predefined rules and learning algorithms.',
                categories: ['Services'],
                tags: ['AI Agents', 'Autonomous', 'Decision Making']
            },
            {
                title: 'AI Assistants - CAAKE',
                url: '/pages/services/assistants.html',
                description: 'AI assistants that help your team be more productive and efficient.',
                content: 'AI assistants augment human capabilities by handling routine tasks, providing information, and offering suggestions. Our AI assistants integrate with popular tools and platforms, allowing your team to focus on high-value activities.',
                categories: ['Services'],
                tags: ['AI Assistants', 'Productivity', 'Integration']
            },
            {
                title: 'Chatbots - CAAKE',
                url: '/pages/services/chatbots.html',
                description: 'Intelligent chatbots that improve customer service and engagement.',
                content: 'Our AI-powered chatbots provide instant responses to customer inquiries, 24/7. They can handle common questions, troubleshoot issues, process orders, and escalate complex problems to human agents. Chatbots improve customer satisfaction while reducing support costs.',
                categories: ['Services'],
                tags: ['Chatbots', 'Customer Service', 'Support']
            },
            {
                title: 'About Us - CAAKE',
                url: '/pages/about.html',
                description: 'Learn about CAAKE and our mission to make AI accessible for all businesses.',
                content: 'Founded in 2020, CAAKE (Cost Avoidance Automation Kingz Enterprise) has been at the forefront of AI technology. Our mission is to make AI accessible and beneficial for all businesses regardless of their size or technical expertise. With a team of expert AI consultants and developers, we\'ve helped numerous businesses across various industries leverage the power of artificial intelligence.',
                categories: ['Company'],
                tags: ['About', 'Mission', 'Team']
            },
            {
                title: 'Contact Us - CAAKE',
                url: '/pages/contact.html',
                description: 'Get in touch with CAAKE for all your AI automation needs.',
                content: 'Contact us to discuss your AI automation needs. Our team is ready to help you transform your business with cutting-edge AI solutions. You can reach us by phone, email, or by filling out the contact form on this page.',
                categories: ['Company'],
                tags: ['Contact', 'Support', 'Inquiries']
            },

        ];
        
        // In a real implementation, we would save this to a file
        // For now, just return the mock data
        return mockIndex;
    }
}

// This would normally be run at build time, not in the browser
// searchIndexBuilder = new SearchIndexBuilder();
// searchIndexBuilder.generateIndex(); 