for x in `ls doc/_src/|grep md$`; do echo $x; pandoc --toc --toc-depth=4 --ascii -f markdown --template template.html doc/_src/$x > doc/$(echo $x | sed 's/md$/html/'); done
pandoc --ascii -f markdown --template template.html doc/_src/index.md > doc/index.html
pandoc --ascii -f html -V title:'Quick start' --template template.html doc/_src/quickstart.html > doc/quickstart.html
pandoc --ascii -f html -V title:Examples --template template.html examples/_src/index.html > examples/index.html
pandoc --ascii -f html -V title:Contribute --template template.html contribute/_src/index.html > contribute/index.html
(cd examples; ./make_src.sh)
