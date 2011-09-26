citationNeeded.js (來源請求.js)
==============================

![Wikipedian Protester](http://imgs.xkcd.com/comics/wikipedian_protester.png)

> [中文說明](http://blog.timc.idv.tw/posts/citation-needed)

This script is a tribute to Chinese Wikipedia for its systemic bias. Such bias is unfortunately contributed by it's editors even without their own knowledge &mdash; such as include objective statements on things when they describe, writing "facts" they were told as kids into the encyclopedia without fact checking.

The fact that the majority of Chinese users are lived in a single mono-culture totalitarian <sup>(not an encyclopedic fact)</sup> state, I believe <sup>(not an encyclopedic fact)</sup>, will eventually contribute the failure of zh.Wikipedia. At least the encyclopedia will never as good as en.Wikipedia on it's society and history entries.

Being told I should not criticize the project without contributing to it, as a web developer, I decided to contribute my effort to this little script, instead of waging Edit Warring.

## What it does

When installed to your Wikipedia account, each time when you select text of an article, a **[citation needed]** button will show up near your cursor, when clicked, it will mark the selected text as citation needed upon confirmation.

## What it doesn't do

Making Wikipedia an instant success. Making you the Wikipedic hero.

## Install

1.  Logged in,

2.  Go to `Special:MyPage/common.js` page with your own, e.g. [this page](https://secure.wikimedia.org/wikipedia/en/wiki/Special:MyPage/common.js) in English Wikipedia.

3.  Edit the page, insert the following script

		importScriptURI(
			'https://raw.github.com/timdream/citationNeeded.js/master/citationNeeded.min.js?'
			+ Math.floor((new Date()).getTime()/1000/60/60/24).toString(16)
		);

4.  Save, reload the page

5.  Go to the article with content that needs citation

6.  Select the text with your cursor, a **[citation needed]** button will show up

7.  Click the button and confirm. Wait for the script talking to Wikipedia API

8.  The page will automatic reload upon completion

## Known Issue

* Script cannot find the corresponding wikitext if your selection is more than plain text (e.g. includes link)
* Script cannot handle multiple non-continuous selection

## Author

timdream <timdream@gmail.com>

## License

CC by-sa 3.0, the same license for Wikipedia.