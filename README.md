# The Minimalist Entrepreneur - Codex Skills

Codex-native conversion of [`slavingia/skills`](https://github.com/slavingia/skills), based on *The Minimalist Entrepreneur* by Sahil Lavingia.

This repository keeps the original 10 business-advisor skills and packages them in the Codex skill layout:

- `SKILL.md` with Codex-compatible frontmatter
- `agents/openai.yaml` UI metadata for Codex
- no Claude plugin manifest required

## Install

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
