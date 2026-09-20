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
              <h1 id="appTitle" data-i18n="appTitle">Manage Followers</h1>
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
          <h2 data-i18n="introTitle">See who doesn’t follow you back.</h2>
          <p id="info-text" data-i18n="introBody">Compare your connections, find non-followers, and clean up your following list.</p>
        </div>

        <nav class="list-tabs" aria-label="Connection lists" data-i18n-aria-label="listsLabel">
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
            <div>
              <h2 id="title">Following</h2>
              <p id="resultsSummary" class="results-summary" aria-live="polite"></p>
            </div>
            <div class="filter-buttons">
              <button type="button" id="filterNotFollowingBackButton" class="filter data-action-control"><span data-i18n="nonFollowersFilter">Not following you</span></button>
              <button type="button" id="filterNotFollowedBackButton" class="filter data-action-control"><span data-i18n="notFollowedBackFilter">You don’t follow</span></button>
            </div>
          </div>

          <div class="input-group" id="searchGroup">
            <label for="searchInput" data-i18n="searchLabel">Search accounts</label>
            <div class="search-field">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.8" />
                <path d="m16 16 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              </svg>
              <input type="search" id="searchInput" data-i18n-placeholder="searchPlaceholder" placeholder="Username or name" autocomplete="off" />
            </div>
          </div>

          <div class="user-list" id="userList" aria-live="polite"></div>

          <div class="loader" id="loader" aria-hidden="true">
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
                <p data-i18n="advancedHelp">Instagram’s own limits still apply and cannot be bypassed.</p>
              </div>
              <input type="checkbox" id="advancedModeToggle" role="switch" />
            </div>
          </details>
        </div>

        <footer class="app-footer">
          <span class="status-dot" aria-hidden="true"></span>
          <span data-i18n="footerNote">Actions are verified with Instagram before the interface changes.</span>
        </footer>
      </section>
    </div>
  `;

  document.body.insertBefore(root, document.body.firstChild);
};

init();
