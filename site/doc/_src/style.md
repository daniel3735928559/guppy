% CSS styling

The following CSS selectors will provide access to various elements of the editor:

* `.guppy_active`: The guppy div when it is active.  For example, one
  can use the `border` property of this class to cause the editor to
  have a glowing blue border when active.

* `.guppy_inactive`: The guppy div when it is inactive.  For example,
  set the `background-color` of this class to a shade of grey to grey
  out the editor when inactive.

* `.guppy_active .main_cursor`: The span for the main cursor.  CSS
  animations can be used, for example, to make the cursor blink.

* `.guppy_text_current`: The span for any plain text content currently
  under selection.  For example, to highlight a textbox with a grey
  border while selected, set a `border` style for this CSS class.

* `.guppy_buttons img`: The image elements for the configuration/help
  buttons in the editor.

* `.guppy_buttons`: The container for the configuration/help buttons
  in the editor.
  
For example, we present here the stylesheet for the example Guppy
page:

```
.guppy_active {
    border: 2px solid black;
    padding: 10px;
    box-shadow: 1px 1px 1px 0 lightgray inset;
    cursor: text;
    background-color: #ffffff;
    color:#000;
    position:relative;
}

.guppy_inactive {
    border: 2px solid black;
    padding: 10px;
    box-shadow: 1px 1px 1px 0 lightgray inset;
    cursor: text;
    background-color: #fafafa;
    color:#000;
    position:relative;
}

.guppy_text_current {
    border: 1px solid #ccc;
}

.guppy_active .main_cursor {
  animation: blink-animation 1s steps(2, start) infinite;
  -webkit-animation: blink-animation 1s steps(2, start) infinite;
}

.guppy_active .guppy_buttons {
    display: block;
}

.guppy_inactive .guppy_buttons {
    display: none;
}

.guppy_buttons {
    position:absolute;
    bottom:0;
    right:0;
    padding:0 3px 3px 0;
}

.guppy_buttons img{
    cursor:pointer;
    height:16px;
    width:16px;
    padding:3px;
    opacity: 0.5;
}

.guppy_buttons img:hover{
    opacity: 1;
}

@keyframes blink-animation {
  to { visibility: hidden; }
}

@-webkit-keyframes blink-animation {
  to { visibility: hidden; }
}
```

