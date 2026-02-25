let alreadyCaptured = false;

function getFormTitle() {
    const titleEl = document.querySelector('div[role="heading"]');
    return titleEl ? titleEl.innerText : document.title;
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

// Google Forms always redirects to /formResponse after submit
function detectByURL() {
    if (window.location.href.includes("formResponse")) {
        captureSubmission();
    }
}

function observePage() {
    const observer = new MutationObserver(() => {
        detectByURL();
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Run once + keep observing
detectByURL();
observePage();