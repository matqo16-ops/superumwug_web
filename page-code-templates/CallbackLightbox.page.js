// Element IDs required inside the CallbackLightbox lightbox:
//   #inputName #inputPhone #dropdownTime #dropdownTopic #checkboxConsent
//   #buttonSubmit #textFormStatus #buttonClose (optional close button)

import { wireCallbackForm } from 'public/callbackForm';
import wixWindow from 'wix-window';

$w.onReady(function () {
    wireCallbackForm($w, {
        ids: {
            name: '#inputName',
            phone: '#inputPhone',
            preferredTime: '#dropdownTime',
            topic: '#dropdownTopic',
            consent: '#checkboxConsent',
            submitButton: '#buttonSubmit',
            statusText: '#textFormStatus'
        },
        sourcePage: 'CallbackLightbox'
    });

    if ($w('#buttonClose').length) {
        $w('#buttonClose').onClick(() => wixWindow.lightbox.close());
    }
});
