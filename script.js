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

function resetUI() {
  loadedUsers.clear();
  connectionCache.Following = null;
  connectionCache.Followers = null;
  currentFilter = null;
  currentFilteredUsers = null;
  document.getElementById("userList").innerHTML = "";
  title.textContent = caller === "Followers" ? "Followers" : "Following";
  title.style.display = "flex";
  document
    .querySelectorAll(".filter")
    .forEach((element) => element.classList.remove("filter-active"));
  infoText.style.display = "none";
  advancedToggleGroup.style.display = "flex";
  searchGroup.style.display = "flex";
  titleAndFilter.style.display = "flex";
}

function toggleFilterButtons({
  followingBackDisplay = "none",
  followedBackDisplay = "flex",
  followedBackText = "",
}) {
  filterNotFollowingBackButton.style.display = followingBackDisplay;
  filterNotFollowedBackButton.style.display = followedBackDisplay;
  if (followedBackText) {
    filterNotFollowedBackButton.textContent = followedBackText;
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
    document.getElementById("info-text").textContent =
      "You must be logged in to manage your Instagram followers.";
    loadFollowingButton.remove();
    loadFollowersButton.remove();
    return;
  }
  resetUI();
  await fetchFollowers();
  toggleFilterButtons({ followedBackText: "Filter Not Followed Back" });
});

loadFollowingButton.addEventListener("click", async () => {
  if (!viewerId) {
    document.getElementById("info-text").textContent =
      "You must be logged in to manage your Instagram followers.";
    loadFollowingButton.remove();
    loadFollowersButton.remove();
    return;
  }
  resetUI();
  await fetchFollowing();
  toggleFilterButtons({
    followingBackDisplay: "flex",
    followedBackDisplay: "none",
    followedBackText: "Filter Non-Followers",
  });
});

overlay.addEventListener("click", function (event) {
  if (event.target === this) {
    this.style.display = "none";
  }
});

const loadedUsers = new Map();
const connectionCache = {
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
  const searchTerm = e.target.value.toLowerCase();
  const usersList = document.getElementById("userList");
  let usersToSearch = currentFilteredUsers || [...loadedUsers.values()];
  if (!searchTerm) {
    usersList.innerHTML = "";
    addUsersToDom(usersToSearch);
    return;
  }
  filteredUsers = usersToSearch.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm) ||
      user.full_name.toLowerCase().includes(searchTerm)
  );
  usersList.innerHTML = "";
  addUsersToDom(filteredUsers);
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
  loader.style.display = isLoading ? "block" : "none";
  document.querySelectorAll(".my-component button").forEach((element) => {
    element.disabled = isLoading;
    element.style.cursor = isLoading ? "not-allowed" : "pointer";
  });
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
  if (!connectionCache[type]) {
    const users = await requestConnections(type);
    connectionCache[type] = new Map(users.map((user) => [user.id, user]));
    refreshRelationshipFlags();
  }

  return connectionCache[type];
}

async function fetchConnections(type) {
  setLoading(true);

  try {
    const users = [...(await ensureConnections(type)).values()];
    loadedUsers.clear();

    if (users.length === 0) {
      document.getElementById("userList").innerHTML =
        "<div>No users to show.</div>";
    } else {
      updateUIWithData(users, type);
    }
  } catch (error) {
    console.error("Error when fetching data from Instagram:", error);
    document.getElementById("userList").innerHTML =
      "<div>Instagram could not load this list. Please try again shortly.</div>";
  } finally {
    setLoading(false);
  }
}

const fetchFollowing = () => fetchConnections("Following");
const fetchFollowers = () => fetchConnections("Followers");

