// ==UserScript==
// @namespace		https://openuserjs.org/users/mikhailsdv
// @name			VK Bookmarks Beautifier
// @description		Добавляет удобный выбор меток для поста в закладках во ВКонтакте.
// @copyright		2019, mikhailsdv (https://openuserjs.org/users/mikhailsdv)
// @license			MIT
// @version			0.1.1
// @match			https://vk.com/*
// @icon			https://i.ibb.co/2gY7dFQ/icon.png
// @author			Misha Saidov
// @grant			none
// ==/UserScript==

// ==OpenUserJS==
// @author mikhailsdv
// ==/OpenUserJS==

(function () {
	"use strict";

	let tickStyle = document.createElement("style");
	tickStyle.innerHTML = ".bookmark_tag_menu_item[data-tagged='1']:before, .bookmark_tag_menu_item_new:after{left: 11px!important;}";
	document.head.appendChild(tickStyle);

	let checkBox = document.createElement("div");
	checkBox.style.width = "18px";
	checkBox.style.height = "18px";
	checkBox.style.position = "absolute";
	checkBox.style.top = "6px";
	checkBox.style.left = "7px";
	checkBox.style.borderRadius = "100%";
	checkBox.style.boxShadow = "0 0 0 1px";

	let tagsSection = document.createElement("div");
	tagsSection.style.position = "relative";
	tagsSection.style.display = "flex";
	tagsSection.style.padding = "10px 16px";
	tagsSection.style.flexWrap = "wrap";

	let addTagsSection = () => {
		Array.from(document.querySelectorAll(".page_block.bookmark_block:not([bookmarks-added='true'])")).forEach(bookmarkItem => {
			let tags = Array.from(bookmarkItem.getElementsByClassName("ui_actions_menu_sublist")[0].children);
			let tagsSectionClone = tagsSection.cloneNode();
			tagsSectionClone.style.backgroundColor = getComputedStyle(bookmarkItem.getElementsByClassName("bookmark_footer")[0]).backgroundColor;
			tags.forEach((tagItem, tagIndex) => {
				let tag = tagItem.cloneNode(true);
				tag.style.textDecoration = "none";
				tag.style.boxShadow = "0 0 0 1px";
				tag.style.margin = "4px";
				tag.style.opacity = "0.7";
				tag.style.paddingLeft = "35px";
				tag.style.borderRadius = "30px";
				tag.appendChild(checkBox.cloneNode());
				tagsSectionClone.appendChild(tag);
			});
			bookmarkItem.setAttribute("bookmarks-added", "true");
			bookmarkItem.appendChild(tagsSectionClone);
		});
	};

	let oldHref = document.location.href;
	let observer = new MutationObserver(mutations => {
		let newBookmarks = mutations.filter(item => item.target === document.querySelector("[data-stat-container='bookmarks']")).length > 0;
		mutations.forEach(mutation => {
			if (oldHref != document.location.href && /vk\.com\/bookmarks/g.test(document.location.href)) {
				oldHref = document.location.href;
				addTagsSection();
			}
			if (newBookmarks) {
				addTagsSection();
			}
		});
	});

	let config = {
		childList: true,
		subtree: true
	};
	observer.observe(document.querySelector("body"), config);

	if (/vk\.com\/bookmarks/g.test(document.location.href)) {
		addTagsSection();
	}
})();