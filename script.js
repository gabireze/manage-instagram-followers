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
  currentFilter = null;
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

loadFollowersButton.addEventListener("click", () => {
  if (!viewerId) {
    document.getElementById("info-text").textContent =
      "You must be logged in to manage your Instagram followers.";
    loadFollowingButton.remove();
    loadFollowersButton.remove();
    return;
  }
  resetUI();
  fetchFollowers();
  toggleFilterButtons({ followedBackText: "Filter Not Followed Back" });
});

loadFollowingButton.addEventListener("click", () => {
  if (!viewerId) {
    document.getElementById("info-text").textContent =
      "You must be logged in to manage your Instagram followers.";
    loadFollowingButton.remove();
    loadFollowersButton.remove();
    return;
  }
  resetUI();
  fetchFollowing();
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

let endCursor = "";
const loadedUsers = new Map();
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

const fetchFollowing = async () => {
  const loader = document.getElementById("loader");
  loader.style.display = "block";
  const loadFollowingButton = document.getElementById("loadFollowingButton");
  document.querySelectorAll(".my-component button").forEach((element) => {
    element.disabled = true;
    element.style.cursor = "not-allowed";
  });
  try {
    const variables = {
      id: viewerId,
      include_reel: false,
      fetch_mutual: false,
      first: 50,
      after: endCursor,
    };
    const response = await fetch(
      `https://www.instagram.com/graphql/query/?query_hash=3dec7e2c57367ef3da3d987d89f9dbc8&variables=${encodeURIComponent(
        JSON.stringify(variables)
      )}`
    );
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const data = await response.json();
    if (data.data.user.edge_follow.edges.length === 0) {
      alert("You don't follow anyone or it was not possible to load the data.");
      return;
    }
    endCursor = data.data.user.edge_follow.page_info.end_cursor;
    const hasNextPage = data.data.user.edge_follow.page_info.has_next_page;
    updateUIWithData(data.data.user.edge_follow.edges, "Following");
    if (hasNextPage) {
      fetchFollowing();
    }
  } catch (error) {
    console.error("Error when fetching data from Instagram:", error);
  } finally {
    loader.style.display = "none";
    document.querySelectorAll(".my-component button").forEach((element) => {
      element.disabled = false;
      element.style.cursor = "pointer";
    });
  }
};

const fetchFollowers = async () => {
  const loader = document.getElementById("loader");
  loader.style.display = "block";
  const loadFollowersButton = document.getElementById("loadFollowersButton");
  loadFollowersButton.disabled = true;
  loadFollowersButton.style.cursor = "not-allowed";
  try {
    const variables = {
      id: viewerId,
      include_reel: false,
      fetch_mutual: false,
      first: 50,
      after: endCursor,
    };
    const response = await fetch(
      `https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables=${encodeURIComponent(
        JSON.stringify(variables)
      )}`
    );
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const data = await response.json();
    if (data.data.user.edge_followed_by.edges.length === 0) {
      alert(
        "You don't have any followers or it was not possible to load the data."
      );
      return;
    }
    endCursor = data.data.user.edge_followed_by.page_info.end_cursor;
    const hasNextPage = data.data.user.edge_followed_by.page_info.has_next_page;
    updateUIWithData(data.data.user.edge_followed_by.edges, "Followers");
    if (hasNextPage) {
      fetchFollowers();
    }
  } catch (error) {
    console.error("Error when fetching data from Instagram:", error);
  } finally {
    loader.style.display = "none";
    document.querySelectorAll(".my-component button").forEach((element) => {
      element.disabled = false;
      element.style.cursor = "pointer";
    });
  }
};

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

if (csrfTokenMatch) {
  headers["X-Csrftoken"] = csrfTokenMatch[0];
}
if (appIdMatch) {
  headers["X-Ig-App-Id"] = appIdMatch[0];
}
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

const followUser = async (userId, button) => {
  button.disabled = true;
  try {
    const response = await fetch(
      `https://i.instagram.com/api/v1/web/friendships/${userId}/follow/`,
      {
        method: "POST",
        headers: headers,
        credentials: "include",
        mode: "cors",
      }
    );
    if (response.ok) {
      console.log("User followed successfully.");
      button.setAttribute("data-action", "unfollow");
      const user = loadedUsers.get(userId);
      user.followed_by_viewer = true;
      user.requested_by_viewer = false;
      updateRelationshipInfo(userId, "follow");
    } else {
      alert(
        "Error trying to follow the user. This may be due to reaching the limit of 5 actions per minute or 60 actions per hour. Please wait a moment before trying again."
      );
    }
  } catch (error) {
    alert("Error trying to follow the user. Try again later.");
    console.error("Error in the request:", error);
  } finally {
    button.disabled = false;
  }
};

const unfollowUser = async (userId, button) => {
  button.disabled = true;
  try {
    const response = await fetch(
      `https://i.instagram.com/api/v1/web/friendships/${userId}/unfollow/`,
      {
        method: "POST",
        headers: headers,
        credentials: "include",
        mode: "cors",
      }
    );
    if (response.ok) {
      console.log("User unfollowed successfully.");
      button.setAttribute("data-action", "follow");
      const user = loadedUsers.get(userId);
      user.followed_by_viewer = false;
      user.requested_by_viewer = false;
      updateRelationshipInfo(userId, "unfollow");
    } else {
      alert(
        "Error trying to unfollow the user. This may be due to reaching the limit of 5 actions per minute or 60 actions per hour. Please wait a moment before trying again."
      );
    }
  } catch (error) {
    alert("Error trying to unfollow the user. Try again later.");
    console.error("Error in the request:", error);
  } finally {
    button.disabled = false;
  }
};

document
  .getElementById("filterNotFollowingBackButton")
  .addEventListener("click", function () {
    const button = this;
    if (currentFilter === "notFollowingBack") {
      currentFilter = null;
      button.textContent = "Non-Followers";
      button.classList.remove("filter-active");
      currentFilteredUsers = null;
      updateUIWithData([...loadedUsers.values()], caller);
    } else {
      currentFilter = "notFollowingBack";
      button.textContent = "Remove Filter";
      button.classList.add("filter-active");
      updateUIWithData([...loadedUsers.values()], caller);
    }
  });

document
  .getElementById("filterNotFollowedBackButton")
  .addEventListener("click", function () {
    const button = this;
    if (currentFilter === "notFollowedBack") {
      currentFilter = null;
      button.textContent = "Not Followed Back";
      button.classList.remove("filter-active");
      currentFilteredUsers = null;
      updateUIWithData([...loadedUsers.values()], caller);
    } else {
      currentFilter = "notFollowedBack";
      button.textContent = "Remove Filter";
      button.classList.add("filter-active");
      updateUIWithData([...loadedUsers.values()], caller);
    }
  });
