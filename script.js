document.addEventListener('DOMContentLoaded', () => {
    const titleEl = document.getElementById('title');
    const descriptionEl = document.getElementById('description');
    const statusEl = document.getElementById('status');
    const uploadButton = document.getElementById('upload_widget');
    const resetButton = document.getElementById('reset_button');
    const spinner = document.getElementById('spinner');
    const imagePreview = document.getElementById('image_preview');

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

    uploadButton.disabled = false;
    titleEl.innerText = `Upload for ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
    descriptionEl.innerText = `Story ID: ${storyId} | Workflow: ${workflowId}`;

    const dynamicFolderPath = `news/upload/${workflowId}/${storyId}/${platform}`;

    const customContext = {
        story_id: storyId,
        workflow_id: workflowId,
        platform: platform
    };

    fetch('/api/cloudinary-config')
        .then(res => res.json())
        .then(({ cloudName, uploadPreset }) => {
            if (!cloudName || !uploadPreset) throw new Error('Invalid config');

            const myWidget = cloudinary.createUploadWidget({
                cloudName,
                uploadPreset,
                folder: dynamicFolderPath,
                context: customContext,
                cropping: false,
                multiple: true,
                maxFiles: 10,
            }, (error, result) => {
                if (!error && result && result.event === "success") {
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

        }).catch(err => {
            console.error('Failed to load Cloudinary config:', err);
            titleEl.innerText = "Error";
            descriptionEl.innerText = "Configuration not loaded.";
            uploadButton.disabled = true;
        });
});