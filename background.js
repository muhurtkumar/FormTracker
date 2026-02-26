chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "FORM_SUBMITTED") {

        if (!message?.payload?.url) return;

        const newEntry = {
            id: crypto.randomUUID(),   // unique ID
            title: message.payload.title,
            url: message.payload.url,
            time: message.payload.time,
            status: "Submitted",       // default status
            notes: ""
        };

        chrome.storage.local.get({ submissions: [] }, (result) => {

            // Prevent duplicate based on same URL + time
            const alreadyExists = result.submissions.some(
                entry => entry.url === newEntry.url && entry.time === newEntry.time
            );

            if (alreadyExists) {
                console.log("Duplicate submission prevented.");
                return;
            }

            const updated = [...result.submissions, newEntry];

            chrome.storage.local.set({ submissions: updated }, () => {
                console.log("Stored submissions:", updated);
            });
        });
    }
});