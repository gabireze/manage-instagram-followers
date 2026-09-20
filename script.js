const translations = {
  en: {
    appTitle: "Manage Followers",
    introTitle: "See who doesn’t follow you back.",
    introBody:
      "Compare your connections, find non-followers, and clean up your following list.",
    followingTab: "Following",
    followersTab: "Followers",
    listsLabel: "Connection lists",
    close: "Close",
    dismiss: "Dismiss message",
    searchLabel: "Search accounts",
    searchPlaceholder: "Username or name",
    nonFollowersFilter: "Not following you",
    notFollowedBackFilter: "You don’t follow",
    removeFilter: "Show everyone",
    advancedTitle: "Advanced mode",
    advancedSummary: "Extension limits",
    advancedLabel: "Disable extension safety limits",
    advancedHelp: "Instagram’s own limits still apply and cannot be bypassed.",
    footerNote:
      "Actions are verified with Instagram before the interface changes.",
    followingTitle: "Following",
    followersTitle: "Followers",
    resultCount: "{count} account",
    resultCountPlural: "{count} accounts",
    filteredCount: "{count} of {total} accounts",
    noUsersTitle: "No accounts here",
    noUsersBody: "Instagram returned an empty list for this view.",
    noSearchTitle: "No matching accounts",
    noSearchBody: "Try another username or name.",
    noFilterTitle: "You’re all caught up",
    noFilterBody: "No accounts match this filter.",
    loginRequired:
      "Log in to Instagram, then reopen the extension to manage your connections.",
    loadError:
      "Instagram couldn’t load this list. Wait a moment and try again.",
    filterError:
      "Instagram couldn’t compare these lists. Wait a moment and try again.",
    mutual: "You follow each other",
    notFollowingYou: "Doesn’t follow you back",
    youDontFollow: "You don’t follow back",
    neither: "You don’t follow each other",
    requestSent: "Follow request sent",
    follow: "Follow",
    followBack: "Follow back",
    unfollow: "Unfollow",
    cancelRequest: "Cancel request",
    followingLoading: "Following…",
    unfollowingLoading: "Unfollowing…",
    cancellingLoading: "Cancelling…",
    minuteLimit:
      "You reached the extension’s {action} limit for one minute. Wait before trying again.",
    hourLimit:
      "You reached the extension’s {action} limit for one hour. Wait before trying again.",
    actionFollow: "follow",
    actionUnfollow: "unfollow",
    instagramBlocked:
      "Instagram blocked the {action} request: {reason}. Advanced mode only disables this extension’s limits.",
    instagramRejected: "Instagram rejected the {action} request: {reason}.",
    relationshipUnchanged:
      "Instagram answered the {action} request, but the relationship didn’t change.",
    actionFailed: "Instagram couldn’t complete the {action} request.",
  },
  pt: {
    appTitle: "Gerenciar seguidores",
    introTitle: "Veja quem não segue você de volta.",
    introBody:
      "Compare suas conexões, encontre quem não segue você e organize a lista de perfis seguidos.",
    followingTab: "Seguindo",
    followersTab: "Seguidores",
    listsLabel: "Listas de conexões",
    close: "Fechar",
    dismiss: "Dispensar mensagem",
    searchLabel: "Buscar contas",
    searchPlaceholder: "Nome de usuário ou nome",
    nonFollowersFilter: "Não seguem você",
    notFollowedBackFilter: "Você não segue",
    removeFilter: "Mostrar todos",
    advancedTitle: "Modo avançado",
    advancedSummary: "Limites da extensão",
    advancedLabel: "Desativar limites de segurança da extensão",
    advancedHelp:
      "Os limites do Instagram continuam valendo e não podem ser ignorados.",
    footerNote:
      "As ações são confirmadas com o Instagram antes de atualizar a interface.",
    followingTitle: "Seguindo",
    followersTitle: "Seguidores",
    resultCount: "{count} conta",
    resultCountPlural: "{count} contas",
    filteredCount: "{count} de {total} contas",
    noUsersTitle: "Nenhuma conta nesta lista",
    noUsersBody: "O Instagram retornou uma lista vazia para esta visualização.",
    noSearchTitle: "Nenhuma conta encontrada",
    noSearchBody: "Tente outro nome de usuário ou nome.",
    noFilterTitle: "Tudo certo por aqui",
    noFilterBody: "Nenhuma conta corresponde a este filtro.",
    loginRequired:
      "Entre no Instagram e abra a extensão novamente para gerenciar suas conexões.",
    loadError:
      "O Instagram não conseguiu carregar esta lista. Aguarde um momento e tente novamente.",
    filterError:
      "O Instagram não conseguiu comparar as listas. Aguarde um momento e tente novamente.",
    mutual: "Vocês se seguem",
    notFollowingYou: "Não segue você de volta",
    youDontFollow: "Você não segue de volta",
    neither: "Vocês não se seguem",
    requestSent: "Solicitação enviada",
    follow: "Seguir",
    followBack: "Seguir de volta",
    unfollow: "Deixar de seguir",
    cancelRequest: "Cancelar solicitação",
    followingLoading: "Seguindo…",
    unfollowingLoading: "Deixando de seguir…",
    cancellingLoading: "Cancelando…",
    minuteLimit:
      "Você atingiu o limite de ações de {action} por minuto da extensão. Aguarde antes de tentar novamente.",
    hourLimit:
      "Você atingiu o limite de ações de {action} por hora da extensão. Aguarde antes de tentar novamente.",
    actionFollow: "seguir",
    actionUnfollow: "deixar de seguir",
    instagramBlocked:
      "O Instagram bloqueou a ação de {action}: {reason}. O modo avançado desativa apenas os limites da extensão.",
    instagramRejected: "O Instagram recusou a ação de {action}: {reason}.",
    relationshipUnchanged:
      "O Instagram respondeu à ação de {action}, mas a relação entre as contas não mudou.",
    actionFailed: "O Instagram não conseguiu concluir a ação de {action}.",
  },
};

