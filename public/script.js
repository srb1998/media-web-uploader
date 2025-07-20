document.addEventListener('DOMContentLoaded', (event) => {
    // Elements
    const titleEl = document.getElementById('title');
    const descriptionEl = document.getElementById('description');
    const statusEl = document.getElementById('status');
    const uploadButton = document.getElementById('upload_widget');
    const resetButton = document.getElementById('reset_button');
    const spinner = document.getElementById('spinner');

    // Cloudinary configuration (placeholders replaced by Vercel)
    const cloudName = 'CLOUDINARY_CLOUD_NAME';
    const uploadPreset = 'CLOUDINARY_UPLOAD_PRESET';

    // Check if placeholders were replaced
    if (cloudName === 'CLOUDINARY_CLOUD_NAME' || uploadPreset === 'CLOUDINARY_UPLOAD_PRESET') {
        titleEl.innerText = "Error";
        descriptionEl.innerText = "Configuration not loaded.";
        uploadButton.disabled = true;
        return;
    }

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const storyId = urlParams.get('story_id');
    const workflowId = urlParams.get('workflow_id');
    const platform = urlParams.get('platform');

    if (!storyId || !workflowId || !platform) {
        titleEl.innerText = "Error";
        descriptionEl.innerText = "Missing story, workflow, or platform information in URL.";
        uploadButton.disabled = true;
        return;
    }

    // Update page content
    titleEl.innerText = `Upload for ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
    descriptionEl.innerText = `Story ID: ${storyId} | Workflow: ${workflowId}`;

    // Construct Cloudinary folder path
    const dynamicFolderPath = `news/upload/${workflowId}/${storyId}/${platform}`;
    console.log("Target Cloudinary Folder:", dynamicFolderPath);

    // Initialize Cloudinary widget
    const myWidget = cloudinary.createUploadWidget({
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        folder: dynamicFolderPath,
        cropping: false,
        multiple: true,
        maxFiles: 10,
    }, (error, result) => {
        if (!error && result && result.event === "success") {
            console.log('Done! Here is the image info: ', result.info);
            statusEl.innerHTML += `<p>✅ Uploaded: ${result.info.original_filename}</p>`;
            resetButton.style.display = 'inline-block';
            spinner.style.display = 'none';
            uploadButton.disabled = false;
        }
        if (error) {
            console.error("Upload Widget Error:", error);
            statusEl.innerHTML += `<p>❌ Error uploading. See console for details.</p>`;
            spinner.style.display = 'none';
            uploadButton.disabled = false;
        }
        if (result && result.event === "close") {
            statusEl.innerHTML += `<p><b>Upload widget closed.</b></p>`;
            spinner.style.display = 'none';
            uploadButton.disabled = false;
        }
        if (result && result.event === "open") {
            spinner.style.display = 'block';
            uploadButton.disabled = true;
        }
    });

    // Upload button event listener
    uploadButton.addEventListener("click", () => {
        statusEl.innerHTML = ''; // Clear status
        resetButton.style.display = 'none';
        myWidget.open();
    });

    // Reset button event listener
    resetButton.addEventListener("click", () => {
        statusEl.innerHTML = '';
        resetButton.style.display = 'none';
        descriptionEl.innerText = `Story ID: ${storyId} | Workflow: ${workflowId}`;
    });
});