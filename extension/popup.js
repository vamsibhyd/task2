document.addEventListener("DOMContentLoaded", () => {
  const scrapeBtn = document.getElementById("scrapeBtn");
  const reactBtn = document.getElementById("reactBtn");
  const likeInput = document.getElementById("likeCount");
  const commentInput = document.getElementById("commentCount");

  // Task 2: Profile scraping
  scrapeBtn.addEventListener("click", async () => {
    const response = await fetch(chrome.runtime.getURL("urls.json"));
    const urls = await response.json();

    console.log("URLs to scrape:", urls);

    for (let i = 0; i < urls.length; i++) {
      console.log(`Opening profile #${i + 1}: ${urls[i]}`);
      await openAndScrapeProfile(urls[i]);
    }

    alert("All profiles scraped and sent to backend!");
  });

  function openAndScrapeProfile(url) {
    return new Promise((resolve) => {
      chrome.tabs.create({ url: url, active: false }, function (tab) {
        const tabId = tab.id;

        function handleMessage(request, sender, sendResponse) {
          if (request.type === "PROFILE_SCRAPED" && sender.tab.id === tabId) {
            fetch("http://localhost:3000/api/profiles", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(request.data)
            })
              .then(() => {
                chrome.tabs.remove(tabId);
                chrome.runtime.onMessage.removeListener(handleMessage);
                resolve();
              })
              .catch((error) => {
                console.error("Error posting data:", error);
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

  // Task 3: Feed Interaction Logic

  function validateInputs() {
    const likeVal = likeInput.value.trim();
    const commentVal = commentInput.value.trim();
    reactBtn.disabled = !(likeVal && commentVal && +likeVal >= 0 && +commentVal >= 0);
  }

  likeInput.addEventListener("input", validateInputs);
  commentInput.addEventListener("input", validateInputs);

  reactBtn.addEventListener("click", () => {
    const likeCount = parseInt(likeInput.value);
    const commentCount = parseInt(commentInput.value);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "START_REACTING",
        likeCount,
        commentCount
      });
    });
  });
});