const localeStorageKey = "manageInstagramFollowers.locale";
let currentLocale = "en";

function t(key, values = {}) {
  const template = translations[currentLocale]?.[key] || translations.en[key] || key;
  return Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template
  );
}

function getPreferredLocale() {
  const savedLocale = localStorage.getItem(localeStorageKey);
  if (savedLocale === "en" || savedLocale === "pt") return savedLocale;
  return navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en";
}

const loadFollowersButton = document.getElementById("loadFollowersButton");
const loadFollowingButton = document.getElementById("loadFollowingButton");
const advancedToggleGroup = document.getElementById("advancedToggleGroup");
const searchGroup = document.getElementById("searchGroup");
const titleAndFilter = document.getElementById("titleAndFilter");
let advancedModeEnabled = false;
const filterNotFollowingBackButton = document.getElementById(
  "filterNotFollowingBackButton"
);
const filterNotFollowedBackButton = document.getElementById(
  "filterNotFollowedBackButton"
);
const overlay = document.getElementById("overlay");
const infoText = document.getElementById("info-text");
const title = document.getElementById("title");
const workspace = document.getElementById("workspace");
const userList = document.getElementById("userList");
const resultsSummary = document.getElementById("resultsSummary");
const notice = document.getElementById("notice");
const noticeText = document.getElementById("noticeText");

function setLocale(locale, persist = true) {
  currentLocale = locale === "pt" ? "pt" : "en";
  if (persist) localStorage.setItem(localeStorageKey, currentLocale);

  document
    .getElementById("manage-instagram-followers-root")
    ?.setAttribute("lang", currentLocale === "pt" ? "pt-BR" : "en");

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });
  document.querySelectorAll(".language-button").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.locale === currentLocale)
    );
  });

  filterNotFollowingBackButton.textContent = t(
    currentFilter === "notFollowingBack"
      ? "removeFilter"
      : "nonFollowersFilter"
  );
  filterNotFollowedBackButton.textContent = t(
    currentFilter === "notFollowedBack"
      ? "removeFilter"
      : "notFollowedBackFilter"
  );

  if (caller) {
    const searchInput = document.getElementById("searchInput");
    if (searchInput.value.trim()) {
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));
    } else {
      addUsersToDom(currentFilteredUsers || [...loadedUsers.values()]);
    }
  }
}

function showNotice(message, tone = "error") {
  noticeText.textContent = message;
  notice.dataset.tone = tone;
  notice.hidden = false;
}

function dismissNotice() {
  notice.hidden = true;
  noticeText.textContent = "";
  delete notice.dataset.tone;
}

function closeExtension() {
  document.getElementById("manage-instagram-followers-root")?.remove();
}

