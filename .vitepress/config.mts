import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Jairus' Docs",
  description: "Centralized manuals and tutorials for all my projects",
  lang: "en-US",
  appearance: "dark",
  base: "/",
  cleanUrls: true,
  head: [["link", { rel: "icon", type: "image/png", href: "/logo.png" }]],
  themeConfig: {
    logo: "/logo.png",
    nav: [
      { text: "Home", link: "/" },
      { text: "Blog", link: "https://blog.jairus.dev" },
      {
        text: "Projects",
        items: [
          { text: "json-as", link: "/json-as/" },
          { text: "as-test", link: "/as-test/" },
          { text: "try-as", link: "/try-as/" },
          { text: "as-labs", link: "/as-labs/" },
          { text: "wipc", link: "/wipc/" },
        ],
      },
      {
        text: "GitHub",
        items: [
          { text: "json-as", link: "https://github.com/JairusSW/json-as" },
          { text: "as-test", link: "https://github.com/JairusSW/as-test" },
          { text: "as-labs", link: "https://github.com/JairusSW/as-labs" },
          { text: "try-as", link: "https://github.com/JairusSW/try-as" },
          { text: "wipc", link: "https://github.com/JairusSW/wipc" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/JairusSW" },
      {
        icon: {
          svg: '<svg fill="#ffffff" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>npm</title><path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z"/></svg>',
        },
        link: "https://www.npmjs.com/~jairussw/",
      },
      {
        icon: {
          svg: '<svg fill="#ffffff" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>LinkedIn</title><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
        },
        link: "https://www.linkedin.com/in/jairussw/",
      },
      {
        icon: {
          svg: '<svg fill="#ffffff" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Email</title><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c2.43 0 4.69-.722 6.586-1.962l-.989-1.526A9.93 9.93 0 0 1 12 22.071C6.45 22.071 1.929 17.55 1.929 12S6.45 1.929 12 1.929 22.071 6.45 22.071 12v1.286a1.929 1.929 0 0 1-3.857 0V12a6.214 6.214 0 1 0-1.985 4.553 3.857 3.857 0 0 0 6.985-2.267V12c0-6.627-5.373-12-12-12zm0 16.286A4.286 4.286 0 1 1 12 7.714a4.286 4.286 0 0 1 0 8.572z"/></svg>',
        },
        link: "mailto:me@jairus.dev",
      },
    ],
    sidebar: {
      "/as-labs/": [
        {
          text: "as-labs",
          items: [
            { text: "Overview", link: "/as-labs/" },
            { text: "Getting Started", link: "/as-labs/guide/getting-started" },
            { text: "Branch Hinting", link: "/as-labs/guide/branch-hinting" },
          ],
        },
      ],
      "/json-as/": [
        {
          text: "Introduction",
          items: [
            { text: "Overview", link: "/json-as/" },
            { text: "Getting Started", link: "/json-as/guide/getting-started" },
          ],
        },
        {
          text: "Guide",
          collapsed: false,
          items: [
            { text: "Basic Usage", link: "/json-as/guide/basic-usage" },
            { text: "Built-in Types", link: "/json-as/guide/built-in-types" },
            {
              text: "Custom Serialization",
              link: "/json-as/guide/custom-serialization",
            },
            {
              text: "Built-in Subclasses",
              link: "/json-as/guide/built-in-subclasses",
            },
            { text: "Lazy Fields", link: "/json-as/guide/lazy-fields" },
            { text: "Performance", link: "/json-as/guide/performance" },
          ],
        },
        {
          text: "Reference",
          collapsed: false,
          items: [
            { text: "Decorators", link: "/json-as/reference/decorators" },
            { text: "Dynamic Types", link: "/json-as/reference/dynamic-types" },
            { text: "Configuration", link: "/json-as/reference/customization" },
            {
              text: "Runtime Behavior",
              link: "/json-as/reference/runtime-behavior",
            },
          ],
        },
        {
          text: "Deep Dive",
          collapsed: false,
          items: [
            {
              text: "Generated Code & the Fast Path",
              link: "/json-as/deep-dive/codegen",
            },
            { text: "The Lazy Slot", link: "/json-as/deep-dive/lazy-slot" },
            {
              text: "The Serialization Buffer",
              link: "/json-as/deep-dive/buffer",
            },
          ],
        },
      ],
      "/as-test/": [
        {
          text: "Introduction",
          items: [
            { text: "Overview", link: "/as-test/" },
            { text: "Getting Started", link: "/as-test/getting-started" },
            { text: "Writing Tests", link: "/as-test/writing-tests" },
          ],
        },
        {
          text: "Assertions",
          collapsed: false,
          items: [
            { text: "Overview", link: "/as-test/assertions/" },
            { text: "Equality", link: "/as-test/assertions/equality" },
            { text: "Numbers", link: "/as-test/assertions/numbers" },
            {
              text: "Types & Truthiness",
              link: "/as-test/assertions/types-and-truthiness",
            },
            {
              text: "Strings & Collections",
              link: "/as-test/assertions/strings-and-collections",
            },
            {
              text: "Snapshots & Throws",
              link: "/as-test/assertions/snapshots-and-throws",
            },
          ],
        },
        {
          text: "Snapshots & Mocking",
          collapsed: false,
          items: [
            { text: "Snapshots", link: "/as-test/snapshots" },
            { text: "Mocking Overview", link: "/as-test/mocking/" },
            { text: "Function Mocks", link: "/as-test/mocking/function-mocks" },
            { text: "Import Mocks", link: "/as-test/mocking/import-mocks" },
            { text: "Stable Values", link: "/as-test/mocking/stable-values" },
          ],
        },
        {
          text: "Fuzzing",
          collapsed: false,
          items: [
            { text: "Overview", link: "/as-test/fuzzing/" },
            {
              text: "Running Fuzzers",
              link: "/as-test/fuzzing/running-fuzzers",
            },
            {
              text: "Seed Generators",
              link: "/as-test/fuzzing/seed-generators",
            },
            {
              text: "Failure Reproduction",
              link: "/as-test/fuzzing/failure-reproduction",
            },
          ],
        },
        {
          text: "Runtimes & Modes",
          collapsed: false,
          items: [
            { text: "Targets & Runtimes", link: "/as-test/runtimes/" },
            { text: "Bindings: raw & esm", link: "/as-test/runtimes/bindings" },
            {
              text: "Multiple Runtimes",
              link: "/as-test/runtimes/multiple-runtimes",
            },
          ],
        },
        {
          text: "Reference",
          collapsed: false,
          items: [
            { text: "CLI", link: "/as-test/cli" },
            { text: "Configuration", link: "/as-test/configuration" },
            { text: "Caching", link: "/as-test/caching" },
            { text: "Coverage", link: "/as-test/coverage" },
            { text: "Reporters", link: "/as-test/reporters" },
            { text: "Doctor", link: "/as-test/doctor" },
          ],
        },
        {
          text: "Recipes",
          collapsed: false,
          items: [
            { text: "Overview", link: "/as-test/examples/" },
            { text: "Minimal Spec", link: "/as-test/examples/minimal-spec" },
            {
              text: "Snapshots & Mocks",
              link: "/as-test/examples/snapshots-and-mocks",
            },
            {
              text: "Fuzzing Patterns",
              link: "/as-test/examples/fuzzing-patterns",
            },
            {
              text: "Multi-Mode Config",
              link: "/as-test/examples/multi-mode-config",
            },
          ],
        },
      ],
      "/try-as/": [
        {
          text: "try-as",
          items: [
            { text: "Overview", link: "/try-as/" },
            { text: "Getting Started", link: "/try-as/guide/getting-started" },
            { text: "How It Works", link: "/try-as/guide/how-it-works" },
            { text: "Examples", link: "/try-as/guide/examples" },
            { text: "Exception API", link: "/try-as/reference/exception-api" },
            { text: "Limitations", link: "/try-as/reference/limitations" },
            { text: "Debugging", link: "/try-as/reference/debugging" },
          ],
        },
      ],
      "/wipc/": [
        {
          text: "wipc",
          items: [
            { text: "Overview", link: "/wipc/" },
            { text: "Getting Started", link: "/wipc/guide/getting-started" },
            { text: "Wire Format", link: "/wipc/guide/wire-format" },
            { text: "Host and Guest APIs", link: "/wipc/reference/api" },
            { text: "Architecture", link: "/wipc/reference/architecture" },
            { text: "Performance", link: "/wipc/reference/performance" },
          ],
        },
      ],
    },
  },
});
