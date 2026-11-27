import { existsSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { extname, join, resolve } from "node:path";

import compareVersions from "compare-versions";
import h2p from "html2plaintext";
import yaml from "js-yaml";
import jsonapi from "jsonapi-serializer";
import truncate from "lodash.truncate";
import { JSDOM } from "jsdom";
import showdown from "showdown";
import walkSync from "walk-sync";
import yamlFront from "yaml-front-matter";

const require = createRequire(import.meta.url);
const { Serializer } = jsonapi;

/**
 * @typedef {object} GuidemakerOptions
 * @property {string} [root] the app's folder, by default the folder of the Vite config
 * @property {string} [source] a package or folder with a `guides` folder, by default the app
 * @property {object} [showdown] the showdown options, by default `showdown` of the app's config/environment.js
 * @property {string | ((version: string) => boolean)} [premberVersionFilter] the versions whose pages {@link urls} lists
 */

const VersionsSerializer = new Serializer("version", {
  attributes: ["allVersions", "currentVersion", "ltsVersions"],
});

const PagesSerializer = new Serializer("page", {
  id: "url",
  attributes: ["title", "pages", "skip_toc", "is_heading"],
  keyForAttribute: "cammelcase",
});

const CONTENT_TYPES = ["content", "description", "toc"];

const ContentSerializer = new Serializer("contents", {
  attributes: CONTENT_TYPES.concat(["canonical", "redirect"]),
  keyForAttribute: "camelCase",
});

const TOC_FILES = /(^|\/)(pages|toc)\.(ya?ml|json)$/;

/**
 * Showdown's own code block parser, with `.*` after the language, so that a fence such as
 * ```` ```html some-stuff ```` still parses.
 */
showdown.subParser("githubCodeBlocks", function (text, options, globals) {
  if (!options.ghCodeBlocks) {
    return text;
  }

  text = globals.converter._dispatch(
    "githubCodeBlocks.before",
    text,
    options,
    globals,
  );
  text += "¨0";
  text = text.replace(
    /(?:^|\n)(?: {0,3})(```+|~~~+)(?: *)([^\s`~]*).*\n([\s\S]*?)\n(?: {0,3})\1/g,
    function (wholeMatch, delim, language, codeblock) {
      let end = options.omitExtraWLInCodeBlocks ? "" : "\n";

      codeblock = showdown.subParser("encodeCode")(codeblock, options, globals);
      codeblock = showdown.subParser("detab")(codeblock, options, globals);
      codeblock = codeblock.replace(/^\n+/g, "");
      codeblock = codeblock.replace(/\n+$/g, "");
      codeblock =
        "<pre><code" +
        (language
          ? ' class="' + language + " language-" + language + '"'
          : "") +
        ">" +
        codeblock +
        end +
        "</code></pre>";
      codeblock = showdown.subParser("hashBlock")(codeblock, options, globals);

      return (
        "\n\n¨G" +
        (globals.ghCodeBlocks.push({ text: wholeMatch, codeblock }) - 1) +
        "G\n\n"
      );
    },
  );
  text = text.replace(/¨0/, "");

  return globals.converter._dispatch(
    "githubCodeBlocks.after",
    text,
    options,
    globals,
  );
});

/**
 * @param {string} folder
 * @returns {string[]} the files of the folder, in the order of walk-sync
 */
function filesIn(folder) {
  if (!existsSync(folder)) return [];

  return walkSync(folder, { directories: false });
}

/**
 * @param {GuidemakerOptions} options
 * @returns {string} the folder with the `guides` folder
 */
export function guidesRoot(options = {}) {
  let root = options.root ?? process.cwd();

  if (options.source) {
    try {
      return require
        .resolve(`${options.source}/package.json`, { paths: [root] })
        .replace(/\/package\.json$/, "");
    } catch {
      let path = join(root, "node_modules", options.source);

      if (existsSync(path)) return path;
    }
  } else if (existsSync(join(root, "guides"))) {
    return root;
  }

  throw new Error(
    "guidemaker: set `source` in the options of the Vite plugin, or add a `guides` folder to the app.",
  );
}

/**
 * @param {string} source the folder with the `guides` folder
 * @returns {{ allVersions: string[], currentVersion: string, ltsVersions?: string[] } | undefined}
 */
export function versionsOf(source) {
  for (let file of [
    join(source, "guides", "versions.yml"),
    join(source, "versions.yml"),
  ]) {
    if (existsSync(file)) return yaml.load(readFileSync(file, "utf8"));
  }
}

/**
 * @param {GuidemakerOptions} options
 * @returns {object} the showdown options
 */
