## Synopsis

Guppy is a Javascript-based WYSIWYG editor for mathematics whose
content is stored in an XML format that makes Guppy mathematical
expressions **searchable**, **parseable**, and **renderable**.

The content of the editor can easily be extracted in a very flexible
XML format (for searching or otherwise manipulating), LaTeX (for
rendering), or a plaintext format (for parsing).

## Demo

A live demo can be found at 
[http://daniel3735928559.github.io/guppy/](http://daniel3735928559.github.io/guppy/)

## Code example

A stripped-down version of the demo page would look like:

```
<html>
  <head>
    <link rel="stylesheet" href="lib/katex/katex.min.css">
    <script src="lib/katex/katex-modified.min.js"></script>
    <script src="lib/mousetrap/mousetrap.min.js"></script>
    <script type="text/javascript" src="guppy/guppy.js"></script>
  </head>
  <body>
    <div id="guppy_div" style="width:400px;height:100px;"></div>
    
    <script>
        Guppy.guppy_init("guppy/transform.xsl","guppy/symbols.json");
        new Guppy("guppy_div");
    </script>
    <button onclick="alert(Guppy.instances.guppy_div.get_content('xml'))">See XML</button>
    <button onclick="alert(Guppy.instances.guppy_div.get_content('latex'))">See LaTeX</button>
    <button onclick="alert(Guppy.instances.guppy_div.get_content('calc'))">See ASCII</button>
  </body>
</html>
```

## Installation and deployment

* Download the `lib` and `guppy` folders.

* Include `guppy/guppy.js` after `lib/katex/katex-modified.min.js`,
  `lib/katex/katex.min.css`, and `lib/mousetrap/mousetrap.min.js`
  files in your page.

* Pass the paths to `guppy/transform.xsl` and `guppy/symbols.json` to
  `Guppy.guppy_init` as in the example above.  This only needs to
  happen once per page.

* For each div that you want turned into a Guppy instance, call `new
  Guppy()` passing in as the first argument either the Element object
  for that div or its ID.

## Editor usage

The editor has many of the usual keyboard text-editing features:
Navigation with the arrow keys, backspace, home, end, selection with
shift-left/right, mod-z/x/c/v for undo, cut, copy, paste
(respectively)).  The mouse is not yet supported in any way.

It will automatically insert mathematical objects if you type their
names.  For example, if you type `sqrt`, this will be replaced by a
square root object.  The list of symbols supported by default is
documented in index.html (or just see the demo page).  Further symbols
can be added by modifying `symbols.json`.  

## API reference

The primary useful items in the Guppy object are:

* `new Guppy(guppy_div, properties)`: `guppy_div` is either the div
  ID or the actual div object that you want turned into a Guppy editor
  (e.g. `document.getElementById('my_div1')`).  `properties` is a
  dictionary that can be null or empty, but may contain the following
  keys:

  * `xml_content`: An XML string with which to initialise the editor's
  state.  Defaults to `<m><e/></m>` (the blank expression).
  
  * `blacklist`: A list of string symbol names, corresponding to
    symbols from `symbols.json` that should not be allowed in this
    instance of the editor.  Defaults to `[]` (nothing blacklisted).

  * `ready_callback`: A function to be called when the instance is
    ready to render things.  

  * `right_callback`: A function to be called when the cursor is at
    the right-most point and a command is received to move the cursor
    to the right (e.g., via the right arrow key).

  * `left_callback`: A function to be called when the cursor is at
    the left-most point and a command is received to move the cursor
    to the right (e.g., via the left arrow key).

  * `done_callback`: A function to be called when Ctrl-Enter is
    pressed in the instance.

  * `debug`: A boolean saying whether guppy should log debug data to
    the console.  Defaults to `false`.

  This function should be called for each div that you want to turn
  into a Guppy instance.

* `Guppy.guppy_init(xsl_path, symbols_path)`: `xsl_path` is the path
  to `guppy/transform.xsl`, `symbols_path` is the path to
  `guppy/symbols.json`.  This function should only be called once per
  page.

* `Guppy.prototype.get_content(type)`: `type` can be `"xml"`, `"latex"`,
  or `"calc"`, and the function will return (respectively) the XML,
  LaTeX, or ASCII representation of the instance's content.
  
* `Guppy.prototype.set_content(xml_data)`: `xml_data` is a string
  containing XML that describes a valid Guppy editor state (e.g. one
  returned by `get_content("xml")`).  This resets the state of the
  editor.
  
