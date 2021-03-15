import fs from 'fs';

export function getComponentPaths() {
  const componentsPath = 'source/components';
  const components = fs.readdirSync(componentsPath);

  const templatePaths = components.map(
    (component) => `${componentsPath}/${component}/template/`,
  );

  return templatePaths;
}

export function getCssBundleName() {
  const cssBundle = fs.readdirSync('static/build/css/');
  return cssBundle[0];
}

export function getJsBundleName() {
  const jsBundle = fs.readdirSync('static/build/js/');
  return jsBundle[0];
}
