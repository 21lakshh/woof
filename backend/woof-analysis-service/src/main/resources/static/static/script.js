document.addEventListener('DOMContentLoaded', function () {
    const uploadBtn = document.getElementById('upload-btn');
    const imageUpload = document.getElementById('image-upload');
    const imageContainer = document.getElementById('image-container');
    const imagePreview = document.getElementById('image-preview');
    const removeBtn = document.getElementById('remove-image');
    const queryInput = document.getElementById('query-input');
    const submitQuery = document.getElementById('submit-query');
    const responseContainer = document.getElementById('response-container');
    const errorContainer = document.getElementById('error-container');
    const errorText = document.getElementById('error-text');
    const locationInput = document.getElementById('location-input');
    const coordinatesInput = document.getElementById('coordinates-input');
    const conditionSelect = document.querySelector('select'); // Dog condition select

    // Manual input state
    let isManualInput = false;

    window.toggleLocationInput = function () {
        const locationInput = document.getElementById('location-input');
        const instructions = document.getElementById('manual-input-instructions');
        isManualInput = !isManualInput;

        if (isManualInput) {
            locationInput.readOnly = false;
            locationInput.placeholder = "Enter your location manually";
            instructions.classList.remove('hidden');
        } else {
            locationInput.readOnly = true;
            locationInput.placeholder = "Enter location or use current location";
            instructions.classList.add('hidden');
        }
    };

    // Object to store all report data
    let reportData = {
        image: null,
        location: {
            address: '',
            coordinates: {
                latitude: null,
                longitude: null
            }
        },
        condition: '',
        details: '',
        timestamp: null
    };

    // Click to Upload button trigger
    uploadBtn.addEventListener('click', () => imageUpload.click());

    // Handle image selection
    imageUpload.addEventListener('change', function (event) {
        const file = event.target.files[0];

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showError('⚠️ Please upload an image file');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            showError('⚠️ File size should be less than 2MB');
            return;
        }

        // Save image to reportData
        reportData.image = file;

        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imageContainer.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    });

    // Handle image removal
    removeBtn.addEventListener('click', function () {
        imagePreview.src = '';
        imageContainer.classList.add('hidden');
        imageUpload.value = ''; // Clear the file input
        reportData.image = null;
    });

    // Update reportData when location changes
    if (locationInput) {
        locationInput.addEventListener('change', function () {
            reportData.location.address = this.value;
        });
    }

    // Listen for coordinates changes
    if (coordinatesInput) {
        coordinatesInput.addEventListener('change', function () {
            const coords = this.value.split(',');
            if (coords.length === 2) {
                reportData.location.coordinates.latitude = parseFloat(coords[0]);
                reportData.location.coordinates.longitude = parseFloat(coords[1]);
            }
        });
    }

    // Update reportData when location is detected
    window.getLocation = function () {
        const locationInput = document.getElementById('location-input');
        const coordinatesInput = document.getElementById('coordinates-input');
        const locationStatus = document.getElementById('location-status');
        const locationIcon = document.getElementById('location-icon');
        const locationLoader = document.getElementById('location-loader');

        // Show loading state
        locationIcon.classList.add('hidden');
        locationLoader.classList.remove('hidden');
        locationStatus.textContent = 'Detecting your location...';

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude, accuracy } = position.coords;

                    // Update reportData with coordinates
                    reportData.location.coordinates.latitude = latitude;
                    reportData.location.coordinates.longitude = longitude;
                    coordinatesInput.value = `${latitude},${longitude}`;

                    // Increased threshold to 2000m for better usability
                    if (accuracy <= 2000) {
                        // Reverse Geocoding using OpenStreetMap Nominatim API
                        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }
                                return response.json();
                            })
                            .then(data => {
                                const locationName = data.display_name || "Unknown location";
                                // Store formatted address
                                locationInput.value = locationName;
                                // Update reportData with address
                                reportData.location.address = locationName;
                                // Update status with accuracy info
                                locationStatus.textContent = `Location detected (Accuracy: ${Math.round(accuracy)}m)`;
                                locationStatus.classList.remove('text-red-500', 'text-yellow-500');
                                locationStatus.classList.add('text-green-500');
                            })
                            .catch((error) => {
                                console.error('Geocoding error:', error);
                                // Fallback to coordinates if geocoding fails
                                locationInput.value = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                                reportData.location.address = locationInput.value;
                                locationStatus.textContent = 'Using coordinates (address lookup failed)';
                                locationStatus.classList.remove('text-red-500', 'text-green-500');
                                locationStatus.classList.add('text-yellow-500');
                            })
                            .finally(() => {
                                // Hide loading state
                                locationIcon.classList.remove('hidden');
                                locationLoader.classList.add('hidden');
                            });
                    } else {
                        locationStatus.textContent = `Location accuracy is low (${Math.round(accuracy)}m). Try moving to an open area or enter location manually.`;
                        locationStatus.classList.remove('text-green-500', 'text-yellow-500');
                        locationStatus.classList.add('text-red-500');
                        // Show manual input instructions
                        document.getElementById('manual-input-instructions').classList.remove('hidden');
                        // Hide loading state
                        locationIcon.classList.remove('hidden');
                        locationLoader.classList.add('hidden');
                    }
                },
                (error) => {
                    let errorMessage = 'Error detecting location: ';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location access denied. Please enable location services in your browser settings.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information unavailable. Please check your GPS settings.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Location request timed out. Please try again.';
                            break;
                        default:
                            errorMessage = 'Unable to detect location. Please try again or enter location manually.';
                    }
                    locationStatus.textContent = errorMessage;
                    locationStatus.classList.remove('text-green-500', 'text-yellow-500');
                    locationStatus.classList.add('text-red-500');
                    // Show manual input instructions
                    document.getElementById('manual-input-instructions').classList.remove('hidden');
                    // Hide loading state
                    locationIcon.classList.remove('hidden');
                    locationLoader.classList.add('hidden');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000, // Increased timeout to 15 seconds
                    maximumAge: 0
                }
            );
        } else {
            locationStatus.textContent = 'Geolocation is not supported by this browser. Please enter location manually.';
            locationStatus.classList.remove('text-green-500', 'text-yellow-500');
            locationStatus.classList.add('text-red-500');
            // Show manual input instructions
            document.getElementById('manual-input-instructions').classList.remove('hidden');
            // Hide loading state
            locationIcon.classList.remove('hidden');
            locationLoader.classList.add('hidden');
        }
    };

    // Update condition
    if (conditionSelect) {
        conditionSelect.addEventListener('change', function () {
            reportData.condition = this.value;
        });
    }

    // Update details
    if (queryInput) {
        queryInput.addEventListener('input', function () {
            reportData.details = this.value;
        });
    }

    // Submit Query
    submitQuery.addEventListener('click', async () => {
        // Update timestamp at submission time
        reportData.timestamp = new Date().toISOString();

        // Validate required fields
        if (!reportData.image) {
            showError('⚠️ Please upload an image');
            return;
        }

        if (!reportData.location.address &&
            (!reportData.location.coordinates.latitude || !reportData.location.coordinates.longitude)) {
            showError('⚠️ Please provide a location');
            return;
        }

        // Create submission status tracker
        const statusTracker = createStatusTracker();
        document.body.appendChild(statusTracker);

        // Display loading state
        submitQuery.disabled = true;
        submitQuery.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';

        try {
            // Update status: creating form data
            updateStatusTracker(statusTracker, 'creating', 'Creating submission package');

            // Create FormData for file upload
            const formData = new FormData();

            // Append the image file
            formData.append('file', reportData.image);

            // Append the JSON data as a string
            formData.append('additionalInfo', JSON.stringify({
                location: reportData.location,
                condition: reportData.condition,
                details: reportData.details,
                timestamp: reportData.timestamp
            }));

            // Small delay to show the status
            await new Promise(resolve => setTimeout(resolve, 500));

            // Update status: uploading
            updateStatusTracker(statusTracker, 'uploading', 'Uploading data');

            // Send directly to the upload_and_query endpoint
            const response = await fetch('http://localhost:8080/api/v1/analyze', {
                method: 'POST',
                body: formData
            });

            // Update status: processing
            updateStatusTracker(statusTracker, 'processing', 'Processing your report');

            const result = await response.json();
            console.log("API Response:", result);

            // Extract and log the raw response content
            let extractedCondition = null;
            if (result.advice) {
                const responseContent = result.advice;

                // Extract condition from response content if available
                const conditionMatch = responseContent.match(/Condition:?\s*(\b(?:healthy|injured|critical|aggressive)\b)/i) ||
                    responseContent.match(/dog (?:appears to be|is|seems|looks)\s+(\b(?:healthy|injured|critical|aggressive)\b)/i);

                if (conditionMatch && conditionMatch[1]) {
                    extractedCondition = conditionMatch[1].toLowerCase();
                    reportData.condition = extractedCondition;
                }

                // Display extracted data in console
                console.log('================ DOG REPORT DATA ================');
                console.log('Image:', {
                    name: reportData.image.name,
                    type: reportData.image.type,
                    size: `${(reportData.image.size / 1024).toFixed(2)} KB`
                });
                console.log('Dog Condition:', extractedCondition || 'Not determined');
                console.log('Latitude:', reportData.location.coordinates.latitude);
                console.log('Longitude:', reportData.location.coordinates.longitude);
                console.log('Timestamp:', reportData.timestamp);
                console.log('================================================');
            }

            if (!response.ok || !result.advice) {
                throw new Error(result.detail || 'An error occurred while processing your request.');
            }

            // Update status: completed
            updateStatusTracker(statusTracker, 'completed', 'Report processed successfully!');

            // Display response
            const markdownResponse = result.advice;
            responseContainer.innerHTML = marked.parse(markdownResponse);
            responseContainer.classList.remove('hidden');
            errorContainer.classList.add('hidden');

            // Show success notification
            showSuccess('Report submitted successfully!');

            // Show location-specific help information
            const locationInfo = document.getElementById('location-info');
            if (locationInfo) locationInfo.classList.remove('hidden');

            const shelterInfo = document.getElementById('shelter-info');
            if (shelterInfo) shelterInfo.classList.remove('hidden');

            const vetInfo = document.getElementById('vet-info');
            if (vetInfo) vetInfo.classList.remove('hidden');

            // Update the condition in the UI if the select exists and condition was extracted
            if (conditionSelect && extractedCondition) {
                conditionSelect.value = extractedCondition;

                // Highlight the select to show it was updated by AI
                conditionSelect.classList.add('border-purple-500', 'bg-purple-100/10');
                const aiLabel = document.createElement('div');
                aiLabel.className = 'text-purple-400 text-xs mt-1 flex items-center';
                aiLabel.innerHTML = '<i class="fas fa-robot mr-1"></i> AI-determined condition';
                if (conditionSelect.parentNode) {
                    conditionSelect.parentNode.appendChild(aiLabel);
                }
            }

            // Remove status tracker after completion
            setTimeout(() => {
                statusTracker.classList.add('opacity-0');
                setTimeout(() => statusTracker.remove(), 500);
            }, 3000);

        } catch (error) {
            console.error('Error:', error);
            showError(error.message);

            // Update status: error
            updateStatusTracker(statusTracker, 'error', 'Error: ' + error.message);

            // Remove status tracker after error
            setTimeout(() => {
                statusTracker.classList.add('opacity-0');
                setTimeout(() => statusTracker.remove(), 5000);
            }, 5000);
        } finally {
            submitQuery.disabled = false;
            submitQuery.innerHTML = '<i class="fas fa-paper-plane mr-2"></i> Submit Report';
        }
    });

    // Helper function to show error messages
    function showError(message) {
        if (errorText) errorText.textContent = message;
        if (errorContainer) {
            errorContainer.classList.remove('hidden');
            errorContainer.classList.add('shake');
            setTimeout(() => errorContainer.classList.remove('shake'), 500);

            // Auto-hide after 5 seconds
            setTimeout(() => {
                errorContainer.classList.add('hidden');
            }, 5000);
        }
        if (responseContainer) responseContainer.classList.add('hidden');
    }

    // Helper function to show success messages
    function showSuccess(message) {
        const successContainer = document.createElement('div');
        successContainer.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-500 translate-y-0';
        successContainer.innerHTML = `
            <div class="flex items-center gap-2">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(successContainer);

        // Animate out after 3 seconds
        setTimeout(() => {
            successContainer.classList.add('translate-y-[-100%]');
            setTimeout(() => successContainer.remove(), 500);
        }, 3000);
    }
});

// Move external logic inside another listener or just keep it safe
document.addEventListener('DOMContentLoaded', function () {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        .animate {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease-out;
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        
        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.2s; }
        .delay-3 { transition-delay: 0.3s; }
    `;
    document.head.appendChild(style);

    // Add responsive navigation menu
    const navToggle = document.createElement('button');
    navToggle.className = 'md:hidden fixed top-4 right-4 z-50 text-white';
    navToggle.innerHTML = '<i class="fas fa-bars text-2xl"></i>';
    document.body.appendChild(navToggle);

    const nav = document.querySelector('.nav-links');
    navToggle.addEventListener('click', () => {
        if (nav) {
            nav.classList.toggle('hidden');
            nav.classList.toggle('flex');
            nav.classList.toggle('flex-col');
            nav.classList.toggle('absolute');
            nav.classList.toggle('top-16');
            nav.classList.toggle('right-4');
            nav.classList.toggle('bg-[#2d3630]');
            nav.classList.toggle('p-4');
            nav.classList.toggle('rounded-lg');
            nav.classList.toggle('shadow-lg');
        }
    });

    // Add scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'fixed top-0 left-0 h-1 bg-purple-500 z-50 transition-all duration-300';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
});

