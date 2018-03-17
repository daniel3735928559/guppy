% XML data format

### Specification

The XML format by which mathematical expressions are internally
represented is specified as follows:

* The document is `<m v="[version]">[component]</m>`

* The `v` attribute contains the Guppy document version in use.  See
  [version information](./version.html).

* A `[component]` consists of alternating `<e>` and `<f>` nodes, always
  starting and ending with `<e>` nodes.

* `<e>` nodes represent expressions and contain only text, as in
  `<e>x+1</e>`

* `<f>` nodes represent symbols and have one attribute: `type`, whose
  value comes from the `type` field in `symbols.json`.  They look like
  ```
  <f type="symbol_type">[sequence of b nodes][sequence of c or l nodes]</f>
  ```

* `<b>` nodes represent methods for rendering a symbol, specified in
  the `p` attribute.  They contain text interspersed with `<r>` nodes
  which determine where the editable components of the symbol go.  For
  example, a square root symbol will specify how to render itself in
  LaTeX by having in its b nodes: `<b p="latex">\sqrt{<r ref="1" />}</b>`,
  indicating that it should be rendered as `\sqrt{first component goes here}`.

* `<r>` nodes are references to components inside `<b>` nodes, and
  have only a `ref` attribute, whose value is the index of the
  component that should be rendered in place of that `<r>` node.

* `<c>` nodes are the editable components of a symbol, appearing under
  an `<f>` node after the `<b>` nodes, and in order of index (as
  referenced in the `<r>` nodes).  They can also appear as children of
  `<l>` nodes, representing the elements of the array.  They have
  whatever attributes are specified in the `attrs` key for this symbol
  in `symbols.json`, and they look like `<c attrs...>[component]</c>`,
  where a `[component]` is as defined above.
  
* `<l>` nodes are arrays, and may appear as children of `<f>` nodes or
  of other `<l>` nodes (in the case of a multi-dimensional array).  An
  `<l>` node always has an `s` attribute indicating how many immediate
  children it has (e.g., in the case of a 1D array, how many elements
  the array has, represented by the number of `<c>` nodes).

### Example: `x+1`

The simple expression `x+1` is represented as:

```
<m>
  <e>x+1</e>
</m>
```

### Example: `sin(x)`

`sin(x)` is represented as: 

```
<m>
  <e></e>
  <f>
    <b p="latex">\sin\left(<r ref="1"/>\right)</b>
    <b p="text">sin(<r ref="1"/>)</b>
    <c><e>x</e></c>
  </f>
  <e></e>
</m>
```

### Example: `sqrt(x+1)`

The square root of `x+1` is:

```
<m>
  <e></e>
  <f>
    <b p="latex">\sqrt{<r ref="1"/>}</b>
    <b p="text">sqrt(<r ref="1"/>)</b>
    <c><e>x+1</e></c>
  </f>
  <e></e>
</m>
```

### Example: `1+(1-x)/sin(x)`

`1+(1-x)/sin(x)` would be represented as:

```
<m>
  <e>1+</e>
  <f>
    <b p="latex">\dfrac{<r ref="1"/>}{<r ref="2"/>}</b>
    <b p="small_latex">\frac{<r ref="1"/>}{<r ref="2"/>}</b>
    <b p="text">(<r ref="1"/>)/(<r ref="2"/>)</b>
    <c up="1" down="2" name="numerator"><e>1-x</e></c>
    <c up="1" down="2" name="denominator">
      <e></e>
      <f>
        <b p="latex">\sin\left(<r ref="1"/>\right)</b>
        <b p="text">sin(<r ref="1"/>)</b>
        <c><e>x</e></c>
      </f>
      <e></e>
    </c>
  </f>
  <e></e>
</m>
```

### Example: Matrix

The 2x3 matrix `[1, 2, 3; x, y, z]` would be represented by:


```
<m>
  <e></e>
  <f type="matrix" group="array">
    <b p="latex">\left(\begin{matrix} <r ref="1" d="2" sep0=" &amp; " sep1="\\"/> \end{matrix}\right)</b>
    <b p="text">matrix(<r ref="1" d="2" sep0="," sep1=";"/>)</b>
    <l s="2">
      <l s="3">
        <c><e>1</e></c>
	<c><e>2</e></c>
	<c><e>3</e></c>
      </l>
      <l s="3">
        <c><e>x</e></c>
	<c><e>y</e></c>
	<c><e>z</e></c>
      </l>
    </l>
  </f>
  <e></e>
</m>
```
