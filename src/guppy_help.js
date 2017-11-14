GuppyHelp = document.createElement("div");
GuppyHelp.setAttribute("class","guppy_help");
GuppyHelp.style = "padding:10px;border:1px solid black; background-color: #fff;position:absolute;top:0;left:0;display:none;";
GuppyHelp.innerHTML = `Start typing a mathematical function to automatically insert it.  <style>td{ vertical-align:top;padding: 2px;}</style>
<table style="width:100%;table-layout:fixed">
<tr><td style="vertical-align:top;border-right:1px solid black;padding-right:15px;">
<table cell-padding="5px">
                <tr>
                    <td><b>Type...</b></td>
                    <td><b>...to create</b></td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">exp or ^</font>
                    </td>
                    <td>Exponent</td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">sub or _</font>
                    </td>
                    <td>Subscript</td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">frac or / </font>
                    </td>
                    <td>Big fraction</td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">shift-/ </font>
                    </td>
                    <td>Division</td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">abs</font>
                    </td>
                    <td>Absolute value</td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">sqrt</font>
                    </td>
                    <td>Square root</td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">root</font>
                    </td>
                    <td>nth root</td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">pi</font>
                    </td>
                    <td>pi</td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">sin/cos/tan</font>
                    </td>
                    <td>Sine/cosine/tangent</td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">log or ln</font>
                    </td>
                    <td>Natural logarithm</td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">deriv</font>
                    </td>
                    <td>Derivative</td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">int</font>
                    </td>
                    <td>Indefinite integral</td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">defi</font>
                    </td>
                    <td>Definite integral</td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">sum</font>
                    </td>
                    <td>Summation</td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">vec</font>
                    </td>
                    <td>Vector</td>
                </tr>
                <tr>
                    <td>
                        <font face="monospace">mat</font>
                    </td>
                    <td>Matrix</td>
                </tr>
            </table></td><td style="vertical-align:top;padding-left:15px;">
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
</table></td></tr></table>`;

module.exports = GuppyHelp;
