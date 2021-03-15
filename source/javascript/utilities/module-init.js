async function moduleInit(moduleName, functionName, callBack) {
  const element = document.querySelector(moduleName);

  if (element) {
    const module = await callBack();
    functionName ? module[functionName]() : module.default();
  }
}

export default moduleInit;
