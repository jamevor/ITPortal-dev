module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "jquery": true,
        "amd": true
    },
    "extends": "eslint:recommended",
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            "tab",
            { "SwitchCase": 1 }
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "key-spacing": [
          "error",
          {
            "beforeColon": false,
            "afterColon": true,
            "mode": "strict"
          }
        ],
        "no-trailing-spaces": "error",
        "no-nested-ternary": "error",
        "no-whitespace-before-property": "error",
        "no-unused-vars": [
          "error",
          {
            "args": "after-used",
            "argsIgnorePattern": "(^req)|(^res)|(^next)"
          }
        ],
        "space-in-parens": [
          "error",
          "never"
        ],
        "space-before-function-paren": [
          "error",
          "never"
        ],
        "space-before-blocks": "error",
        "no-console": [
          "error",
          {
            "allow": [
              "warn",
              "error"
            ]
          }
        ]
    }
};
