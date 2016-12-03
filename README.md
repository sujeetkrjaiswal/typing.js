# AutoTyping #
This module will help to create AutoTyping effect from the pre-provide text.
The auto-typing module accepts two listner : timer(default) & keystroke based.

## QuickStart ##
**html file**
```html
<html>
<head> ... </head>
<body>
<div id="myAutoTypingPlayArea"></div>
<pre id="myTextInPreBlock">
Hello World!
This will ensure easy writing of text and
will help retain new line characters
</pre>
<script src="./path/to/AutoTyping.js"></script>
</body>
</html>
````
**javascript snippet**
```javascript
var elm = document.getElementById("myAutoTypingPlayArea");
var text = document.getElementById("myTextInPreBlock").innerText();
var strokeSpeed = 5; //5 * 100 ms for timer (default)
var autotype = new AutoTyping.App(elm,text,AutoTyping.ListnerType.default,5)
```

## Explanation of parameters ##
### Listener Type: ###
Options 	|	Config to pass
------------|-----------------------------------
timer 		|	AutoTyping.ListnerType.timer
keyStroke 	|	AutoTyping.ListnerType.keyStroke
default 	|	AutoTyping.ListnerType.default

### Constructor Parameters ###
**Constructor Function** : AutoTyping.App
Parameters 	|	Explanations
------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
element 	|	The element over inside which, the auto typing will insert text nodes
text 		|	the complete text that will be inserted
type 		|	is it timer based or key press event based (Use the options from above ListnerType Options)
strokeSpeed	|	for timer = it is time ( in t X 100 ms) when pseduo key stroke is pressed, and for key Stroke: no. of characters it would process for every physical key press
callback 	| 	Optional callback function when the text auto tying is finished