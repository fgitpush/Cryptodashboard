

    <div class="container-fluid">
        <div class="heading float-left">
            <h3 id="extTopBannerH2">Cryptocurrency Market Prices</h3>
            <br>
        </div>

        <div class="date float-right m-auto">
            <form id="currency_switch" role="form">
                <select class="custom-select" id="currency">
                    <option value="" selected id="extDropDownDefaultSelect"> - SELECT A DEFAULT CURRENCY</option>
                </select>
            </form>
        </div>

    </div>

    <table class="table table-hover">
        <thead style="background-color:white">
            <tr>
                <th width="6%"></th>
                <th width="10%" id="extTableHeadingTitle_NAME">NAME</th>
                <th width="6%" id="extTableHeadingTitle_RANK">RANK</th>
                <!-- <th width="18%" ><span id="extTableHeadingTitle_PRICE">PRICE</span> (<span id="setCurrencyCode"></span>)</th> -->
                <th width="23%"><span id="extTableHeadingTitle_PRICE">PRICE</span> (<span id="setCurrencyCode"></span>)</th>
                <!-- <th>1hr</th> -->
                <th width="15%" class="text-center" id="extTableHeadingTitle_24HR">24HR</th>
                <th width="10%" class="text-center" id="extTableHeadingTitle_WEEK">WEEK</th>

                <!-- <th width="15%" id="extTableHeadingTitle_BITCOIN">BITCOIN</th> -->
                <!-- <th width="25%" id="extTableHeadingTitle_BUY_SELL">BUY/SELL</th> -->

                <th width="" id="extTableHeadingTitle_BITCOIN">BITCOIN</th>
                <!-- <th width="27%" id="extTableHeadingTitle_BUY_SELL">BUY/SELL</th> -->
                <th width="30%" id="extTableHeadingTitle_BUY_SELL">BUY/SELL</th>

            </tr>
        </thead>
        <tbody class="tbody">
        </tbody>
    </table>

    <a href="#" type="button" id="extBUTTON_LOAD_MORE" class="load-button btn btn-primary btn-sm">LOAD MORE</a>

    <div class="container preloader" style="height:350px">
        <div class="col-12 text-center">
            <img src="img/szmk-loader.gif" class="img-fluid" alt="">
        </div>
    </div>

    <div id="errorMessage">
        <div class="container-fluid">
            <div class="row">

                <div class="col-12">
                    <h3 id="extERROR_Service_Unavailable">The service is currently unavailable due to high-demand.</h3>
                    <h2 id="extERROR_Check_Back" class="message">Please check back in short while.</h2>
                </div>

            </div>

        </div>
    </div>

    <script src="js/jquery-3.1.0.min.js"></script>
    <script src="js/jquery.stickytableheaders.min.js"></script>
    <script src="js/jquery.lazy.min.js"></script>

    <script src="js/currency-functions.js"></script>
    <script src="js/currency-init.js"></script>
    <link rel="stylesheet" href="css/bootstrap4-beta/css/bootstrap.min.css">
    <link href="css/font-awesome-4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,700" rel="stylesheet">
    <!-- <link href="https://fonts.googleapis.com/css?family=Karla:400,700" rel="stylesheet"> -->
    <link rel="stylesheet" href="css/style.css">

