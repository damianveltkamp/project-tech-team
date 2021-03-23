import moduleInit from '@javascript/utilities/module-init';
import * as form from '@components/form/javascript/form';
import * as overview from '@components/overview/javascript/overview';
import * as support from '@components/support/javascript/support';

moduleInit('[js-hook-module-form-validation]', '', () => form);
moduleInit('[js-hook-module-overview]', '', () => overview);
moduleInit('[js-hook-module-support]', '', () => support);