document.querySelectorAll(".language-button").forEach((button) => {
  button.addEventListener("click", () => setLocale(button.dataset.locale));
});
document
  .getElementById("closeExtensionButton")
  .addEventListener("click", closeExtension);
document
  .getElementById("dismissNoticeButton")
  .addEventListener("click", dismissNotice);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeExtension();
});

function resetUI() {
  loadedUsers.clear();
  currentFilter = null;
  currentFilteredUsers = null;
  document.getElementById("userList").innerHTML = "";
  document.getElementById("searchInput").value = "";
  filterNotFollowingBackButton.textContent = t("nonFollowersFilter");
  filterNotFollowedBackButton.textContent = t("notFollowedBackFilter");
  title.textContent =
    caller === "Followers" ? t("followersTitle") : t("followingTitle");
  title.style.display = "flex";
  document
    .querySelectorAll(".filter")
    .forEach((element) => element.classList.remove("filter-active"));
  infoText.style.display = "none";
  advancedToggleGroup.style.display = "flex";
  searchGroup.style.display = "grid";
  titleAndFilter.style.display = "flex";
  workspace.hidden = false;
  const introBlock = document.querySelector(".intro-block");
  introBlock.hidden = true;
  introBlock.style.display = "none";
  dismissNotice();
}

function toggleFilterButtons({
  followingBackDisplay = "none",
  followedBackDisplay = "flex",
  followedBackTextKey = "",
}) {
  filterNotFollowingBackButton.style.display = followingBackDisplay;
  filterNotFollowedBackButton.style.display = followedBackDisplay;
  if (followedBackTextKey) {
    filterNotFollowedBackButton.textContent = t(followedBackTextKey);
  }
}

document
  .getElementById("advancedModeToggle")
  .addEventListener("change", function (e) {
    advancedModeEnabled = e.target.checked;
    console.log("Advanced Mode:", advancedModeEnabled);
  });

loadFollowersButton.addEventListener("click", async () => {
  if (!viewerId) {
    showNotice(t("loginRequired"));
    return;
  }
  resetUI();
  setActiveListTab("Followers");
  await fetchFollowers();
  toggleFilterButtons({ followedBackTextKey: "notFollowedBackFilter" });
});

loadFollowingButton.addEventListener("click", async () => {
  if (!viewerId) {
    showNotice(t("loginRequired"));
    return;
  }
  resetUI();
  setActiveListTab("Following");
  await fetchFollowing();
  toggleFilterButtons({
    followingBackDisplay: "flex",
    followedBackDisplay: "none",
    followedBackTextKey: "nonFollowersFilter",
  });
});

function setActiveListTab(type) {
  loadFollowingButton.classList.toggle("is-active", type === "Following");
  loadFollowersButton.classList.toggle("is-active", type === "Followers");
  loadFollowingButton.setAttribute(
    "aria-current",
    type === "Following" ? "page" : "false"
  );
  loadFollowersButton.setAttribute(
    "aria-current",
    type === "Followers" ? "page" : "false"
  );
}

overlay.addEventListener("click", function (event) {
  if (event.target === this) {
    closeExtension();
  }
});

const loadedUsers = new Map();
const connectionCache = {
  Following: null,
  Followers: null,
};
const connectionRequests = {
  Following: null,
  Followers: null,
};
let filteredUsers = [];
let caller = null;
let currentFilteredUsers = null;
let currentFilter = null;
let followUnfollowAttempts = {
  follow: [],
  unfollow: [],
};

document.getElementById("searchInput").addEventListener("input", function (e) {
  const searchTerm = e.target.value.trim().toLocaleLowerCase(currentLocale);
  let usersToSearch = currentFilteredUsers || [...loadedUsers.values()];
  if (!searchTerm) {
    addUsersToDom(usersToSearch);
    return;
  }
  filteredUsers = usersToSearch.filter(
    (user) =>
      user.username.toLocaleLowerCase(currentLocale).includes(searchTerm) ||
      user.full_name.toLocaleLowerCase(currentLocale).includes(searchTerm)
  );
  addUsersToDom(filteredUsers, filteredUsers.length === 0 ? "search" : null);
});

function normalizeConnectionUser(user, type) {
  const friendship = user.friendship_status || {};

  return {
    ...user,
    id: String(user.id || user.pk),
    followed_by_viewer:
      user.followed_by_viewer ?? friendship.following ?? type === "Following",
    follows_viewer:
      user.follows_viewer ?? friendship.followed_by ?? type === "Followers",
    requested_by_viewer:
      user.requested_by_viewer ?? friendship.outgoing_request ?? false,
  };
}

