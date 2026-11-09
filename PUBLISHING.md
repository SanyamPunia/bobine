# Publishing bobine

How to release a new version of the `bobine` npm package. The package lives
in `packages/bobine/` and compiles the same `components/ui` and `lib` files the
shadcn registry ships, so a release carries whatever is on `main`.

## Before your first release

1. Create an account on [npmjs.com](https://www.npmjs.com/signup) and turn on
   two-factor authentication for publishing (Account → Two-Factor
   Authentication → "Authorization and writes").
2. Ask an owner of the package to add you:

   ```bash
   npm owner add <your-npm-username> bobine
   ```

3. Log in from your terminal and check it worked:

   ```bash
   npm login
   npm whoami
   ```

## Pick the version

The version follows [semver](https://semver.org). While bobine is below 1.0:

| Change | Bump | Example |
| --- | --- | --- |
| Bug fix, no API change | patch | 0.1.0 → 0.1.1 |
| New prop, part or export | minor | 0.1.1 → 0.2.0 |
| Removed or renamed prop, part or export | minor, and say so in the release notes | 0.2.0 → 0.3.0 |

From 1.0 on, a breaking change is a major bump.

## Release steps

Run everything from the repository root unless a step says otherwise.

1. **Start from an up-to-date, clean `main`.**

   ```bash
   git checkout main
   git pull
   git status   # must show nothing to commit
   ```

2. **Bump the version.** This edits `packages/bobine/package.json` only. The
   site header reads the version from that file, so nothing else changes.

   ```bash
   cd packages/bobine
   npm version patch --no-git-tag-version   # or minor / major
   cd ../..
   ```

3. **Update what documents the API**, if the release changes it:
   `packages/bobine/README.md`, `skills/bobine/SKILL.md` and the props in
   `lib/docs.ts`.

4. **Run the checks.**

   ```bash
   pnpm install
   pnpm test
   pnpm registry:build
   pnpm package:build
   ```

5. **Check what will be published.** The list should hold only `dist/`,
   `README.md`, `LICENSE` and `package.json`, with no source files or `.env`.

   ```bash
   cd packages/bobine
   npm pack --dry-run
   ```

6. **Commit and tag the release.**

   ```bash
   git add packages/bobine/package.json
   git commit -m "chore(release): bobine 0.1.1"
   git tag bobine@0.1.1
   ```

7. **Publish.** `pnpm publish` rebuilds through `prepublishOnly` and refuses
   to run on a dirty tree or off `main`. npm asks for your two-factor code.

   ```bash
   cd packages/bobine
   pnpm publish --access public
   ```

   To rehearse without publishing, add `--dry-run`.

8. **Push the commit and the tag.**

   ```bash
   git push
   git push origin bobine@0.1.1
   ```

9. **Confirm the release.**

   ```bash
   npm view bobine version
   ```

   Then open [npmjs.com/package/bobine](https://www.npmjs.com/package/bobine)
   and check the README renders. Optionally, create a GitHub release from the
   tag with a short list of changes.

## If something goes wrong

- **Published a broken version:** do not unpublish it. Fix the bug and
  release a patch, then mark the bad one:

  ```bash
  npm deprecate bobine@0.1.1 "Broken build, use 0.1.2"
  ```

  npm only allows unpublishing within 72 hours, and a version number can
  never be reused, even after an unpublish.
- **`E403` / "You do not have permission":** you are not an owner yet. See
  "Before your first release".
- **`EOTP`:** npm needs your two-factor code. Run the command again and
  enter it, or pass `--otp=123456`.
- **"Unclean working tree":** commit or stash your changes first. Do not
  pass `--no-git-checks` to skip this check.
