document
  .getElementById("loadFollowersButton")
  .addEventListener("click", fetchFollowers);

document
  .getElementById("loadFollowingButton")
  .addEventListener("click", fetchFollowing);

let endCursor = ""; // Variável global para manter o registro do cursor
const loadedUsers = new Map(); // Usar Map em vez de Set
let filteredUsers = [];
let caller = null;

document.getElementById("searchInput").addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();

  if (!searchTerm) {
    document.getElementById("userList").innerHTML = "";
    // Usa os valores do Map loadedUsers
    addUsersToDom([...loadedUsers.values()]);
    return;
  }

  // Agora, filtramos diretamente dos valores de loadedUsers, que é um Map de objetos de usuário
  filteredUsers = [...loadedUsers.values()].filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm) ||
      user.full_name.toLowerCase().includes(searchTerm)
  );

  // Limpa a lista de usuários antes de repopulá-la com os resultados filtrados
  document.getElementById("userList").innerHTML = "";

  // Passa os usuários filtrados para serem adicionados ao DOM
  addUsersToDom(filteredUsers);
});

async function fetchFollowing() {
  const loader = document.getElementById("loader");
  loader.style.display = "block"; // Mostrar o loader

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
      alert("Você não segue ninguém ou não foi possível carregar os dados.");
      return;
    }

    // Atualize o cursor global com o novo end_cursor da resposta
    endCursor = data.data.user.edge_follow.page_info.end_cursor;
    const hasNextPage = data.data.user.edge_follow.page_info.has_next_page;

    // Chama função para atualizar a UI
    updateUIWithData(data.data.user.edge_follow.edges, "Followers");

    if (hasNextPage) {
      fetchFollowing(); // Chama a si mesma para buscar a próxima página
    }
  } catch (error) {
    console.error("Erro ao buscar dados do Instagram:", error);
  } finally {
    loader.style.display = "none"; // Ocultar o loader após a operação
  }
}

async function fetchFollowers() {
  const loader = document.getElementById("loader");
  loader.style.display = "block"; // Mostrar o loader

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
      alert("Você não segue ninguém ou não foi possível carregar os dados.");
      return;
    }

    // Atualize o cursor global com o novo end_cursor da resposta
    endCursor = data.data.user.edge_followed_by.page_info.end_cursor;
    const hasNextPage = data.data.user.edge_followed_by.page_info.has_next_page;

    // Chama função para atualizar a UI
    updateUIWithData(data.data.user.edge_followed_by.edges, "Following");

    if (hasNextPage) {
      fetchFollowers(); // Chama a si mesma para buscar a próxima página
    }
  } catch (error) {
    console.error("Erro ao buscar dados do Instagram:", error);
  } finally {
    loader.style.display = "none"; // Ocultar o loader após a operação
  }
}

function updateUIWithData(edges, functionCalled) {
  searchInput.style.display = "block";
  populateLoadedUser(edges, functionCalled);
  addUsersToDom(loadedUsers.values());
}

function populateLoadedUser(users, functionCalled) {
  if (caller !== functionCalled) {
    loadedUsers.clear();
    caller = functionCalled;
  }
  users.forEach((edge) => {
    const user = edge.node;
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
    let buttonLabel = "Follow";
    let buttonAction = "follow";

    if (user.followed_by_viewer) {
      buttonLabel = "Unfollow";
      buttonAction = "unfollow";
    }

    // Caso especial para seguidores que o usuário não segue de volta
    if (!user.followed_by_viewer && caller === "Followers") {
      buttonLabel = "Follow Back";
      buttonAction = "follow";
    }

    userDiv.innerHTML = `
      <a href="https://www.instagram.com/${user.username}/" target="_blank">
        <img src="${user.profile_pic_url}" alt="${user.username}" class="user-photo">
      </a>
      <div class="user-details">
        <a href="https://www.instagram.com/${user.username}/" target="_blank" class="username">@${user.username}</a>
        <div class="full-name">${user.full_name}</div>
      </div>
      <button class="action-button" data-id="${user.id}" data-action="${buttonAction}">${buttonLabel}</button>
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

function followUser(userId, button) {
  fetch(`https://i.instagram.com/api/v1/web/friendships/${userId}/follow/`, {
    method: "POST",
    headers: headers,
    credentials: "include", // Necessário para incluir cookies de sessão
    mode: "cors",
  })
    .then((response) => {
      if (response.ok) {
        console.log("Usuário seguido com sucesso.");
        button.textContent = "Unfollow";
        button.setAttribute("data-action", "unfollow");
        // Atualizações adicionais na UI podem ser feitas aqui
      } else {
        console.error("Erro ao tentar seguir o usuário.");
      }
    })
    .catch((error) => console.error("Erro na requisição:", error));
}

// Exemplo de uso dos cabeçalhos em uma requisição fetch para deixar de seguir um usuário
function unfollowUser(userId, button) {
  fetch(`https://i.instagram.com/api/v1/web/friendships/${userId}/unfollow/`, {
    method: "POST",
    headers: headers,
    credentials: "include", // Necessário para incluir cookies de sessão
    mode: "cors",
  })
    .then((response) => {
      if (response.ok) {
        console.log("Usuário deixou de seguir com sucesso.");
        button.textContent = "Follow";
        button.setAttribute("data-action", "follow");
        // Atualizações adicionais na UI podem ser feitas aqui
      } else {
        console.error("Erro ao tentar deixar de seguir o usuário.");
      }
    })
    .catch((error) => console.error("Erro na requisição:", error));
}
