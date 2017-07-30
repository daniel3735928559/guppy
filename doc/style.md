## CSS styling

The following CSS selectors will provide access to various elements of the editor:

* `.guppy_active`: The guppy div when it is active.  For example, one
  can use the `border` property of this class to cause the editor to
  have a glowing blue border when active.

* `.guppy_inactive`: The guppy div when it is inactive.  For example,
  set the `background-color` of this class to a share of grey to
  grey out the editor when inactive.

* `.guppy_active .main_cursor`: The span for the main cursor.  CSS
  animations can be used, for example, to make the cursor blink.

* `.guppy_text_current`: The span for any plain text content currently
  under selection.  For example, to highlight a textbox with a grey
  border while selected, set a `border` style for this CSS class.

### Example

Here, we present the stylesheet for the example Guppy page, with
commentary on what each of the styles does

```
/* Make the guppy background white when active */
.guppy_active {
    background-color: #ffffff;
}

/* Make the guppy background grey when inactive */
.guppy_inactive {
    background-color: #fafafa;
}

/* Give active textboxes a grey border */
.guppy_text_current {
    border: 1px solid #ccc;
}

/* Make the cursor blink */
.guppy_active .main_cursor {
  animation: blink-animation 1s steps(2, start) infinite;
  -webkit-animation: blink-animation 1s steps(2, start) infinite;
}

@keyframes blink-animation {
  to { visibility: hidden; }
}

@-webkit-keyframes blink-animation {
  to { visibility: hidden; }
}

```

