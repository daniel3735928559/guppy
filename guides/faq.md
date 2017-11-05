# Guppy FAQ

Introducing [Guppy](https://daniel3735928559.github.io/guppy/site/).

## What is it?

A WYSIWYG mathematical expression editor.

## Who is it for?

People editing and/or consuming mathematical expressions.
Specifically, the needs of two target audiences have guided the
development to date:

* Students learning mathematics online
	 
  It is intended make it easy both for students to input and for
  software to validate mathematical expressions.  The input interface
  should be simpler than LaTeX, faster than clicking through menus of
  symbol options, and the results should be parseable so that inputs
  can be evaluated.

* Research mathematicians

  It should be easier for researchers to search for mathematics.  More
  computer-readable storage for mathematical expressions may allow
  search engines of the future to discern whether "H^2" is "H squared"
  or "degree-2 cohomology".  This project aims to make entering both
  of these interpretations easier than LaTeX would, while also
  including the information needed to distinguish them.
	 
## How is it different from other equation editors?

The output is semantically tagged.  Now, you can distinguish whether
dy/dx means "derivative of y with respect to x" or "quotient of the
product d times y by the product d times x".

Also, in its default configuration it requires neither backslashes nor
use of the mouse to enter expressions.

## How is it different from using semantically meaningful macros in LaTeX?  For example, "$\derivative{y}{x}$" or "$\exp{x}{2}$".

It's less typing and it's prettier.

In this editor, when you make the three keystrokes to enter "x^2", you
not only get to see the rendered exponent (and thus can more easily
avoid subtle syntax errors), you also automatically get embedded into
your input all the semantic information that this is an exponential
with x as the base and 2 as the exponent.

## Why can't it output to Maple/SymPy/Sage/[My favourite language]?

The simple answer is that you can make it do so.

The much better answer is that you shouldn't.

A common suggested use-case for this is to take user input, have the
editor output it as SymPy for processing on the server side.  This
almost always permits a malicious user to easily execute arbitrary
code (such as `rm -rf --no-preserve-root /`) on the server.  Removing
builtins will not save you, and containers will probably also not save
you.

If the significance of `().__class__.__base__.__subclasses__()` is
lost on you, you definitely shouldn't do this.  Even if you understand
why that is relevant, you still most likely should not do this.

## Why "guppy"?

I truly don't remember.  `/usr/share/dict/words` might have played a
role.

## Why XML?

Because it is easy to get out of.  When the day comes that a nicer
format comes along that can be as easily and declaratively queried and
transformed, it will be a simple matter to XSLT any lingering XML
specimens into the new hot sauce.

## Why Javascript?

Because it was there.

## Why?

Because.

## Can I make the cursor orange?

Yes.  Many elements are tagged with CSS classes so that you can
write CSS to customise the editor's appearance.  !important.  

## Can it do matrices?

Yes!

## Can make toast?

No!

## It doesn't work on my browser!

I've tested it on recent versions of Firefox and Chrome and some
version of Safari.  Also, on IE11.  It didn't work on IE11.

## I miss backslashes!

Fine.  Have it your way.  They are included, but optional, with a
configuration option to make them required if you choose.

## Is it mobile friendly!

It comes with an on-screen keyboard module that can be used to input
from a phone or tablet.  Try it out:
https://daniel3735928559.github.io/guppy/examples/osk.html

## Is it secure?

```
Set-MailboxAutoReplyConfiguration -Identity $SECURITY -AutoReplyState Enabled -ExternalMessage "Thanks for you report.  We take security very seriously and somone will contact you regarding your report.  Have a nice day."
```

## Is it Web 3.0 compliant?

The planned port to HTML9 Responsive Boilerstrap JS is planned.
