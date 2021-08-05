This userscript applies to https://mail.protonmail.com  
*(after the recent layout update there's no `beta` subdomain anymore (`beta.protonmail.com` ) --- enabling 'beta' features is just a toggle button now (Settings | 'Beta Access' )*.  
It automatically removes the ProtonMail signature from the 'New message' textboxes,  
which is appended by default to each mail body and cannot be modified via Settings in free accounts.

It uses the excellent library [arrive.js](https://github.com/uzairfarooq/arrive)

The script only works in Chrome, not Firefox - see [here](https://github.com/darkred/Userscripts/issues/13#issuecomment-739492052) and [here](https://github.com/darkred/Userscripts/issues/43#issuecomment-893362520).  
Tampermonkey and Violentmonkey are supported - Greasemonkey is not supported.
