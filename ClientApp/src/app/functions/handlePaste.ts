import { handleData } from './handleData';
export function handlePaste(e) {
  //console.log(e);
  //var $start = element;
  var source;
  //check for access to clipboard from window or event
  if (e !== undefined) {
    ////console.log("Data defined");
    ////console.log("Passing from handle paste:")
    let dataToPass = e.getData('Text');
    ////console.log(dataToPass);
    return handleData(dataToPass);
  }
  else {
    ////console.log("Data undefined");
    ////console.log(source);
  }
}
