for x in `ls doc/_src/|grep md$`; do echo $x; pandoc --ascii -f markdown --template template.html doc/_src/$x > doc/$(echo $x | sed 's/md$/html/'); done
pandoc --ascii -f html --template template.html doc/_src/quickstart.html > doc/quickstart.html
pandoc --ascii -f html --template template.html examples/_src/index.html > examples/index.html
pandoc --ascii -f html --template template.html contribute/_src/index.html > contribute/index.html
(cd examples; ./make_src.sh)
