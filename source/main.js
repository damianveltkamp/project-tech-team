import moduleInit from '@javascript/utilities/module-init';
import * as form from '@components/form/javascript/form';
import * as overview from '@components/overview/javascript/overview';
import * as support from '@components/support/javascript/support';
import * as popup from '@components/popup/javascript/popup';

moduleInit('[js-hook-module-form-validation]', '', () => form);
moduleInit('[js-hook-module-overview]', '', () => overview);
moduleInit('[js-hook-module-support]', 'requestSupport', () => support);
moduleInit('[js-hook-module-chat]', 'openChat', () => support);
moduleInit('[js-hook-module-chat-form]', 'sendChatMessage', () => support);
moduleInit('[js-hook-module-get-messages]', 'getChatMessages', () => support);
moduleInit('[js-hook-module-popup]', '', () => popup);
