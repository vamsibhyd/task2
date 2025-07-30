chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "SEND_PROFILE_DATA") {
    console.log(" Received in background:", request.data);

    fetch("http://localhost:3000/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request.data)
    })
    .then(res => {
      console.log(" Successfully posted to backend");
      sendResponse({ success: true });
    })
    .catch(err => {
      console.error(" Post error:", err);
      sendResponse({ success: false, error: err.message });
    });
    return true;
  }
});