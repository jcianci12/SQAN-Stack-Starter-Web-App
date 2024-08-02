export function fieldMatchesOptions(options: any[], value, hiddenvalue, fieldname: Array<string>) {
  console.log(options)
  if (options?.length === 0) {
    return null
  }
  let checkOptionExists: boolean = false;

  fieldname.forEach(element => {
    if (checkOptionExists == false) {
      if (options) {
        checkOptionExists = options.some(({ element }) => element == value);
      }
    }
  });

  if (options) {
    if (value == "") {
      return null;
    }
    else {
      if (checkOptionExists) {
        console.log("match found");
        return hiddenvalue;
      }
      else {
        console.log("no match found setting value to blank");
        return null;
      }
    }
    console.log(hiddenvalue);
  }
  else {
    return null;
  }
}
