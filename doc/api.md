## API reference

The primary useful items in the Guppy object are:

* `new Guppy(guppy_div, config)`: `guppy_div` is either the div ID or
  the actual div object that you want turned into a Guppy editor
  (e.g. either `"guppy_div_1"` or
  `document.getElementById("guppy_div_1")` will work).  `config` is a
  dictionary that can be null or empty, but may contain the following
  keys:

  * `events`: A dictionary of callbacks (omit any that you do not wish
    to handle) for various events.  These will be called with an
    `event` argument.
    
    * `ready`: Called when the instance is ready to render things.
      Argument will be null.

    * `change`: Called when the editor's content changes.  Argument
      will be a dictionary with keys `old` and `new` containing the
      old and new documents, respectively.
    
    * `left_end`: Called when the cursor is at the left-most point
      and a command is received to move the cursor to the left (e.g.,
      via the left arrow key).  Argument will be null.
    
    * `right_end`: Called when the cursor is at the right-most point
      and a command is received to move the cursor to the right (e.g.,
      via the right arrow key).  Argument will be null.  

    * `done`: Called when the enter key is pressed in the editor.
      Argument will be null.

    * `completion`: Called when the editor outputs tab completion
      options.  Argument is a dictionary with the key `candidates`, a
      list of the options for tab-completion.

    * `debug`: Called when the editor outputs some debug information.
      Argument is a dictionary with the key `message`.  

    * `error`: Called when the editor receives an error.  Argument is
      a dictionary with the key `message`.

    * `focus`: Called when the editor is focused or unfocused.
      Argument will have a single key `focused` which will be `true`
      or `false` according to whether the editor is newly focused or
      newly unfocused (respectively).

  * `options`: A dictionary of editor configuration options, with the
    following keys (all optional): 

    * `xml_content`: An XML string with which to initialise the
      editor's state.  Defaults to `<m><e/></m>` (the blank
      expression).
  
    * `autoreplace`: A boolean determining whether or not to
      autoreplace typed text with the corresponding symbols when
      possible.  Defaults to true.
  
    * `blank_caret`: A LaTeX string that specifies what the caret
      should look like when in a blank spot.  If left unspecified,
      defaults to the normal vertical bar caret.
    
    * `empty_content`: A LaTeX string that will be displayed when the
      editor is both inactive and contains no content.  Defaults to
      `\color{red}{[?]}`.

    * `blacklist`: A list of string symbol names, corresponding to
      symbols that should not be allowed in this instance of the
      editor.  Defaults to `[]` (nothing blacklisted).
    
  This function should be called for each div that you want to turn
  into a Guppy instance.

* `Guppy.get_symbols(symbol_files, callback)`: `symbol_files` is a
  list of URLs of JSON files conaining further symbols that should be
  accepted by Guppy.  The special string `"builtins"` may also be
  included in the list to get Guppy's built-in symbol definitions
  (Greek letters, etc.).

  This function should only be called once per page.

  If the same symbol is defined in multiple files in the list, the
  definition that is used is from whichever file appears later in the
  `symbol_files` list. Once all files are loaded, `callback` will be
  called if it was passed.

* `Guppy.prototype.get_content(type)`: `type` can be `"xml"`,
  `"latex"`, or `"text"`, and the function will return (respectively)
  the XML, LaTeX, or ASCII representation of the instance's content.
  
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

* `sel_clear()` and `sel_delete()` will clear and delete
  (respectively) the current selection.

* `sel_all()` will select the entire contents of the editor.

* `home()` and `end()` will go to the start/end of the editor content,
  respectively.

* `list_extend(direction, copy)` is the function for extending a list
  when the cursor is inside it.  `direction` should be `"up"`,
  `"down"`, `"right"`, or `"left"`, indicating the direction from the
  cursor in which the new row/column/element should be added.  If
  1-dimensional, right/left add a new element and up/down do nothing.
  If 2-dimensional, right/left add a new column to the right/left of
  the current one, while up/down add a new row above/below the current
  one.  `copy` is a boolean--`true` if the new row/column/element
  should be a copy of the current one, and false if it should be
  blank.

* `list_remove()`, `list_remove_col()` and `list_remove_row()` are the
  functions for removing, respectively, an element from a 1D list, a
  column from a 2D array, or a row from a 2D array.  

* `up()` and `down()` are the functions for moving up and down within
  a 2D array.

* `backspace()`, `delete_key()`, `spacebar()`, and `backslash()` will
  do the same thing as hitting the Backspace, Delete, space, or backslash
  keys, respectively.

* `undo()` and `redo()` will undo and redo the previous operation
  (respectively).

* `insert_string(s)` will insert the string `s` it at the current
  cursor position.
  
* `insert_symbol(sym_name)` will take the string name of a symbol
  (from any of the files loaded by `Guppy.get_symbols`) and insert it
  at the current cursor position.
