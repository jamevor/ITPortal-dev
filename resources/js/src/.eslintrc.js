module.exports = {
  "env": {
      "browser": true,
      "es6": true,
      "node": false,
      "jquery": true,
      "amd": false
  },
  "extends": "eslint:recommended",
  "parserOptions": {
      "ecmaVersion": 2017,
      "sourceType": "script"
  },
  "rules": {
      "indent": [
          "error",
          "tab"
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
