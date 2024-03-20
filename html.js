const init = () => {
  var targetElement = document.getElementById("splash-screen");
  if (targetElement) {
    var componentHtml = `
    <div class="overlay" id="overlay">
    <div class="my-component centered-column">
      <h2>Manage Instagram Followers</h2>
      <div id="info-text">Manage your Instagram followers, including features to follow back, unfollow non-followers, and discover mutual followers.</div>
      <input type="text" placeholder="Search..." id="searchInput">
      <div class="user-list" id="userList">
      </div>
      <button id="loadFollowersButton">Followers</button>
      <button id="loadFollowingButton">Following</button>
      <div class="loader" id="loader"></div>
    </div>
  </div>  
  `;
    targetElement.insertAdjacentHTML("beforebegin", componentHtml);
  } else {
    console.error("Target element not found");
  }
};
init();