function updateUIWithData(edges, functionCalled) {
  document.getElementById("searchInput").style.display = "block";
  const userList = document.getElementById("userList");

  populateLoadedUser(edges, functionCalled);
  if (currentFilter === "notFollowingBack" && functionCalled === "Following") {
    currentFilteredUsers = [...loadedUsers.values()].filter(
      (user) => !user.follows_viewer && user.followed_by_viewer
    );
    userList.innerHTML = "";
    addUsersToDom(currentFilteredUsers);
  } else if (
    currentFilter === "notFollowedBack" &&
    functionCalled === "Followers"
  ) {
    currentFilteredUsers = [...loadedUsers.values()].filter(
      (user) => !user.followed_by_viewer
    );
    userList.innerHTML = "";
    addUsersToDom(currentFilteredUsers);
  } else {
    userList.innerHTML = "";
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

function addUsersToDom(users) {
  const usersList = document.getElementById("userList");
  usersList.innerHTML = "";
  usersList.style.display = "flex";
  title.textContent = caller === "Followers" ? "Followers" : "Following";

  const relationshipConfig = {
    Following: {
      true: {
        true: { info: "Mutual", label: "Unfollow", action: "unfollow" },
        false: {
          info: "Not Following You Back",
          label: "Unfollow",
          action: "unfollow",
        },
      },
      false: {
        true: {
          info: "You Don't Follow Back",
          label: "Follow Back",
          action: "follow",
        },
        false: {
          info: "You don't follow each other",
          label: "Follow",
          action: "follow",
        },
      },
    },
    Followers: {
      true: {
        true: { info: "Mutual", label: "Unfollow", action: "unfollow" },
        false: {
          info: "Not Following You Back",
          label: "Unfollow",
          action: "unfollow",
        },
        undefined: { info: "Mutual", label: "Unfollow", action: "unfollow" },
      },
      false: {
        true: {
          info: "You Don't Follow Back",
          label: "Follow Back",
          action: "follow",
        },
        false: {
          info: "You don't follow each other",
          label: "Follow",
          action: "follow",
        },
        undefined: {
          info: "You Don't Follow Back",
          label: "Follow Back",
          action: "follow",
        },
      },
    },
  };
  if (users.length === 0) {
    usersList.innerHTML = "<div>No users to show.</div>";
    return;
  }
  users.forEach((user) => {
    const userDiv = document.createElement("div");
    userDiv.classList.add("user");
    userDiv.setAttribute("data-id", user.id);

    let relationState;

    if (user.requested_by_viewer) {
      relationState = {
        info: "Follow Request Sent",
        label: "Cancel Request",
        action: "unfollow", // ainda usaremos "unfollow" para cancelar
      };
    } else {
      relationState =
        relationshipConfig[caller][!!user.followed_by_viewer][
          user.follows_viewer
        ];
    }
    const relationshipInfo = `<div class='relationship-info'>${relationState.info}</div>`;
    const buttonLabel = relationState.label;
    const buttonAction = relationState.action;

    userDiv.innerHTML = `
      <a href="https://www.instagram.com/${user.username}/" target="_blank">
        <img src="${user.profile_pic_url}" alt="${user.username}" class="user-photo">
      </a>
      <div class="user-details">
        <a href="https://www.instagram.com/${user.username}/" target="_blank" class="username">@${user.username}</a>
        <div class="full-name">${user.full_name}</div>
        ${relationshipInfo}
      </div>
      <button class="action-button" data-id="${user.id}" data-action="${buttonAction}">${buttonLabel}</button>
    `;
    usersList.appendChild(userDiv);
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
    alert(
      `You have reached the limit of ${actionType} actions per minute. Please wait.`
    );
    return false;
  } else if (attemptsLastHour >= 60) {
    alert(
      `You have reached the limit of ${actionType} actions per hour. Please wait.`
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
  const userDiv = document.querySelector(`div.user[data-id="${userId}"]`);
  if (!userDiv) return;

  const relationshipInfoDiv = userDiv.querySelector(".relationship-info");
  const userActionButton = userDiv.querySelector(".action-button");
  const user = loadedUsers.get(userId);
  if (!user) return;

  if (user.requested_by_viewer) {
    relationshipInfoDiv.innerHTML = "Follow Request Sent";
    userActionButton.textContent = "Cancel Request";
    userActionButton.setAttribute("data-action", "unfollow");
    return;
  }

  if (caller === "Followers") {
    if (newStatus === "follow") {
      relationshipInfoDiv.innerHTML = "Mutual";
      userActionButton.textContent = "Unfollow";
      userActionButton.setAttribute("data-action", "unfollow");
    } else if (newStatus === "unfollow") {
      relationshipInfoDiv.innerHTML = "You Don't Follow Back";
      userActionButton.textContent = "Follow Back";
      userActionButton.setAttribute("data-action", "follow");
    }
  }

  if (caller === "Following") {
    if (newStatus === "follow") {
      relationshipInfoDiv.innerHTML =
        user.followed_by_viewer && !user.follows_viewer
          ? "Not Following You Back"
          : "Mutual";
      userActionButton.textContent = "Unfollow";
      userActionButton.setAttribute("data-action", "unfollow");
    } else if (newStatus === "unfollow") {
      relationshipInfoDiv.innerHTML =
        !user.followed_by_viewer && user.follows_viewer
          ? "You Don't Follow Back"
          : "Not Following You Back";
      userActionButton.textContent = "Follow";
      userActionButton.setAttribute("data-action", "follow");
    }
  }
}

function getInstagramErrorMessage(action, response, data) {
  const actionLabel = action === "follow" ? "follow" : "unfollow";
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
    return `Instagram blocked the ${actionLabel} request: ${reason}. Advanced Mode only disables this extension's local limits; it cannot bypass Instagram's limits.`;
  }

  return `Instagram rejected the ${actionLabel} request: ${reason}.`;
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
          "Instagram answered the follow request, but the account relationship did not change."
        );
      }
    } catch (error) {
      const reason =
        error?.response?.data?.feedback_message ||
        error?.response?.data?.message ||
        error?.message ||
        "unknown error";
      throw new Error(`Instagram rejected the follow request: ${reason}`);
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
      `Instagram answered the ${action} request, but the account relationship did not change.`
    );
  }

  throw lastError || new Error(`Instagram could not complete the ${action} request.`);
}

const followUser = async (userId, button) => {
  button.disabled = true;
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
    alert(error.message || "Error trying to follow the user. Try again later.");
    console.error("Error in the follow request:", error);
  } finally {
    button.disabled = false;
  }
};

const unfollowUser = async (userId, button) => {
  button.disabled = true;
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
    alert(error.message || "Error trying to unfollow the user. Try again later.");
    console.error("Error in the unfollow request:", error);
  } finally {
    button.disabled = false;
  }
};

document
  .getElementById("filterNotFollowingBackButton")
  .addEventListener("click", async function () {
    const button = this;
    if (currentFilter === "notFollowingBack") {
      currentFilter = null;
      button.textContent = "Non-Followers";
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
        button.textContent = "Remove Filter";
        button.classList.add("filter-active");
        document.getElementById("userList").innerHTML = "";
        addUsersToDom(currentFilteredUsers);
      } catch (error) {
        console.error("Error when loading followers for the filter:", error);
        document.getElementById("userList").innerHTML =
          "<div>Instagram could not apply this filter. Please try again shortly.</div>";
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
      button.textContent = "Not Followed Back";
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
        button.textContent = "Remove Filter";
        button.classList.add("filter-active");
        document.getElementById("userList").innerHTML = "";
        addUsersToDom(currentFilteredUsers);
      } catch (error) {
        console.error("Error when loading following for the filter:", error);
        document.getElementById("userList").innerHTML =
          "<div>Instagram could not apply this filter. Please try again shortly.</div>";
      } finally {
        setLoading(false);
      }
    }
  });
