## Auxiliary APIs

A few additional objects beyond the main editor are documented here:

* `GuppyDoc` found in `build/guppy_doc.min.js`: For manipulating standalone
  documents.  For example, if you have an XML string and want to load
  it as a Guppy document, convert it to LaTeX, or run an XPath query
  on it, this class has that functionality.

* `GuppyRender` found in `build/guppy_render.min.js`: For rendering
  documents found on the page.
  
* `GuppyOSK` found in `build/guppy_osk.js`: The on-screen keyboard
  that can make the editor mobile-friendly.


### `GuppyDoc`

#### Constructor

* `new GuppyDoc(doc)`: Takes an XML string `doc` and creates a Guppy
  document from it.

  * `doc` is a string which should be valid Guppy XML.

#### Instance methods

* `get_content(format)`: Return the content of the document.

  * `format` is a string--either `"latex"`, `"text"`, or `"xml"`.
    Determines the format of in which to return the content.

* `set_content(xml_data)`: Sets the content of the document.

  * `xml_data` is a string which should be valid Guppy XML.

* `xpath_node(xpath)`: Returns the first node matching the given xpath
  expression.

  * `xpath`: A string containing XPath.  

* `xpath_list(xpath)`: Returns an iterator over all nodes matching the
  given XPath expression.

  * `xpath`: A string containing XPath.  

* `get_symbols(groups)`: Returns a list of all string types of symbols
  involved in any of the groups in `groups`.

  * `groups` is either empty (in which case all symbol types will be
    returned) or an array of string names of groups whose symbol types
    should be included.

* `root()`: Returns an Element object for the root node of the
  document.


### `GuppyRender`

#### Static methods

* `GuppyRender.render_all()`: Renders all Guppy XML documents found on
  the page.  These should be placed in script tags with
  `type="guppy_xml"` in the source before this function is called.

  For example if the page has

  ```<script type="guppy_xml"><m><e>x+1</e></m></script>```

  Then a call to `GuppyRender.render_all()` will replace this element with a
  span containing the renered equation.

* `GuppyRender.render(doc, target_id)`: Render the provided XML
  document in the element `#target_id`.

  * `doc`: A string representing the XML document to be rendered

  * `target_id`: The ID of an element on the page into which the
    rendered content should be placed.


### `GuppyOSK`

To enable the on-screen keyboard, ensure all Guppy instances have been
initialised and then create a new GuppyOSK object with `new
GuppyOSK()`.  This will cause any instances of the editor to, when
focused, create an on-screen keyboard at the bottom of the screen with
tabs for the various groups of symbols.

#### Constructor

* `new GuppyOSK(config)`: Create the on-screen keyboard object and
  attach event handlers to all Guppy instances on the page so that
  when any one of them receives focus, the on-screen keyboard appears
  and displays a keyboard with that editor's symbols.

  * `config`: This is a dictionary with configuration options.
    Currently, the following keys are supported:

    * `goto_tab`: This is a string containing the name of the group
      whose tab the keyboard should jump to every time a key is
      pressed.  For example, the value `"abc"` will cause the keyboard
      to revert to the lower-case alphanumeric tab every time a key is
      pressed.