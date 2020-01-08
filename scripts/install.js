#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filename = path.resolve(__dirname, '../../../sjcclogin.json');
const options = {
  flag: "wx"
};

fs.writeFile(filename, "{}", options, (err) => {
  if (err) console.log(err);
});
