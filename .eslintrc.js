module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "standard-with-typescript",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier", "prettier/react",
        "universe", "plugin:react-hooks/recommended",
        'eslint:recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
		'plugin:@typescript-eslint/recommended',
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        // allow .js files to contain JSX code
        "react/jsx-filename-extension": [1, { "extensions": [".ts", ".tsx", ".js", ".jsx"] }],
        // prevent eslint to complain about the "styles" variable being used before it was defined
        "no-use-before-define": ["error", { "variables": false }],
        // ignore errors for the react-navigation package
        "react/prop-types": ["error", { "ignore": ["navigation", "navigation.navigate"] }],
        // ignore errors for import directives
        "import/extensions": [
          "error",
          "ignorePackages",
          {
            "js": "never",
            "jsx": "never",
            "ts": "never",
            "tsx": "never"
          }
        ]
      }
}
