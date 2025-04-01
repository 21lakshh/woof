document.addEventListener('DOMContentLoaded', function() {
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

    function getFormattedDateTime() {
        let now = new Date();
    
        let year = now.getFullYear();
        let month = String(now.getMonth() + 1).padStart(2, '0');
        let day = String(now.getDate()).padStart(2, '0');
        let hours = String(now.getHours()).padStart(2, '0');
        let minutes = String(now.getMinutes()).padStart(2, '0');
        let seconds = String(now.getSeconds()).padStart(2, '0');
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    // Click to Upload button trigger
    uploadBtn.addEventListener('click', () => imageUpload.click());

    // Handle image selection
    imageUpload.addEventListener('change', function(event) {
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

        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imageContainer.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    });

    // Handle image removal
    removeBtn.addEventListener('click', function() {
        imagePreview.src = '';
        imageContainer.classList.add('hidden');
        imageUpload.value = ''; // Clear the file input
        storedTime = getFormattedDateTime();
    });
    // Submit Query
    submitQuery.addEventListener('click', async () => {
        const image = imageUpload.files[0];
        const query = queryInput.value;

        if (!image || !query) {
            showError('⚠️ Please upload an image and enter a query.');
            return;
        }
        const formData = new FormData();

        formData.append('file', image);
        formData.append('additional_info', query);
        
        try {
            submitQuery.disabled = true;
            submitQuery.textContent = 'Processing... ⏳';

            const response = await fetch('/upload_and_query', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            console.log("API Response:", result);

            if (!response.ok || !result.choices || !result.choices[0] || !result.choices[0].message || !result.choices[0].message.content) {
                throw new Error(result.detail || 'An error occurred while processing your request.');
            }
            
            const responseText = result.choices[0].message.content;
            const markdownResponse = result.choices[0].message.content;
            responseContainer.innerHTML = marked.parse(markdownResponse);
            responseContainer.classList.remove('hidden');
            errorContainer.classList.add('hidden');

            // Now create the second formData for create_hotspot
            const formData2 = new FormData();
            formData2.append('file', image);
            formData2.append('latitude', latitude); // Ensure latitude is defined
            formData2.append('longitude', longitude); // Ensure longitude is defined
            formData2.append('response', responseText);
            formData2.append('time', time); // Use the function to get the current time

            // Send the second request
            const hotspotResponse = await fetch('/create_hotspot', {
                method: 'POST',
                body: formData2
            });

            if (!hotspotResponse.ok) {
                throw new Error(`Server error: ${hotspotResponse.status} ${hotspotResponse.statusText}`);
            }

        } catch (error) {
            console.error('Error:', error);
            showError(error.message);
        } finally {
            submitQuery.disabled = false;
            submitQuery.textContent = '🚀 Submit Query';
        }
    });

    function showError(message) {
        errorText.textContent = message;
        errorContainer.classList.remove('hidden');
        responseContainer.classList.add('hidden');
        imageUpload.value = ''; // Clear the file input on error
    }
});