function setLoading(isLoading) {
  const loader = document.getElementById("loader");
  loader.style.display = isLoading ? "flex" : "none";
  userList.style.display = isLoading ? "none" : caller ? "flex" : "none";
  document
    .querySelector(".my-component")
    ?.setAttribute("aria-busy", String(isLoading));
  document.querySelectorAll(".data-action-control").forEach((element) => {
    element.disabled = isLoading;
    element.setAttribute("aria-disabled", String(isLoading));
  });
}

function updateResultsMeta(users) {
  const total = loadedUsers.size;
  const count = users.length;
  resultsSummary.textContent =
    currentFilter || count !== total
      ? t("filteredCount", { count, total })
      : t(count === 1 ? "resultCount" : "resultCountPlural", { count });
}

function renderEmptyState(reason = "empty") {
  const titleKey =
    reason === "search"
      ? "noSearchTitle"
      : reason === "filter"
      ? "noFilterTitle"
      : "noUsersTitle";
  const bodyKey =
    reason === "search"
      ? "noSearchBody"
      : reason === "filter"
      ? "noFilterBody"
      : "noUsersBody";

  userList.innerHTML = `
    <div class="empty-state">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
        <circle cx="10" cy="9" r="3.5" stroke="currentColor" stroke-width="1.7" />
        <path d="M3.5 19c.7-3.1 2.8-4.8 6.5-4.8 2.2 0 3.9.6 5 1.8m2-7 4 4m0-4-4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
      </svg>
      <strong>${t(titleKey)}</strong>
      <span>${t(bodyKey)}</span>
    </div>
  `;
  userList.style.display = "flex";
}

async function requestConnections(type) {
  const users = [];
  let nextMaxId = null;

  do {
    const params = new URLSearchParams({ count: "100" });
    if (nextMaxId) params.set("max_id", nextMaxId);

    const response = await fetch(
      `/api/v1/friendships/${viewerId}/${type.toLowerCase()}/?${params}`,
      {
        credentials: "include",
        headers,
      }
    );

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const data = await response.json();
    if (data.status && data.status !== "ok") {
      throw new Error(data.message || `Instagram returned ${data.status}`);
    }

    if (Array.isArray(data.users)) {
      users.push(
        ...data.users.map((user) => normalizeConnectionUser(user, type))
      );
    }

    nextMaxId = data.next_max_id || null;
  } while (nextMaxId);

  return users;
}

function refreshRelationshipFlags() {
  ["Following", "Followers"].forEach((type) => {
    connectionCache[type]?.forEach((user) => {
      if (connectionCache.Following) {
        user.followed_by_viewer = connectionCache.Following.has(user.id);
      }
      if (connectionCache.Followers) {
        user.follows_viewer = connectionCache.Followers.has(user.id);
      }
    });
  });
}

async function ensureConnections(type) {
  if (connectionCache[type]) return connectionCache[type];

  if (!connectionRequests[type]) {
    connectionRequests[type] = requestConnections(type)
      .then((users) => {
        const connections = new Map(users.map((user) => [user.id, user]));
        connectionCache[type] = connections;
        return connections;
      })
      .finally(() => {
        connectionRequests[type] = null;
      });
  }

  const connections = await connectionRequests[type];
  refreshRelationshipFlags();
  return connections;
}

async function fetchConnections(type) {
  caller = type;
  title.textContent =
    type === "Followers" ? t("followersTitle") : t("followingTitle");
  setLoading(true);

  try {
    const companionType = type === "Following" ? "Followers" : "Following";
    const [selectedConnections] = await Promise.all([
      ensureConnections(type),
      ensureConnections(companionType),
    ]);
    refreshRelationshipFlags();
    const users = [...selectedConnections.values()];
    loadedUsers.clear();

    updateUIWithData(users, type);
  } catch (error) {
    console.error("Error when fetching data from Instagram:", error);
    showNotice(t("loadError"));
    renderEmptyState();
  } finally {
    setLoading(false);
  }
}

const fetchFollowing = () => fetchConnections("Following");
const fetchFollowers = () => fetchConnections("Followers");

