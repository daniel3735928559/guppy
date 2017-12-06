# Guppy

## Synopsis

Guppy is a Javascript-based WYSIWYG editor for mathematics whose
content is stored in an XML format that makes Guppy mathematical
expressions **searchable**, **parseable**, and **renderable**.

The content of the editor can easily be extracted in a very flexible
XML format (for searching or otherwise manipulating), LaTeX (for
rendering), or a plaintext format (for parsing).

## Demo

A live demo can be found at 
[http://daniel3735928559.github.io/guppy/site](http://daniel3735928559.github.io/guppy/site)

## Code example

A stripped-down version of the demo page would look like:

```
<!doctype html>
<html>
<head>
   <link rel="stylesheet" href="build/guppy-default.min.css">
   <script type="text/javascript" src="build/guppy.min.js"></script>
   <script type="text/javascript">
      window.onload = function(){
         Guppy.init({"path":"build",
		             "symbols":"sym/symbols.json"});
         new Guppy("guppy1");
      }
   </script>
   <button onclick="alert(Guppy.instances.guppy1.get_content('xml'))">See XML</button>
   <button onclick="alert(Guppy.instances.guppy1.get_content('latex'))">See LaTeX</button>
   <button onclick="alert(Guppy.instances.guppy1.get_content('text'))">See ASCII</button>
</head>
<body><div id="guppy1" style="width: 400px;"></div></body>
</html>
```

## Installation and deployment

* Download the `build` and `sym` folders.

* Include the `build/guppy.min.js` and `build/guppy-default.min.css` files in
  your page.

* Pass a list of paths to various symbol definition files (several of
  which are in `sym/`) as well as the string `"builtins"` (if you want
  the built-in symbols, such as Greek letters) to `Guppy.get_symbols`
  as in the example above.  This only needs to happen once per page.
  Symbol names from files that appear later in the list will override
  symbol names from files earlier in the list.

* For each div that you want turned into a Guppy instance, call `new
  Guppy()` passing in as the first argument either the Element object
  for that div or its ID.

## FAQ

* How to make it mobile friendly?

  The standard phone keyboard will not activate when the editor is
  focused.  However, Guppy comes with an on-screen keyboard that you
  can activate.  See [GuppyOSK
  documentation](https://github.com/daniel3735928559/guppy/blob/master/doc/other_api.md#guppyosk)
  as well as the [OSK
  example](https://github.com/daniel3735928559/guppy/blob/master/examples/osk.html)
  ([demo](https://daniel3735928559.github.io/guppy/examples/osk.html)).

* How do I change the styling of the editor?

  There are multiple configuration options and CSS classes that can be
  used to customise the appearance of the editor.  See [the
  documentation](doc/style.md).

## Editor usage

The editor has many of the usual keyboard text-editing features:
Navigation with the arrow keys, backspace, home, end, selection with
shift-left/right, mod-z/x/c/v for undo, cut, copy, paste
(respectively).  Using the mouse to navigate and select is also
supported.

If you type the name of a mathematical object such as `sqrt`, the
editor will automatically replace that entered text with the
corresponding object.  The list of symbols supported by default is
documented in index.html (or just see the demo page).  Further symbols
can be added by modifying `symbols.json`.

## Development

When working on the editor, any changes made to the Javascript source
(e.g. [src/guppy.js](https://github.com/daniel3735928559/guppy/blob/master/src/guppy.js)
need to be complied by running `./make -d`).

Because the editor makes AJAX requests as part of its normal
functioning, testing is best done with a small webserver.  For
example, running

```python3 -m http.server --bind 127.0.0.1 8000```

in the root directory of the guppy repository and then browsing to
[localhost:8000/index.html](localhost:8000/index.html) will let you
see the current state of the editor with all your modifications.  As
you're making edits, be sure to run `./make` before refreshing in
order to see your changes reflected in the page.

If you're in a position where you don't have internet connectivity,
you can test using
[localhost:8000/basic.html](localhost:8000/index.html) instead, as
this page does not require any outside resources.

## Further documentation

* [The Javascript API for controlling the editor](doc/editor_api.md)
* [The Javascript APIs for document manipulation, on-screen keyboard, and rendering](doc/other_api.md)
* [Editor styling options](doc/style.md)
* [The JSON specification used to describe available symbols](doc/symbols.md)
* [The XML format used to represent expressions](doc/format.md)
* [Editor internals](doc/internals.md)

## Tests

The tests can be run by opening /test/test.html in a browser, for
example, by going to
[http://daniel3735928559.github.io/guppy/test/test.html](http://daniel3735928559.github.io/guppy/test/test.html)

## License

Guppy is licensed under the [MIT License](http://opensource.org/licenses/MIT).
