document.addEventListener('DOMContentLoaded', (event) => {
    const titleEl = document.getElementById('title');
    const descriptionEl = document.getElementById('description');
    const statusEl = document.getElementById('status');
    const uploadButton = document.getElementById('upload_widget');
    const resetButton = document.getElementById('reset_button');
    const spinner = document.getElementById('spinner');
    const imagePreview = document.getElementById('image_preview');

    const cloudName = 'CLOUDINARY_CLOUD_NAME';
    const uploadPreset = 'CLOUDINARY_UPLOAD_PRESET';

    if (cloudName === 'CLOUDINARY_CLOUD_NAME' || uploadPreset === 'CLOUDINARY_UPLOAD_PRESET') {
        titleEl.innerText = "Error";
        descriptionEl.innerText = "Configuration not loaded.";
        uploadButton.disabled = true;
        return;
    }

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

    titleEl.innerText = `Upload for ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
    descriptionEl.innerText = `Story ID: ${storyId} | Workflow: ${workflowId}`;

    const dynamicFolderPath = `news/upload/${workflowId}/${storyId}/${platform}`;
    console.log("Target Cloudinary Folder:", dynamicFolderPath);

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
            const fileName = result.info.original_filename;
            const fileUrl = result.info.secure_url;
            statusEl.innerHTML += `<p>✅ Uploaded: ${fileName}</p>`;
            const img = document.createElement('img');
            img.src = fileUrl;
            img.alt = fileName;
            img.title = fileName;
            img.addEventListener('click', () => window.open(fileUrl, '_blank'));
            imagePreview.appendChild(img);
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

    uploadButton.addEventListener("click", () => {
        statusEl.innerHTML = '';
        imagePreview.innerHTML = '';
        resetButton.style.display = 'none';
        myWidget.open();
    });

    resetButton.addEventListener("click", () => {
        statusEl.innerHTML = '';
        imagePreview.innerHTML = '';
        resetButton.style.display = 'none';
        descriptionEl.innerText = `Story ID: ${storyId} | Workflow: ${workflowId}`;
    });
});