* `Guppy.prototype.activate()`: Gives the editor focus.

* `Guppy.prototype.deactivate()`: Unfocuses the editor.

* `Guppy.instances`: This is a dictionary that contains all Guppy
  objects on the page , indexed by div ID.  So you can access the
  Guppy object with `Guppy.instances.guppy_div_id`.  If the div did
  not have an ID, the div will be given one by new Guppy() that is
  unique on the page, and will be accessible from that object by, for
  example, `new Guppy(...).editor.id`.  

There are other instance-level functions that may be of use in some
circumstances (e.g. for creating a browser-button-based interface):

* `left()` and `right()` will move the cursor left and right
  (respectively).
  
* `sel_left()` and `sel_right()` will move the cursor left and right
  (respectively) while selecting (the equivalent of using the left and
  right arrows while also holding down shift).
  
* `sel_cut()`, `sel_copy()` and `sel_paste()` cut, copy, and paste
  (respectively) the current selection, if any.

* `backspace()` will do the same thing as hitting the backspace button.

* `undo()` and `redo()` will undo and redo the previous operation
  (respectively).

* `insert_string(s)` will insert the string `s` it at the current
  cursor position.
  
* `insert_symbol(sym_name)` will take the string name of a symbol from
  `symbols.json` and insert it at the current cursor position.

## Symbol definition reference

`symbols.json` is a dictionary whose keys are the symbol names
(i.e. the strings that will get auto-replaced by the symbol in the
editor) and whose values are dictionaries with the following keys:

* `output`: A dictionary with keys `latex`, `calc`, and an optional
  `small_latex`.  The values are strings which will comprise the
  LaTeX, ASCII, or small LaTeX (respectively) representations of the
  symbol.  A symbol may have editable components, the ith of which is
  represented by `{$i}` appearing in the string.  For example, the
  LaTeX representation of the `sqrt` symbol is `"\\sqrt{{$1}}"`,
  indicating that it has one editable component, namely the inside of
  the square root.

* `type`: A string name for the symbol (will appear in the XML and can
  used for searching).

* `current`: If this is non-zero, then if the symbol is inserted while
  something is selected, then that selection will become this
  component of the symbol.  For example, if the current state is
  `x+1+2` and you select `x+1` and press `^`, then because the
  exponent symbol has `"current":1`, the selection will become
  component 1 of the exponent (i.e. the base) and you will get
  `(x+1)^{}+2`.

* [optional] `current_type`: If this is `"token"` and current is
  non-zero, then when the symbol is inserted, the first token to the
  left of the cursor when the symbol is inserted will become the
  component specified in `current`.  For example, the exponent symbol
  has `"current":1,"current_type":"token"`, so if the current state of
  the editor is `pi+sin(x)` and the cursor is just after the pi, then
  if `^` is pressed, the state will become `{pi}^{}+sin(x)`.  

* [optional] `attrs`: This is a dictionary describing the XML
  attributes that will be given to each of the symbol's editable
  components.  That is, each key is an attribute name, and each value
  is a list of strings, the ith of which will be the value of the
  attribute for the ith component (attribute will be excluded if the
  value is 0).  For example, if the `attrs` dictionary has entry
  `"size":[0,0,"s"]`, then the first and second components will not
  get a size attribute, and the third will get an attribute
  `size="s"`.  You can include whatever attribute names you want, but
  the following names are treated specially in Guppy if they are
  present:
  
  * `mode`: This should be set to "text" for any components that
    should be rendered as text (rather than in math mode).  
  
  * `up`: Which component to jump to when the up arrow key is pressed
    (or 0 for the default behaviour).  For example, in a definite
    integral, we want the up arrow key to take us from the integrand
    or the variable of integration directly to the upper limit.  Since
    the upper limit of integration is component 2, we use
    `"up":[2,2,2,2]`.
  
  * `down`: Which component to jump to when the down arrow key is
    pressed (or 0 for the default behaviour).
  
  * `bracket`: If `bracket` is `"yes"`, then this component will be
    surrounded in parentheses if it contains more than one character
    in it.  For example, the first component of an exponent has
    `bracket="yes"`, so will render as `x^{y}` if the first component is
    `x` and the second `y`, but will render as `(x+1)^{y+2}` if the first
    component is `x+1` and the second `y+2`.  
  
  * `size`: If `size` is `"s"`, then when rendering to LaTeX, anything
    in this component will be rendered using its `small_latex` output
    mode if available.  For example, an exponent has
    `"small":[0,"s"]`, so the second component (the thing in the
    exponent) is marked as being small.  Thus, for instance, fractions
    and integrals (to name two) that appear inside that exponent will
    not render at their normal, large size.

