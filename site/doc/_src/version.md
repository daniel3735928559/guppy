% Format version changelogs

Here we describe the various versions of Guppy XML documents and
symbol specifications that may exist in the wild with the following
caveats: 

* Any symbol file not containing a `_version` top-level key may be
  assumed to be version 1.0.0.

* Any Guppy XML document not containing `m/@v` may be assumed to be
  1.1.0.

* Document and symbol version numbers need not correlate with version
  numbers of Guppy itself.

### Symbol

The complete specification for the current version is described in the
documentation for
[`Guppy.add_global_symbol`](../api/guppy-js/2.0.0-rc.1/Guppy.html#.add_global_symbol).

#### 2.0.0-alpha.3

* Added `keys` to symbol dictionary to specify keyboard input
  combinations for that symbol.

#### 2.0.0-alpha.2

* Removed `attrs.char` as redundant

* Replaced `current.index` with `input`

#### 2.0.0-alpha.1

* Added top-level keys `_version`, `_name`, and `_templates`.

* Moved `attrs` to `args`

* Moved `char`, `type`, and `group` to subkeys of `attrs`

* Added `template`

* Added `ast.type` and `ast.value`

* Transposed `attrs` (now `args`) from 
  ```
  {
    attr1: [arg1attr1val, arg2attr1val],
    attr2: [arg1attr2val, arg2attr2val]
  }
  ```
  to
  ```
  [
    arg1: {attr1:val,attr2:val},
    arg2: {attr1:val,attr2:val}
  ]
  ```
  since the attributes used by different arguments are frequently
  different.  Breaks compatibility with 1.0.0.

#### 1.0.0

Initial version

### Document

The complete specification for the current version is described in the
[XML format](./format.html) page.

#### 1.2.0

* Added `m/@v` to specify version.

* Removed `f/@c`

* Backwards-compatible with 1.1.0 and 1.0.0

#### 1.1.0

* Added `l` nodes as valid children of `f` and `l` nodes, with valid
  children either `l` or `c`.

* Backwards-compatible with 1.0.0

#### 1.0.0

Initial version
