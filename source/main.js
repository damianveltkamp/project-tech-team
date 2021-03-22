import moduleInit from '@javascript/utilities/module-init';
import * as header from '@components/header/javascript/header';
import * as form from '@components/form/javascript/form';

moduleInit('[js-hook-module-header]', 'header', () => header);
moduleInit('[js-hook-module-form-validation]', '', () => form);
