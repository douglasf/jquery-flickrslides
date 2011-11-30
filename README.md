Photo slide plugin for jQuery
======================

Usage
---
Include the javascript file like this:
`<script src="jquery.slides.js" type="text/javascript" charset="utf-8"></script>`
It has to be after you included jQuery and before you have the rest of your scripts that is going to use it.

Invoke it like this:
`$("#something").flickrSlides({api_key: "yourapikey", photoset_id: "yourphotosetid"});`
In your script.js or whatever you call it.

You need an API key from flickr to use this, you can get one [here](http://www.flickr.com/services/apps/create/apply).

You need a photo set on flickr with photos in, and you need the id of that photoset. You can see the id in the URL to your photoset i.e.
`http://www.flickr.com/photos/00000000@AA2/sets/1111111111111111/` where "1111111111111111" is the id.

No images is used for buttons, instead a font is used. This means that you will have to add

	@font-face {
	    font-family: 'WebSymbolsRegular';
	    src: url('websymbols-regular-webfont.eot');
	    src: url('websymbols-regular-webfont.eot?#iefix') format('embedded-opentype'),
	         url('websymbols-regular-webfont.woff') format('woff'),
	         url('websymbols-regular-webfont.ttf') format('truetype'),
	         url('websymbols-regular-webfont.svg#WebSymbolsRegular') format('svg');
	    font-weight: normal;
	    font-style: normal;
	}

to your css file. And make sure that the path to the font files is correct.

The list with thumbnail photos can be styled with `#something ul li`
 
TODO:
---
* Make more generic
* Move all the styling from the javascript to where it belongs