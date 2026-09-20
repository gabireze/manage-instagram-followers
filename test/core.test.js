const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../core.js");

const users = [
  { id: "1", username: "zoe", full_name: "Zoe", followed_by_viewer: true, follows_viewer: false, requested_by_viewer: false },
  { id: "2", username: "ana", full_name: "Ana", followed_by_viewer: true, follows_viewer: true, requested_by_viewer: false },
  { id: "3", username: "bia", full_name: "Bia", followed_by_viewer: false, follows_viewer: true, requested_by_viewer: false },
  { id: "4", username: "cai", full_name: "Caio", followed_by_viewer: false, follows_viewer: false, requested_by_viewer: true },
];

test("normalizes both Instagram connection payload shapes", () => {
  const normalized = core.normalizeConnectionUser(
    { pk: 42, friendship_status: { following: true, followed_by: false } },
    "Following"
  );
  assert.equal(normalized.id, "42");
  assert.equal(normalized.followed_by_viewer, true);
  assert.equal(normalized.follows_viewer, false);
});

test("filters non-followers without including unrelated accounts", () => {
  assert.deepEqual(
    core.filterUsers(users, "notFollowingBack").map((user) => user.id),
    ["1"]
  );
});

test("reconciles both lists before the first render", () => {
  const following = new Map([
    ["1", { id: "1", username: "one" }],
    ["2", { id: "2", username: "two" }],
  ]);
  const followers = new Map([["2", { id: "2", username: "two" }]]);
  core.reconcileConnectionMaps(following, followers);
  assert.equal(following.get("1").follows_viewer, false);
  assert.equal(following.get("2").follows_viewer, true);
  assert.deepEqual(
    core
      .filterUsers([...following.values()], "notFollowingBack")
      .map((user) => user.id),
    ["1"]
  );
});

test("counts every relationship state", () => {
  assert.deepEqual(core.countRelationships(users), {
    all: 4,
    notFollowingBack: 1,
    mutual: 1,
    notFollowedBack: 1,
    requested: 1,
  });
});

test("sorts by relationship priority and username", () => {
  assert.deepEqual(
    core.sortUsers(users, "relationship").map((user) => user.id),
    ["1", "3", "4", "2"]
  );
});

test("accepts a completed follow or private-account request", () => {
  assert.equal(
    core.responseMatchesFriendshipAction({ following: true }, "follow"),
    true
  );
  assert.equal(
    core.responseMatchesFriendshipAction({ outgoing_request: true }, "follow"),
    true
  );
  assert.equal(
    core.responseMatchesFriendshipAction(
      { following: false, outgoing_request: false },
      "unfollow"
    ),
    true
  );
});