function updateUIWithData(edges, functionCalled) {
  document.getElementById("searchInput").style.display = "block";

  populateLoadedUser(edges, functionCalled);
  if (currentFilter === "notFollowingBack" && functionCalled === "Following") {
    currentFilteredUsers = [...loadedUsers.values()].filter(
      (user) => !user.follows_viewer && user.followed_by_viewer
    );
    addUsersToDom(
      currentFilteredUsers,
      currentFilteredUsers.length === 0 ? "filter" : null
    );
  } else if (
    currentFilter === "notFollowedBack" &&
    functionCalled === "Followers"
  ) {
    currentFilteredUsers = [...loadedUsers.values()].filter(
      (user) => !user.followed_by_viewer
    );
    addUsersToDom(
      currentFilteredUsers,
      currentFilteredUsers.length === 0 ? "filter" : null
    );
  } else {
    addUsersToDom([...loadedUsers.values()]);
  }
}

function populateLoadedUser(users, functionCalled) {
  if (caller !== functionCalled) {
    caller = functionCalled;
  }
  users.forEach((edge) => {
    const user = edge.node ?? edge;
    if (!loadedUsers.has(user.id)) {
      loadedUsers.set(user.id, user);
    }
  });
}

function getRelationshipState(user) {
  if (user.requested_by_viewer) {
    return {
      infoKey: "requestSent",
      labelKey: "cancelRequest",
      action: "unfollow",
      tone: "pending",
    };
  }

  if (user.followed_by_viewer && user.follows_viewer) {
    return {
      infoKey: "mutual",
      labelKey: "unfollow",
      action: "unfollow",
      tone: "mutual",
    };
  }

  if (user.followed_by_viewer && !user.follows_viewer) {
    return {
      infoKey: "notFollowingYou",
      labelKey: "unfollow",
      action: "unfollow",
      tone: "nonFollower",
    };
  }

  if (!user.followed_by_viewer && user.follows_viewer) {
    return {
      infoKey: "youDontFollow",
      labelKey: "followBack",
      action: "follow",
      tone: "notFollowedBack",
    };
  }

  return {
    infoKey: "neither",
    labelKey: "follow",
    action: "follow",
    tone: "none",
  };
}

function addUsersToDom(users, emptyReason = null) {
  userList.innerHTML = "";
  userList.style.display = "flex";
  title.textContent =
    caller === "Followers" ? t("followersTitle") : t("followingTitle");
  updateResultsMeta(users);

  if (users.length === 0) {
    renderEmptyState(emptyReason || (currentFilter ? "filter" : "empty"));
    return;
  }

  users.forEach((user) => {
    const relationState = getRelationshipState(user);
    const profileUrl = `https://www.instagram.com/${encodeURIComponent(
      user.username
    )}/`;
    const userDiv = document.createElement("article");
    userDiv.className = "user";
    userDiv.dataset.id = user.id;

    const photoLink = document.createElement("a");
    photoLink.className = "user-photo-link";
    photoLink.href = profileUrl;
    photoLink.target = "_blank";
    photoLink.rel = "noreferrer";
    photoLink.setAttribute("aria-label", `@${user.username}`);

    const photo = document.createElement("img");
    photo.className = "user-photo";
    photo.src = user.profile_pic_url;
    photo.alt = "";
    photo.width = 44;
    photo.height = 44;
    photo.loading = "lazy";
    photoLink.appendChild(photo);

    const details = document.createElement("div");
    details.className = "user-details";

    const username = document.createElement("a");
    username.className = "username";
    username.href = profileUrl;
    username.target = "_blank";
    username.rel = "noreferrer";
    username.textContent = `@${user.username}`;

    const fullName = document.createElement("span");
    fullName.className = "full-name";
    fullName.textContent = user.full_name || "";

    const relationshipInfo = document.createElement("span");
    relationshipInfo.className = "relationship-info";
    relationshipInfo.dataset.relationship = relationState.tone;
    relationshipInfo.textContent = t(relationState.infoKey);

    details.append(username, fullName, relationshipInfo);

    const actionButton = document.createElement("button");
    actionButton.type = "button";
    actionButton.className = "action-button data-action-control";
    actionButton.dataset.id = user.id;
    actionButton.dataset.action = relationState.action;
    actionButton.textContent = t(relationState.labelKey);

    userDiv.append(photoLink, details, actionButton);
    userList.appendChild(userDiv);
  });

  attachButtonListeners();
}

