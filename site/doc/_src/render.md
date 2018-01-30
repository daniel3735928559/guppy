% Rendering documents

Guppy has the ability to render pre-existing mathematical expression
on a page, where those expressions may be specified as XML documents,
JSON syntax trees, plain text, or semantic LaTeX.

In all cases, equations get rendered into a `<span>` element with a
unique ID and class `guppy-render`.  To render many Guppy documents on
a page, you call `render_all` (parameters described below), which will
return a list of objects of the form `{"id":id, "doc":doc}`, where
`id` is the string ID of the span containing the rendered document,
and `doc` is the Guppy.Doc object there rendered.


### Rendering pre-existing XML

If you have a GuppyXML document, say `<m v="2.0.0"><e>x+1</e></m>`,
then you can include it in an HTML document as valid HTML by enclosing
it in a script tag:

```
<script type="text/guppy_xml">
  <m v="2.0.0"><e>x+1</e></m>
</script>
```

On such a page, a call to `Guppy.Doc.render_all()` will render
all such tags as documents, and will return the list of 
`{"id":id, "doc":doc}` objects as described above.

### Rendering plain text or LaTeX

If you have equations on a page in a format that Guppy can
import--plain text or semantic LaTeX, and those equations are
delimited by some string such as `"$$"`, `Guppy.Doc.render_all` can also
render these.  The first arguemnt is the format in which the equations
are specified (`"latex"` or `"text"`) and the second is the delimited
string (e.g. `"$$"`).

```
<p>This is a paragraph about $$m^(a^(t^h))$$</p>
```

Can be rendered with `Guppy.Doc.render_all("text", "$$")`.

### Accessing rendered document objects

The function `render_all` returns a list of objects that specify both
the id of the span into which the expression was rendered and the
Guppy.Doc object that contains the information.  So, for example, if
you had rendered `x^2` on the page and wanted to evaluate it in
response to user input, you could do: 

```
var eqns = Guppy.Doc.render_all("text", "$$")
var x = prompt("Enter a value for x");
alert(eqns[0].get_content("function")({"x":x}));
```
