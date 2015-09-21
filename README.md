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

## Code Example

A stripped-down version of the demo page would look like:

```
<html>
  <head>
    <link rel="stylesheet" href="lib/katex/katex.min.css">
    <script src="lib/katex/katex-modified.min.js"></script>
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

## Installation and use

* Download the `lib` and `guppy` folders.

* Include `guppy/guppy.js` as well as `lib/katex-modified.min.js` and
  `lib/katex.min.css` files in your page.

* Pass the paths to `guppy/transform.xsl` and `guppy/symbols.json` to
  `Guppy.guppy_init` as in the example above.  This only needs to
  happen once per page.

* For each div that you want turned into a Guppy instance, call `new
  Guppy()` passing in as the first argument either the Element object
  for that div or its ID.

## Frontend Usage

The use of the editor frontend itself is documented in index.html (or 
see the demo).

## API Reference

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

## Tests

The tests can be run by opening /test/test.html in a browser, for example, by going to [http://daniel3735928559.github.io/guppy/test/test.html](http://daniel3735928559.github.io/guppy/test/test.html)

## License

Guppy is licensed under the [MIT License](http://opensource.org/licenses/MIT).