function attachButtonListeners() {
  document.querySelectorAll(".action-button").forEach((button) => {
    button.removeEventListener("click", handleActionButtonClick);
    button.addEventListener("click", handleActionButtonClick);
  });
}

const viewerIdMatch = document.body.innerHTML.match(/"viewerId":"(\w+)"/i);
const appScopedIdentityMatch = document.body.innerHTML.match(
  /"appScopedIdentity":"(\w+)"/i
);
const csrfTokenMatch = document.body.innerHTML.match(
  /(?<="csrf_token":").+?(?=")/i
);
const csrfCookieMatch = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/i);
const appIdMatch = document.body.innerHTML.match(
  /(?<="X-IG-App-ID":").+?(?=")/i
);
const rolloutHashMatch = document.body.innerHTML.match(
  /(?<="rollout_hash":").+?(?=")/i
);

let viewerId = viewerIdMatch ? viewerIdMatch[1] : null;
viewerId =
  viewerId || (appScopedIdentityMatch ? appScopedIdentityMatch[1] : null);

const headers = {
  "Content-Type": "application/x-www-form-urlencoded",
  "X-Requested-With": "XMLHttpRequest",
  "X-Asbd-Id": "129477",
  "X-Ig-Www-Claim": sessionStorage.getItem("www-claim-v2") || "",
};

if (csrfTokenMatch || csrfCookieMatch) {
  headers["X-Csrftoken"] = csrfTokenMatch
    ? csrfTokenMatch[0]
    : decodeURIComponent(csrfCookieMatch[1]);
}
headers["X-Ig-App-Id"] = appIdMatch
  ? appIdMatch[0]
  : "936619743392459";
if (rolloutHashMatch) {
  headers["X-Instagram-Ajax"] = rolloutHashMatch[0];
}

function isWithinLimit(actionType) {
  if (advancedModeEnabled) return true;

  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  const oneHourAgo = now - 3600000;

  followUnfollowAttempts[actionType] = followUnfollowAttempts[
    actionType
  ].filter((timestamp) => timestamp >= oneHourAgo);

  const attemptsLastMinute = followUnfollowAttempts[actionType].filter(
    (timestamp) => timestamp >= oneMinuteAgo
  ).length;
  const attemptsLastHour = followUnfollowAttempts[actionType].length;

  if (attemptsLastMinute >= 5) {
    showNotice(
      t("minuteLimit", {
        action: t(actionType === "follow" ? "actionFollow" : "actionUnfollow"),
      }),
      "warning"
    );
    return false;
  } else if (attemptsLastHour >= 60) {
    showNotice(
      t("hourLimit", {
        action: t(actionType === "follow" ? "actionFollow" : "actionUnfollow"),
      }),
      "warning"
    );
    return false;
  }

  followUnfollowAttempts[actionType].push(now);
  return true;
}

const handleActionButtonClick = async (event) => {
  const userId = event.target.getAttribute("data-id");
  const action = event.target.getAttribute("data-action");
  if (!isWithinLimit(action)) return;

  if (action === "follow") {
    await followUser(userId, event.target);
  } else if (action === "unfollow") {
    await unfollowUser(userId, event.target);
  }
};

function updateRelationshipInfo(userId, newStatus) {
  const userDiv = document.querySelector(`.user[data-id="${userId}"]`);
  if (!userDiv) return;

  const relationshipInfoDiv = userDiv.querySelector(".relationship-info");
  const userActionButton = userDiv.querySelector(".action-button");
  const user = loadedUsers.get(userId);
  if (!user) return;

  const relationState = getRelationshipState(user);
  relationshipInfoDiv.textContent = t(relationState.infoKey);
  relationshipInfoDiv.dataset.relationship = relationState.tone;
  userActionButton.textContent = t(relationState.labelKey);
  userActionButton.setAttribute("data-action", relationState.action);
  delete userActionButton.dataset.state;
}

function getInstagramErrorMessage(action, response, data) {
  const actionLabel = t(action === "follow" ? "actionFollow" : "actionUnfollow");
  const reason =
    data?.feedback_message ||
    data?.message ||
    data?.error_type ||
    `HTTP ${response.status}`;
  const wasBlocked =
    response.status === 401 ||
    response.status === 403 ||
    response.status === 429 ||
    data?.feedback_required ||
    data?.spam ||
    data?.require_login ||
    data?.checkpoint_required ||
    /feedback_required|checkpoint_required|challenge_required|login_required/i.test(
      reason
    );

  if (wasBlocked) {
    return t("instagramBlocked", { action: actionLabel, reason });
  }

  return t("instagramRejected", { action: actionLabel, reason });
}

