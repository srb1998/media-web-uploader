document.addEventListener('DOMContentLoaded', (event) => {

    const cloudName = "drfuycgyf"; 
    const uploadPreset = "telegram_news_uploader"; 

    // Get parameters from the page URL (e.g., ?story_id=1&workflow_id=abc)
    const urlParams = new URLSearchParams(window.location.search);
    const storyId = urlParams.get('story_id');
    const workflowId = urlParams.get('workflow_id');
    const platform = urlParams.get('platform');
    
    const titleEl = document.getElementById('title');
    const descriptionEl = document.getElementById('description');
    const statusEl = document.getElementById('status');

    if (!storyId || !workflowId || !platform) {
        titleEl.innerText = "Error";
        descriptionEl.innerText = "Missing story, workflow, or platform information in URL.";
        document.getElementById('upload_widget').disabled = true;
        return;
    }

    // Update the page title and description for clarity
    titleEl.innerText = `Upload for ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
    descriptionEl.innerText = `Story ID: ${storyId} | Workflow: ${workflowId}`;

    // Construct the dynamic folder path for Cloudinary
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
            statusEl.innerHTML += `<p>✅ Uploaded: ${result.info.original_filename}</p>`;
        }
        if (error) {
            console.error("Upload Widget Error:", error);
            statusEl.innerHTML += `<p>❌ Error uploading. See console for details.</p>`;
        }
        if (result && result.event === "close") {
            statusEl.innerHTML += `<p><b>Upload widget closed.</b></p>`;
        }
    });

    document.getElementById("upload_widget").addEventListener("click", function(){
        statusEl.innerHTML = ''; // Clear status on new upload
        myWidget.open();
    }, false);
});