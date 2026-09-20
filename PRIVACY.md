# Privacy Policy / Política de Privacidade

**Manage Instagram Followers**

Effective date / Data de vigência: September 20, 2026 / 20 de setembro de 2026

Applies to / Aplicável à versão: 1.2.0

[English](#english) · [Português](#português)

---

## English

### 1. Purpose

Manage Instagram Followers is a Chrome extension with one purpose: helping a signed-in Instagram user understand and manage the relationship between their Followers and Following lists.

The extension can compare those lists, display relationship statuses, search and filter accounts, and perform follow, unfollow, or cancel-request actions only when initiated by the user.

### 2. Data processed locally

To provide these features, the extension temporarily processes data already available through the user's authenticated Instagram browser session, including:

- Instagram usernames, display names, profile pictures, and account identifiers.
- Followers and Following lists and the relationship status between accounts.
- Follow, unfollow, and cancel-request actions initiated by the user.

This information is processed locally in the Instagram tab. Connection data may be kept in an in-memory cache for up to two minutes to avoid unnecessary repeated requests. It is not stored permanently and is cleared when the page or extension interface is closed or reloaded.

### 3. Data collected by the developer

The developer does **not** collect, receive, store, sell, or use:

- Instagram credentials or passwords.
- Cookies, session identifiers, CSRF tokens, or authentication tokens.
- Instagram usernames, account identifiers, profile pictures, or connection lists.
- Follow or unfollow history.
- Browsing history or activity on unrelated websites.

The extension does not use analytics, advertising trackers, an external server, or a developer-controlled database.

### 4. Chrome storage

The extension stores only:

- The selected interface language (`English` or `Português`) in `chrome.storage.local`.
- Recent follow and unfollow timestamps in `chrome.storage.session`, used only to enforce the extension's temporary safety limits during the browser session.

These stored values do not contain Instagram usernames, account identifiers, credentials, cookies, tokens, profile data, or Followers and Following lists.

Users can remove locally stored extension data by uninstalling the extension or clearing its data through Chrome.

### 5. Network requests and sharing

The extension communicates only with Instagram domains covered by `https://*.instagram.com/*` to:

- Load connection information needed for the user-facing features.
- Send follow, unfollow, or cancel-request actions explicitly requested by the user.
- Verify whether the requested relationship change occurred before updating the interface.

These requests go directly between the user's browser and Instagram. Data is not sent to the developer, advertising networks, data brokers, analytics providers, or any other external service.

Instagram processes these requests under its own terms and privacy practices.

### 6. Chrome permissions

The extension uses the narrow permissions required for its single purpose:

- `scripting`: injects the packaged interface, styles, and logic into an Instagram tab after the user clicks the extension icon.
- `storage`: saves the language preference and temporary safety-limit timestamps described above.
- `https://*.instagram.com/*`: allows the extension to operate only on Instagram pages and communicate with the Instagram endpoints required for connection management.

The extension does not request access to unrelated websites.

### 7. Remote code

The extension does **not** use remote code. All executable JavaScript and CSS is included in the extension package. It does not use `eval`, download executable scripts, import remote modules, or execute instructions received from a remote server.

Instagram responses provide data and action results only; they are not executed as code.

### 8. Limited use and security

Data accessed by the extension is used only to provide its disclosed follower-relationship management features. This use complies with the [Chrome Web Store User Data Policy](https://developer.chrome.com/docs/webstore/program-policies/policies), including its Limited Use requirements.

The extension keeps processing within the user's browser and relies on the user's existing authenticated HTTPS connection with Instagram. Users should never share their Instagram cookies, tokens, or session information with anyone.

### 9. User choices and responsibility

Users choose when to open the extension and when to initiate each account action. Individual and batch unfollow operations require confirmation. Internal safety limits are included, but Instagram's own restrictions and rate limits always continue to apply.

Manage Instagram Followers is an independent project and is not affiliated with, endorsed by, or sponsored by Instagram or Meta. Users are responsible for complying with Instagram's [Terms of Use](https://help.instagram.com/581066165581870).

### 10. Changes to this policy

This policy may be updated when the extension's functionality or data practices change. The effective date and applicable version will be updated at the top of this document.

### 11. Contact

Maintainer: **Gabriel de Rezende Gonçalves**

Website: [https://gabireze.com.br](https://gabireze.com.br/)

Email: [contato@gabireze.com.br](mailto:contato@gabireze.com.br)

---

## Português

### 1. Finalidade

O Manage Instagram Followers é uma extensão do Chrome com uma única finalidade: ajudar um usuário conectado ao Instagram a entender e gerenciar a relação entre suas listas de Seguidores e Seguindo.

A extensão pode comparar essas listas, exibir o status das relações, pesquisar e filtrar contas e executar ações de seguir, deixar de seguir ou cancelar solicitação somente quando iniciadas pelo usuário.

### 2. Dados processados localmente

Para oferecer esses recursos, a extensão processa temporariamente dados já disponíveis na sessão autenticada do Instagram no navegador do usuário, incluindo:

- Nomes de usuário, nomes de exibição, fotos de perfil e identificadores de contas do Instagram.
- Listas de Seguidores e Seguindo e o status da relação entre as contas.
- Ações de seguir, deixar de seguir e cancelar solicitação iniciadas pelo usuário.

Essas informações são processadas localmente na aba do Instagram. Os dados das conexões podem permanecer em um cache na memória por até dois minutos para evitar solicitações repetidas desnecessárias. Eles não são armazenados permanentemente e são apagados quando a página ou a interface da extensão é fechada ou recarregada.

### 3. Dados coletados pelo desenvolvedor

O desenvolvedor **não** coleta, recebe, armazena, vende ou utiliza:

- Credenciais ou senhas do Instagram.
- Cookies, identificadores de sessão, tokens CSRF ou tokens de autenticação.
- Nomes de usuário, identificadores de contas, fotos de perfil ou listas de conexões do Instagram.
- Histórico de ações de seguir ou deixar de seguir.
- Histórico de navegação ou atividade em sites não relacionados.

A extensão não utiliza ferramentas de análise, rastreadores de publicidade, servidor externo ou banco de dados controlado pelo desenvolvedor.

### 4. Armazenamento do Chrome

A extensão armazena somente:

- O idioma selecionado para a interface (`English` ou `Português`) no `chrome.storage.local`.
- Registros recentes de horário das ações de seguir e deixar de seguir no `chrome.storage.session`, utilizados somente para aplicar os limites temporários de segurança durante a sessão do navegador.

Esses valores não contêm nomes de usuário, identificadores de contas, credenciais, cookies, tokens, dados de perfil ou listas de Seguidores e Seguindo do Instagram.

O usuário pode remover os dados locais da extensão desinstalando-a ou limpando seus dados pelo Chrome.

### 5. Solicitações de rede e compartilhamento

A extensão se comunica apenas com domínios do Instagram abrangidos por `https://*.instagram.com/*` para:

- Carregar as informações de conexões necessárias para os recursos exibidos ao usuário.
- Enviar ações de seguir, deixar de seguir ou cancelar solicitação solicitadas explicitamente pelo usuário.
- Confirmar se a alteração solicitada realmente aconteceu antes de atualizar a interface.

Essas solicitações ocorrem diretamente entre o navegador do usuário e o Instagram. Os dados não são enviados ao desenvolvedor, redes de publicidade, corretores de dados, provedores de análise ou qualquer outro serviço externo.

O Instagram processa essas solicitações de acordo com seus próprios termos e práticas de privacidade.

### 6. Permissões do Chrome

A extensão utiliza apenas as permissões necessárias para sua finalidade única:

- `scripting`: insere a interface, os estilos e a lógica incluídos no pacote em uma aba do Instagram depois que o usuário clica no ícone da extensão.
- `storage`: salva a preferência de idioma e os registros temporários dos limites de segurança descritos acima.
- `https://*.instagram.com/*`: permite que a extensão funcione somente nas páginas do Instagram e se comunique com os endpoints necessários para gerenciar conexões.

A extensão não solicita acesso a sites não relacionados.

### 7. Código remoto

A extensão **não** utiliza código remoto. Todo JavaScript e CSS executável está incluído no pacote da extensão. Ela não utiliza `eval`, baixa scripts executáveis, importa módulos remotos ou executa instruções recebidas de um servidor remoto.

As respostas do Instagram fornecem somente dados e resultados das ações; elas não são executadas como código.

### 8. Uso limitado e segurança

Os dados acessados pela extensão são utilizados somente para fornecer os recursos divulgados de gerenciamento das relações entre seguidores. Esse uso está de acordo com a [Política de Dados do Usuário da Chrome Web Store](https://developer.chrome.com/docs/webstore/program-policies/policies), incluindo seus requisitos de Uso Limitado.

O processamento permanece no navegador do usuário e utiliza a conexão HTTPS autenticada já existente com o Instagram. O usuário nunca deve compartilhar cookies, tokens ou informações de sessão do Instagram com outras pessoas.

### 9. Escolhas e responsabilidade do usuário

O usuário escolhe quando abrir a extensão e quando iniciar cada ação em uma conta. Ações individuais ou em lote para deixar de seguir exigem confirmação. A extensão inclui limites internos de segurança, mas as restrições e os limites do próprio Instagram continuam sempre ativos.

O Manage Instagram Followers é um projeto independente e não possui afiliação, aprovação ou patrocínio do Instagram ou da Meta. O usuário é responsável por cumprir os [Termos de Uso do Instagram](https://help.instagram.com/581066165581870).

### 10. Alterações nesta política

Esta política poderá ser atualizada quando as funcionalidades ou práticas de dados da extensão forem modificadas. A data de vigência e a versão aplicável serão atualizadas no início deste documento.

### 11. Contato

Responsável: **Gabriel de Rezende Gonçalves**

Site: [https://gabireze.com.br](https://gabireze.com.br/)

E-mail: [contato@gabireze.com.br](mailto:contato@gabireze.com.br)
