document.getElementById("loadFollowersButton").addEventListener("click", () => {
  loadedUsers.clear();
  fetchFollowers();
  currentFilter = null;
  document
    .getElementById("filterNotFollowingBackButton")
    .classList.remove("filter-active");
  document.getElementById("filterNotFollowingBackButton").style.display =
    "none";
  document.getElementById("filterNotFollowedBackButton").style.display = "flex";
  document.getElementById("filterNotFollowedBackButton").textContent =
    "Filter Not Followed Back";
});

document.getElementById("loadFollowingButton").addEventListener("click", () => {
  loadedUsers.clear();
  fetchFollowing();
  currentFilter = null;
  document
    .getElementById("filterNotFollowedBackButton")
    .classList.remove("filter-active");
  document.getElementById("filterNotFollowingBackButton").style.display =
    "flex";
  document.getElementById("filterNotFollowedBackButton").style.display = "none";
  document.getElementById("filterNotFollowingBackButton").textContent =
    "Filter Non-Followers";
});

document.getElementById("overlay").addEventListener("click", function (event) {
  if (event.target === this) {
    this.style.display = "none";
  }
});

let endCursor = "";
const loadedUsers = new Map();
let filteredUsers = [];
let caller = null;
let currentFilteredUsers = null; // Armazena os usuários atualmente filtrados ou null
let currentFilter = null; // Armazena o filtro atual

document.getElementById("searchInput").addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();
  let usersToSearch = currentFilteredUsers || [...loadedUsers.values()]; // Usa currentFilteredUsers se não for null, senão usa todos os usuários

  if (!searchTerm) {
    document.getElementById("userList").innerHTML = "";
    addUsersToDom(usersToSearch);
    return;
  }

  filteredUsers = usersToSearch.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm) ||
      user.full_name.toLowerCase().includes(searchTerm)
  );

  document.getElementById("userList").innerHTML = "";
  addUsersToDom(filteredUsers);
});

async function fetchFollowing() {
  const loader = document.getElementById("loader");
  loader.style.display = "block"; // Mostrar o loader
  document.getElementById("loadFollowingButton").disabled = true;
  document.getElementById("loadFollowingButton").style.cursor = "not-allowed";
  try {
    const variables = {
      id: "240664985", // Seu ID de usuário do Instagram
      include_reel: false,
      fetch_mutual: false,
      first: 50, // Número de usuários para retornar por página
      after: endCursor, // Passar o cursor da última requisição aqui
    };

    const response = await fetch(
      `https://www.instagram.com/graphql/query/?query_hash=3dec7e2c57367ef3da3d987d89f9dbc8&variables=${encodeURIComponent(
        JSON.stringify(variables)
      )}`
    );
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    if (data.data.user.edge_follow.edges.length === 0) {
      alert("You don't follow anyone or it was not possible to load the data.");
      return;
    }

    // Atualize o cursor global com o novo end_cursor da resposta
    endCursor = data.data.user.edge_follow.page_info.end_cursor;
    const hasNextPage = data.data.user.edge_follow.page_info.has_next_page;

    // Chama função para atualizar a UI
    updateUIWithData(data.data.user.edge_follow.edges, "Following");

    if (hasNextPage) {
      fetchFollowing(); // Chama a si mesma para buscar a próxima página
    }
  } catch (error) {
    console.error("Error when fetching data from Instagram:", error);
  } finally {
    loader.style.display = "none"; // Ocultar o loader após a operação
    document.getElementById("loadFollowingButton").disabled = false;
    document.getElementById("loadFollowingButton").style.cursor = "pointer";
  }
}

async function fetchFollowers() {
  const loader = document.getElementById("loader");
  loader.style.display = "block"; // Mostrar o loader
  document.getElementById("loadFollowersButton").disabled = true;
  document.getElementById("loadFollowersButton").style.cursor = "not-allowed";
  try {
    const variables = {
      id: "240664985", // Seu ID de usuário do Instagram
      include_reel: false,
      fetch_mutual: false,
      first: 50, // Número de usuários para retornar por página
      after: endCursor, // Passar o cursor da última requisição aqui
    };

    const response = await fetch(
      `https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables=${encodeURIComponent(
        JSON.stringify(variables)
      )}`
    );
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    if (data.data.user.edge_followed_by.edges.length === 0) {
      alert(
        "You don't have any followers or it was not possible to load the data."
      );
      return;
    }

    // Atualize o cursor global com o novo end_cursor da resposta
    endCursor = data.data.user.edge_followed_by.page_info.end_cursor;
    const hasNextPage = data.data.user.edge_followed_by.page_info.has_next_page;

    // Chama função para atualizar a UI
    updateUIWithData(data.data.user.edge_followed_by.edges, "Followers");

    if (hasNextPage) {
      fetchFollowers(); // Chama a si mesma para buscar a próxima página
    }
  } catch (error) {
    console.error("Error when fetching data from Instagram:", error);
  } finally {
    loader.style.display = "none"; // Ocultar o loader após a operação
    document.getElementById("loadFollowersButton").disabled = false;
    document.getElementById("loadFollowersButton").style.cursor = "pointer";
  }
}

