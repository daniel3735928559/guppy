## Synopsis

Guppy is a Javascript-based WYSIWYG editor for mathematics whose
content is stored in an XML format that makes Guppy mathematical
expressions **searchable**, **parseable**, and **renderable**.

The content of the editor can easily be extracted in XML format (for
searching or otherwise manipulating), LaTeX (for rendering), or a
plaintext format (for parsing).

Guppy does **not** store a complete syntax tree for the mathematical
expression entered, but the XML format is almost a syntax tree: The
difference is that the leaves are not primitives (numbers or
variables), but rather are basic arithmetic expressions (those
involving only the four basic operations as well as primitives).

## Demo

A live demo can be found at 
[http://daniel3735928559.github.io/guppy/](http://daniel3735928559.github.io/guppy/)

## Code Example

To include Guppy on a page, you need to include the KaTeX stylesheet
and javascript as well as (in order) keyboard.js and guppy.js.

Then you can turn any div (with whatever styling you choose) into a
Guppy div with `new Guppy("guppy_div_id")`

The constructor also accepts a dictionary as its second argument
containing various properties you wish to set on that Guppy instance.

```
<html>
  <head>
    <link rel="stylesheet" href="libguppy/katex/katex.min.css">
    <script src="libguppy/katex/katex.min.js"></script>
    <script type="text/javascript" src="libguppy/keyboard.js"></script>
    <script type="text/javascript" src="libguppy/guppy.js"></script>
  </head>
  <body>
    <div id="guppy_div" style="width:400px;height:100px;"></div>
    
    <script>
        guppy_init("libguppy/transform.xsl");
        new Guppy("guppy_div", {});
    </script>
  </body>
</html>
```

There is a dictionary called guppy_instances that contains alll Guppy
objects created in this way, indexed by div ID.  So in some other
Javascript, you can access the Guppy object with
`guppy_instances['guppy_div']`.

The one instance function of a Guppy object that you will need is
`content`.

* To get the raw XML document which comprises the object's internal state, use `content("xml")`
* To get a LaTeX representation of the content, use `content("latex")`
* To get a parseable ASCII representation of the content, use `content("calc")`

So for example, calling `GUPPY_INSTANCES['guppy_div'].content("calc")`
will give the ASCII representation of the current content of the guppy
instance in `guppy_div`.  

## Installation

* Download the libguppy folder and contents.

* Include the three `.js` and one `.css` files from this folder in
  your page as in the example above.

* Pass the appropriate path to `libguppy/transform.xsl` to
  `guppy_init` as in the example above.

## API Reference

The use of the editor frontend itself is documented in index.html.  

For interacting with the editor from Javascript, a Guppy object has
only one function that will really interest most people: 

* `content(type)`: `type` can be `"xml"`, `"latex"`, or `"calc"`, and
  the function will return (respectively) the XML, LaTeX, or ASCII
  representation of the instance's content.

There are other functions that may be of use in some circumstances
(e.g. for creating a button-based interface): `left()` and `right()`
will move the cursor left and right (respectively), `backspace()` will
do the same thing as hitting the backspace button, `undo()` will undo
the previous operation, and so on.  More complete documentation will
eventually be available in this repository.

The properties that can be passed to the Guppy constructor will go
here when there are any interesting ones.  For now, nothing.

## License

This software is licensed under the MIT License
