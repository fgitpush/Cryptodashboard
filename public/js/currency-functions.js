// **********************************************************************************************************
// SETUP
// **********************************************************************************************************
var Setup = {

    _cache: {
        $table: $('table'),
        $preloader: $('preloader'),
    },

    init() {

        // LOAD LANGUAGE
        Language.loadInternationalLanguage();

        // BUILD CURRENCY LIST
        this._buildCurrencyDropDown();

        // ENABLE DROP-DOWN EVENT HANDLER
        Currency._eventHandler_CurrencyDropDownSubmit();
        // Currency._eventHandler_hoverRowBuySellButton();
        Currency._eventHandler_loadMoreCurrencyButton();
        Currency._eventHandler_eventTracking();
        // Currency._eventHandler_searchField();

        // PREPARE ASSETS
        this._prepareStage();

        //GET API CALLS
        Currency.getCoins(defaultCurrencyCode);

    },

    _buildCurrencyDropDown() {
        Currency.buildCurrencyHTMLDropdownSelect();
    },

    _prepareStage() {
        // console.log("TABLE",this._cache.$table);
        this._cache.$table.hide();
        this._cache.$table.stickyTableHeaders();
    },


}


// **********************************************************************************************************
// HELPER FUNCTIONS
// **********************************************************************************************************
var Helper = {

    numberWithCommas(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return parts.join(".");
    },

    arrayContains(string, array) {
        return (array.indexOf(string) > -1);
    },

    insideAssociativeObject(string, key, object) {

        return object.filter(function(obj) {
            return obj.dinner == string
        });

    },

    //http://davidwalsh.name/javascript-debounce-function
    debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },

}


// **********************************************************************************************************
// STORAGE: CHROME LOCAL STORAGE
// **********************************************************************************************************

var Storage = {

    loadGoogleStorage() {

        if (chrome.storage == null) {
            return
        }

        chrome.storage.local.get("defaultCurrency", function(result) {
            var data = result.defaultCurrency;
            // alert(data);
            // console.log("1. CHECK STORAGE: ",data);

            return data
        });
    },

    setGoogleStorage(obj) {

        // console.log ('STORAGE: SET INIT');
        // console.log ('STORAGE OBJ:', obj);

        // if (chrome.storage == null || !key || !value ) {            
        if (chrome.storage == null || !obj) {
            console.log("Cant set storage. Chrome Storage only works in Extensions.");
            return
        }

        chrome.storage.local.set(obj);
    },

    getGoogleStorage(key) {

        // console.log ('STORAGE: GET INIT');

        if (chrome.storage == null || !key) {
            // console.log("GETTING ERROR!");
            return
        }

        // chrome.storage.local.get({ "defaultCurrency": 'USD' }, function(){
        chrome.storage.local.get(key, function(result) {
            // chrome.storage.local.get("defaultCurrency", function(result){
            // console.log("KEY GET:",key);
            // console.log("GET RESULT:",result);
            // console.log("2. GET RESULT:",result[key]);
        });


    },

}


// **********************************************************************************************************
// LANGUAGE - Localization - chrome.i18n
// **********************************************************************************************************

var extTableInside_BUY, extTableInside_SELL;

