/*
|-------------------------------------------------------------------------------
| Development config                      https://maizzle.com/docs/environments
|-------------------------------------------------------------------------------
|
| The exported object contains the default Maizzle settings for development.
| This is used when you run `maizzle build` or `maizzle serve` and it has
| the fastest build time, since most transformations are disabled.
|
*/

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fm = require("front-matter");

module.exports = {
  baseURL: {
    url: "https://static.jdwly.com/",
    tags: ["img"],
  },
  build: {
    templates: {
      source: "src/content",
      filetypes: ["md"],
      destination: {
        path: ".dev/emails",
      },
    },
  },
  markdown: {
    plugins: [
      {
        plugin: require("markdown-it-attrs"),
      },
    ],
  },
  events: {
    beforeRender(html) {
      const { attributes, body } = fm(html);
      const layout = attributes.layout || "main";

      return `
        <x-${layout}>
          <fill:template>
            <md>${body}</md>
          </fill:template>
        </x-${layout}>`;
    },
  },
};
