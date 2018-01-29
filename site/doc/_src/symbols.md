% Adding your own symbol

### When to add a symbol

One of the goals of Guppy is to make it possible that documents are
semantically meaningful.  For this reason, Guppy does not accept
arbitrary LaTeX, but requires that all special notation be defined as
a "symbol", which specifies the rendering of the object and what
arguments are required to create the object.

For example, Guppy does not support typing an integral sign, but
rather has a symbol for definite integral (and a separate one for
indefinite integral).  The definite integral symbol is added when the
user types "defi", and takes four arguments: the lower limit, upper
limit, integrand, and variable of integration.

### How to add a symbol

If you're adding a custom symbol, the preferred method is to have a
separate json file (or even several) for your symbols such as
`my_symbols.json`.  When you initialise Guppy, you can specify
multiple symbol files to load symbols from:

```
Guppy.init({"path":"/lib/guppy",
            "symbols":["/lib/guppy/symbols.json", "/data/my_symbols.json"]});
```

This will load the `symbols.json` file that comes with Guppy as well
as your custom symbols.

A JSON symbols file contains a single dictionary of symbols.  They
keys in this dictionary are the strings the user would type to insert
the symbol, and the values are themselves dictionaries that describe
the symbols.  For example, somewhere in the `symbols.json` file we
find the definite integral symbol:

```
    "defi":
    {"output":{
        "latex":"\\displaystyle\\int_{{$1}}^{{$2}}{$3}d{$4}"},
     "attrs":{ "type":"defintegral", "group":"calculus"}
    },
```

This tells us a few things: 

* The key tells us that "defi" is what the user must input to create a
  definite integral,

* In the dictionary, the "output" key has entries for each rendering
  method we want to support ("latex" being the only one required, as
  we need that to display the symbol in the editor).  The `{$n}`
  notation in the ouptut refers to arguments.  For instnace, `{$1}` is
  used where we want the user to input the lower limit.  This symbol,
  then, has four arguments.

* The "attrs" key specifies certain attributes of the symbol:

  * "type" is its semantically meaningful name that can be used, for
    example, to search for occurances of this symbol

  * "group" is the tab under which to group this symbol when
    displaying the on-screen keyboard for mobile editing.

The actual definite integral symbol is slightly more complicated for
reasons that will become clear as we go through some examples.

### Example: permittivity of free space `\epsilon_0`

Guppy already allows one to input `\epsilon_0` using the subscript
notation.  There are two reasons we might want a separate symbol for
this regardless:

* Elsewhere in the document is a list of values that are denoted by
  `\epsilon_0, \epsilon_1, ..., \epsilon_n` and we want to distinguish
  "the first `\epsilon` value in that list from the permittivity of
  free space.
  
* To input `\epsilon_0` repeatedly is a lot of typing, and maybe if we
  could just type "perm", life would be easier.

To add such a symbol, we make a few decisions:

* The user should input it by typing "perm"

* In LaTeX, it should render as `\epsilon_0`

* In ASCIImath it should render as `e_0`

* It should be searchable via the string `"permittivity"`

* It should be grouped with other physics-related symbols in the
  mobile interface.
  
These decisions manifest in the JSON symbol file as the following
entry in the dictionary: 

```
    "perm":
    {"output":{
        "latex":"\\epsilon_0",
		"asciimath":"e_0"}
     "attrs":{ "type":"permittivity", "group":"physics"}
    },
```
### Example: finite fields `\mathbf{F}_q`

Guppy does not have any "bold-face" notation, so if we want the finite
field notation `\mathbf{F}_q`, we need a custom symbol.  We make a few
decisions:

* The user should input it by typing "Fq"

* We want the user to be able to specify the cardinality of the field

* In LaTeX, it should render as `\mathbf{F}_{CARDINALITY}`

* In ASCIImath it should render as `F_{CARDINALITY}`

* It should be searchable via the string `"finitefield"`

* It should be grouped with other number theory-related symbols in the
  mobile interface.
  
These decisions manifest in the JSON symbol file as the following
entry in the dictionary: 

```
    "Fq":
    {"output":{
        "latex":"\\mathbb{F}_{{$1}}",
		"asciimath":"F_{$1}"}
     "attrs":{ "type":"finitefield", "group":"number_theory"}
    },
```

### Example: tensor product `\otimes`

The tensor product is a simple symbol like the permittivity of free
space in that it has no arguments.  However, unlike `\epsilon_0`, it
behaves as an operator.  When Guppy generates a syntax free for an
input like `V \otimes W`, we don't want this to be interpreted as "V
times tensorproduct times W", but rather as "V tensorproduct W".

So we can start with a spec very similar to the permittivity of free
space example: 

```
    "tensor":
    {"output":{
        "latex":"\\otimes",
		"asciimath":" o "}
     "attrs":{ "type":"tensor", "group":"operations"}
    },
```