function showdownOptions(options) {
  if (options.showdown) return options.showdown;

  let file = join(options.root ?? process.cwd(), "config", "environment.js");

  if (!existsSync(file)) return {};

  try {
    let config = require(file);

    return (typeof config === "function" ? config() : config)?.showdown ?? {};
  } catch {
    return {};
  }
}

/**
 * @param {string} html
 * @returns {{ text: string, depth: string, id: string | null }[]}
 */
function headings(html) {
  /**
   * A fragment shares one document, where a new JSDOM window for each of thousands of pages runs out of memory.
   */
  return Array.from(
    JSDOM.fragment(html).querySelectorAll("h1, h2, h3, h4, h5"),
    (heading) => ({
      text: heading.textContent,
      depth: heading.nodeName.replace(/\D/g, ""),
      id: heading.getAttribute("id"),
    }),
  );
}

/**
 * @param {string} markdownFile
 * @param {string} relativePath such as `getting-started/index.md`
 * @param {showdown.Converter} converter
 * @returns {string} the JSON:API document of the page
 */
export function pageJson(markdownFile, relativePath, converter) {
  let front = yamlFront.loadFront(readFileSync(markdownFile, "utf8"));
  let markdown = front.__content.trim();
  let html = converter.makeHtml(markdown);
  let page = {
    path: relativePath,
    id: relativePath.replace(/\.(md|markdown)$/, ""),
    content: markdown,
    html,
    toc: headings(html),
    ...front,
  };

  if (!page.description) {
    page.description = truncate(h2p(page.html), {
      length: 260,
      separator: /,?\.* +/,
    });
  }

  return JSON.stringify(ContentSerializer.serialize(page));
}

/**
 * @param {string} tocFile such as `pages.yml`
 * @returns {string} the JSON:API document of the table of contents
 */
export function pagesJson(tocFile) {
  let text = readFileSync(tocFile, "utf8");
  let pages = tocFile.endsWith(".json") ? JSON.parse(text) : yaml.load(text);

  /**
   * Each page's url includes the urls of its parents.
   */
  function subpageUrls(parentUrl, currentPage, childPages) {
    if (currentPage && parentUrl)
      currentPage.url = `${parentUrl}/${currentPage.url}`;

    for (let page of childPages ?? []) {
      subpageUrls(currentPage ? currentPage.url : null, page, page.pages);
    }
  }

  subpageUrls(null, null, pages);

  return JSON.stringify(PagesSerializer.serialize(pages));
}

/**
 * @param {string} source the folder with the `guides` folder
 * @returns {{ folder: string, contentFolder: string }[]} each guides folder, and the folder of its JSON output
 */
function contentFolders(source) {
  let versions = versionsOf(source);
  let guides = join(source, "guides");

  if (!versions) return [{ folder: guides, contentFolder: "content/release" }];

  let folders = versions.allVersions.map((listed) => {
    let version = listed === versions.currentVersion ? "release" : listed;

    return {
      folder: join(guides, version),
      contentFolder: `content/${version}`,
    };
  });

  folders.push({
    folder: join(guides, "release"),
    contentFolder: `content/${versions.currentVersion}`,
  });

  return folders;
}

/**
 * Every file that the content folder of the app has, by its path in the build.
 *
 * @param {GuidemakerOptions} options
 * @returns {Map<string, () => string>} the files, by path such as `content/release/index.json`
 */
export function contentFiles(options = {}) {
  let source = guidesRoot(options);
  let converter = new showdown.Converter(showdownOptions(options));
  let versions = versionsOf(source);
  /** @type {Map<string, () => string>} */
  let files = new Map();

  for (let { folder, contentFolder } of contentFolders(source)) {
    for (let path of filesIn(folder)) {
      let file = join(folder, path);

      if (/\.(md|markdown)$/.test(path)) {
        files.set(
          `${contentFolder}/${path.replace(/\.(md|markdown)$/, "")}.json`,
          () => pageJson(file, path, converter),
        );
      } else if (TOC_FILES.test(path)) {
        files.set(
          `${contentFolder}/${path.replace(/\.(ya?ml|json)$/, "")}.json`,
          () => pagesJson(file),
        );
      }
    }
  }

  if (versions) {
    files.set("content/versions.json", () =>
      JSON.stringify(
        VersionsSerializer.serialize({ ...versions, id: "versions" }),
      ),
    );
  }

  return files;
}

/**
 * @param {string} folder
 * @returns {string[]} the page urls of the markdown files, such as `getting-started`
 */
function pagePaths(folder) {
  return filesIn(folder)
    .filter((path) => extname(path) === ".md")
    .map((path) => path.replace(/\.md/, "").replace(/\/index$/, ""));
}

/**
 * The urls of the pages, for a static site generator such as the SSG plugin of vite-ember-ssr.
 *
 * @param {GuidemakerOptions} options
 * @returns {string[]}
 */
