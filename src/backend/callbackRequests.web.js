// Backend Web Module — callable from any page via:
//   import { submitCallbackRequest } from 'backend/callbackRequests.web';
//
// Collection required: CallbackRequests (create manually in the CMS — see README.md step 3).
// Fields: name, phone, preferredTime, topic, partnerType, message, consent, sourcePage,
// language, status.

import { Permissions, webMethod } from 'wix-web-module';
import wixData from 'wix-data';

const COLLECTION = 'CallbackRequests';
const PHONE_PATTERN = /^[0-9+()\s/-]{6,20}$/;

function validate(payload) {
    const errors = {};

    if (!payload || typeof payload !== 'object') {
        return { name: 'required', phone: 'required', preferredTime: 'required', consent: 'required' };
    }

    if (!payload.name || !payload.name.trim()) {
        errors.name = 'required';
    }
    if (!payload.phone || !PHONE_PATTERN.test(payload.phone.trim())) {
        errors.phone = 'invalid';
    }
    if (!payload.preferredTime || !payload.preferredTime.trim()) {
        errors.preferredTime = 'required';
    }
    if (payload.consent !== true) {
        errors.consent = 'required';
    }

    return errors;
}

/**
 * Validates and stores a callback request. Runs server-side, so it can insert into the
 * collection with suppressAuth even if "who can add content" permissions are tightened later.
 *
 * @param {{
 *   name: string, phone: string, preferredTime: string, topic?: string,
 *   partnerType?: string, message?: string, consent: boolean,
 *   sourcePage: string, language: string
 * }} payload
 */
export const submitCallbackRequest = webMethod(Permissions.Anyone, async (payload) => {
    const errors = validate(payload);
    if (Object.keys(errors).length > 0) {
        return { success: false, errors };
    }

    const toInsert = {
        name: payload.name.trim(),
        phone: payload.phone.trim(),
        preferredTime: payload.preferredTime.trim(),
        topic: (payload.topic || 'Sonstiges').trim(),
        partnerType: payload.partnerType ? payload.partnerType.trim() : '',
        message: payload.message ? payload.message.trim() : '',
        consent: true,
        sourcePage: payload.sourcePage || '',
        language: payload.language || 'de',
        status: 'new'
    };

    try {
        const result = await wixData.insert(COLLECTION, toInsert, { suppressAuth: true });
        return { success: true, id: result._id };
    } catch (err) {
        console.error('submitCallbackRequest insert failed', err);
        return { success: false, errors: { _general: 'server' } };
    }
});
