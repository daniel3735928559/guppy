% FAQ

### What is it?

A WYSIWYG mathematical expression editor with output that is suited to
computer as well as human use, and that is easier than raw LaTeX.

### Who is it for?

Anyone who wants math input that is easy for novices to enter (such as
in an educational context) and/or that is readable by computers (such
as in a web based calculator application).

Specifically, the needs of two target audiences have guided the
development to date:

* Students learning mathematics online: It is intended make it easy
  both for students to input and for software to validate mathematical
  expressions.  The input interface should be simpler than LaTeX,
  faster than clicking through menus of symbol options, and the
  results should be parseable so that inputs can be symbolically
  understood.
  
* Research mathematicians: It should be easier for researchers to
  search for mathematics.  More computer-readable storage for
  mathematical expressions may allow search engines of the future to
  discern whether "H^2" is "H squared" or "degree-2 cohomology".  This
  project aims to make entering both of these interpretations easier
  than LaTeX would, while also including the information needed to
  distinguish them.
 
### How is it different from other equation editors?

The output is semantically tagged.  Now, you can distinguish whether
`dy/dx` means "derivative of y with respect to x" or "quotient of the
product d times y by the product d times x".

Also, in its default configuration it requires neither backslashes nor
use of the mouse to enter expressions (though both of these are
options, when needed).

### Why can't it output to Maple/SymPy/Sage/[My favourite language]?

The simple answer is that you could make it do so (for example, by
adding appropriate "sympy" outputs to your `symbols.json`).

The much better answer is that, in most cases, you shouldn't. 

If you want to process your mathematical expressions server-side, our
advice is that you consume expressions from the editor as data, (for
example via the "ast" syntax tree output) and evaluate them with the
standard recursive process.  Convenience methods exist in the GuppyDoc
class for doing this in Javascript.

We have intentionally omitted any code outputs (SymPy, etc) that might
get passed to a server because because such a setup almost always
permits a malicious (or merely curious) user to easily take over the
server.  Removing builtins will not save you, chroot will not save
you, and containers will also probably not save you.  If the
significance of `().__class__.__base__.__subclasses__()` is lost on
you, you definitely shouldn't do this.  Even if you understand why
that is relevant, you still most likely should not do this.

### Can I make the cursor orange?

Yes.  Many elements are tagged with CSS classes so that you can write
CSS to customise the editor's appearance.  See the [style
tutorial](./style.html).  !important.

### What are the future plans for this editor?

Broadly, to integrate it with other software used for creating
mathematical content, and to develop applications taking advantage of
the computer-friendly storage format.  See the
[roadmap](./roadmap.html) for details.

### Is it secure?

There are two threat models we have explicitly designed against:

* XSS: In anticipation of content from one user's editor being
  displayed to other users, all XML documents handled by the editor
  are parsed by `DOMParser` only and are never added to the root
  document.
  
* NPM-based attacks: Many components of modern web apps are deployed
  using npm install, which will recursively fetch all the component's
  dependencies.  Rather than specify dependencies and hope that when
  these are resolved by NPM at install time they are not compromised,
  we have performed a limited audit of our dependencies and packaged
  them with our releases.


### Is it mobile friendly?

It comes with an on-screen keyboard module that can be used to
input from a phone or tablet.  Try it
out [here](/site/examples/osk).

### Can it do linear algebra?

Yes!  Type "mat" for a matrix, and "vec" for a vector

### Why XML?

Because it is easy to get out of.  When the day comes that a
nicer format comes along that can be as easily and
declaratively queried and transformed, it will be a simple
matter to XSLT any lingering XML specimens into the new hot
sauce.

### Why Javascript?

Because it was there.

### Why "guppy"?

I truly don't remember.  /usr/share/dict/words may have played a role.

### It doesn't work on my browser!

I've tested it on recent versions of Firefox and Chrome and some
version of Safari.  Also, on IE11.  It didn't work on IE11.  If you
have a browser for which it is broken and shouldn't be, open an
[issue](https://github.com/daniel3735928559/guppy/issues).

### I miss backslashes!

Fine.  Have it your way.  They are included, but optional, with a
configuration option to make them required if you choose.

### Is it Web 3.0 compliant?

The planned port to HTML9 Responsive Boilerstrap JS is planned.
