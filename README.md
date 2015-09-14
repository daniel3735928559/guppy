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

To include Guppy on a page, you need to include the KaTeX stylesheet
and javascript as well as (in order) keyboard.js and guppy.js.

Then you can turn any div (with whatever styling you choose) into a
Guppy div with

```
new Guppy(document.getElementById("guppy_div_id"))
```

The constructor also accepts a dictionary as its second argument
containing various properties you wish to set on that Guppy instance.

```
<html>
  <head>
    <link rel="stylesheet" href="lib/katex/katex.min.css">
    <script src="lib/katex/katex-modified.min.js"></script>
    <script type="text/javascript" src="guppy/keyboard.js"></script>
    <script type="text/javascript" src="guppy/guppy.js"></script>
  </head>
  <body>
    <div id="guppy_div" style="width:400px;height:100px;"></div>
    
    <script>
        Guppy.guppy_init("libguppy/transform.xsl");
        new Guppy("guppy_div", {});
    </script>
    <button onclick="alert(Guppy.instances.guppy_div.get_content('xml'))">See XML</button>
    <button onclick="alert(Guppy.instances.guppy_div.get_content('latex'))">See LaTeX</button>
    <button onclick="alert(Guppy.instances.guppy_div.get_content('calc'))">See ASCII</button>
  </body>
</html>
```

There is a dictionary called Guppy.instances that contains all Guppy
objects created in this way, indexed by div ID.  So in some other
Javascript, you can access the Guppy object with
`Guppy.instances.guppy_div`.

## Installation

* Download the `lib` and `guppy` folders.

* Include `guppy/keyboard.js`,`guppy/guppy.js` (in that order) as well
  as `lib/katex-modified.min.js` and `lib/katex.min.css` files in your
  page as in the example above.

* Pass the appropriate path to `guppy/transform.xsl` to `Guppy.guppy_init`
  as in the example above.  This only needs to happen once per page.

* For each div that you want turned into a Guppy instance, call `new
  Guppy()` passing in as the first argument either the Element object
  for that div or its ID.

## API Reference

The use of the editor frontend itself is documented in index.html.  

The Guppy object has three functions that you will principally need to
interact with:

* `new Guppy(guppy_div, properties)`: `guppy_div` is either the div ID
  or the actual div object that you want turned into a Guppy editor
  (e.g. `document.getElementById('my_div1')`).  `properties` currently
  does not need to contain anything.  This function should be called
  once per div that you want to turn into a Guppy instance.

* `Guppy.guppy_init(xsl_path)`: `xsl_path` is the path to
  `guppy/transform.xsl`.  This function should only be called once per
  page.

* `Guppy.prototype.get_content(type)`: `type` can be `"xml"`, `"latex"`,
  or `"calc"`, and the function will return (respectively) the XML,
  LaTeX, or ASCII representation of the instance's content.

There are other functions that may be of use in some circumstances
(e.g. for creating a button-based interface): `left()` and `right()`
will move the cursor left and right (respectively), `backspace()` will
do the same thing as hitting the backspace button, `undo()` will undo
the previous operation, and so on.  More complete documentation will
eventually be available in this repository.

The properties that can be passed to the Guppy constructor will go
here when there are any interesting ones.  For now, nothing.

## License

Guppy is licensed under the [MIT License](http://opensource.org/licenses/MIT)
