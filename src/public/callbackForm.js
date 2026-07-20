// Shared callback-form wiring, reused by every page/lightbox that has a callback form
// (Callback lightbox, Home inline form, Kontakt page form, B2B variant with partnerType).
//
// Usage from a page/lightbox code file:
//
//   import { wireCallbackForm } from 'public/callbackForm';
//
//   $w.onReady(() => {
//       wireCallbackForm($w, {
//           ids: {
//               name: '#inputName',
//               phone: '#inputPhone',
//               preferredTime: '#dropdownTime',
//               topic: '#dropdownTopic',
//               partnerType: '#dropdownPartnerType', // optional — B2B page only
//               message: '#inputMessage',             // optional
//               consent: '#checkboxConsent',
//               submitButton: '#buttonSubmit',
//               statusText: '#textFormStatus'
//           },
//           sourcePage: 'Kontakt',
//           messages: {
//               success: 'Danke! Wir melden uns in Kürze bei Ihnen.',
//               error: 'Da ist etwas schiefgelaufen. Bitte prüfen Sie Ihre Angaben.',
//               missingConsent: 'Bitte bestätigen Sie die Datenschutz-Einwilligung.'
//           }
//       });
//   });

import { submitCallbackRequest } from 'backend/callbackRequests.web';
import wixWindow from 'wix-window';

const DEFAULT_MESSAGES = {
    success: 'Danke! Wir melden uns in Kürze bei Ihnen.',
    error: 'Da ist etwas schiefgelaufen. Bitte prüfen Sie Ihre Angaben oder rufen Sie uns direkt an.',
    missingConsent: 'Bitte bestätigen Sie die Datenschutz-Einwilligung.'
};

export function wireCallbackForm($w, options) {
    const ids = options.ids;
    const messages = { ...DEFAULT_MESSAGES, ...(options.messages || {}) };
    const sourcePage = options.sourcePage || 'unknown';

    $w(ids.submitButton).onClick(async () => {
        const consentChecked = ids.consent ? $w(ids.consent).checked : true;
        if (!consentChecked) {
            setStatus($w, ids.statusText, messages.missingConsent, true);
            return;
        }

        $w(ids.submitButton).disable();

        const payload = {
            name: $w(ids.name).value,
            phone: $w(ids.phone).value,
            preferredTime: ids.preferredTime ? $w(ids.preferredTime).value : '',
            topic: ids.topic ? $w(ids.topic).value : '',
            partnerType: ids.partnerType ? $w(ids.partnerType).value : '',
            message: ids.message ? $w(ids.message).value : '',
            consent: consentChecked,
            sourcePage,
            language: wixWindow.multilingual && wixWindow.multilingual.currentLanguage
                ? wixWindow.multilingual.currentLanguage
                : 'de'
        };

        try {
            const result = await submitCallbackRequest(payload);
            if (result.success) {
                setStatus($w, ids.statusText, messages.success, false);
                clearForm($w, ids);
            } else {
                setStatus($w, ids.statusText, messages.error, true);
            }
        } catch (err) {
            setStatus($w, ids.statusText, messages.error, true);
        } finally {
            $w(ids.submitButton).enable();
        }
    });
}

function setStatus($w, statusId, text, isError) {
    if (!statusId) return;
    const el = $w(statusId);
    el.text = text;
    el.show();
    if (typeof el.style !== 'undefined' && el.style && el.style.color) {
        el.style.color = isError ? '#B3261E' : '#2E7D32';
    }
}

function clearForm($w, ids) {
    if (ids.name) $w(ids.name).value = '';
    if (ids.phone) $w(ids.phone).value = '';
    if (ids.message) $w(ids.message).value = '';
    if (ids.consent) $w(ids.consent).checked = false;
}
