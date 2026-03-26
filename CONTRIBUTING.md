# Contributing to PuduCan — Cancer Tracker JIPMER

Thank you for your interest in contributing! Please take a moment to read these guidelines before getting started.

---

## 🧭 Getting Started

1. **Fork** the repository and clone your fork locally.
2. Install dependencies using `pnpm install`.
3. Copy `.env.example` to `.env.local` and fill in your Firebase credentials.
4. Run the development server with `pnpm dev`.

---

## 🌿 Branching Strategy

- `main` — stable, production-ready code.
- Create feature branches from `main` using the naming convention:
  - `feat/your-feature-name`
  - `fix/bug-description`
  - `chore/task-name`
  - `docs/update-description`

---

## ✅ Before You Submit a PR

- Run linting: `pnpm lint`
- Run formatter: `pnpm format`
- Run tests: `pnpm test`
- Make sure all pre-commit hooks (Husky) pass without errors.

---

## 📝 Commit Message Convention

Follow the **Conventional Commits** format:
```
type(scope): short description

Examples:
feat(auth): add role-based redirect on login
fix(table): resolve pagination reset on filter change
chore(deps): upgrade TanStack Query to v5
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## 🔀 Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR.
- Write a clear PR title and description explaining **what** and **why**.
- Reference any related issues using `Closes #<issue-number>`.
- Add or update tests if your change affects logic.
- Do not commit `.env` files or any credentials.

---

## 🐛 Reporting Issues

When opening an issue, please include:
- A clear title and description.
- Steps to reproduce (for bugs).
- Screenshots if applicable.
- Your environment (OS, browser, Node version).

---

## 🗣️ Code of Conduct

Be respectful and constructive in all interactions. This project is a healthcare tool — quality and reliability matter deeply.

---

## 📬 Questions?

Open a GitHub Discussion or reach out via Issues. We're happy to help!