var Language = {

    loadInternationalLanguage() {

        if (chrome.i18n == null) {
            // console.log("GETTING ERROR!");
            return
        }



        // DEfault Locale/Lang
        // console.log(browserSetLocale); 

        $body.find('#extTopBannerH2').text(chrome.i18n.getMessage("extTopBannerH2"));
        $body.find('#extDropDownDefaultSelect').text(chrome.i18n.getMessage("extDropDownDefaultSelect"));
        $body.find('#extTableHeadingTitle_RANK').text(chrome.i18n.getMessage("extTableHeadingTitle_RANK"));
        $body.find('#extTableHeadingTitle_NAME').text(chrome.i18n.getMessage("extTableHeadingTitle_NAME"));
        $body.find('#extTableHeadingTitle_PRICE').text(chrome.i18n.getMessage("extTableHeadingTitle_PRICE"));
        $body.find('#extTableHeadingTitle_24HR').text(chrome.i18n.getMessage("extTableHeadingTitle_24HR"));
        $body.find('#extTableHeadingTitle_WEEK').text(chrome.i18n.getMessage("extTableHeadingTitle_WEEK"));
        $body.find('#extTableHeadingTitle_BITCOIN').text(chrome.i18n.getMessage("extTableHeadingTitle_BITCOIN"));
        $body.find('#extTableHeadingTitle_BUY_SELL').text(chrome.i18n.getMessage("extTableHeadingTitle_BUY_SELL"));
        $body.find('#extBUTTON_LOAD_MORE').text(chrome.i18n.getMessage("extBUTTON_LOAD_MORE"));
        $body.find('#extERROR_Service_Unavailable').text(chrome.i18n.getMessage("extERROR_Service_Unavailable"));
        $body.find('#extERROR_Check_Back').text(chrome.i18n.getMessage("extERROR_Check_Back"));

        // INTERNAL LANGUAGE
        extTableInside_BUY = chrome.i18n.getMessage("extTableInside_BUY");
        extTableInside_SELL = chrome.i18n.getMessage("extTableInside_SELL");


        // Track
        _gaq.push(['_trackEvent', 'Default Language', browserSetLocale + ' - ' + browserSetLanguageDirection]);
    }

}


// **********************************************************************************************************
// IMAGE - Lazy Loading
// **********************************************************************************************************
// $(document).on('ajaxStop', function() {    

//     console.log('Lazy fired!');   
//     $('img.lazy').Lazy({
//         // your configuration goes here
//         // scrollDirection: 'vertical',
//         effect: 'fadeIn',
//         effectTime: 600,
//         threshold: 100,
//         // visibleOnly: true,
//         // onError: function(element) {
//         //     console.log('error loading ' + element.data('src'));
//         // }
//     });      
// });