function updateUIWithData(edges, functionCalled) {
  searchInput.style.display = "block";
  populateLoadedUser(edges, functionCalled);
  if (currentFilter === "notFollowingBack" && functionCalled === "Following") {
    currentFilteredUsers = [...loadedUsers.values()].filter(
      (user) => !user.follows_viewer && user.followed_by_viewer
    );
    document.getElementById("userList").innerHTML = "";
    addUsersToDom(currentFilteredUsers);
  } else if (
    currentFilter === "notFollowedBack" &&
    functionCalled === "Followers"
  ) {
    currentFilteredUsers = [...loadedUsers.values()].filter(
      (user) => !user.followed_by_viewer
    );
    document.getElementById("userList").innerHTML = "";
    addUsersToDom(currentFilteredUsers);
  } else {
    document.getElementById("userList").innerHTML = "";
    addUsersToDom([...loadedUsers.values()]);
  }
}

function populateLoadedUser(users, functionCalled) {
  if (caller !== functionCalled) {
    caller = functionCalled;
  }
  users.forEach((edge) => {
    const user = edge.node ?? edge;

    // Verifica se o usuário já foi carregado usando seu id como chave
    if (!loadedUsers.has(user.id)) {
      // Adiciona o usuário ao Map, usando o id como chave e o objeto user como valor
      loadedUsers.set(user.id, user);
    }
  });
}

function addUsersToDom(users) {
  const usersList = document.getElementById("userList");
  usersList.innerHTML = ""; // Limpa a lista antes de adicionar novos usuários
  usersList.style.display = "flex";

  users.forEach((user) => {
    const userDiv = document.createElement("div");
    userDiv.classList.add("user");
    userDiv.setAttribute("data-id", user.id);
    let buttonLabel = "Follow";
    let buttonAction = "follow";
    let relationshipInfo = ""; // Inicia a informação do relacionamento como vazia

    if (user.followed_by_viewer) {
      buttonLabel = "Unfollow";
      buttonAction = "unfollow";
      if (!user.follows_viewer) {
        // Eu sigo, mas a pessoa não me segue de volta
        relationshipInfo =
          "<div class='relationship-info'>Not Following You Back</div>";
      }
    }

    if (!user.followed_by_viewer && user.follows_viewer === undefined) {
      // A pessoa me segue, mas eu não sigo de volta
      buttonLabel = "Follow Back";
      buttonAction = "follow";
      relationshipInfo =
        "<div class='relationship-info'>You Don't Follow Back</div>";
    }

    if (
      (user.followed_by_viewer && user.follows_viewer) ||
      (user.followed_by_viewer && user.follows_viewer === undefined)
    ) {
      // Relação mútua
      relationshipInfo = "<div class='relationship-info'>Mutual</div>";
    }

    userDiv.innerHTML = `
      <a href="https://www.instagram.com/${user.username}/" target="_blank">
        <img src="${
          user.profile_pic_url ??
          "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
        }" alt="${user.username}" class="user-photo">
      </a>
      <div class="user-details">
        <a href="https://www.instagram.com/${
          user.username
        }/" target="_blank" class="username">@${user.username}</a>
        <div class="full-name">${user.full_name}</div>
        ${relationshipInfo} <!-- Exibe a informação do relacionamento -->
      </div>
      <button class="action-button" data-id="${
        user.id
      }" data-action="${buttonAction}">${buttonLabel}</button>
    `;
    usersList.appendChild(userDiv);
  });

  attachButtonListeners();
}

function attachButtonListeners() {
  document.querySelectorAll(".action-button").forEach((button) => {
    button.removeEventListener("click", handleActionButtonClick); // Remove listener to avoid duplicates
    button.addEventListener("click", handleActionButtonClick);
  });
}

// Extração de informações relevantes da página
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

// Preparação dos cabeçalhos para a requisição
const headers = {
  "Content-Type": "application/x-www-form-urlencoded",
  "X-Requested-With": "XMLHttpRequest",
  "X-Asbd-Id": "129477", // Valor estático, verifique se está correto para o seu caso
  "X-Ig-Www-Claim": sessionStorage.getItem("www-claim-v2") || "",
};

// Adicionando tokens e IDs extraídos aos cabeçalhos, se disponíveis
if (csrfTokenMatch) {
  headers["X-Csrftoken"] = csrfTokenMatch[0];
}
if (appIdMatch) {
  headers["X-Ig-App-Id"] = appIdMatch[0];
}
if (rolloutHashMatch) {
  headers["X-Instagram-Ajax"] = rolloutHashMatch[0];
}

