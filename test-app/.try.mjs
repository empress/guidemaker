/**
 * Scenarios for @embroider/try, applied to this package.json.
 */
export default scenarios();

function scenarios() {
  return {
    scenarios: [
      {
        name: "ember-lts-5.12",
        npm: {
          devDependencies: {
            "ember-source": "~5.12.0",
          },
        },
      },
      {
        name: "ember-lts-6.12",
        npm: {
          devDependencies: {
            "ember-source": "~6.12.0",
          },
        },
      },
      {
        name: "ember-latest",
        npm: {
          devDependencies: {
            "ember-source": "npm:ember-source@latest",
          },
        },
      },
      {
        name: "ember-beta",
        npm: {
          devDependencies: {
            "ember-source": "npm:ember-source@beta",
          },
        },
      },
      {
        name: "ember-canary",
        npm: {
          devDependencies: {
            "ember-source": "npm:ember-source@alpha",
          },
        },
      },
    ],
  };
}
