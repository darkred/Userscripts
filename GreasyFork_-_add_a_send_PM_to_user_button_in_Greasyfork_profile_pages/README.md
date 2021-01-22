By default you may send a pm via a user's forum profile page (e.g. see link 1).  
With this script you may also send a pm via user's Greasyfork profile page (e.g. see link 2).

```
Forum profile:     https://greasyfork.org/en/forum/profile/1/JasonBarnabe
Greasyfork profile: https://greasyfork.org/en/users/1-jasonbarnabe
```

example:  
![](https://i.imgur.com/0pe0Ce2.jpg)

How it works:  

- By clicking the script's PM icon, the script always gets you to a "Create a new conversation" page (`https://greasyfork.org/en/users/your_username/conversations/new?other_user=target_username`).  
- In contrast, by clicking the the site's built-in"Send message" link:
  - if you haven't sent any PM before,  
it gets you to a "Create a new conversation (`https://greasyfork.org/en/users/your_username/conversations/new?other_user=target_username`)
  - if you have send PMs before,  
it gets you to a "Conversation with user" page (`https://greasyfork.org/en/users/your_username/conversations/___`)  
where all your previous PMs are displayed in the same page,  
and you have to scroll down to reach the "Post Reply" form.

Notes: 

- the button doesn't appear in your own Greasyfork profile page, and it only works when you are logged in, for obvious reasons,  
- it is compatible with Citrus GFork.

[Hosted in GitHub](https://github.com/darkred/Userscripts)