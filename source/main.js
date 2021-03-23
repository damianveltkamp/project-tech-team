import moduleInit from '@javascript/utilities/module-init';
import * as form from '@components/form/javascript/form';
import * as overview from '@components/overview/javascript/overview';

moduleInit('[js-hook-module-form-validation]', '', () => form);
moduleInit('[js-hook-module-overview', '', () => overview);
