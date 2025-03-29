/**
 * Mobile Optimization Audit Script for CAAKE Website
 * 
 * This script checks various aspects of the website for mobile optimization
 * including responsive design, touch targets, viewport settings, and more.
 * 
 * Usage: Run this script in the browser console while viewing the website.
 */

const MobileAudit = {
    results: {
        passes: [],
        warnings: [],
        failures: []
    },

    /**
     * Run the complete audit
     */
    runAudit: function() {
        console.log('%c 📱 CAAKE Mobile Optimization Audit 📱', 'font-size: 20px; font-weight: bold; color: #0066cc;');
        
        // Run all checks
        this.checkViewport();
        this.checkTouchTargets();
        this.checkFontSizes();
        this.checkMediaQueries();
        this.checkImagesResponsive();
        this.checkInputFields();
        this.checkOverflow();
        this.checkFixedPositionElements();
        this.checkTapDelay();
        this.checkOrientation();
        this.checkContrast();
        this.checkContentWidth();
        this.checkGestures();
        this.checkScrollableElements();
        this.checkPinchZoom();
        
        // Display results
        this.displayResults();
        
        // Generate report
        return this.generateReport();
    },

    /**
     * Check if viewport meta tag is properly set
     */
    checkViewport: function() {
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        
        if (!viewportMeta) {
            this.addFailure('Viewport meta tag is missing. Add: <meta name="viewport" content="width=device-width, initial-scale=1.0">');
            return;
        }
        
        const content = viewportMeta.getAttribute('content');
        
        if (!content.includes('width=device-width')) {
            this.addWarning('Viewport meta tag should include width=device-width');
        }
        
        if (!content.includes('initial-scale=1')) {
            this.addWarning('Viewport meta tag should include initial-scale=1');
        }
        
        if (content.includes('user-scalable=no') || content.includes('maximum-scale=1')) {
            this.addFailure('Viewport meta tag restricts zooming which is an accessibility issue');
        } else {
            this.addPass('Viewport meta tag is properly configured');
        }
    },

    /**
     * Check touch target sizes
     */
    checkTouchTargets: function() {
        const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [role="button"]');
        let smallTargets = [];
        
        interactiveElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            
            // Check if element is visible
            if (rect.width === 0 || rect.height === 0) return;
            
            // Apple HIG recommends minimum 44x44px touch targets
            if (rect.width < 44 || rect.height < 44) {
                smallTargets.push({
                    element: element.tagName,
                    text: element.textContent?.substring(0, 20) || '[no text]',
                    width: rect.width,
                    height: rect.height
                });
            }
        });
        
        if (smallTargets.length > 0) {
            this.addWarning(`Found ${smallTargets.length} touch targets smaller than recommended 44x44px. First few: ${JSON.stringify(smallTargets.slice(0, 3))}`);
        } else {
            this.addPass('All touch targets meet size recommendations');
        }
    },

    /**
     * Check font sizes for readability
     */
    checkFontSizes: function() {
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, li');
        let smallText = [];
        
        textElements.forEach(element => {
            const style = window.getComputedStyle(element);
            const fontSize = parseFloat(style.fontSize);
            
            // Check if text is visible
            if (style.display === 'none' || style.visibility === 'hidden') return;
            
            // 16px is generally considered minimum readable size on mobile
            if (fontSize < 16 && element.textContent.trim().length > 0) {
                smallText.push({
                    element: element.tagName,
                    text: element.textContent?.substring(0, 20) || '[no text]',
                    fontSize: fontSize
                });
            }
        });
        
        if (smallText.length > 0) {
            this.addWarning(`Found ${smallText.length} text elements smaller than 16px. First few: ${JSON.stringify(smallText.slice(0, 3))}`);
        } else {
            this.addPass('All text elements have adequate font size');
        }
    },

    /**
     * Check for responsive media queries
     */
    checkMediaQueries: function() {
        const styleSheets = document.styleSheets;
        let mediaQueriesFound = 0;
        let mobileFirst = false;
        
        try {
            for (let i = 0; i < styleSheets.length; i++) {
                const rules = styleSheets[i].cssRules || styleSheets[i].rules;
                
                if (!rules) continue; // Skip if we can't access rules (CORS)
                
                for (let j = 0; j < rules.length; j++) {
                    const rule = rules[j];
                    
                    if (rule.type === CSSRule.MEDIA_RULE) {
                        mediaQueriesFound++;
                        
                        // Check if using mobile-first approach
                        if (rule.conditionText && rule.conditionText.includes('min-width')) {
                            mobileFirst = true;
                        }
                    }
                }
            }
        } catch (e) {
            this.addWarning('Could not check all stylesheets for media queries due to CORS restrictions');
        }
        
        if (mediaQueriesFound === 0) {
            this.addFailure('No media queries found - site may not be responsive');
        } else {
            this.addPass(`Found ${mediaQueriesFound} media queries`);
            
            if (mobileFirst) {
                this.addPass('Mobile-first approach detected with min-width queries');
            } else {
                this.addWarning('Consider using mobile-first approach with min-width queries');
            }
        }
    },

    /**
     * Check if images are responsive
     */
    checkImagesResponsive: function() {
        const images = document.querySelectorAll('img');
        let nonResponsiveImages = [];
        let missingSrcset = 0;
        let missingAlt = 0;
        let missingDimensions = 0;
        
        images.forEach(img => {
            // Check for max-width: 100%
            const style = window.getComputedStyle(img);
            if (style.maxWidth !== '100%' && !style.maxWidth.includes('px')) {
                nonResponsiveImages.push(img.src.split('/').pop());
            }
            
            // Check for srcset
            if (!img.srcset && !img.parentElement.tagName === 'PICTURE') {
                missingSrcset++;
            }
            
            // Check for alt text
            if (!img.hasAttribute('alt')) {
                missingAlt++;
            }
            
            // Check for dimensions
            if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
                missingDimensions++;
            }
        });
        
        if (nonResponsiveImages.length > 0) {
            this.addWarning(`Found ${nonResponsiveImages.length} images without max-width:100%`);
        } else {
            this.addPass('All images have proper responsive styling');
        }
        
        if (missingSrcset > 0) {
            this.addWarning(`${missingSrcset} images are missing srcset attribute for responsive image loading`);
        }
        
        if (missingAlt > 0) {
            this.addWarning(`${missingAlt} images are missing alt text (accessibility issue)`);
        }
        
        if (missingDimensions > 0) {
            this.addWarning(`${missingDimensions} images are missing explicit width/height attributes (potential CLS issue)`);
        }
    },

    /**
     * Check input fields for mobile friendliness
     */
    checkInputFields: function() {
        const inputFields = document.querySelectorAll('input, select, textarea');
        let smallInputs = 0;
        let smallFonts = 0;
        let missingTypes = 0;
        
        inputFields.forEach(field => {
            const rect = field.getBoundingClientRect();
            const style = window.getComputedStyle(field);
            
            // Check dimensions
            if (rect.height < 48) { // Minimum touch target for inputs
                smallInputs++;
            }
            
            // Check font size
            if (parseFloat(style.fontSize) < 16) {
                smallFonts++;
            }
            
            // Check input types for mobile optimization
            if (field.tagName === 'INPUT' && !field.hasAttribute('type')) {
                missingTypes++;
            }
        });
        
        if (smallInputs > 0) {
            this.addWarning(`${smallInputs} input fields are smaller than recommended height (48px)`);
        }
        
        if (smallFonts > 0) {
            this.addWarning(`${smallFonts} input fields have font-size smaller than 16px (may cause zoom on iOS)`);
        }
        
        if (missingTypes > 0) {
            this.addWarning(`${missingTypes} input fields are missing type attribute`);
        }
        
        if (smallInputs === 0 && smallFonts === 0 && missingTypes === 0) {
            this.addPass('All input fields are properly configured for mobile');
        }
    },

    /**
     * Check for horizontal overflow issues
     */
    checkOverflow: function() {
        const bodyWidth = document.body.getBoundingClientRect().width;
        const windowWidth = window.innerWidth;
        let overflowElements = [];
        
        // Check if body is wider than viewport
        if (bodyWidth > windowWidth) {
            this.addFailure(`Body width (${bodyWidth}px) exceeds viewport width (${windowWidth}px) causing horizontal scroll`);
        }
        
        // Check for elements that exceed viewport width
        const allElements = document.querySelectorAll('*');
        
        for (let i = 0; i < allElements.length; i++) {
            const element = allElements[i];
            const rect = element.getBoundingClientRect();
            
            if (rect.width > windowWidth + 5) { // +5px for small rounding differences
                overflowElements.push({
                    element: element.tagName,
                    class: element.className,
                    width: rect.width
                });
                
                if (overflowElements.length >= 5) break; // Limit to first 5 issues
            }
        }
        
        if (overflowElements.length > 0) {
            this.addFailure(`Found ${overflowElements.length} elements wider than viewport causing overflow: ${JSON.stringify(overflowElements)}`);
        } else {
            this.addPass('No horizontal overflow issues detected');
        }
    },

    /**
     * Check fixed position elements on mobile
     */
    checkFixedPositionElements: function() {
        const fixedElements = Array.from(document.querySelectorAll('*')).filter(el => {
            const style = window.getComputedStyle(el);
            return style.position === 'fixed' || style.position === 'sticky';
        });
        
        if (fixedElements.length > 0) {
            this.addWarning(`Found ${fixedElements.length} fixed/sticky positioned elements. Ensure they don't obstruct content on mobile.`);
            
            // Check if they occupy too much screen space
            const totalFixedHeight = fixedElements.reduce((total, el) => {
                return total + el.getBoundingClientRect().height;
            }, 0);
            
            if (totalFixedHeight > window.innerHeight * 0.3) {
                this.addFailure(`Fixed/sticky elements occupy ${Math.round(totalFixedHeight / window.innerHeight * 100)}% of screen height, which is excessive for mobile`);
            }
        } else {
            this.addPass('No fixed/sticky position elements detected');
        }
    },

    /**
     * Check for tap delay removal
     */
    checkTapDelay: function() {
        const hasTouchAction = document.querySelector('html[style*="touch-action"]') !== null;
        const hasFastClick = typeof window.FastClick !== 'undefined';
        
        if (!hasTouchAction && !hasFastClick) {
            this.addWarning('No tap delay removal technique detected. Consider using touch-action: manipulation or FastClick.');
        } else {
            this.addPass('Tap delay removal implemented');
        }
    },

    /**
     * Check orientation-specific styles
     */
    checkOrientation: function() {
        let orientationMediaQueries = 0;
        
        try {
            for (let i = 0; i < document.styleSheets.length; i++) {
                const rules = document.styleSheets[i].cssRules || document.styleSheets[i].rules;
                
                if (!rules) continue;
                
                for (let j = 0; j < rules.length; j++) {
                    const rule = rules[j];
                    
                    if (rule.type === CSSRule.MEDIA_RULE && 
                        (rule.conditionText.includes('orientation: portrait') || 
                         rule.conditionText.includes('orientation: landscape'))) {
                        orientationMediaQueries++;
                    }
                }
            }
        } catch (e) {
            this.addWarning('Could not check all stylesheets for orientation media queries due to CORS restrictions');
        }
        
        if (orientationMediaQueries === 0) {
            this.addWarning('No orientation-specific styles found. Consider adding styles for different device orientations.');
        } else {
            this.addPass(`Found ${orientationMediaQueries} orientation-specific media queries`);
        }
    },

    /**
     * Check contrast ratios for accessibility
     */
    checkContrast: function() {
        // This is a simplified check
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, li');
        let potentialContrastIssues = 0;
        
        textElements.forEach(element => {
            const style = window.getComputedStyle(element);
            const textColor = style.color;
            const bgColor = style.backgroundColor;
            
            // Very basic check for potential low contrast
            if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
                // Skip elements with transparent background
                return;
            }
            
            // Convert colors to grayscale to roughly estimate contrast
            const textRgb = this.getRgbFromColor(textColor);
            const bgRgb = this.getRgbFromColor(bgColor);
            
            if (!textRgb || !bgRgb) return;
            
            const textGray = (textRgb.r * 0.299 + textRgb.g * 0.587 + textRgb.b * 0.114);
            const bgGray = (bgRgb.r * 0.299 + bgRgb.g * 0.587 + bgRgb.b * 0.114);
            const diff = Math.abs(textGray - bgGray);
            
            if (diff < 125) {
                potentialContrastIssues++;
            }
        });
        
        if (potentialContrastIssues > 0) {
            this.addWarning(`Detected ${potentialContrastIssues} potential contrast issues. Use a contrast checker tool for accurate assessment.`);
        } else {
            this.addPass('No obvious contrast issues detected');
        }
    },

    /**
     * Utility function to get RGB values from CSS color
     */
    getRgbFromColor: function(color) {
        if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') return null;
        
        const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
        
        if (rgbMatch) {
            return {
                r: parseInt(rgbMatch[1], 10),
                g: parseInt(rgbMatch[2], 10),
                b: parseInt(rgbMatch[3], 10)
            };
        }
        
        return null;
    },

    /**
     * Check if content width is constrained for readability
     */
    checkContentWidth: function() {
        const paragraphs = document.querySelectorAll('p');
        let wideTextElements = 0;
        
        paragraphs.forEach(p => {
            const width = p.getBoundingClientRect().width;
            
            // Check if paragraph is too wide for comfortable reading
            if (width > 600 && window.innerWidth > 768) {
                wideTextElements++;
            }
        });
        
        if (wideTextElements > 0) {
            this.addWarning(`Found ${wideTextElements} text blocks wider than 600px on large screens. Consider constraining text width for readability.`);
        } else {
            this.addPass('Text width is properly constrained for readability');
        }
    },

    /**
     * Check for mobile gesture support
     */
    checkGestures: function() {
        const hasHammer = typeof window.Hammer !== 'undefined';
        const hasTouchEvents = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (hasTouchEvents) {
            this.addPass('Device supports touch events');
            
            if (hasHammer) {
                this.addPass('Hammer.js detected for gesture support');
            } else {
                this.addWarning('Consider adding a gesture library like Hammer.js for enhanced mobile interactions');
            }
        }
    },

    /**
     * Check scrollable elements for -webkit-overflow-scrolling
     */
    checkScrollableElements: function() {
        const scrollableElements = Array.from(document.querySelectorAll('*')).filter(el => {
            const style = window.getComputedStyle(el);
            return (style.overflowY === 'scroll' || style.overflowY === 'auto' || 
                    style.overflowX === 'scroll' || style.overflowX === 'auto') && 
                   (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth);
        });
        
        const smoothScrollingElements = scrollableElements.filter(el => {
            const style = window.getComputedStyle(el);
            return style.webkitOverflowScrolling === 'touch';
        });
        
        if (scrollableElements.length > 0 && smoothScrollingElements.length < scrollableElements.length) {
            this.addWarning(`Found ${scrollableElements.length - smoothScrollingElements.length} scrollable elements without -webkit-overflow-scrolling: touch for smooth iOS scrolling`);
        } else if (scrollableElements.length > 0) {
            this.addPass('All scrollable elements have smooth scrolling enabled');
        }
    },

    /**
     * Check if pinch-zoom is disabled
     */
    checkPinchZoom: function() {
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        
        if (viewportMeta && viewportMeta.getAttribute('content').includes('user-scalable=no')) {
            this.addFailure('Pinch-zoom is disabled (user-scalable=no), which is an accessibility issue');
        } else {
            this.addPass('Pinch-zoom is enabled for accessibility');
        }
    },

    /**
     * Add a passing test
     */
    addPass: function(message) {
        this.results.passes.push(message);
    },

    /**
     * Add a warning
     */
    addWarning: function(message) {
        this.results.warnings.push(message);
    },

    /**
     * Add a failure
     */
    addFailure: function(message) {
        this.results.failures.push(message);
    },

    /**
     * Display results in console
     */
    displayResults: function() {
        console.log('\n%c ✓ PASSES ', 'background-color: #4CAF50; color: white; padding: 5px 10px; border-radius: 3px;');
        this.results.passes.forEach(message => {
            console.log('%c ✓ %s', 'color: #4CAF50;', message);
        });
        
        console.log('\n%c ⚠ WARNINGS ', 'background-color: #FF9800; color: white; padding: 5px 10px; border-radius: 3px;');
        this.results.warnings.forEach(message => {
            console.log('%c ⚠ %s', 'color: #FF9800;', message);
        });
        
        console.log('\n%c ✗ FAILURES ', 'background-color: #F44336; color: white; padding: 5px 10px; border-radius: 3px;');
        this.results.failures.forEach(message => {
            console.log('%c ✗ %s', 'color: #F44336;', message);
        });
        
        const score = Math.floor(100 * (this.results.passes.length / 
            (this.results.passes.length + this.results.warnings.length + this.results.failures.length * 2)));
        
        console.log('\n%c MOBILE OPTIMIZATION SCORE: %s%', 
                   `background-color: ${score > 80 ? '#4CAF50' : score > 60 ? '#FF9800' : '#F44336'}; 
                    color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;`, 
                    score);
    },

    /**
     * Generate a structured report
     */
    generateReport: function() {
        const totalChecks = this.results.passes.length + this.results.warnings.length + this.results.failures.length;
        const score = Math.floor(100 * (this.results.passes.length / 
            (this.results.passes.length + this.results.warnings.length + this.results.failures.length * 2)));
        
        return {
            score: score,
            summary: {
                total: totalChecks,
                passes: this.results.passes.length,
                warnings: this.results.warnings.length,
                failures: this.results.failures.length
            },
            details: {
                passes: this.results.passes,
                warnings: this.results.warnings,
                failures: this.results.failures
            },
            timestamp: new Date().toISOString()
        };
    }
};

// To run the audit, copy this entire script to the browser console
// and execute: MobileAudit.runAudit(); 