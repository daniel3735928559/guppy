## Synopsis

Guppy is a Javascript-based WYSIWYG editor for mathematics whose
content is stored in an XML format that makes Guppy mathematical
expressions **searchable**, **parseable**, and **renderable**.

The content of the editor can easily be extracted in XML format (for
searching or otherwise manipulating), LaTeX (for rendering), or a
plaintext format (for parsing).

Guppy does **not** store a complete syntax tree for the mathematical
expression entered.  The XML format differs from a syntax tree in that
the leaves are not primitives (numbers or variables), but rather are
basic arithmetic expressions (those involving only the four basic
operations as well as primitives).

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

* `backspace()` will do the same thing as hitting the backspace button.

* `undo()` will undo the previous operation,

* `insert_string(s)` will insert the string `s` it at the current cursor position.
  
* `insert_symbol(sym_name)` will take the string name of a symbol from
  `symbols.json` and insert it at the current cursor position.

## `symbols.json` reference

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

## Tests

The tests can be run by opening /test/test.html in a browser, for
example, by going to
[http://daniel3735928559.github.io/guppy/test/test.html](http://daniel3735928559.github.io/guppy/test/test.html)

## License

Guppy is licensed under the [MIT License](http://opensource.org/licenses/MIT).
