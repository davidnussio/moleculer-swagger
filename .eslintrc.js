module.exports = {
  extends: ["airbnb/base", "prettier"],
  plugins: ["prettier"],
  env: {
    jest: true,
  },
  rules: {
    "no-param-reassign": "warn",
    // "import/no-extraneous-dependencies": [
    //   "error",
    //   { packageDir: "./example/" },
    // ],
  },
};
