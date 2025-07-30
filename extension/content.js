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
  console.log(" Content script loaded!");

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

  console.log(" Scraped Data:", data);

  chrome.runtime.sendMessage({ type: "SEND_PROFILE_DATA", data });
}, 7000);