document.addEventListener('DOMContentLoaded', function() {
    const uploadBtn = document.getElementById('upload-btn');
    const imageUpload = document.getElementById('image-upload');
    const displayImage = document.getElementById('display-image');
    const imageContainer = document.getElementById('image-container');
    const queryInput = document.getElementById('query-input');
    const submitQuery = document.getElementById('submit-query');
    const responseContainer = document.getElementById('response-container');
    const errorContainer = document.getElementById('error-container');
    const errorText = document.getElementById('error-text');

    // Click to Upload button trigger
    uploadBtn.addEventListener('click', () => {
        imageUpload.click();
    });

    // Display uploaded image
    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                displayImage.src = e.target.result;
                imageContainer.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
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
            
            const markdownResponse = result.choices[0].message.content
            responseContainer.innerHTML = marked.parse(markdownResponse);
            responseContainer.classList.remove('hidden');
            errorContainer.classList.add('hidden');
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
    }
});