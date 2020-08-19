module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "amd": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
		'plugin:prettier/recommended',
    ],
    "parserOptions": {
        "ecmaVersion": 8,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "plugins": [
        "react",
        "prettier",
    ],
    "settings": {
        "react": {
            "version": 'detect',
        }
    },
    "rules": {
        "jsx-quotes": [1,"prefer-double"],
        "quotes": ["error", "single", { "avoidEscape": true }],
        "eqeqeq": "error",
        "indent": ["error", 2],
        "prettier/prettier": "warn",
        "no-console": "error",
    }
};
