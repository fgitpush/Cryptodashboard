// **********************************************************************************************************
// VARIABLES
// **********************************************************************************************************
var debugLog = false;
var GAnalyticsActive = true;

var $body = $('body');

var defaultCurrencyCode = 'USD';
var defaultListAmount = '100';
var buttonLoadMoreCurrencyHasBeenClicked = false;
// var whenLoadMoreButtonClickedNewListAmount      = '1000';
var whenLoadMoreButtonClickedNewListAmount = 'all';

var browserSetLocale, browserSetLanguageDirection;
if (chrome.storage == null) {
    browserSetLocale = 'en';
    browserSetLanguageDirection = 'ltr';
} else {
    browserSetLocale = chrome.i18n.getMessage("@@ui_locale");
    browserSetLanguageDirection = chrome.i18n.getMessage("@@bidi_dir");
}

// **********************************************************************************************************
// GOOGLE ANALYTICS
// **********************************************************************************************************
// --- Goggle Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-110453617-2']);
_gaq.push(['_trackPageview']);
_gaq.push(['_trackEvent', 'Extension', 'Extension loaded']);
// _gaq.push(['_trackEvent', 'Default Language', browserSetLocale]);

if (GAnalyticsActive) {
    (function() {
        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = 'https://ssl.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    })();
}


// **********************************************************************************************************
// SETUP/INIT
// **********************************************************************************************************
// Setup.init();

if (chrome.storage == null) {
    Setup.init();
} else {
    chrome.storage.local.get("defaultCurrency", function(result) {
        var data = result.defaultCurrency;

        if (data) {
            defaultCurrencyCode = data;
        }

        Setup.init();
    });
}





// **********************************************************************************************************
// DEBUGGING
// **********************************************************************************************************
function consoleLog(text) {

    if (debugLog) {

        console.log(text);
    }
}

// **********************************************************************************************************
// GOOGLE STORAGE MONITOR
// **********************************************************************************************************
// chrome.storage.onChanged.addListener(function(changes, namespace) {
//     for (key in changes) {
//       var storageChange = changes[key];
//       console.log('Storage key "%s" in namespace "%s" changed. ' +
//                   'Old value was "%s", new value is "%s".',
//                   key,
//                   namespace,
//                   storageChange.oldValue,
//                   storageChange.newValue);
//     }
// });