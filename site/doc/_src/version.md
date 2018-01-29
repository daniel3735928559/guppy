% Format version changelogs

### Symbol

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
  different.

#### 1.0.0

Initial version

### Document

#### 2.0.0-alpha.1

* Added `m/@v` to specify version.

* Removed `f/@c`

#### 1.1.0

* Added `l` nodes as valid children of `f` and `l` nodes, with valid
  children either `l` or `c`.

#### 1.0.0

Initial version