function handleActionButtonClick(event) {
  const userId = event.target.getAttribute("data-id");
  const action = event.target.getAttribute("data-action");

  if (action === "follow") {
    followUser(userId, event.target);
  } else if (action === "unfollow") {
    unfollowUser(userId, event.target);
  }
}

function updateRelationshipInfo(userId, newStatus) {
  const userDiv = document.querySelector(`div.user[data-id="${userId}"]`);
  const relationshipInfoDiv = userDiv.querySelector(".relationship-info");
  const userActionButton = userDiv.querySelector(".action-button");

  const user = loadedUsers.get(userId);

  if (caller === "Followers") {
    if (newStatus === "follow") {
      relationshipInfoDiv.innerHTML = "Mutual";
      userActionButton.textContent = "Unfollow";
    } else if (newStatus === "unfollow") {
      relationshipInfoDiv.innerHTML = "You Don't Follow Back";
      userActionButton.textContent = "Follow Back";
    }
  }

  if (caller === "Following") {
    if (newStatus === "follow") {
      if (user.followed_by_viewer && user.follows_viewer) {
        relationshipInfoDiv.innerHTML = "Mutual";
        userActionButton.textContent = "Unfollow";
      }
      if (user.followed_by_viewer && !user.follows_viewer) {
        relationshipInfoDiv.innerHTML = "Not Following You Back";
        userActionButton.textContent = "Unfollow";
      }
    } else if (newStatus === "unfollow") {
      if (user.followed_by_viewer && user.follows_viewer) {
        relationshipInfoDiv.innerHTML = "You Don't Follow Back";
        userActionButton.textContent = "Follow Back";
      } else if (user.followed_by_viewer && !user.follows_viewer) {
        relationshipInfoDiv.innerHTML = "Not Following You Back";
        userActionButton.textContent = "Follow";
      }
    }
  }
}

function followUser(userId, button) {
  button.disabled = true;
  fetch(`https://i.instagram.com/api/v1/web/friendships/${userId}/follow/`, {
    method: "POST",
    headers: headers,
    credentials: "include",
    mode: "cors",
  })
    .then((response) => {
      if (response.ok) {
        console.log("User followed successfully.");
        button.setAttribute("data-action", "unfollow");
        updateRelationshipInfo(userId, "follow");
        // Atualizações adicionais na UI podem ser feitas aqui
      } else {
        console.error("Error trying to follow the user.");
      }
    })
    .catch((error) => console.error("Error in the request:", error))
    .finally(() => {
      button.disabled = false;
    });
}

function unfollowUser(userId, button) {
  button.disabled = true;
  fetch(`https://i.instagram.com/api/v1/web/friendships/${userId}/unfollow/`, {
    method: "POST",
    headers: headers,
    credentials: "include",
    mode: "cors",
  })
    .then((response) => {
      if (response.ok) {
        console.log("User unfollowed successfully.");
        button.setAttribute("data-action", "follow");
        updateRelationshipInfo(userId, "unfollow");
        // Atualizações adicionais na UI podem ser feitas aqui
      } else {
        console.error("Error trying to unfollow the user.");
      }
    })
    .catch((error) => console.error("Error in the request:", error))
    .finally(() => {
      button.disabled = false;
    });
}

// Ajusta o evento do botão de filtro para alternar entre aplicar e remover o filtro
document
  .getElementById("filterNotFollowingBackButton")
  .addEventListener("click", function () {
    const button = this; // Referência ao botão clicado
    if (currentFilter === "notFollowingBack") {
      // Se o filtro atual está ativo, desativa-o
      currentFilter = null;
      button.textContent = "Filter Non-Followers"; // Atualiza o texto do botão
      button.classList.remove("filter-active");
      // Chama updateUIWithData sem aplicar o filtro, pois queremos remover o filtro
      currentFilteredUsers = null;
      updateUIWithData([...loadedUsers.values()], caller); // Pode precisar ajustar essa chamada conforme sua lógica de dados
    } else {
      // Ativa o filtro
      currentFilter = "notFollowingBack";
      button.textContent = "Remove Filter"; // Atualiza o texto do botão
      button.classList.add("filter-active");
      // Aplica o filtro com base no contexto atual (Following ou Followers)
      updateUIWithData([...loadedUsers.values()], caller); // Ajuste conforme necessário
    }
  });

document
  .getElementById("filterNotFollowedBackButton")
  .addEventListener("click", function () {
    const button = this; // Referência ao botão clicado
    if (currentFilter === "notFollowedBack") {
      currentFilter = null;
      button.textContent = "Filter Not Followed Back";
      button.classList.remove("filter-active");
      // Limpa o filtro e atualiza a UI
      currentFilteredUsers = null;
      updateUIWithData([...loadedUsers.values()], caller);
    } else {
      currentFilter = "notFollowedBack";
      button.textContent = "Remove Filter";
      button.classList.add("filter-active");
      // Aplica o filtro e atualiza a UI
      updateUIWithData([...loadedUsers.values()], caller);
    }
  });
