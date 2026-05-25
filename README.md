# The Minimalist Entrepreneur - Codex Skills

Codex-native conversion of [`slavingia/skills`](https://github.com/slavingia/skills), based on *The Minimalist Entrepreneur* by Sahil Lavingia.

This repository keeps the original 10 business-advisor skills and packages them in the Codex skill layout:

- `SKILL.md` with Codex-compatible frontmatter
- `agents/openai.yaml` UI metadata for Codex
- no Claude plugin manifest required

## Install

After the npm package is published, install with:

```bash
npx one-person-company-codex-skills add
```

Restart Codex after installing new skills.

Useful variants:

```bash
# Check what the installer can see
npx one-person-company-codex-skills doctor

# Install only a few skills
npx one-person-company-codex-skills add pricing mvp validate-idea

# Replace already-installed copies
npx one-person-company-codex-skills add --force
```

The `npx` installer copies the bundled `skills/*` folders into `$CODEX_HOME/skills`, or `~/.codex/skills` when `CODEX_HOME` is unset.

Before the first npm publish, the same CLI can be tested directly from GitHub:

```bash
npx --package github:Iwiii/minimalist-entrepreneur-codex-skills one-person-company-codex-skills add
```

The shorter alias also works after installation:

```bash
npx --package one-person-company-codex-skills opc-codex-skills --help
```

## Publish to npm

The package name `one-person-company-codex-skills` is configured in `package.json`.

One-time setup:

```bash
npm login --registry=https://registry.npmjs.org/
npm whoami --registry=https://registry.npmjs.org/
```

Publish:

```bash
npm publish --registry=https://registry.npmjs.org/
```

npm currently requires either 2FA on the publishing account or a granular access token with bypass 2FA enabled. If npm prompts for browser login, security key, or OTP during `npm login` / `npm publish`, complete that prompt in your browser or terminal.

## Manual Install

Ask Codex to install from this GitHub repo:

```text
Use $skill-installer to install all skills from Iwiii/minimalist-entrepreneur-codex-skills:
skills/find-community
skills/validate-idea
skills/mvp
skills/processize
skills/first-customers
skills/pricing
skills/marketing-plan
skills/grow-sustainably
skills/company-values
skills/minimalist-review
```

Or run the installer helper directly:

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo Iwiii/minimalist-entrepreneur-codex-skills \
  --path skills/find-community \
    skills/validate-idea \
    skills/mvp \
    skills/processize \
    skills/first-customers \
    skills/pricing \
    skills/marketing-plan \
    skills/grow-sustainably \
    skills/company-values \
    skills/minimalist-review
```

Restart Codex after installing new skills.

## Skills

| Skill | Invoke | Use when |
| --- | --- | --- |
| Find Community | `$find-community` | Looking for a business idea or trying to identify a community to serve |
| Validate Idea | `$validate-idea` | Testing whether a business idea is worth pursuing before building |
| MVP | `$mvp` | Reducing product scope to the simplest valuable version |
| Processize | `$processize` | Delivering value manually before writing code |
| First Customers | `$first-customers` | Finding and selling to the first 100 customers |
| Pricing | `$pricing` | Setting prices or revisiting pricing strategy |
| Marketing Plan | `$marketing-plan` | Creating an organic content and audience strategy |
| Grow Sustainably | `$grow-sustainably` | Evaluating hiring, spending, fundraising, or scaling decisions |
| Company Values | `$company-values` | Defining culture and values before hiring |
| Minimalist Review | `$minimalist-review` | Gut-checking a business decision through minimalist principles |

## Source

Converted from [`slavingia/skills`](https://github.com/slavingia/skills). The source plugin metadata declares the project as MIT licensed.

See [`LICENSE`](LICENSE) and [`NOTICE`](NOTICE) for license text and upstream attribution.