function responseMatchesFriendshipAction(data, action) {
  const relationship = data?.friendship_status || data;
  const following = relationship?.following;
  const outgoingRequest = relationship?.outgoing_request;

  if (action === "follow") {
    return following === true || outgoingRequest === true;
  }

  return following === false && outgoingRequest !== true;
}

function getInstagramModule(moduleName) {
  try {
    const moduleRequire =
      typeof require === "function" ? require : window.require;
    return typeof moduleRequire === "function"
      ? moduleRequire(moduleName)
      : null;
  } catch (error) {
    console.warn(`Instagram module ${moduleName} is unavailable:`, error);
    return null;
  }
}

function getInstagramNavigationContext() {
  const navChain = getInstagramModule("IGNavChain")?.getInstance?.();
  const containerUtils = getInstagramModule("PolarisContainerModuleUtils");
  const pageId = navChain?.last?.()?.pageID;

  return {
    container_module:
      containerUtils?.getContainerModule?.(pageId) || "profile",
    nav_chain:
      navChain?.getNavChainForSend?.() ||
      "PolarisFeedRoot:feedPage:1:via_cold_start",
  };
}

async function performNativeInstagramFollow(userId) {
  const instapi = getInstagramModule("PolarisInstapi");
  if (!instapi?.apiPost) return { handled: false, data: null };

  const navigation = getInstagramNavigationContext();
  const response = await instapi.apiPost(
    "/api/v1/friendships/create/{target_user_id}/",
    {
      body: {
        container_module: navigation.container_module,
        include_follow_friction_check: true,
        nav_chain: navigation.nav_chain,
        user_id: userId,
      },
      path: { target_user_id: userId },
    }
  );

  return { handled: true, data: response?.data || response };
}

async function verifyFriendshipAction(userId, action) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    if (attempt > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const response = await fetch(
      `/api/v1/friendships/show/${userId}/`,
      {
        credentials: "include",
        headers,
      }
    );

    if (!response.ok) continue;

    const data = await response.json();
    if (responseMatchesFriendshipAction(data, action)) return true;
  }

  return false;
}

async function performFriendshipAction(userId, action) {
  if (action === "follow") {
    try {
      const nativeResult = await performNativeInstagramFollow(userId);
      if (nativeResult.handled) {
        if (
          responseMatchesFriendshipAction(nativeResult.data, action) ||
          (await verifyFriendshipAction(userId, action))
        ) {
          return nativeResult.data;
        }

        throw new Error(
          t("relationshipUnchanged", { action: t("actionFollow") })
        );
      }
    } catch (error) {
      const reason =
        error?.response?.data?.feedback_message ||
        error?.response?.data?.message ||
        error?.message ||
        "unknown error";
      throw new Error(
        t("instagramRejected", { action: t("actionFollow"), reason })
      );
    }
  }

  const requests =
    action === "unfollow"
      ? [
          {
            endpoint: `https://i.instagram.com/api/v1/web/friendships/${userId}/unfollow/`,
          },
          { endpoint: `/api/v1/friendships/destroy/${userId}/` },
        ]
      : [
          {
            endpoint: `/api/v1/friendships/create/${userId}/`,
            body: new URLSearchParams({
              container_module: "profile",
              include_follow_friction_check: "true",
              nav_chain: "PolarisFeedRoot:feedPage:1:via_cold_start",
              user_id: userId,
            }),
          },
        ];
  let lastError = null;

  for (const request of requests) {
    const response = await fetch(request.endpoint, {
      method: "POST",
      headers,
      credentials: "include",
      body: request.body,
    });

    let data = null;
    try {
      data = await response.json();
    } catch (error) {
      console.warn("Instagram returned a non-JSON response:", error);
    }

    if (!response.ok || data?.status === "fail") {
      lastError = new Error(getInstagramErrorMessage(action, response, data));
      if (
        response.status === 401 ||
        response.status === 403 ||
        response.status === 429 ||
        data?.feedback_required ||
        data?.checkpoint_required
      ) {
        throw lastError;
      }
      continue;
    }

    if (
      responseMatchesFriendshipAction(data, action) ||
      (await verifyFriendshipAction(userId, action))
    ) {
      return data;
    }

    lastError = new Error(
      t("relationshipUnchanged", {
        action: t(action === "follow" ? "actionFollow" : "actionUnfollow"),
      })
    );
  }

  throw (
    lastError ||
    new Error(
      t("actionFailed", {
        action: t(action === "follow" ? "actionFollow" : "actionUnfollow"),
      })
    )
  );
}

