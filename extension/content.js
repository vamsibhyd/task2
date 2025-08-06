// ------------------------
// TASK 2: Profile Scraper
// ------------------------

function getText(selector) {
  const el = document.querySelector(selector);
  return el ? el.innerText.trim() : "";
}

function getFollowerAndConnectionCounts() {
  const allListItems = document.querySelectorAll("li");
  let followerCount = "";
  let connectionCount = "";

  allListItems.forEach(li => {
    const text = li.innerText.toLowerCase();
    if (text.includes("followers")) followerCount = li.innerText.trim();
    if (text.includes("connections")) connectionCount = li.innerText.trim();
  });

  return { followerCount, connectionCount };
}

setTimeout(() => {
  if (window.location.href.includes("/in/")) {
    console.log(" Profile content script loaded");

    const { followerCount, connectionCount } = getFollowerAndConnectionCounts();

    const data = {
      name: getText("h1.text-heading-xlarge"),
      url: window.location.href,
      about: getText("section.pv-about-section"),
      bio: getText(".text-body-medium.break-words"),
      location: getText(".text-body-small.inline.t-black--light.break-words"),
      followerCount,
      connectionCount,
      bioLine: getText(".text-body-medium.break-words")
    };

    console.log(" Scraped Profile Data:", data);

    chrome.runtime.sendMessage({ type: "PROFILE_SCRAPED", data });
  }
}, 7000);

// ------------------------
// TASK 3: Feed Reactor
// ------------------------

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "START_REACTING") {
    const { likeCount, commentCount } = request;

    console.log(" Starting Feed Interaction:");
    console.log("Likes:", likeCount, "Comments:", commentCount);

    startFeedInteraction(likeCount, commentCount);
  }
});

async function startFeedInteraction(likeCount, commentCount) {
  await waitForFeedToLoad();

  const likeButtons = Array.from(document.querySelectorAll('button[aria-label*="Like"], button[aria-label*="like"]'))
    .filter(btn => btn.offsetParent !== null);

  const commentButtons = Array.from(document.querySelectorAll('button[aria-label*="Comment"], button[aria-label*="comment"]'))
    .filter(btn => btn.offsetParent !== null);

  shuffleArray(likeButtons);
  shuffleArray(commentButtons);

  // Perform Likes
  for (let i = 0; i < Math.min(likeCount, likeButtons.length); i++) {
    likeButtons[i].click();
    console.log(` Liked post #${i + 1}`);
    await sleep(1000 + Math.random() * 1000);
  }

  // Perform Comments
for (let i = 0; i < Math.min(commentCount, commentButtons.length); i++) {
  console.log(`Attempting to comment on post #${i + 1}`);
  commentButtons[i].click();
  await sleep(1500); 

  const textareas = Array.from(document.querySelectorAll('div[role="textbox"]'))
    .filter(el => el.offsetParent !== null);

  if (textareas.length > 0) {
    console.log(" Found comment box");

    // Focus and simulate real typing
    textareas[0].focus();
    document.execCommand("insertText", false, "CFBR");

    await sleep(800); // Allow React to enable submit

    let submitButton = null;
    let retryCount = 0;

    while ((!submitButton || submitButton.disabled) && retryCount < 5) {
      submitButton = document.querySelector('button.comments-comment-box__submit-button');
      if (submitButton && submitButton.offsetParent !== null && !submitButton.disabled) {
        break;
      }
      await sleep(500);
      retryCount++;
    }

    if (submitButton && !submitButton.disabled) {
      console.log(" Found and clicked submit button");
      submitButton.click();
      console.log(` Commented on post #${i + 1}`);
      await sleep(1000 + Math.random() * 1000);
    } else {
      console.warn(" Submit button still not clickable after retries");
    }
  } else {
    console.warn(" No comment box found");
  }
}

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function waitForFeedToLoad() {
  return new Promise(resolve => {
    const checkInterval = setInterval(() => {
      const posts = document.querySelectorAll('[data-id*="urn:li:activity"]');
      if (posts.length > 0) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 1000);
  });
}