However, in order to specify that, semantically, this is an operator
and not an object, we add an "ast" entry to the spec declaring the the
type for the purposes of building the AST is "operator": 
```
    "tensor":
    {"output":{
        "latex":"\\otimes",
		"asciimath":" o "}
     "attrs":{ "type":"tensor", "group":"operations"},
	 "ast":{"type":"operator"}
    },
```

### Example: Riemann curvature tensor: `R^{i}_{jkl}`

While Guppy has support for exponents and subscripts, entering `R_1^2`
will render as `(R_1)^2`, making explicit the fact that the
superscript refers to exponentiation.  If we want some notation with
both sub- and superscripts as indices, we make a special symbol.  

An example is the Riemann curvature tensor `R^i_{jkl}` which is
notated with one superscript index and three subscript indices.  Since
we want the user to be able to specify the values of these indices,
this starts off as a four-argument symbol similar to the definite
integral:

```
"RCT":
{"output":{
    "latex":"R^{{$1}}_{{$2}{$3}{$4}}",
	"asciimath":"R^{{$1}}_{{$2}{$3}{$4}}"},
 "attrs":{
    "type":"curvaturetensor",
	"group":"physics"}
},
```

However, when we're editing we want a few additional behaviours: 

* When we press the "up" arrow in any of the subscripts, we want the
  cursor to move to the superscript
  
* Likewise, when we press the "down" arrow in the superscript, we want
  the cursor to move to the subscripts

* We need to make explicit the fact that the sub- and superscript
  arguments should be rendered as small (for example, integrals in the
  superscript should not be rendered at full size.
  
All these can be specified using the "args" key in the symbol
specification, which is a list of dictionaries where the nth
dictionary in the list describes the behaviour for argument n.  For
example, the first dictionary can have an entry `"down":"2"` to
specify that, in the first argument (i.e. the superscript) the down
arrow should bring us to the second argument (the first subscript):

```
"RCT":
{"output":{
    "latex":"R^{{$1}}_{{$2}{$3}{$4}}",
	"asciimath":"R^{{$1}}_{{$2}{$3}{$4}}"},
 "attrs":{
    "type":"riemanncurvature",
	"group":"physics"},
 "args":[
   {"down":"2","small":"yes"},
   {"up":"1","small":"yes"},
   {"up":"1","small":"yes"},
   {"up":"1","small":"yes"}
 ]
},
```

### Example: Newton's notation for derivative: `f'(x)`

The "prime" notation for derivatives is not built into Guppy, and the
editor doesn't naturally accept inputting the apostrophe character.
In order to allow this, we can create a symbol for the derivative of a
function expressed this way: 

```
"prime":
{"output":{
    "latex":"{$1}'({$2})",
	"asciimath":"{$1}'({$2})"},
 "attrs":{
    "type":"derivative2",
	"group":"calculus"}
},
```

However, this does not fully work: When we input the symbol, we want
whatever came immediately before it to pre-populate the first argument
(i.e. the function whose derivative we're taking).  To wit, if we
input `fprime`, we are presented with `f[?]'([?])` rather than
`f'([?])`.  We can fix this with the "input" key, which specifies the
index of the argument that should be pre-populated with the previous
token:

```
"'":
{"output":{
    "latex":"{$1}'({$2})",
	"asciimath":"{$1}'({$2})"},
 "attrs":{
    "type":"derivative2",
	"group":"calculus"},
 "input":1
},
```

### Example: Column vectors

We can add a column vector entry, which is rendered as
`\left(\begin{matrix}ARGS\end{matrix}\right)`.  We can start with a
simple one-argument symbol: 

```
"cvec":
{"output":{
    "latex":"\\left( \begin{matrix} {$1} \end{matrix}\\right)",
    "asciimath":"vec({$1})"},
 "attrs":{
    "type":"colvector",
    "group":"array"}
},
```

However this allows only a single entry in our column vector.  To
allow many, we specify that this first argument is actually a
one-dimensional list by changing `{$1}` to `{$1{separator}}`, where
"separator" is the whatever we want to separate the elements of the
list.  For LaTeX rendering of a column vector, we want the entries to
be separated with `\\`, and for ASCIImath, a comma will do.  So we
end up with: 

```
"cvec":
{"output":{
    "latex":"\\left( \begin{matrix} {$1{\\\\}} \end{matrix}\\right)",
    "asciimath":"cvec({$1{,}})"},
 "attrs":{
    "type":"colvector",
    "group":"array"}
},
```

### Example: `\cases`

We can continue to add more separators to get higher-dimensional
arrays.  For example, if we want to have a "cases" environment to
express, for example, "f(x) = 0 if x is rational and 1 if x is
irrational" using the LaTeX `\begin{cases}`, we can do it thus: 

```
"cases":
{"output":{
    "latex":"\\begin{cases} {$1{ & \\text{ if }}{\\\\}} \\end{cases}",
    "asciimath":"cases({$1{ if }{;}})"},
 "attrs":{
    "type":"cases",
    "group":"array"}
},
```

This example starts to show the limitations of the editor: In
principle there should be two columns only in this environment, but
there is no syntax for constraining the array to only two columns in
the current version of the editor.
