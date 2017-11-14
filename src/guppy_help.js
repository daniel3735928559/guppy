GuppyHelp = document.createElement("div");
GuppyHelp.setAttribute("class","guppy_help");
GuppyHelp.style = "padding:10px;border:1px solid black; background-color: #fff;position:absolute;top:0;left:0;display:none;";
GuppyHelp.innerHTML = `<p>Start typing the name of a mathematical function to automatically insert it.  </p><p>(For example, "sqrt" for root, "mat" for matrix, or "defi" for definite integral.)</p>
<style>td{ vertical-align:top;padding: 2px;}</style>
<h3>Controls</h3>
            <table>
                <tr>
                    <td><b>Press...</b></td>
                    <td><b>...to do</b></td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">left/right arrows</font>
                    </td>
                    <td>Move cursor</td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">shift+left/right arrows</font>
                    </td>
                    <td>Select region</td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">ctrl+a</font>
                    </td>
                    <td>Select all</td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">ctrl+x/c/v</font>
                    </td>
                    <td>Cut/copy/paste</td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">ctrl+z/y</font>
                    </td>
                    <td>Undo/redo</td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">ctrl+left/right</font>
                    </td>
                    <td>Add entry to list or column to matrix</td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">shift+ctrl+left/right</font>
                    </td>
                    <td>Add copy of current entry/column to to list/matrix</td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">ctrl+up/down</font>
                    </td>
                    <td>Add row to matrix</td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">shift+ctrl+up/down</font>
                    </td>
                    <td>Add copy of current row to matrix</td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">ctrl+backspace</font>
                    </td>
                    <td>Delete current entry in list or column in
                    matrix</td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">ctrl+shift+backspace</font>
                    </td>
                    <td>Delete current row in matrix</td>
                </tr>
</table>`;

var help_x = document.createElement("div");
help_x.innerHTML = `<font size="6pt">&times;</font>`;
help_x.style = "cursor:pointer;position:absolute;top:0;right:0;padding-right:5px;line-height:1;";
help_x.onclick = function(e){ GuppyHelp.style.display = "none"; }
GuppyHelp.appendChild(help_x);

module.exports = GuppyHelp;
