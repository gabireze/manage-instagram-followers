(function exposeManageInstagramFollowersCore(root, factory) {
  const core = factory();
  if (typeof module === "object" && module.exports) module.exports = core;
  if (root) root.ManageInstagramFollowersCore = core;
})(typeof window !== "undefined" ? window : globalThis, function createCore() {
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

  function getRelationshipState(user) {
    if (user.requested_by_viewer) {
      return {
        infoKey: "requestSent",
        labelKey: "cancelRequest",
        action: "unfollow",
        tone: "requested",
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

  function filterUsers(users, filter) {
    if (filter === "notFollowingBack") {
      return users.filter(
        (user) => user.followed_by_viewer && !user.follows_viewer
      );
    }
    if (filter === "mutual") {
      return users.filter(
        (user) => user.followed_by_viewer && user.follows_viewer
      );
    }
    if (filter === "notFollowedBack") {
      return users.filter(
        (user) => !user.followed_by_viewer && user.follows_viewer
      );
    }
    if (filter === "requested") {
      return users.filter((user) => user.requested_by_viewer);
    }
    return [...users];
  }

  function sortUsers(users, sort, locale = "en") {
    const collator = new Intl.Collator(locale, { sensitivity: "base" });
    const result = [...users];
    if (sort === "username") {
      return result.sort((a, b) => collator.compare(a.username, b.username));
    }
    if (sort === "name") {
      return result.sort((a, b) =>
        collator.compare(a.full_name || a.username, b.full_name || b.username)
      );
    }
    if (sort === "relationship") {
      const order = {
        nonFollower: 0,
        notFollowedBack: 1,
        requested: 2,
        mutual: 3,
        none: 4,
      };
      return result.sort((a, b) => {
        const difference =
          order[getRelationshipState(a).tone] -
          order[getRelationshipState(b).tone];
        return difference || collator.compare(a.username, b.username);
      });
    }
    return result;
  }

  function countRelationships(users) {
    return users.reduce(
      (counts, user) => {
        counts.all += 1;
        const tone = getRelationshipState(user).tone;
        if (tone === "nonFollower") counts.notFollowingBack += 1;
        if (tone === "mutual") counts.mutual += 1;
        if (tone === "notFollowedBack") counts.notFollowedBack += 1;
        if (tone === "requested") counts.requested += 1;
        return counts;
      },
      {
        all: 0,
        notFollowingBack: 0,
        mutual: 0,
        notFollowedBack: 0,
        requested: 0,
      }
    );
  }

  function reconcileConnectionMaps(following, followers) {
    [following, followers].forEach((connections) => {
      connections?.forEach((user) => {
        if (following) user.followed_by_viewer = following.has(user.id);
        if (followers) user.follows_viewer = followers.has(user.id);
      });
    });
    return { following, followers };
  }

  function responseMatchesFriendshipAction(data, action) {
    const relationship = data?.friendship_status || data;
    const following = relationship?.following;
    const outgoingRequest = relationship?.outgoing_request;
    return action === "follow"
      ? following === true || outgoingRequest === true
      : following === false && outgoingRequest !== true;
  }

  return {
    countRelationships,
    filterUsers,
    getRelationshipState,
    normalizeConnectionUser,
    reconcileConnectionMaps,
    responseMatchesFriendshipAction,
    sortUsers,
  };
});
