export function valueInTextBoxButNoValueInHiddenField(value, hiddenfield) {
  console.log("value: ",value,"hidden ", hiddenfield);

  if ((value != null ||value)  && hiddenfield == "") {
    console.log("false");
    return false;
  }
  else {
    console.log("true");
    return true;
  }
}