const followUser = async (userId, button) => {
  button.disabled = true;
  button.dataset.state = "loading";
  button.textContent = t("followingLoading");
  dismissNotice();
  try {
    await performFriendshipAction(userId, "follow");
    console.log("User followed successfully.");
    button.setAttribute("data-action", "unfollow");
    const user = loadedUsers.get(userId);
    user.followed_by_viewer = true;
    user.requested_by_viewer = false;
    connectionCache.Following?.set(userId, user);
    updateRelationshipInfo(userId, "follow");
  } catch (error) {
    const user = loadedUsers.get(userId);
    if (user) button.textContent = t(getRelationshipState(user).labelKey);
    showNotice(error.message || t("actionFailed", { action: t("actionFollow") }));
    console.error("Error in the follow request:", error);
  } finally {
    delete button.dataset.state;
    button.disabled = false;
  }
};

const unfollowUser = async (userId, button) => {
  button.disabled = true;
  const userBeforeAction = loadedUsers.get(userId);
  button.dataset.state = "loading";
  button.textContent = t(
    userBeforeAction?.requested_by_viewer
      ? "cancellingLoading"
      : "unfollowingLoading"
  );
  dismissNotice();
  try {
    await performFriendshipAction(userId, "unfollow");
    console.log("User unfollowed successfully.");
    button.setAttribute("data-action", "follow");
    const user = loadedUsers.get(userId);
    user.followed_by_viewer = false;
    user.requested_by_viewer = false;
    connectionCache.Following?.delete(userId);
    updateRelationshipInfo(userId, "unfollow");
  } catch (error) {
    const user = loadedUsers.get(userId);
    if (user) button.textContent = t(getRelationshipState(user).labelKey);
    showNotice(
      error.message || t("actionFailed", { action: t("actionUnfollow") })
    );
    console.error("Error in the unfollow request:", error);
  } finally {
    delete button.dataset.state;
    button.disabled = false;
  }
};

document
  .getElementById("filterNotFollowingBackButton")
  .addEventListener("click", async function () {
    const button = this;
    if (currentFilter === "notFollowingBack") {
      currentFilter = null;
      button.textContent = t("nonFollowersFilter");
      button.classList.remove("filter-active");
      currentFilteredUsers = null;
      updateUIWithData([...loadedUsers.values()], caller);
    } else {
      setLoading(true);
      try {
        const followers = await ensureConnections("Followers");
        currentFilter = "notFollowingBack";
        currentFilteredUsers = [...loadedUsers.values()].filter(
          (user) => !followers.has(user.id)
        );
        button.textContent = t("removeFilter");
        button.classList.add("filter-active");
        addUsersToDom(
          currentFilteredUsers,
          currentFilteredUsers.length === 0 ? "filter" : null
        );
      } catch (error) {
        console.error("Error when loading followers for the filter:", error);
        showNotice(t("filterError"));
      } finally {
        setLoading(false);
      }
    }
  });

document
  .getElementById("filterNotFollowedBackButton")
  .addEventListener("click", async function () {
    const button = this;
    if (currentFilter === "notFollowedBack") {
      currentFilter = null;
      button.textContent = t("notFollowedBackFilter");
      button.classList.remove("filter-active");
      currentFilteredUsers = null;
      updateUIWithData([...loadedUsers.values()], caller);
    } else {
      setLoading(true);
      try {
        const following = await ensureConnections("Following");
        currentFilter = "notFollowedBack";
        currentFilteredUsers = [...loadedUsers.values()].filter(
          (user) => !following.has(user.id)
        );
        button.textContent = t("removeFilter");
        button.classList.add("filter-active");
        addUsersToDom(
          currentFilteredUsers,
          currentFilteredUsers.length === 0 ? "filter" : null
        );
      } catch (error) {
        console.error("Error when loading following for the filter:", error);
        showNotice(t("filterError"));
      } finally {
        setLoading(false);
      }
    }
  });

setLocale(getPreferredLocale(), false);
loadFollowingButton.focus({ preventScroll: true });
