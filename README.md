# Manage Instagram Followers

**Manage Instagram Followers** is a lightweight, bilingual Chrome extension that helps you compare Instagram connections, find non-followers, follow people back, and safely clean up your following list.

---

## GitAds Sponsored
[![Sponsored by GitAds](https://gitads.dev/v1/ad-serve?source=gabireze/manage-instagram-followers@github)](https://gitads.dev/v1/ad-track?source=gabireze/manage-instagram-followers@github)

---

## Features

- **Follow Back** – Easily follow users who recently followed you.
- **Unfollow Non-Followers** – Remove users who are not following you back.
- **Mutual Followers** – See users you follow who also follow you.
- **Search** – Find users by name or username using the search bar.
- **Relationship filters and counts** – View everyone, non-followers, mutual connections, accounts you do not follow, and pending requests.
- **Safe batch cleanup** – Select non-followers, review the action, and process accounts one at a time.
- **Refresh and sorting** – Refresh the comparison and sort by relationship, username, or name.
- **English and Portuguese** – Switch languages directly in the interface.

---

## Installation

### From the Chrome Web Store

Install directly from the Chrome Web Store:  
[Manage Instagram Followers - Chrome Web Store](https://chromewebstore.google.com/detail/manage-instagram-followers/laoengmeoeboelooafhjhbfphdfoiegg)

### Manual Installation (Developer Mode)

1. Clone this repository or download the source code.
2. Open Google Chrome and go to `chrome://extensions`.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the folder containing the extension.

---

## Usage

1. Log in to your Instagram account.
2. Click the extension icon in the Chrome toolbar.
3. In the new Instagram tab, click **Find non-followers**.
4. Review the results or switch between **Following** and **Followers**.
5. Use search and filters, then click **Follow**, **Unfollow**, or **Cancel Request** to manage each user.

The extension always opens in a fresh Instagram tab for a consistent startup. The main **Find non-followers** action opens the most common workflow directly; the other connection lists appear after that first step.

---

## Important Notes

- This extension is designed to simplify follower management but should be used responsibly to avoid violating Instagram’s [Terms of Use](https://help.instagram.com/581066165581870).
- Instagram enforces rate limits. To prevent temporary blocks on your account, avoid excessive activity.
- **Advanced Mode** disables internal safety limits. Use this option with caution.
- Advanced Mode turns itself off after 15 minutes. Instagram's own limits always continue to apply.
- No Instagram credentials, cookies, usernames, or account IDs are sent to the developer.

---

## Development

Run the dependency-free checks with:

```bash
npm test
npm run check
```

The tests cover relationship normalization, filters, counters, sorting, and follow/unfollow response verification.

---

## Português

O **Manage Instagram Followers** ajuda a descobrir quem não segue você de volta, encontrar conexões mútuas, seguir novos seguidores e organizar com segurança a lista de perfis seguidos. A interface pode ser alternada entre inglês e português.

Ao clicar no ícone, a extensão abre uma nova aba do Instagram. O fluxo principal começa no botão **Encontrar quem não me segue**; depois, as listas **Seguindo** e **Seguidores**, busca, ordenação, atualização manual, filtros com contadores e seleção múltipla ficam disponíveis.

---

## Contributing

Contributions are welcome. If you have suggestions or improvements, feel free to open an issue or submit a pull request.

---

## License

This project is licensed under the MIT License. For details, see the [LICENSE](https://opensource.org/licenses/MIT) file.

<!-- GitAds-Verify: DZ1GIX51I6IU89RM199KZPDB8HHT1THS -->