## Data format

The XML format by which mathematical expressions are internally
represented is specified as follows:

* The document is `<m>[component]</m>`

* A `[component]` consists of alternating `<e>` and `<f>` nodes, always
  starting and ending with `<e>` nodes.

* `<e>` nodes represent expressions and contain only text, as in
  `<e>x+1</e>`

* `<f>` nodes represent symbols and have one attribute: `type`, whose
  value comes from the `type` field in `symbols.json`.  They look like
  ```<f type="symbol_type">[sequence of b nodes][sequence of c nodes]</f>```

* `<b>` nodes represent methods for rendering a symbol, specified in
  the `p` attribute.  They contain text interspersed with `<r>` nodes
  which determine where the editable components of the symbol go.  For
  example, a square root symbol will specify how to render itself in
  LaTeX by having in its b nodes: `<b p="latex">\sqrt{<r ref="1" />}</b>`,
  indicating that it should be rendered as `\sqrt{first component goes here}`.

* `<r>` nodes are references to components inside `<b>` nodes, and
  have only a `ref` attribute, whose value is the index of the
  component that should be rendered in place of that `<r>` node.

* `<c>` nodes are the editable components of a symbol, appearing under
  an `<f>` node after the `<b>` nodes, and in order of index (as
  referenced in the `<r>` nodes).  They have whatever attributes are
  specified in the `attrs` key for this symbol in `symbols.json`, and
  they look like `<c attrs...>[component]</c>`, where a `[component]`
  is as defined above.

So, for example, the square root of x+1 would be represented as:

```
<m>
  <e></e>
  <f>
    <b p="latex">\sqrt{<r ref="1"/>}</b>
    <b p="calc">sqrt(<r ref="1"/>)</b>
    <c><e>x+1</e></c>
  </f>
  <e></e>
</m>
```

Whereas the fraction `1+(1-x)/sin(x) would be represented as:

```
<m>
  <e>1+</e>
  <f>
    <b p="latex">\dfrac{<r ref="1"/>}{<r ref="2"/>}</b>
    <b p="small_latex">\frac{<r ref="1"/>}{<r ref="2"/>}</b>
    <b p="calc">(<r ref="1"/>)/(<r ref="2"/>)</b>
    <c up="1" down="2" name="numerator"><e>1-x</e></c>
    <c up="1" down="2" name="denominator">
      <e></e>
      <f>
        <b p="latex">\sin\left(<r ref="1"/>\right)</b>
        <b p="calc">sin(<r ref="1"/>)</b>
        <c><e>x</e></c>
      </f>
      <e></e>
    </c>
  </f>
  <e></e>
</m>
```

## Internals

The majority of the code in Guppy is implementing the logic involved
with modifying the XML tree (described above) via an editor which
displays a kind of flattened version of this tree to the user.
Specifically, the functions that contribute many of the lines are
`left`, `right`, `sel_left`, `sel_right`, `sel_cut`, `sel_copy`,
`sel_paste`, `backspace`, and `insert_symbol` functions.

These fall into two major categories: Moving the cursor around within
the tree, and adding/removing/changing fragments of the tree.  We'll
discuss a few examples of each:

### Cursor functions

In Guppy, the cursor is only allowed to be inside `<e>` nodes.  Since
these only contain text, we can describe the cursor position by a
reference to an `<e>` node within the tree, (`this.current` in the
code), and a numerical offset indicating where the cursor sits within
the text (`this.caret` in the code).

We outline here the basic flow of two of the cursor-related functions:

* `left`: First, since this is not a selection operation, this should
  clear the current selection no matter what.  Then, if the
  `this.caret` is bigger than 0, then we're not at the left of the
  current `<e>` node and so can just decrement `this.caret` and be
  done.  If, on the other hand, `this.caret` is 0, then we need to
  jump to the previous `<e>` node, whatever that is.  So we set
  `this.current` to be that `<e>` node, and `this.caret` to be the
  length of that node's text (as we should start out at the very
  right-most position in that node).

  All the work, then, is in finding this "previous `<e>` node", which
  basically amounts to looking for the one right before us in document
  order.  Ideally, we could use the XPath `preceding` axis, but this
  did not seem to work.  However, there are only a few possible
  situations for the current `<e>` node:

  * `<m><e>current</e>...</m>`: If it is the first child of its parent
    and its parent is an `<m>` node, then we're at the beginning and
    should call `this.left_callback`.

  * `<e>target</e><f><b/><b/><c><e>current</e></c><c/>...</f>`:
    If it is the first child of its parent and its parent is a `<c>`
    node which is also the first child of its parent `<f> node, then
    we need to move to the `<c>` node immediately before that `<f>`
    node.
    
  * `<f><b/><b/><c>...<e>target</e></c><c><e>current</e></c><c/>...</f>`:
    If it is the first child of its parent and its parent is a `<c>`
    node which is not the first child of its parent `<f> node, then
    we need to move to the last `<e>` node in the previous `<c>` node.
    
  * `<f><b/><b/>...<c>...<e>target</e></c></f><e>current</e>`:
    If it follows an `<f>` node, and that `<f>` node has editable components
    (i.e. `<c>` children), then we need to move to the last node of the last
    `<c> child of that `<f>` node.
    
  * `<e>target</e><f><b/><b/></f><e>current</e>`: If it
    follows an `<f>` node, and that `<f>` node has no editable
    components (i.e. no `<c>` children), then we need to move the
    `<e>` node immediately preceding that `<f>` node.

