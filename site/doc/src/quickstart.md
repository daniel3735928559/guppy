# Quick start

* Download the [build]() folder and place it in your site's
directory. We'll suppose it is in `/lib/guppy/`
* Include guppy.min.js and guppy-default.min.css in your page:
```html
<link rel="stylesheet" href="/lib/guppy/style/guppy-default.min.css">
<script type="text/javascript" src="/lib/guppy/js/guppy.min.js"></script>
```
* Initialise the editor with the path to the "build" folder, as well
as a list of symbol files you want it to use (this function takes many
more arguments as well, allowing global configuration of all editors
on the page.  See the
[documentation](../api/guppymath/2.0.0-alpha/Guppy.html#.init) for
details.)
```javascript
Guppy.init({"path":"/lib/guppy","symbols":"/lib/guppy/sym/symbols.json"});
```
* Initialise an instance of the editor with the ID of a div that you
want to be turned into the editor.
```javascript
var g1 = new Guppy("guppy1");
```
* Putting it all together for a complete [basic example](../examples/basic): 
```html
<!doctype html>
<html>
<head>
    <link rel="stylesheet" href="/lib/guppy/style/guppy-default.min.css">
    <script type="text/javascript" src="/lib/guppy/js/guppy.min.js"></script>
    <script type="text/javascript">
        window.onload = function(){
	        Guppy.init({"path":"/lib/guppy","symbols":"/lib/guppy/sym/symbols.json"});
	        var g1 = new Guppy("guppy1");
        }
    </script>
</head>

<body>
    <div id="guppy1" style="width:400px;"></div>
</body>

  </html>
```
