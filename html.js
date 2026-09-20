const init = () => {
  const existingRoot = document.getElementById("manage-instagram-followers-root");
  if (existingRoot) existingRoot.remove();

  const root = document.createElement("div");
  root.id = "manage-instagram-followers-root";
  root.innerHTML = `
    <div class="overlay" id="overlay">
      <section class="my-component" role="dialog" aria-modal="true" aria-labelledby="appTitle" aria-describedby="info-text">
        <header class="app-header">
          <div class="brand-block">
            <span class="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                <circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.8" />
                <circle cx="16" cy="16" r="3" stroke="currentColor" stroke-width="1.8" />
                <path d="M10.2 10.2 13.8 13.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              </svg>
            </span>
            <div>
              <h1 id="appTitle" data-i18n="appTitle">Manage Instagram Followers</h1>
              <p class="app-kicker">Instagram</p>
            </div>
          </div>

          <div class="header-actions">
            <div class="language-switch" role="group" aria-label="Language">
              <button type="button" class="language-button" data-locale="en" aria-pressed="true">EN</button>
              <button type="button" class="language-button" data-locale="pt" aria-pressed="false">PT</button>
            </div>
            <button type="button" id="closeExtensionButton" class="icon-button" data-i18n-aria-label="close" aria-label="Close">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              </svg>
            </button>
          </div>
        </header>

        <div class="intro-block">
          <span class="intro-eyebrow" data-i18n="introEyebrow">Connection checkup</span>
          <h2 data-i18n="introTitle">See who doesn’t follow you back.</h2>
          <p id="info-text" data-i18n="introBody">Compare your connections, find non-followers, and clean up your following list.</p>
          <button type="button" id="findNonFollowersButton" class="primary-cta data-action-control">
            <span data-i18n="findNonFollowers">Find non-followers</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
              <path d="m9 6 6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <ol class="intro-steps" data-i18n-aria-label="howItWorks" aria-label="How it works">
            <li><span>1</span><div><strong data-i18n="stepCompare">Compare</strong><small data-i18n="stepCompareDetail">Followers and following</small></div></li>
            <li><span>2</span><div><strong data-i18n="stepReview">Review</strong><small data-i18n="stepReviewDetail">See the relationship status</small></div></li>
            <li><span>3</span><div><strong data-i18n="stepDecide">Decide</strong><small data-i18n="stepDecideDetail">Choose who to unfollow</small></div></li>
          </ol>
          <p class="privacy-note">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            <span data-i18n="privacyNote">Your connection data stays in this browser.</span>
          </p>
        </div>

        <nav id="listTabs" class="list-tabs" aria-label="Connection lists" data-i18n-aria-label="listsLabel" hidden>
          <button type="button" id="loadFollowingButton" class="list-tab data-action-control">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
              <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7-1h6m-3-3v6M2 20c.7-3.2 2.7-5 6-5 2 0 3.5.7 4.5 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span data-i18n="followingTab">Following</span>
          </button>
          <button type="button" id="loadFollowersButton" class="list-tab data-action-control">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
              <path d="M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6 8c-.7-3.2-2.7-5-6-5s-5.3 1.8-6 5m13-9h5m-2.5-2.5v5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span data-i18n="followersTab">Followers</span>
          </button>
        </nav>

        <div id="notice" class="notice" role="status" aria-live="polite" hidden>
          <svg class="notice-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
            <path d="M12 10v6m0-9h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          <span id="noticeText"></span>
          <button type="button" id="dismissNoticeButton" class="notice-dismiss" data-i18n-aria-label="dismiss" aria-label="Dismiss">×</button>
        </div>

        <div class="workspace" id="workspace" hidden>
          <div id="titleAndFilter" class="list-heading">
            <div class="title-copy">
              <button type="button" id="backHomeButton" class="back-button" data-i18n-aria-label="backHome" aria-label="Back to start">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true"><path d="m15 6-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </button>
              <div>
                <h2 id="title">Following</h2>
                <p id="resultsSummary" class="results-summary" aria-live="polite"></p>
              </div>
            </div>
            <div class="filter-buttons">
              <button type="button" id="filterAllButton" class="filter data-action-control filter-active" data-filter="all"><span data-i18n="allFilter">All</span><span class="filter-count" data-count="all"></span></button>
              <button type="button" id="filterNotFollowingBackButton" class="filter data-action-control" data-filter="notFollowingBack"><span data-i18n="nonFollowersFilter">Not following you</span><span class="filter-count" data-count="notFollowingBack"></span></button>
              <button type="button" id="filterMutualButton" class="filter data-action-control" data-filter="mutual"><span data-i18n="mutualFilter">Mutual</span><span class="filter-count" data-count="mutual"></span></button>
              <button type="button" id="filterNotFollowedBackButton" class="filter data-action-control" data-filter="notFollowedBack"><span data-i18n="notFollowedBackFilter">You don’t follow</span><span class="filter-count" data-count="notFollowedBack"></span></button>
              <button type="button" id="filterRequestedButton" class="filter data-action-control" data-filter="requested"><span data-i18n="requestedFilter">Requested</span><span class="filter-count" data-count="requested"></span></button>
              <button type="button" id="selectVisibleButton" class="filter" data-i18n="selectShown">Select shown</button>
            </div>
          </div>

          <div class="input-group" id="searchGroup">
            <div class="search-control">
              <label for="searchInput" data-i18n="searchLabel">Search accounts</label>
              <div class="search-field">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.8" />
                  <path d="m16 16 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
                <input type="search" id="searchInput" data-i18n-placeholder="searchPlaceholder" placeholder="Username or name" autocomplete="off" />
              </div>
            </div>
            <div class="sort-control">
              <label for="sortSelect" data-i18n="sortLabel">Sort</label>
              <select id="sortSelect" class="sort-select data-action-control">
                <option value="relationship" data-i18n="sortRelationship">Relationship</option>
                <option value="username" data-i18n="sortUsername">Username</option>
                <option value="name" data-i18n="sortName">Name</option>
              </select>
            </div>
            <button type="button" id="refreshButton" class="refresh-button data-action-control" data-i18n-aria-label="refresh" aria-label="Refresh">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true"><path d="M20 6v5h-5M4 18v-5h5M18.5 9A7 7 0 0 0 6 6.5L4 9m2 6a7 7 0 0 0 12 2.5L20 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </button>
          </div>
          <p id="updatedAt" class="updated-at" aria-live="polite"></p>

          <div id="batchBar" class="batch-bar" hidden>
            <span id="selectionSummary"></span>
            <div class="batch-actions">
              <button type="button" id="clearSelectionButton" class="text-button" data-i18n="clearSelection">Clear</button>
              <button type="button" id="stopBatchButton" class="text-button" data-i18n="stopBatch" hidden>Stop</button>
              <button type="button" id="unfollowSelectedButton" class="danger-button" data-i18n="unfollowSelected">Unfollow selected</button>
            </div>
          </div>

          <div class="user-list" id="userList"></div>

          <div class="loader" id="loader" aria-hidden="true">
            <p id="loadingProgress" class="loading-progress" data-i18n="loadingConnections">Comparing your connections…</p>
            <div class="skeleton-row"><span></span><span></span><span></span></div>
            <div class="skeleton-row"><span></span><span></span><span></span></div>
            <div class="skeleton-row"><span></span><span></span><span></span></div>
          </div>

          <details class="advanced-panel" id="advancedPanel">
            <summary>
              <span data-i18n="advancedTitle">Advanced mode</span>
              <span class="advanced-summary-note" data-i18n="advancedSummary">Extension limits</span>
            </summary>
            <div class="advanced-toggle" id="advancedToggleGroup">
              <div>
                <label for="advancedModeToggle" data-i18n="advancedLabel">Disable extension safety limits</label>
                <p data-i18n="advancedHelp">Instagram’s own limits still apply. Advanced mode turns off after 15 minutes.</p>
              </div>
              <input type="checkbox" id="advancedModeToggle" role="switch" />
            </div>
            <button type="button" id="copyDiagnosticsButton" class="diagnostic-button" data-i18n="copyDiagnostics">Copy diagnostic report</button>
          </details>
        </div>

        <footer class="app-footer">
          <span class="status-dot" aria-hidden="true"></span>
          <span data-i18n="footerNote">Actions are verified with Instagram before the interface changes.</span>
        </footer>

        <div id="confirmDialog" class="confirm-backdrop" hidden>
          <div class="confirm-card" role="alertdialog" aria-modal="true" aria-labelledby="confirmTitle" aria-describedby="confirmBody">
            <h2 id="confirmTitle"></h2>
            <p id="confirmBody"></p>
            <div class="confirm-actions">
              <button type="button" id="cancelConfirmButton" class="text-button" data-i18n="cancel">Cancel</button>
              <button type="button" id="acceptConfirmButton" class="danger-button" data-i18n="confirmUnfollow">Unfollow</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;

  document.body.insertBefore(root, document.body.firstChild);
};

init();

if (!window.__manageInstagramFollowersStorageBridge) {
  window.__manageInstagramFollowersStorageBridge = true;
  window.addEventListener("message", async (event) => {
    if (event.source !== window || !event.data?.mifStorage) return;
    const { action, payload, requestId } = event.data;

    if (action === "get") {
      const state = await chrome.runtime.sendMessage({
        mifStorage: true,
        action: "get",
      });
      window.postMessage(
        {
          mifStorage: true,
          action: "state",
          requestId,
          payload: {
            locale: state?.locale,
            rateLimits: state?.rateLimits,
          },
        },
        window.location.origin
      );
    }

    if (action === "setLocale" && ["en", "pt"].includes(payload)) {
      await chrome.runtime.sendMessage({
        mifStorage: true,
        action: "setLocale",
        payload,
      });
    }

    if (action === "setRateLimits") {
      const sanitized = {
        follow: Array.isArray(payload?.follow)
          ? payload.follow.filter(Number.isFinite)
          : [],
        unfollow: Array.isArray(payload?.unfollow)
          ? payload.unfollow.filter(Number.isFinite)
          : [],
      };
      await chrome.runtime.sendMessage({
        mifStorage: true,
        action: "setRateLimits",
        payload: sanitized,
      });
    }
  });
}
