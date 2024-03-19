.PHONY: edge-fel
edge-fel: src/vendor/edge-fel/edge-fel.js

.PHONY: clean
clean:
	rm -rf build
	rm -rf src/vendor/edge-fel

src/vendor/edge-fel/edge-fel.js: build/edge-fel
	mkdir -p src/vendor/edge-fel
	em++ -s SINGLE_FILE=1 -sMODULARIZE -lembind -o $@ -O3 -I$</edge-fel/Lib $</edge-fel/Lib/*.cpp

build/edge-fel:
	mkdir -p $@
	git clone -b main https://github.com/edge-ml/edge-fel.git build/edge-fel
