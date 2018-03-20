% Roadmap

The high-level goals of this project are that mathematics should be
stored in a way that is easy for both computers and humans to
consume.  Our plan has three parts: 

* Enhance its **compatibility**, ensuring it can be used on many
  platforms.

* Explore **integration** with existing platforms for creating
  mathematical content.
  
* Develop **applications** that allow those consuming mathematical
  content to take advantage of the computer's improved understanding
  of that content.

### Compatibility

We wish to ensure that the editor is usable on as many platforms as
possible: 

* More mobile testing

* Internet Explorer compatibility (possibly through babelify?)

### Integration

We seek to allow people to use the editor in contexts in which they
already create mathematical content.  Some (by no means all) platforms
that I wish to explore specifically are:

* Programming tools: Jupyter notebooks, Sage workbooks

* Javascript libraries/frameworks: Quill.js, ReactJS, CodeMirror

* Content management systems: TiddlyWiki, Moodle, WordPress, Emacs

### Applications

When mathematical content is stored in a computer-friendly way, there
should be ways of leveraging that extra understanding to help those
consuming that content.

We envision a tool a bit like a programming IDE, except for reading
mathematics.  For example, if when reading a theorem we find a symbol
whose definition we have forgotten, we should be able to click on that
symbol and be able to cross-reference its definition and its other
instances in the document.
  
### Philosophy

If PostScript is the assembly language of typesetting mathematics,
then perhaps LaTeX is the C and this XML format can be one of many
competing higher-level languages for specifying mathematical
formulae--not optimal for all use-cases, but addressing positively the
needs of a few.
