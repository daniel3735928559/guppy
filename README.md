## Synopsis

Guppy is a Javascript-based WYSIWYG editor for mathematics whose
content is stored in XML, making Guppy mathematical expressions
**searchable**, **parseable**, and **renderable**.  

The content of the editor can easily be extracted in XML format (for
searching or otherwise manipulating), LaTeX (for rendering), or a
parseable plaintext format.

## Code Example

To include Guppy on a page, you need to include the KaTeX stylesheet
and javascript as well as (in order) keyboard.js and guppy.js.

Then you can turn any div (with whatever styling you choose) into a
Guppy div with `new Guppy("guppy_div_id")`

The constructor also accepts a dictionary as its second argument
containing various properties you wish to set on that Guppy instance.

```
&lt;html>
  &lt;head>
    &lt;link rel="stylesheet" href="katex/katex.min.css">
    &lt;script src="katex/katex.min.js">&lt;/script>
    &lt;script type="text/javascript" src="keyboard.js">&lt;/script>
    &lt;script type="text/javascript" src="guppy.js">&lt;/script>
  &lt;/head>
  &lt;body>
    &lt;div id="guppy_div" style="width:400px;height:100px;">&lt;/div>
    
    &lt;script>new Guppy("guppy_div", {});&lt;/script>
  &lt;/body>
&lt;/html>
```

There is a dictionary called guppy_instances that contains alll Guppy
objects created in this way, indexed by div ID.  So in some other
Javascript, you can access the Guppy object with
`guppy_instances['guppy_div']`.

The one function you will need is `content`.

* To get the raw XML document which comprises the object's internal state, use `content("xml")`
* To get a LaTeX representation of the content, use `content("latex")`
* To get a parseable ASCII representation of the content, use `content("calc")`

So for example, calling `GUPPY_INSTANCES['guppy_div'].content("calc")`
will give the ASCII representation of the current content of the guppy
instance in `guppy_div`.  

## Installation

Just download the `katex.min.css`, `katex.min.js`, `keyboard.js`, and
`guppy.js` and place them somewhere accessible from your page and
include them as above (again, making sure to include keyboard.js
before guppy.js).  

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
