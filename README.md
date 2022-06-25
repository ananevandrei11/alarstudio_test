# 1. Canvas
There are clickable canvas. Click at the star changes color of down canvas.
There are not nothing add packages. You need open index.htnl in a browser.

# 2. SPA (add / delete / edit user`s data (name and phone))

There are two mode for veiw: with server (json-server) and without server (static data).
## a. Mode without server:
1. Check comment in index.html
	* If lines from line 22 to line 121 in index.html commented out, uncomment these lines
	***
		[line 22:] <tr class="table__tr-row" data-id="1">
		...
		[line 121:] </tr>
	***
	* If line line 165 in index.html commented out, uncomment this line
	***
		[line 165:] <script src="scriptNotServer.js"></script>
	***
	* If line line 166 in index.html uncommented out, comment this line
	***
		[line 166:] <script src="scriptServer.js"></script>
	***
2. Start index.html in browser.

---

## b. Mode with server:
1. Install node modules
***
	npm init
***
2. Add package json-server
***
	npm i --save-dev json-server
***
or 
***
	yarn add --dev json-server
***
or
***
	npm install
***
3. Uncomment in index.html line 166
***
	[line 166:] <!-- <script src="scriptServer.js"></script> -->
***
4. Comment in index.html line 165
***
	[line 165:] <script src="scriptNotServer.js"></script>
***
5. Comment in index.html from line 22 to line 121
***
	[line 22:] <tr class="table__tr-row" data-id="1">
	...
	[line 121:] </tr>
***
6. Start server (port: 8000)
***
	npm server
***
or 
***
	yarn server
***
7. Start index.html in browser.

