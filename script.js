document
  .getElementById("loadButton")
  .addEventListener("click", fetchInstagramData);

let endCursor = ""; // Variável global para manter o registro do cursor
const loadedUser = new Set();
let filteredUsers = [];

document.getElementById("searchInput").addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();

  if (!searchTerm) {
    document.getElementById("userList").innerHTML = "";
    addUsersToDom(loadedUser);
    return;
  }

  // Filtra diretamente de loadedUserIds, que assume ser um Set de objetos de usuário
  filteredUsers = Array.from(loadedUser).filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm) ||
      user.full_name.toLowerCase().includes(searchTerm)
  );

  // Limpa a lista de usuários antes de repopulá-la com os resultados filtrados
  document.getElementById("userList").innerHTML = "";

  // Chama populateUsers com os usuários filtrados
  addUsersToDom(filteredUsers);
});

async function fetchInstagramData() {
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
      `https://www.instagram.com/graphql/query/?query_hash=3dec7e2c57367ef3da3d987d89f9dbc8&variables=${encodeURIComponent(JSON.stringify(variables))}`
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
    updateUIWithData(data.data.user.edge_follow.edges);

    if (hasNextPage) {
      fetchInstagramData(); // Chama a si mesma para buscar a próxima página
    }
  } catch (error) {
    console.error("Erro ao buscar dados do Instagram:", error);
  } finally {
    loader.style.display = "none"; // Ocultar o loader após a operação
  }
}

function updateUIWithData(edges) {
  searchInput.style.display = "block";
  populateLoadedUser(edges);
  addUsersToDom(loadedUser);

  // Associa o ouvinte de evento a todos os botões "Remover" na página.
  document.querySelectorAll(".unfollow-button").forEach((button) => {
    button.addEventListener("click", handleFollowButton);
  });
}


function populateLoadedUser(users) {
  users.forEach((edge) => {
    const user = edge.node;
    // Verifica se o usuário já foi carregado
    if (!loadedUser.has(user.id)) {
      // Adiciona o ID do usuário ao Set para evitar duplicatas
      loadedUser.add(user);
    }
  });
}

function addUsersToDom(users) {
  const usersList = document.getElementById("userList");
  usersList.style.display = "flex";

  users.forEach((user) => {
    // Cria e adiciona o elemento 'div' para o usuário
    const userDiv = document.createElement("div");
    userDiv.classList.add("user");
    userDiv.innerHTML = `
      <a href="https://www.instagram.com/${user.username}/" target="_blank">
        <img src="${user.profile_pic_url}" alt="${user.username}" class="user-photo">
      </a>
      <div class="user-details">
        <a href="https://www.instagram.com/${user.username}/" target="_blank" class="username">@${user.username}</a>
        <div class="full-name">${user.full_name}</div>
      </div>
      <button class="unfollow-button" data-id="${user.id}">Remover</button>
    `;

    usersList.appendChild(userDiv);
  });
}

function populateUsers(users) {
  const usersList = document.getElementById("userList");

  users.forEach((edge) => {
    const user = edge.node;

    // Verifica se o usuário já foi carregado
    if (loadedUser.has(user.id)) {
      // Se já foi carregado, não faz nada e passa para o próximo
      return;
    }

    // Adiciona o ID do usuário ao Set para evitar duplicatas no futuro
    loadedUser.add(user.id);

    // ... Criação e adição do elemento 'div' como antes ...
    const userDiv = document.createElement("div");
    userDiv.classList.add("user");
    userDiv.innerHTML = `
    <a href="https://www.instagram.com/${user.username}/" target="_blank">
      <img src="${user.profile_pic_url}" alt="${user.username}" class="user-photo">
    </a>
    <div class="user-details">
      <a href="https://www.instagram.com/${user.username}/" target="_blank" class="username">@${user.username}</a>
      <div class="full-name">${user.full_name}</div>
    </div>
    <button class="unfollow-button" data-id="${user.id}">Remover</button>
  `;

    usersList.appendChild(userDiv);
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

function handleFollowButton(event) {
  const isFollowing = event.target.textContent === "Remover";

  if (isFollowing) {
    unfollowUser(event);
  } else {
    followUser(event);
  }
}

function followUser(event) {
  const userId = event.target.getAttribute("data-id");
  fetch(`https://i.instagram.com/api/v1/web/friendships/${userId}/follow/`, {
    method: "POST",
    headers: headers,
    credentials: "include", // Necessário para incluir cookies de sessão
    mode: "cors",
  })
    .then((response) => {
      if (response.ok) {
        console.log("Usuário seguido com sucesso.");
        event.target.textContent = "Remover";
        event.target.classList.remove("follow-button");
        event.target.classList.add("unfollow-button");
        // Atualizações adicionais na UI podem ser feitas aqui
      } else {
        console.error("Erro ao tentar seguir o usuário.");
      }
    })
    .catch((error) => console.error("Erro na requisição:", error));
}

// Exemplo de uso dos cabeçalhos em uma requisição fetch para deixar de seguir um usuário
function unfollowUser(event) {
  const userId = event.target.getAttribute("data-id");
  fetch(`https://i.instagram.com/api/v1/web/friendships/${userId}/unfollow/`, {
    method: "POST",
    headers: headers,
    credentials: "include", // Necessário para incluir cookies de sessão
    mode: "cors",
  })
    .then((response) => {
      if (response.ok) {
        console.log("Usuário deixou de seguir com sucesso.");
        event.target.textContent = "Seguir";
        event.target.classList.remove("unfollow-button");
        event.target.classList.add("follow-button");
        // Atualizações adicionais na UI podem ser feitas aqui
      } else {
        console.error("Erro ao tentar deixar de seguir o usuário.");
      }
    })
    .catch((error) => console.error("Erro na requisição:", error));
}