* `sel_left`: When we are selecting (e.g. holding shift and pressing
  arrow keys), we are moving the cursor around, but somewhere else is
  the "start of selection" cursor, so that the selection is the region
  between the current cursor and this selection-start cursor.  For
  sanity, we want to require that these two cursors always be in the
  same level of the tree.

  `sel_left`, therefore, will first check if the "start of selection"
  cursor is present, and if not, it will place it at the current
  cursor location.  Then, it will move the cursor to the left as
  before, but keeping it at the same level of the tree with the
  selection cursor and normal cursor always having the same immediate
  parent.  If we're not at the beginning of an `<e>` node, this is
  still easy.  If we are at the beginning, then there are again cases:

  * `<m><e>current</e>...</m>`: If it is the first child of its parent
    and its parent is an `<m>` node, then we're at the beginning and
    should again call `this.left_callback`.

  * `<c><e>current</e></c>`: If it is the first child of its parent
    and its parent is a `<c>` node, then we cannot go left without
    leaving our current level in the tree, so we do not go anywhere.
    
  * `<e>target</e><f>...</f><e>current</e>`: If it follows an `<f>`
    node, and that `<f>` node, then we need to move the `<e>` node
    immediately preceding that `<f>` node.

### Editing functions

* `backspace`: Again, if the cursor is in the middle of an `<e>` node,
  this is easy.  If the cursor is at the beginning of an `<e>` node,
  then we simply choose to have the backspace operation move the
  cursor left as described above.

* `sel_cut`: Because the selection can only be from somewhere in one
  `<e>` node to somewhere in another _sibling_ `<e>` node, we need
  only to understand what fragment we're cutting out and what we
  should be left with.  This can be visualised thus:

  ```<m>...<e>stuff1 [sel_start] stuff2</e>...more stuff...<e>stuff3 [sel_end] stuff4</e>...</m>```

  should transform to:

  ```<m>...<e>stuff1 stuff4</e>...</m>```

  with the clipboard containing the fragment: 

  ```<e>stuff2</e>...more stuff...<e>stuff3</e>```

  There is another simpler case in which the selection start and end
  are in the same `<e>` node, but this is much easier.

* `sel_paste`: If the clipboard contains a fragment like

  ```<e>stuff2</e>...more stuff...<e>stuff3</e>```

  then when we paste, the cursor will be in the middle of an `<e>` node, such as:

  ```<m>...<e>stuff1 [cursor] stuff4</e>...</m>```

  So the basic idea will be to merge the stuff to the left of the
  cursor (stuff1), with the first `<e>` node of the fragment, and
  merge the stuff to the right of the cursor (stuff2) with the last
  `<e>` node of the fragment, resulting in:  

  ```<m>...<e>stuff1 stuff2</e>...more stuff...<e>stuff3 [cursor] stuff4</e>...</m>```

## Tests

The tests can be run by opening /test/test.html in a browser, for
example, by going to
[http://daniel3735928559.github.io/guppy/test/test.html](http://daniel3735928559.github.io/guppy/test/test.html)

## License

Guppy is licensed under the [MIT License](http://opensource.org/licenses/MIT).
