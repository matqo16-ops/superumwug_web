// Site-wide code — runs on every page. File name is fixed by Wix; do not rename.
//
// Required Element IDs (set in Studio Properties panel — see README.md "Element IDs"):
//   #buttonRequestCallback   Header persistent "Rückruf anfordern" / "Request a callback" button
//
// Required Lightbox (create in Studio, name it exactly "CallbackLightbox"):
//   Its own code lives in page-code-templates/CallbackLightbox.page.js — paste into the file
//   Wix generates for it after you create it.

import wixWindow from 'wix-window';

$w.onReady(function () {
    if ($w('#buttonRequestCallback').length) {
        $w('#buttonRequestCallback').onClick(() => {
            wixWindow.openLightbox('CallbackLightbox');
        });
    }
});
