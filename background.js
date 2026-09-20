const INSTAGRAM_URL_PATTERN = "https://*.instagram.com/*";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message?.mifStorage) return false;

  (async () => {
    if (message.action === "get") {
      const [localState, sessionState] = await Promise.all([
        chrome.storage.local.get("locale"),
        chrome.storage.session.get("rateLimits"),
      ]);
      sendResponse({
        locale: localState.locale,
        rateLimits: sessionState.rateLimits,
      });
      return;
    }

    if (message.action === "setLocale" && ["en", "pt"].includes(message.payload)) {
      await chrome.storage.local.set({ locale: message.payload });
      sendResponse({ ok: true });
      return;
    }

    if (message.action === "setRateLimits") {
      const sanitized = {
        follow: Array.isArray(message.payload?.follow)
          ? message.payload.follow.filter(Number.isFinite)
          : [],
        unfollow: Array.isArray(message.payload?.unfollow)
          ? message.payload.unfollow.filter(Number.isFinite)
          : [],
      };
      await chrome.storage.session.set({ rateLimits: sanitized });
      sendResponse({ ok: true });
    }
  })().catch((error) => sendResponse({ error: error.message }));

  return true;
});

chrome.action.onClicked.addListener(async (clickedTab) => {
  let targetTab = clickedTab;

  if (!targetTab?.url?.startsWith("https://www.instagram.com/")) {
    const instagramTabs = await chrome.tabs.query({
      url: [INSTAGRAM_URL_PATTERN],
    });
    targetTab = instagramTabs.find((tab) => tab.active) || instagramTabs[0];
  }

  if (!targetTab?.id) {
    targetTab = await chrome.tabs.create({ url: "https://www.instagram.com/" });
    await waitForTab(targetTab.id);
  } else {
    await chrome.tabs.update(targetTab.id, { active: true });
    if (targetTab.windowId) {
      await chrome.windows.update(targetTab.windowId, { focused: true });
    }
  }

  await injectExtension(targetTab.id);
});

function waitForTab(tabId) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(onUpdated);
      reject(new Error("Instagram took too long to load."));
    }, 30000);

    function onUpdated(updatedTabId, changeInfo) {
      if (updatedTabId !== tabId || changeInfo.status !== "complete") return;
      clearTimeout(timeout);
      chrome.tabs.onUpdated.removeListener(onUpdated);
      resolve();
    }

    chrome.tabs.onUpdated.addListener(onUpdated);
  });
}

async function injectExtension(tabId) {
  await chrome.scripting.insertCSS({
    files: ["tokens.css", "style.css"],
    target: { tabId },
  });
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ["html.js"],
  });
  await chrome.scripting.executeScript({
    target: { tabId },
    function: injectPageScripts,
  });
}

function injectPageScripts() {
  const sources = ["core.js", "script.js"].map((file) =>
    chrome.runtime.getURL(file)
  );

  const loadNext = () => {
    const source = sources.shift();
    if (!source) return;

    const script = document.createElement("script");
    script.src = source;
    script.onload = () => {
      script.remove();
      loadNext();
    };
    script.onerror = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
  };

  loadNext();
}
