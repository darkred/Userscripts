By default you may send a pm via a user's forum profile page (e.g. see link 1).  
With this script you may also send a pm via user's Greasyfork profile page (e.g. see link 2).
```
Forum profile:      https://greasyfork.org/en/forum/profile/324/darkred
Greasyfork profile: https://greasyfork.org/en/users/2160-darkred
```

example:  
![](https://i.imgur.com/LUN73U5.gif)

*Notes: the button doesn't appear in your own Greasyfork profile page, 
and it only works when you are logged in, for obvious reasons*. 
<br>

**<u>Update 11/12/2016</u>**:
The script was not working ok (because you have to simulate a keypress sequence -with a delay between each press-  
in order the username to be "typed" in the autocomplete popup, and so the script to be able to click it, to select it).  
I fixed it, but, in order to manage sending this simulated keypress sequence ( 1-line in the script! - line 47)   
I have to use the following `require`'s :  
- `jQuery`,  
- 1 from [bililiteRange](https://github.com/dwachss/bililiteRange),   
- 1 from [jquery-simulate](https://github.com/jquery/jquery-simulate) (by jQuery), and   
- 2 from [jquery-simulate-ext](https://github.com/j-ulrich/jquery-simulate-ext) .  

The fact that these `require`'s are needed in order by the `jquery-simulate-ext` plugin to work,  
is documented here: [https://github.com/j-ulrich/jquery-simulate-ext#usage](https://github.com/j-ulrich/jquery-simulate-ext#usage).

And, I also use [arrive.js](https://github.com/uzairfarooq/arrive) in the script.   

<br>

[Hosted in GitHub](https://github.com/darkred/Userscripts)