// Update status tracker UI
function updateStatusTracker(tracker, status, message) {
    if (!tracker) return;

    const statusTitle = tracker.querySelector('.status-title');
    const statusMessage = tracker.querySelector('.status-message');
    const statusIcon = tracker.querySelector('.status-icon');

    // Update message
    if (statusMessage) statusMessage.textContent = message;

    // Update steps
    const steps = ['creating', 'analyzing', 'uploading', 'processing', 'completed'];
    const currentIndex = steps.indexOf(status);

    steps.forEach((step, index) => {
        // Find the step dot element - only process if it exists
        const stepDot = tracker.querySelector(`.step-${step} .step-dot`);
        const stepLabel = tracker.querySelector(`.step-${step} .step-label`);

        if (!stepDot || !stepLabel) return; // Skip if element doesn't exist (for backward compatibility)

        if (index < currentIndex) {
            // Completed steps
            stepDot.classList.remove('bg-gray-600', 'bg-purple-500');
            stepDot.classList.add('bg-green-500');
            stepLabel.classList.remove('text-gray-400');
            stepLabel.classList.add('text-green-500');
        } else if (index === currentIndex) {
            // Current step
            stepDot.classList.remove('bg-gray-600');
            stepDot.classList.add('bg-purple-500');
            stepLabel.classList.remove('text-gray-400');
            stepLabel.classList.add('text-purple-500');
        }
    });

    // Update title and icon based on status
    if (statusTitle) {
        switch (status) {
            case 'creating':
                statusTitle.textContent = 'Creating Report';
                break;
            case 'analyzing':
                statusTitle.textContent = 'AI Analyzing';
                break;
            case 'uploading':
                statusTitle.textContent = 'Uploading Report';
                break;
            case 'processing':
                statusTitle.textContent = 'Processing Report';
                break;
            case 'completed':
                statusTitle.textContent = 'Report Submitted';
                if (statusIcon) statusIcon.innerHTML = '<i class="fas fa-check-circle text-green-500 text-5xl"></i>';
                break;
            case 'error':
                statusTitle.textContent = 'Submission Error';
                if (statusIcon) statusIcon.innerHTML = '<i class="fas fa-exclamation-circle text-red-500 text-5xl"></i>';
                break;
        }
    }
}

