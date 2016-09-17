This userscript is an improved version of [BugMeNot](http://userscripts-mirror.org/scripts/show/23074) dated from 2009, by 'hosts'   
_(which in turn was based on code found at http://www.oreillynet.com/pub/h/4171)_. 

This applies in both HTTP and HTTPS sites.  

Many sites (e.g. online newspapers) require you to register with the site before being able to read content. This registration is annoying, invasive, and a serious privacy risk. (Several newspaper publishing companies have been caught selling their registration information to spammers.) A site called BugMeNot.com (http://www.bugmenot.com) has sprung up to aggregate fake logins for such sites. This script takes BugMeNot one step further by integrating it into the login page itself.
It retrieves all possible logins from bugmenot.com, shows their count, and you can try each one on every clicking of 'Get login from BugMeNot'.

Extra features/changes to the initial version:
- During the 1st attempt all found logins are temporarily stored for using them in the next login attempts.
- Only 1 connection is done to bugmenot.com.
- The script now works even when the `Username` \<input> element has `type="email"` (i.e. not only `type="text"`)
- Added the `// @noframes` imperative.
- Sometimes, when you open a login page, the `Username` field would have focus by default.  
This would cause the following issue:  
clicking inside the field, would only Firefox's autocomplete entries - not the script's entries.  
To workaround this, the script causes an unfocus on the `Username` field on page load,  
to make sure that the options will appear when you click(focus) inside the field.  

Tested in Greasemonkey.

<br> 

**How to use:**  

After installing this script, go to any page that requires sign in.    
Click on either the `Username` or the `Password` textbox. This is what will appear:     
![image](https://i.imgur.com/bMyO0Un.jpg)   
(the `1/-` means the 1st login out of yet unknown available logins)  
Note: in login pages where where the sign in form appears as a hovering/expanding element,  
just open the login link in a new tab: now the script will work.

By clicking `Get login from BugMeNot` the script will contact bugmenot.com, and,  
if it finds login(s), it will temporarily store all found logins for the current browser session via GM_setValue,  
and then it will autofill the login form with the 1st found login, as shown below:  
![image](https://i.imgur.com/E7ccv8O.jpg)  
*Note: you may view all found logins in Web Console.*

Try to sign in with that 1st found login.  
If the login is invalid, you may navigate again to the sign-in page   
and try each one of the rest logins by clicking again on either the `Username` or the `Password` textbox  
and then to `Try next login from BugMeNot`, i.e.  
![image](https://i.imgur.com/pqZ0Rz7.jpg)  
Notice the `2/3`? It means the 2nd login out of 3 available logins.  
*Note that only 1 connection is done to bugmenot.com - all login attempts are done using the stored logins from the 1st attempt* *(you may view all stored logins in Web Console).*  
Also, now you may use the entry `Reset login attempt counter` if needed.

Also, during this, if the Username or Password textbox are already filed with the previous login,  
you'll get a prompt to `Overwrite the current login entry`: (just press OK to continue).  
![image](https://i.imgur.com/ismAlzx.jpg)


If there were no logins found you'll get this alert box:  
![image](https://i.imgur.com/ayDyxaR.jpg)  
meaning that you can either (see the 1st screenshot for reference): 
- press `More Options` to open(in a new tab) the relevant bugmenot page, or  
- just press `Visit BugMeNot` which will open(in a new tab) http://bugmenot.com .  

Note: you may reset the attempt(=login) count:
- either by clicking on the `Reset login attempt counter`, 
- or by opening/refreshing any irrelevant page to the current one,
i.e. just navigate to an irrelevant page, then switch to the login page.

<br>

Thanks to 'hosts' for his version of a very useful script!