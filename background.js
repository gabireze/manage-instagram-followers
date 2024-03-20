chrome.action.onClicked.addListener(async function () {
  await chrome.tabs.create(
    { url: "https://www.instagram.com/" },
    async function (tab) {
      chrome.tabs.onUpdated.addListener(async function b(tabId, changeInfo) {
        if (tabId === tab.id && changeInfo.status === "complete") {
          await chrome.scripting.insertCSS({
            files: ["style.css"],
            target: { tabId: tab.id },
          });
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["html.js"],
          });
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: injectScript,
          });
          await chrome.tabs.onUpdated.removeListener(b);
        }
      });
    }
  );
});

async function injectScript() {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("script.js");
  script.onload = function () {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);
}
