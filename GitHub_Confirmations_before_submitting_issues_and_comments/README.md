GitHub by default allows in the issues area for a public repo:  

- submitting a new issue with just 1 character as title and no body, and  
- posting a comment with just 1 character.

<br>
This script creates a confirmation popup whenever attempting to submit an issue or post a comment via Ctrl+Enter in GitHub  
i.e. it applies in these 3 cases:

- when attempting to submit a new issue (while having focus in issue title textbox) via <kbd>Ctrl+Enter</kbd> or <kbd>Enter</kbd>
- when attempting to submit a new issue (while having focus in issue body textarea) via <kbd>Ctrl+Enter</kbd>
- when attempting to submit a new comment (while having focus in the new comment textarea) via <kbd>Ctrl+Enter</kbd>

<br>

Thanks to trespassersW for his help [here](https://greasyfork.org/en/discussions/development/55889-script-for-creating-a-confirmation-popup-when-submitting-closing-an-issue-via-ctrl-enter-in-github#comment-145065).
