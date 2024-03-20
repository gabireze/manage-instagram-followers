const init = () => {
  var targetElement = document.getElementById("splash-screen");
  if (targetElement) {
    var componentHtml = `
    <div class="overlay" id="overlay">
    <div class="my-component centered-column">
      <h2>Não Seguidores no Instagram</h2>
      <div id="info-text">Descubra quem não está seguindo você de volta.</div>
      <input type="text" placeholder="Pesquisar..." id="searchInput">
      <div class="user-list" id="userList">
        <!-- Lista de usuários não seguidores será populada aqui -->
      </div>
      <button id="loadButton">Carregar</button>
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
