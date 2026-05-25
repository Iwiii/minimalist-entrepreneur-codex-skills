#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");

const PACKAGE_ROOT = path.resolve(__dirname, "..");
const SOURCE_SKILLS_DIR = path.join(PACKAGE_ROOT, "skills");
const DEFAULT_COMMAND = "add";

function usage() {
  return `Minimalist Entrepreneur Codex Skills

Usage:
  minimalist-entrepreneur-codex-skills add [skill...] [--dest <dir>] [--force] [--dry-run] [--json]
  minimalist-entrepreneur-codex-skills list [--json]
  minimalist-entrepreneur-codex-skills doctor [--json]

Commands:
  add       Install all bundled skills, or the named subset.
  install   Alias for add.
  list      List bundled skill names.
  doctor    Check source and destination paths.

Options:
  --dest <dir>   Destination skills directory. Defaults to $CODEX_HOME/skills or ~/.codex/skills.
  --force        Replace existing destination skill directories.
  --dry-run      Show what would happen without writing files.
  --json         Print machine-readable JSON.
  -h, --help     Show this help.

Examples:
  npx minimalist-entrepreneur-codex-skills add
  npx minimalist-entrepreneur-codex-skills add pricing mvp
  npx minimalist-entrepreneur-codex-skills doctor --json
`;
}

function parseArgs(argv) {
  const options = {
    command: null,
    dest: null,
    force: false,
    dryRun: false,
    json: false,
    help: false,
    skills: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--dest") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("--dest requires a directory");
      }
      options.dest = value;
      index += 1;
      continue;
    }

    if (arg.startsWith("--dest=")) {
      options.dest = arg.slice("--dest=".length);
      continue;
    }

    if (arg === "--force") {
      options.force = true;
      continue;
    }

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--json") {
      options.json = true;
      continue;
    }

    if (arg === "-h" || arg === "--help") {
      options.help = true;
      continue;
    }

    if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    }

    if (!options.command) {
      options.command = arg;
    } else {
      options.skills.push(normalizeSkillName(arg));
    }
  }

  options.command = normalizeCommand(options.command || DEFAULT_COMMAND);
  options.dest = path.resolve(expandHome(options.dest || defaultDest()));
  return options;
}

function normalizeCommand(command) {
  if (command === "install") {
    return "add";
  }
  return command;
}

function normalizeSkillName(value) {
  return value.replace(/^skills\//, "").replace(/\/$/, "");
}

function expandHome(value) {
  if (value === "~") {
    return os.homedir();
  }
  if (value.startsWith("~/")) {
    return path.join(os.homedir(), value.slice(2));
  }
  return value;
}

function defaultDest() {
  return path.join(process.env.CODEX_HOME || path.join(os.homedir(), ".codex"), "skills");
}

function listBundledSkills() {
  if (!fs.existsSync(SOURCE_SKILLS_DIR)) {
    throw new Error(`Bundled skills directory not found: ${SOURCE_SKILLS_DIR}`);
  }

  return fs
    .readdirSync(SOURCE_SKILLS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => fs.existsSync(path.join(SOURCE_SKILLS_DIR, name, "SKILL.md")))
    .sort();
}

function copyDirectory(source, destination) {
  fs.mkdirSync(destination, { recursive: true });

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  }
}

function removeDirectory(target) {
  fs.rmSync(target, { recursive: true, force: true });
}

function installSkills(options) {
  const allSkills = listBundledSkills();
  const selectedSkills = options.skills.length > 0 ? options.skills : allSkills;
  const unknown = selectedSkills.filter((name) => !allSkills.includes(name));

  if (unknown.length > 0) {
    throw new Error(`Unknown skill(s): ${unknown.join(", ")}. Available: ${allSkills.join(", ")}`);
  }

  const results = [];

  if (!options.dryRun) {
    fs.mkdirSync(options.dest, { recursive: true });
  }

  for (const name of selectedSkills) {
    const source = path.join(SOURCE_SKILLS_DIR, name);
    const destination = path.join(options.dest, name);
    const exists = fs.existsSync(destination);

    if (exists && !options.force) {
      results.push({ skill: name, status: "skipped", destination, reason: "already exists" });
      continue;
    }

    if (!options.dryRun) {
      if (exists) {
        removeDirectory(destination);
      }
      copyDirectory(source, destination);
    }

    results.push({
      skill: name,
      status: options.dryRun ? "would-install" : exists ? "replaced" : "installed",
      destination,
    });
  }

  return {
    command: "add",
    destinationRoot: options.dest,
    dryRun: options.dryRun,
    force: options.force,
    results,
  };
}

function doctor(options) {
  const skills = listBundledSkills();
  return {
    command: "doctor",
    packageRoot: PACKAGE_ROOT,
    sourceSkillsDir: SOURCE_SKILLS_DIR,
    sourceSkillsDirExists: fs.existsSync(SOURCE_SKILLS_DIR),
    bundledSkillCount: skills.length,
    bundledSkills: skills,
    destinationRoot: options.dest,
    destinationRootExists: fs.existsSync(options.dest),
    codexHome: process.env.CODEX_HOME || null,
    node: process.version,
  };
}

function printJson(data) {
  process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
}

function printInstallSummary(data) {
  for (const result of data.results) {
    const detail = result.reason ? ` (${result.reason})` : "";
    process.stdout.write(`${result.status}: ${result.skill} -> ${result.destination}${detail}\n`);
  }
  process.stdout.write("\nRestart Codex to pick up newly installed skills.\n");
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    process.stdout.write(usage());
    return;
  }

  if (options.command === "list") {
    const skills = listBundledSkills();
    if (options.json) {
      printJson({ command: "list", skills });
    } else {
      process.stdout.write(`${skills.join("\n")}\n`);
    }
    return;
  }

  if (options.command === "doctor") {
    const result = doctor(options);
    if (options.json) {
      printJson(result);
    } else {
      process.stdout.write(`package root: ${result.packageRoot}\n`);
      process.stdout.write(`bundled skills: ${result.bundledSkillCount}\n`);
      process.stdout.write(`destination: ${result.destinationRoot}\n`);
      process.stdout.write(`destination exists: ${result.destinationRootExists ? "yes" : "no"}\n`);
      process.stdout.write(`node: ${result.node}\n`);
    }
    return;
  }

  if (options.command === "add") {
    const result = installSkills(options);
    if (options.json) {
      printJson(result);
    } else {
      printInstallSummary(result);
    }
    return;
  }

  throw new Error(`Unknown command: ${options.command}\n\n${usage()}`);
}

try {
  main();
} catch (error) {
  const wantsJson = process.argv.includes("--json");
  if (wantsJson) {
    printJson({ ok: false, error: error.message });
  } else {
    process.stderr.write(`${error.message}\n`);
  }
  process.exit(1);
}
