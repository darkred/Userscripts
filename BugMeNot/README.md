It's a modified/fixed version of [BugMeNot](http://userscripts-mirror.org/scripts/show/23074) by hosts  
(which in terms was based on code found at http://www.oreillynet.com/pub/h/4171 )
because it didn't work anymore.  

This applies in HTTP and HTTPS sites.  

Many sites (e.g. online newspapers) require you to register with the site before being able to read content. This registration is annoying, invasive, and a serious privacy risk. (Several newspaper publishing companies have been caught selling their registration information to spammers.) A site called BugMeNot.com (http://www.bugmenot.com) has sprung up to aggregate fake logins for such sites. This script takes BugMeNot one step further by integrating it into the login page itself.
It retrieves all possible logins from bugmenot.com, shows their count, and you can try each one on every clicking of 'Get login from BugMeNot'.


<br>  
<u>How to use</u>:  
After installing this script, go to any page that requires Sign in.  
Click on either the `Username` or the `Password textbox` This is what will appear:  
![image](https://i.imgur.com/bMyO0Un.jpg)  
(the `1/-` means the 1st login out of yet unknown available logins)

By clicking `Get login from BugMeNot` the script will contact bugmenot.com and,  
if it finds a login, it will autofill the login form, as shown below:  
![image](https://i.imgur.com/E7ccv8O.jpg)  

Try to sign in. If the login is invalid, you may navigate again to the sign-in page 
and you can try each one of the rest logins with clicking of 'Get login from BugMeNot', i.e.
![image][https://i.imgur.com/8C12J6L.jpg]
Notice the `2/3`? It means the 2nd login out of 3 available logins.

If there were no logins found you'll get this alert box:  
![image](https://i.imgur.com/ayDyxaR.jpg)  
meaning that you can either:  
- press `More Options` to open(in a new tab) the relevant bugmenot page and try(copy/paste another login), or  
- just press `Visit BugMeNot` which will open(in a new tab) http://bugmenot.com .  

Note: you may reset the attempt(=login) count by opening/refreshing any irrelevant page to the current one,
i.e. just navigate to an irrelevant page, then switch to the login page.

<br>

Thanks to hosts for making a very useful script!