var Version = {}
Version.GUPPY_VERSION = "2.0.0-alpha.1";
Version.DOC_VERSION = "1.2.0";
Version.SYMBOL_VERSION = "2.0.0-alpha.3";

Version.DOC_ERROR = function(id, found_ver){
    throw Error("Document version mismatch for " + id + ": Found " + found_ver + ", required " + Version.DOC_VERSION + ".  To update your document, please see daniel3735928559.github.io/guppy/doc/version.html");
}

Version.SYMBOL_ERROR = function(id, found_ver){
    throw Error("Symbol version mismatch for " + id + ": Found " + found_ver + ", required " + Version.SYMBOL_VERSION + ".  To update your document, please see daniel3735928559.github.io/guppy/doc/version.html");
}
export default Version