function createStatusTracker() {
    const statusTracker = document.createElement('div');
    statusTracker.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-90 text-white p-6 rounded-xl shadow-2xl z-50 transition-all duration-300';
    statusTracker.innerHTML = `
        <div class="text-center">
            <div class="status-icon mb-4">
                <div class="spinner inline-block w-12 h-12 border-4 border-gray-600 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
            <h3 class="status-title text-xl font-bold mb-2">Initializing</h3>
            <p class="status-message text-gray-300">Preparing your report</p>
            
            <div class="progress-steps flex justify-between mt-6 relative">
                <div class="absolute top-1/2 left-0 right-0 h-1 bg-gray-600 -translate-y-1/2"></div>
                
                <div class="step-creating relative z-10">
                    <div class="step-dot w-4 h-4 rounded-full bg-gray-600 mb-2"></div>
                    <div class="step-label text-xs text-gray-400">Create</div>
                </div>
                
                <div class="step-analyzing relative z-10">
                    <div class="step-dot w-4 h-4 rounded-full bg-gray-600 mb-2"></div>
                    <div class="step-label text-xs text-gray-400">Analyze</div>
                </div>
                
                <div class="step-uploading relative z-10">
                    <div class="step-dot w-4 h-4 rounded-full bg-gray-600 mb-2"></div>
                    <div class="step-label text-xs text-gray-400">Upload</div>
                </div>
                
                <div class="step-processing relative z-10">
                    <div class="step-dot w-4 h-4 rounded-full bg-gray-600 mb-2"></div>
                    <div class="step-label text-xs text-gray-400">Process</div>
                </div>
                
                <div class="step-completed relative z-10">
                    <div class="step-dot w-4 h-4 rounded-full bg-gray-600 mb-2"></div>
                    <div class="step-label text-xs text-gray-400">Complete</div>
                </div>
            </div>
            
            <button class="cancel-btn mt-6 text-sm text-gray-400 hover:text-white">Cancel</button>
        </div>
    `;

    // Add cancel button functionality
    const cancelBtn = statusTracker.querySelector('.cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            statusTracker.classList.add('opacity-0');
            setTimeout(() => statusTracker.remove(), 500);
        });
    }

    return statusTracker;
}