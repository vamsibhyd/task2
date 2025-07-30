document.getElementById("start").addEventListener("click", async () => {
  const response = await fetch(chrome.runtime.getURL("urls.json"));
  const urls = await response.json();

  console.log(" URLs to scrape:", urls);

  for (let i = 0; i < urls.length; i++) {
    console.log(` Opening profile #${i + 1}: ${urls[i]}`);
    await openAndScrapeProfile(urls[i]);
  }

  alert(" All profiles scraped and sent to backend!");
});

function openAndScrapeProfile(url) {
  return new Promise((resolve) => {
    chrome.tabs.create({ url: url, active: false }, function (tab) {
      const tabId = tab.id;
      console.log("Opened tab ID:", tabId);

      function handleMessage(request, sender, sendResponse) {
        if (request.type === "PROFILE_SCRAPED" && sender.tab.id === tabId) {
          console.log(" Received profile data from tab", tabId, ":", request.data);

          fetch("http://localhost:3000/api/profiles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request.data)
          })
          .then(() => {
            console.log("📦 Data sent to backend. Closing tab:", tabId);
            chrome.tabs.remove(tabId);
            chrome.runtime.onMessage.removeListener(handleMessage);
            resolve();
          })
          .catch((error) => {
            console.error(" Error posting data:", error);
            chrome.tabs.remove(tabId);
            chrome.runtime.onMessage.removeListener(handleMessage);
            resolve();
          });
        }
      }

      chrome.runtime.onMessage.addListener(handleMessage);
    });
  });
}