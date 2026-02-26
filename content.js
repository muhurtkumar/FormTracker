let alreadyCaptured = false;

function getFormTitle() {
    const titleEl = document.querySelector('div[role="heading"]');
    return titleEl ? titleEl.innerText : document.title;
}

function isFinalSubmissionScreen() {
    // Look for confirmation text block
    const confirmationText = document.querySelector("div[role='heading'] + div");

    if (!confirmationText) return false;

    const text = confirmationText.innerText.toLowerCase();

    return text.includes("response") || text.includes("submitted");
}

function captureSubmission() {
    if (alreadyCaptured) return;

    alreadyCaptured = true;

    const data = {
        title: getFormTitle(),
        url: window.location.href,
        time: new Date().toLocaleString()
    };

    console.log("Form submitted:", data);

    chrome.runtime.sendMessage({
        type: "FORM_SUBMITTED",
        payload: data
    });
}

function observePage() {
    const observer = new MutationObserver(() => {
        if (isFinalSubmissionScreen()) {
            captureSubmission();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

observePage();