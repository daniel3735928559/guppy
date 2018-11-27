% Scripting the editor

Any Guppy instance can be controlled from javascript.  For example,
you can create some buttons that perform actions in the editor (such
as moving the cursor right and left or inserting an integral symbol).

The object that allows most of this is the `Engine` instance
associated with an editor.  If we have an editor with ID "guppy1", we
can access its `Engine` with `Guppy("guppy1").engine`.  Functions
available from this object are documented in the API
[here](../api/guppy-js/2.0.0-rc.1/Engine.html). 

For example, to move the cursor one space to the left, insert the
letter "x", and then delete what comes after it, we can do: 

```
var e = Guppy("guppy1").engine;
e.left();
e.insert_string("x");
e.delete_key();
```
