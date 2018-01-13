for x in `ls doc/src/|grep md$`; do echo $x; pandoc --ascii -f markdown --template template.html doc/src/$x > doc/$(echo $x | sed 's/md$/html/'); done
pandoc --ascii -f html --template template.html doc/src/quickstart.html > doc/quickstart.html
pandoc --ascii -f html --template template.html examples/src/index.html > examples/index.html
pandoc --ascii -f html --template template.html contribute/src/index.html > contribute/index.html
(cd examples; ./make_src.sh)
