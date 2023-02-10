function slugger(str) {
  str = str.replace(/^\s+|\s+$/g, ""); // Trim leading and trailing spaces
  str = str.toLowerCase(); // Convert to lowercase

  // Remove characters that are not alphanumeric, whitespaces, or dashes
  str = str.replace(/[^a-z0-9\s-]/g, "");

  // Replace whitespaces and consecutive dashes with a single dash
  str = str.replace(/[\s-]+/g, "-");

  return str;
}

module.exports = slugger;