export function urls(options = {}) {
  let source = guidesRoot(options);
  let guides = join(source, "guides");
  let versions = versionsOf(source);

  if (!versions) {
    return pagePaths(guides)
      .map((path) => `/release/${path}`)
      .concat(["/release"]);
  }

  let filter = options.premberVersionFilter;
  let built = versions.allVersions;

  if (typeof filter === "function") {
    built = built.filter(filter);
  } else if (typeof filter === "string") {
    built = built.filter((version) =>
      compareVersions.compare(version, filter, ">="),
    );
  } else if (filter !== undefined) {
    throw new Error(
      "guidemaker: 'premberVersionFilter' must be a function, or the version string to build from.",
    );
  }

  built = built.concat(["release"]);

  let result = built.map((version) => `/${version}`);

  for (let version of built) {
    let folder = version === versions.currentVersion ? "release" : version;

    for (let path of pagePaths(join(guides, folder)))
      result.push(`/${version}/${path}`);
  }

  for (let path of pagePaths(join(guides, "release"))) {
    result.push(`/${versions.currentVersion}/${path}`);
  }

  return result;
}

/**
 * @param {string} redirect the `redirect` of a page's front matter
 * @param {string} version
 * @returns {string} the url of the redirect
 */
function redirectUrl(redirect, version) {
  if (/^https?:\/\//.test(redirect)) return redirect;
  if (redirect.endsWith("/index"))
    return `/${version}/${redirect.replace(/\/index$/, "")}`;

  return `/${version}/${redirect}`;
}

/**
 * The lines of a Netlify `_redirects` file for the pages with a `redirect` in their front matter.
 *
 * @param {GuidemakerOptions} options
 * @returns {string[]}
 */
export function netlifyRedirects(options = {}) {
  let source = guidesRoot(options);
  let guides = join(source, "guides");
  let versions = versionsOf(source);
  let redirects = ["/          /release/", "/current/* /release/:splat"];

  for (let path of filesIn(guides).filter((path) => extname(path) === ".md")) {
    let front = yamlFront.loadFront(readFileSync(join(guides, path), "utf8"));

    if (!front.redirect) continue;

    let page = path.replace(/\/index.md$/, "").replace(/\.md$/, "");

    if (!versions) {
      redirects.push(
        `/release/${page} ${redirectUrl(front.redirect, "release")}`,
      );
      continue;
    }

    let version = page.match(/^([^/]*)/)[1];
    let redirect = redirectUrl(front.redirect, version);

    redirects.push(`/${page} ${redirect}`);

    if (version === "release") {
      redirects.push(
        `/${page.replace(/^release\//, `${versions.currentVersion}/`)} ${redirect}`,
      );
    }
  }

  return redirects;
}

/**
 * @param {string} folder
 * @returns {string[]} the files of the folder
 */
function publicFiles(folder) {
  return filesIn(folder);
}

/**
 * Serves the content JSON of the guides in dev, and emits it into the build.
 * The guides source package's `public` folder comes along, when the guides are in another package.
 *
 * @param {GuidemakerOptions} options
 * @returns {import('vite').Plugin}
 */
export function guidemaker(options = {}) {
  /** @type {GuidemakerOptions} */
  let resolved = options;
  /** @type {Map<string, () => string> | undefined} */
  let files;

  function content() {
    files ??= contentFiles(resolved);
    return files;
  }

  function sourcePublic() {
    let source = guidesRoot(resolved);

    return source === resolve(resolved.root ?? process.cwd())
      ? undefined
      : join(source, "public");
  }

  return {
    name: "guidemaker",

    configResolved(config) {
      resolved = { root: config.root, ...options };
    },

    configureServer(server) {
      server.watcher.on("all", (_event, path) => {
        if (path.startsWith(join(guidesRoot(resolved), "guides")))
          files = undefined;
      });

      server.middlewares.use((request, response, next) => {
        let path = decodeURIComponent(
          new URL(request.url, "http://localhost").pathname,
        ).slice(1);
        let file = content().get(path);

        if (file) {
          response.setHeader("content-type", "application/json");
          response.end(file());
          return;
        }

        let folder = sourcePublic();
        let asset = folder && join(folder, path);

        if (asset && existsSync(asset) && statSync(asset).isFile()) {
          response.end(readFileSync(asset));
          return;
        }

        next();
      });
    },

    generateBundle() {
      for (let [fileName, source] of content()) {
        this.emitFile({ type: "asset", fileName, source: source() });
      }

      let folder = sourcePublic();

      for (let path of folder ? publicFiles(folder) : []) {
        this.emitFile({
          type: "asset",
          fileName: path,
          source: readFileSync(join(folder, path)),
        });
      }
    },
  };
}
