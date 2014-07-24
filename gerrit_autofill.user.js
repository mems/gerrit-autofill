// ==UserScript==
// @name        Gerrit login autofill
// @namespace   gerritloginautofill
// @description Enable login autofill on Gerrit.
// @include     /gerrit/
// @version     1
// @grant	    none
// ==/UserScript==

// In GWT forms are submitted with AJAX
// But browser's form autofill not work on that forms because they are not real one (no form tag)
// http://stackoverflow.com/questions/4841156/gwt-and-autofill
// http://jamies-gwt.blogspot.fr/2011/08/gwt-and-usernamepassword-autocomplete.html
// http://wayback.archive.org/web/20130201020841/http://borglin.net/gwt-project/?page_id=467

/**
* Create mutation observer will observe nodes addition
*/
var observer = new MutationObserver(function(mutations){
	var hasNodesAdded = false;
	// Find if one mutation concerns nodes addition
	for(var key in mutations){
		hasNodesAdded = hasNodesAdded || mutations[key].addedNodes;
	}

	if(hasNodesAdded){
		initForm();
	}
});
observer.observe(document.body, {childList: true});

/**
* Search .gwt-DialogBox input.gwt-TextBox
* and wrap its first parent table with a form
* Should wrap inputs login & password + buttons
*/
function initForm(){
	var input = document.querySelector(".gwt-DialogBox input.gwt-TextBox");
	// If no input founded or has already a form
	if(!input || input.form){
		return;
	}

	var table = input;
	// Find table parent
	while(table && table.tagName != "TABLE"){
		table = table.parentNode;
	}

	// Fail to found table
	if(!table){
		console.error("Error: TABLE not found for the given input:", input);
		return;
	}

	//Wrap table with a form to allow input be autofilled
	var form = document.createElement("form");
	// Prevent form submit
	form.addEventListener("submit", function(event){event.preventDefault();}, false);
	table.parentNode.insertBefore(form, table);
	form.appendChild(table);
	// To submit the form, find first button (and suppose is the right one) and change its type to a submit button
	form.getElementsByTagName("button")[0].setAttribute("type", "submit");
}