// **********************************************************************************************************
// CURRENCY ACTIONS
// **********************************************************************************************************
var Currency = {

    currencies: [{
            "id": "USD",
            "currencyName": "US Dollar",
            "currencySymbol": "$",
            "currencySymbolPosition": "before"
        }, {
            "id": "EUR",
            "currencyName": "Euro",
            "currencySymbol": "€",
            "currencySymbolPosition": "before"
        }, {
            "id": "GBP",
            "currencyName": "British Pound Sterling",
            "currencySymbol": "£",
            "currencySymbolPosition": "before"
        }, {
            "id": "AUD",
            "currencyName": "Australian dollar",
            "currencySymbol": "$",
            "currencySymbolPosition": "before"
        }, {
            "id": "BRL",
            "currencyName": "Brazilian Real",
            "currencySymbol": "R$",
            "currencySymbolPosition": "before"
        }, {
            "id": "CAD",
            "currencyName": "Canadian Dollar",
            "currencySymbol": "$",
            "currencySymbolPosition": "before"
        }, {
            "id": "CHF",
            "currencyName": "Swiss Franc",
            "currencySymbol": "Fr.",
            "currencySymbolPosition": "before"
        }, {
            "id": "CNY",
            "currencyName": "Chinese Yuan Renminbi",
            "currencySymbol": "¥",
            "currencySymbolPosition": "before"
        }, {
            "id": "CZK",
            "currencyName": "Czech Koruna",
            "currencySymbol": "Kč",
            "currencySymbolPosition": "before"
        }, {
            "id": "DKK",
            "currencyName": "Danish Krone",
            "currencySymbol": "kr.",
            "currencySymbolPosition": "after"
        }, {
            "id": "EUR",
            "currencyName": "Euro",
            "currencySymbol": "€",
            "currencySymbolPosition": "before"
        }, {
            "id": "GBP",
            "currencyName": "British Pound Sterling",
            "currencySymbol": "£",
            "currencySymbolPosition": "before"
        }, {
            "id": "HKD",
            "currencyName": "Hong Kong Dollar",
            "currencySymbol": "$",
            "currencySymbolPosition": "before"
        }, {
            "id": "HUF",
            "currencyName": "Hungarian Forint",
            "currencySymbol": "Ft",
            "currencySymbolPosition": "after"
        }, {
            "id": "IDR",
            "currencyName": "Indonesian Rupiah",
            "currencySymbol": "Rp ",
            "currencySymbolPosition": "before"
        }, {
            "id": "ILS",
            "currencyName": "Israeli New Sheqel",
            "currencySymbol": "₪",
            "currencySymbolPosition": "before"
        }, {
            "id": "INR",
            "currencyName": "Indian Rupee",
            "currencySymbol": "₹",
            "currencySymbolPosition": "before"
        }, {
            "id": "JPY",
            "currencyName": "Japanese Yen",
            "currencySymbol": "¥",
            "currencySymbolPosition": "before"
        }, {
            "id": "KRW",
            "currencyName": "South Korean Won",
            "currencySymbol": "₩",
            "currencySymbolPosition": "before"
        }, {
            "id": "MXN",
            "currencyName": "Mexican Peso",
            "currencySymbol": "$",
            "currencySymbolPosition": "before"
        }, {
            "id": "MYR",
            "currencyName": "Malaysian Ringgit",
            "currencySymbol": "RM",
            "currencySymbolPosition": "before"
        }, {
            "id": "NOK",
            "currencyName": "Norwegian Krone",
            "currencySymbol": ",-",
            "currencySymbolPosition": "after"
        }, {
            "id": "NZD",
            "currencyName": "New Zealand Dollar",
            "currencySymbol": "$",
            "currencySymbolPosition": "after"
        }, {
            "id": "PHP",
            "currencyName": "Philippine Peso",
            "currencySymbol": "₱ ",
            "currencySymbolPosition": "before"
        }, {
            "id": "PKR",
            "currencyName": "Pakistani Rupee",
            "currencySymbol": "₨ ",
            "currencySymbolPosition": "before"
        }, {
            "id": "PLN",
            "currencyName": "Polish Zloty",
            "currencySymbol": " zł",
            "currencySymbolPosition": "after"
        }, {
            "id": "RUB",
            "currencyName": "Russian Ruble",
            "currencySymbol": " руб",
            "currencySymbolPosition": "after"
        }, {
            "id": "SEK",
            "currencyName": "Swedish Krona",
            "currencySymbol": " kr",
            "currencySymbolPosition": "after"
        }, {
            "id": "SGD",
            "currencyName": "Singapore Dollar",
            "currencySymbol": "$",
            "currencySymbolPosition": "before"
        }, {
            "id": "THB",
            "currencyName": "Thai Baht",
            "currencySymbol": "฿",
            "currencySymbolPosition": "before"
        }, {
            "id": "TRY",
            "currencyName": "Turkish Lira",
            "currencySymbol": "TL",
            "currencySymbolPosition": "after"
        }, {
            "id": "TWD",
            "currencyName": "New Taiwan Dollar",
            "currencySymbol": "$",
            "currencySymbolPosition": "before"
        }, {
            "id": "ZAR",
            "currencyName": "South African Rand",
            "currencySymbol": "R",
            "currencySymbolPosition": "before"
        }

    ],

    buildCurrencyHTMLDropdownSelect() {

        $(this.currencies).each(function() {

            var name = this.currencyName;
            var value = this.id;

            // console.log(name);
            // console.log(value);

            //this refers to the current item being iterated over

            var option = $('<option />');
            // option.attr('value', value).text(name+" ("+value+")");
            option.attr('value', value).text(value + " -  " + name);

            // $('#combo').append(option);
            $('#currency').append(option);
        });

    },


    getCoins(currency) {


        $('#setCurrencyCode').html(defaultCurrencyCode);

        var apiUrl;

        // var success = this.currencies.filter(function (current) { return current.id == "JPY" });
        var currencyExist = this.currencies.filter(function(current) {
            return current.id == currency
        });
        // console.log("SUCESS:",currencyExist);


        // AMOUNT OF CURRENCY RULES 
        if (buttonLoadMoreCurrencyHasBeenClicked) {
            defaultListAmount = whenLoadMoreButtonClickedNewListAmount
        }

        // ENDPOINT
        if (currencyExist != '') {
            // apiUrl = "https://api.coinmarketcap.com/v1/ticker/?convert=" + currency + "&limit=" + defaultListAmount + "";
            apiUrl = "https://cors-anywhere.herokuapp.com/https://coinmark.co/api/v1/?&currency=" + currency + "&limit=" + defaultListAmount + "&token=1";
        } else {
            // apiUrl = "https://api.coinmarketcap.com/v1/ticker/?convert=USD&limit=" + defaultListAmount + "";
            apiUrl = "https://cors-anywhere.herokuapp.com/https://coinmark.co/api/v1/?&currency=USD&limit=" + defaultListAmount + "&token=1";
        }

        // GET API DATA Request ---------------------------------------------------------------------------------
        $.getJSON(apiUrl, {})
            .done(function(data, status) {

                // console.log(status);

                // return;

                $('.preloader').fadeOut(600, () => {
                    $('table').fadeIn();
                    // $('.load-button').fadeIn();
                    // HIDE BUTTON FROM CANVAS
                    if (buttonLoadMoreCurrencyHasBeenClicked == false) {
                        $('.load-button').fadeIn();
                    }
                });


                var textToInsert = '';


                $.each(data, function(key, val) {

                    var lowerName = val.name.replace(/[\s+-]/g, '-').replace(/[^\w-]/g, '').toLowerCase();


                    // RED/GREEN HIGHLIGHT  ------------------------------------------------
                    var highlight_class_24h, highlight_class_7d, arrowPerformance;

                    var value_perc_24h = parseFloat(val.percent_change_24h);
                    var value_perc_7d = parseFloat(val.percent_change_7d);


                    if (value_perc_24h > 0) {
                        highlight_class_24h = "green";
                        arrowPerformance = '<i class="fa fa-chevron-up"></i>';
                        // arrowPerformance = '<i class="material-icons">keyboard_arrow_up</i>';
                    } else {
                        highlight_class_24h = "red";
                        arrowPerformance = '<i class="fa fa-chevron-down"></i>';
                        // arrowPerformance = '<i class="material-icons">keyboard_arrow_down</i>';
                    }

                    if (value_perc_7d > 0) {
                        highlight_class_7d = "green";
                        // arrowPerformance = '<i class="fa fa-chevron-up"></i>';
                    } else {
                        highlight_class_7d = "red";
                        // arrowPerformance = '<i class="fa fa-chevron-down"></i>';
                    }

                    if (!value_perc_24h) {
                        value_perc_24h = ' --- '
                    }

                    if (!value_perc_7d) {
                        value_perc_7d = ' --- '
                    }

                    // console.log(val.percent_change_24h,val.percent_change_7d);


                    // CURRENCY LIST FIXER ------------------------------------------------

                    var currencyMain, currencySymbol;

                    // VARIABLE: va

                    var toLower = currencyExist[0].id.toLowerCase();
                    // console.log(toLower);

                    var fixedMain = val["price_" + toLower];

                    if (fixedMain) {
                        currencyMain = fixedMain;
                        // currencySymbol = "R-----";
                        currencySymbol = currencyExist[0].currencySymbol;
                    } else {
                        currencyMain = val.price_usd;
                        currencySymbol = "$";
                    }



                    // COMMA Fixes, make Price with commas like 100,000.00 -------------------------------------------------
                    // var currencyMain = val.price_zar;


                    var highLow = parseFloat(currencyMain);
                    var price;

                    if (highLow > 1) {
                        // price = highLow.toFixed(2);
                        price = highLow.toFixed(2);
                        price = Helper.numberWithCommas(price)
                    } else {
                        // price = highLow.toFixed(5);
                        price = highLow.toFixed(4);
                    }




                    // CURRENCY SYMBOL Before or After ------------------------------------------------
                    var symbolAndPrice

                    if (currencyExist[0].currencySymbolPosition == 'after') {

                        symbolAndPrice = price + " " + currencySymbol
                            // symbolAndPrice = price+" <small>"+currencySymbol+"</small>"

                    } else {
                        symbolAndPrice = currencySymbol + "" + price
                            // symbolAndPrice = " <small>"+currencySymbol+"</small>"+price
                    }



                    // BITCOIN FIXER --------------------------------------------------------
                    var numBit = val.price_btc;

                    var priceBit = parseFloat(numBit).toFixed(8);


                    // BITCOIN CASH ChANGELKY Fix --------------------------------------------------------
                    var symbolFixBitCoinCash;

                    if (val.symbol === 'BCH') {
                        symbolFixBitCoinCash = 'BCH'; // Fix cause on CHANGELLY BCH = BCC
                    } else {
                        symbolFixBitCoinCash = val.symbol
                    }



                    // BITCOIN FIRST BUY ITEM ChANGELLY Fix --------------------------------------------------------
                    var symbolSellFixForBitcoin, symbolSellFixForBitcoin, amountSellFixForBitcoin;

                    if (val.symbol === 'BTC') {
                        // symbolSellFixForBitcoin = 'ETH'; // Fix cause on CHANGELLY BCH = BCC
                        // amountSellFixForBitcoin = '1'; // Fix 

                        symbolSellFixForBitcoin = 'btcusd'; // Fix cause on CHANGELLY BCH = BCC
                        amountSellFixForBitcoin = '100'; // Fix 
                    } else {
                        symbolSellFixForBitcoin = 'btc'
                        amountSellFixForBitcoin = '1'; // Fix
                    }


                    // BUY SELL TRANSLATION --------------------------------------------------------
                    if (!extTableInside_BUY) {
                        extTableInside_BUY = 'BUY'; //
                    }

                    if (!extTableInside_SELL) {
                        extTableInside_SELL = 'SELL'; //
                    }


                    // CHANGELLY GEO LNK  --------------------------------------------------------

                    var changellyLanguage = '';

                    // ar,es,fr,pt,de,ru,vi,hi,ja,cn,ko                      


                    if (browserSetLocale.indexOf('de') !== -1) {
                        // console.log( 'English',browserSetLocale )
                        changellyLanguage = 'de.';

                    } else if (browserSetLocale.indexOf('ar') !== -1) {
                        // console.log( 'English',browserSetLocale )
                        changellyLanguage = 'ar.';

                    } else if (browserSetLocale.indexOf('es') !== -1) {
                        // console.log( 'English',browserSetLocale )
                        changellyLanguage = 'es.';

                    } else if (browserSetLocale.indexOf('fr') !== -1) {
                        // console.log( 'English',browserSetLocale )
                        changellyLanguage = 'fr.';

                    } else if (browserSetLocale.indexOf('pt') !== -1) {
                        // console.log( 'English',browserSetLocale )
                        changellyLanguage = 'pt.';

                    } else if (browserSetLocale.indexOf('ru') !== -1) {
                        // console.log( 'English',browserSetLocale )
                        changellyLanguage = 'ru.';

                    } else if (browserSetLocale.indexOf('vi') !== -1) {
                        // console.log( 'English',browserSetLocale )
                        changellyLanguage = 'vi.';

                    } else if (browserSetLocale.indexOf('hi') !== -1) {
                        // console.log( 'English',browserSetLocale )
                        changellyLanguage = 'hi.';

                    } else if (browserSetLocale.indexOf('ja') !== -1) {
                        // console.log( 'English',browserSetLocale )
                        changellyLanguage = 'ja.';

                    } else if (browserSetLocale.indexOf('ko') !== -1) {
                        // console.log( 'English',browserSetLocale )
                        changellyLanguage = 'ko.';

                    } else if (browserSetLocale.indexOf('cn') !== -1) {
                        // console.log( 'English',browserSetLocale )
                        changellyLanguage = 'cn.';

                    } else {
                        // console.log( 'Default set',browserSetLocale );

                        changellyLanguage = '';
                    }


                    // CHANGELLY LINKS ----------------------------------------------------------------------------------------

                    // var changellyOutgoingBUY, changellyOutgoingSELL;

                    // if (browserSetLocale.indexOf('en') !== -1) {

                    //     changellyOutgoingBUY = `https://${changellyLanguage}changelly.com/widget/v1?auth=email&from=${symbolSellFixForBitcoin}&to=${symbolFixBitCoinCash}&merchant_id=d907de097cd0&address=&amount=${amountSellFixForBitcoin}&ref_id=d907de097cd0&color=4EB6F2`;
                    //     changellyOutgoingSELL = `https://${changellyLanguage}changelly.com/widget/v1?auth=email&from=${symbolFixBitCoinCash}&to=BTCmerchant_id=d907de097cd0&address=&amount=1&ref_id=d907de097cd0&color=4EB6F2`;

                    // } else {
                    //     changellyOutgoingBUY = `https://${changellyLanguage}changelly.com/?ref_id=d907de097cd0`;
                    //     changellyOutgoingSELL = `https://${changellyLanguage}changelly.com/?ref_id=d907de097cd0`;
                    // }


                    // COINMARK LINKs LINKS ----------------------------------------------------------------------------------------

                    var changellyOutgoingBUY, changellyOutgoingSELL;
                    var mainUrl = 'coinmark.co';

                    // if (browserSetLocale.indexOf('en') !== -1) {

                    //     changellyOutgoingBUY2 = `https://${changellyLanguage}changelly.com/widget/v1?auth=email&from=${symbolSellFixForBitcoin}&to=${symbolFixBitCoinCash}&merchant_id=d907de097cd0&address=&amount=${amountSellFixForBitcoin}&ref_id=d907de097cd0&color=4EB6F2`;
                    //     changellyOutgoingSELL2 = `https://${changellyLanguage}changelly.com/widget/v1?auth=email&from=${symbolFixBitCoinCash}&to=BTCmerchant_id=d907de097cd0&address=&amount=1&ref_id=d907de097cd0&color=4EB6F2`;


                    // } else {
                    //     // changellyOutgoingBUY    = `https://${changellyLanguage}changelly.com/exchange/${symbolSellFixForBitcoin}/${symbolFixBitCoinCash}/${amountSellFixForBitcoin}?ref_id=d907de097cd0`;
                    //     // changellyOutgoingSELL   = `https://${changellyLanguage}changelly.com/exchange/${symbolFixBitCoinCash}/btc/1?ref_id=d907de097cd0`;  
                    //     changellyOutgoingBUY2 = `https://${changellyLanguage}changelly.com/?ref_id=d907de097cd0`;
                    //     changellyOutgoingSELL2 = `https://${changellyLanguage}changelly.com/?ref_id=d907de097cd0`;
                    // }

                    changellyOutgoingBUY = `https://${mainUrl}/out/?auth=email&from=${symbolSellFixForBitcoin}&to=${symbolFixBitCoinCash}&merchant_id=d907de097cd0&address=&amount=${amountSellFixForBitcoin}&ref_id=d907de097cd0&color=4EB6F2`;
                    changellyOutgoingSELL = `https://${mainUrl}/out/?auth=email&from=${symbolFixBitCoinCash}&to=BTCmerchant_id=d907de097cd0&address=&amount=1&ref_id=d907de097cd0&color=4EB6F2`;






                    textToInsert += `  

                            <tr class="tr justify-content-center align-self-center align-middle">
                                <td class="align-middle text-center"> 
                                <!-- ${ val.rank} 
                                    &nbsp;&nbsp; -->
                                
                                <!-- <img src="icons/coins/${lowerName}.png" class="lazy img-fluid" alt=""></td>-->
                                <img src="https://coinmark.co/assets/extension/coins/${lowerName}.png" class="lazy img-fluid" alt=""></td>
                               <!--  <img src="icons/icon16.png" data-src="icons/coins/${lowerName}.png" class="lazy img-fluid black" alt=""> -->
                                
                                <td class="align-middle"> 
                                        <h4 class="name">${val.name}</h4> 
                                        <h5><small>${symbolFixBitCoinCash}</small> </h5>                                    
                                </td>
                               
                                <td class=" align-middle text-left">  ${ val.rank} </td>                         
                                
                                <td class="${highlight_class_24h} align-middle text-left"> <h4 class="price">${symbolAndPrice}&nbsp;${arrowPerformance}</h4> </td>                         
                                <td class="${highlight_class_24h} align-middle text-right">  <h4 class="twentyFour_Hr">${value_perc_24h}% ${arrowPerformance}</h4> </td>
                                <td class="${highlight_class_7d} align-middle  text-center"> ${value_perc_7d}% </td>

                                 <td class=" align-middle bit"> ${priceBit} </td>                              

                                <td>
                                        <div class="btn-group" role="group" aria-label="Basic example">
                                            <a class="btn-buy btn btn-secondary" data-action="BUY - ${symbolFixBitCoinCash} - ${val.name} - ${browserSetLocale}" href="${changellyOutgoingBUY}" target="_blank">
                                                    ${extTableInside_BUY}
                                            </a>
                                            <a class="btn-sell btn btn-secondary" data-action="SELL - ${symbolFixBitCoinCash} - ${val.name} - ${browserSetLocale}" href="${changellyOutgoingSELL}" target="_blank">
                                                    ${extTableInside_SELL}
                                            </a>
                                        </div>
                                </td>


                            </tr>`;

                }); //End $.each

                $('.tbody').append(textToInsert);


                // $('img.lazy').on('load',function(){
                //   console.log(this)//fires this function when it appears
                //   //LAZY LOADING
                //         // Lazy.loadLazyLoad();
                // });


                // Tracking
                _gaq.push(['_trackEvent', 'API', 'SUCCESS - Get currency']);


            })
            .fail(function(jqxhr, textStatus, error) {

                $('.preloader').fadeOut(600, () => {
                    $('#errorMessage').fadeIn();
                });

                var err = textStatus + ", " + error;
                console.log("Request Failed: " + err);

                // Tracking
                _gaq.push(['_trackEvent', 'API', 'ERROR - Get currency']);
            });


    },

    _eventHandler_CurrencyDropDownSubmit() {

        $("#currency").change(function(e) {



            e.preventDefault();

            var submittedCurrency = $('#currency').val();
            // console.log("SUBMITTED CURRENCY",submittedCurrency);

            if (submittedCurrency != '') {

                Storage.setGoogleStorage({
                    "defaultCurrency": submittedCurrency
                })
                defaultCurrencyCode = submittedCurrency;

                // $('.preloader').fadeIn();
                $('table').fadeOut(300, () => {
                    // this._cache.table.toggle('slow');
                    $('.tbody').html('');
                    $('.load-button').hide();
                    $('.preloader').fadeIn();

                    Currency.getCoins(submittedCurrency);
                });

                // Tracking
                _gaq.push(['_trackEvent', 'DROP-DOWN', 'Changed - ' + submittedCurrency]);
                // _gaq.push(['_trackEvent', 'D - FIGO Selected Currency', submittedCurrency]);

            }

        });
    },

    _eventHandler_loadMoreCurrencyButton() {

        $(".load-button").click(function(e) {

            e.preventDefault();

            // console.log("BUTTON:",defaultCurrencyCode);

            buttonLoadMoreCurrencyHasBeenClicked = true;


            if (defaultCurrencyCode != '') {

                $('table').fadeOut(500, () => {
                    // this._cache.table.toggle('slow');
                    $('.tbody').html('');
                    $('.load-button').hide();
                    $('.preloader').fadeIn();

                    Currency.getCoins(defaultCurrencyCode);
                });
            }

            // Tracking
            _gaq.push(['_trackEvent', 'BUTTON', 'Load More Coins - Clicked']);

        });
    },

    _eventHandler_hoverRowBuySellButton() {

        // var $body = $('body');
        var $elem = '.tr';

        // $('body tr').hover(function () {
        $body.on('mouseover', $elem, function() {
            var button = $(this).find('.btn')

            button.first().addClass('btn-success');
            button.last().addClass('btn-danger');
        });

        // $body.on('mouseout','.tr',function() {
        $body.on('mouseout', $elem, function() {
            var button = $(this).find('.btn')

            button.first().removeClass('btn-success');
            button.last().removeClass('btn-danger');

        });

    },

    _eventHandler_eventTracking() {

        // $('body tr').hover(function () {
        $body.on('click', '.btn-buy', function(e) {
            e.preventDefault();

            var href = $(this).attr("href");
            console.log(href);

            var data = $(this).attr('data-action')

            // Tracking
            _gaq.push(['_trackEvent', 'BUTTON', data]);

            setTimeout(function() {
                // chrome.windows.create({url: href});
                chrome.tabs.create({
                    url: href
                });
            }, 50);

        });

        $body.on('click', '.btn-sell', function(e) {
            e.preventDefault();

            var href = $(this).attr("href");
            console.log(href);

            var data = $(this).attr('data-action')

            // Tracking
            _gaq.push(['_trackEvent', 'BUTTON', data]);

            setTimeout(function() {
                // chrome.windows.create({url: href});
                chrome.tabs.create({
                    url: href
                });
            }, 50);

        });

    },

    _eventHandler_searchField() {

        var $searchField = $('#search_field');
        if ($searchField.length > 0) {
            $searchField.keyup(Helper.debounce(function() {
                $('h3').text('Hello ' + $searchField.val())
            }, 500));
        }

    },


}