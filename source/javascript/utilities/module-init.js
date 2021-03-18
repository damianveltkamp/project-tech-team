async function moduleInit(moduleName, functionName, callBack) {
  const element = document.querySelector(moduleName);

  if (element) {
    const module = await callBack();

    if (functionName) {
      module[functionName]();
    } else {
      module.default();
    }
  }
}

export default moduleInit;
