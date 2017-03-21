var config = {
    apiKey: "AIzaSyCFvi3XKzVcjvhHHQT5-SFp894dTor5zLE",
    authDomain: "finance-app-bfbc5.firebaseapp.com",
    databaseURL: "https://finance-app-bfbc5.firebaseio.com",
    storageBucket: "finance-app-bfbc5.appspot.com",
    messagingSenderId: "38154991736"
};
firebase.initializeApp(config);
database = firebase.database();
// This .on("click") function will trigger the AJAX Call
var stock = {};
$("#find-stock").on("click", function(event) {
    // Preventing the submit button from trying to submit the form
    // We're optionally using a form so the user may hit Enter to search instead of clicking the button
    event.preventDefault();
    var Markit = {};
    /**
     * Define the QuoteService.
     * First argument is symbol (string) for the quote. Examples: AAPL, MSFT, JNJ, GOOG.
     * Second argument is fCallback, a callback function executed onSuccess of API.
     */
    var name = $("#stock-input").val().toUpperCase();

    Markit.QuoteService = function(sSymbol, fCallback) {
        name = sSymbol;
        this.fCallback = fCallback;
        this.DATA_SRC = "http://dev.markitondemand.com/Api/v2/Quote/jsonp";
        this.makeRequest();
    };
    /**
     * Ajax success callback. fCallback is the 2nd argument in the QuoteService constructor.
     */
    Markit.QuoteService.prototype.handleSuccess = function(jsonResult) {
        this.fCallback(jsonResult);
    };
    /**
     * Ajax error callback
     */
    Markit.QuoteService.prototype.handleError = function(jsonResult) {
        console.error(jsonResult);
    };
    /** 
     * Starts a new ajax request to the Quote API
     */
    Markit.QuoteService.prototype.makeRequest = function() {
        //Abort any open requests
        if (this.xhr) {
            this.xhr.abort();
        }
        //Start a new request
        this.xhr = $.ajax({
            data: {
                symbol: name
            },
            url: this.DATA_SRC,
            dataType: "jsonp",
            success: this.handleSuccess,
            error: this.handleError,
            context: this
        });
    };

    new Markit.QuoteService(name, function(jsonResult) {
        //Catch errors
        if (!jsonResult || jsonResult.Message) {
            console.error("Error: ", jsonResult.Message);
            return;
        }
        //If all goes well, your quote will be here.
        console.log(jsonResult);
        //Now proceed to do something with the data.
        $("#legal-name").text(jsonResult.Name);
        $("#symbol-name").text(jsonResult.Symbol);
        $("#high-price").text("High Price:" + "  " + jsonResult.High);
        $("#low-price").text("Low Price:" + "  " + jsonResult.Low);
        $("#last-price").text("Current Price:" + "  " + jsonResult.LastPrice);
        stock = jsonResult;
    });

    //=====================Second AJAX Request==================================//

    console.log(this);
    console.log("'" + $("#stock-input").val() + "'");

    var url = "https://api.intrinio.com/companies?ticker=" + $("#stock-input").val().toUpperCase();
    var username = "f3c71abbeedf153649a3f4c2c3f8a891";
    var password = "bf28a1c0a59cc7ae5b2778cf20a4bc77";
    var auth = "Basic " + btoa(username + ':' + password);
    $.ajax({
        url: url,
        method: 'GET',
        headers: {
            "Authorization": auth
        }
    }).done(function(response) {
        console.log(response)
        $("#legal_name").text(response.legal_name);
        $("#ceo").text("CEO: " + response.ceo);
        $("#business_address").text("Address: " + response.business_address);
        $("#company_url").attr("href", response.company_url).text(response.company_url);
        $("#employees").text("Employees: " + response.employees);
        $("#long_description").text(response.long_description);
    });
});

$("#add-button").on("click", function(e) {
    e.preventDefault();
    var jsonResult = sessionStorage.getItem('stock');
    console.log("JSON RESULT:", stock);
    database.ref().push(stock);
    // $("#tableList > tbody").append("<tr><td>" + stock.Name + "</td><td>" + stock.Symbol + "</td><td>" + stock.High +
    //     "</td><td>" + stock.Low + "</td><td>" + stock.LastPrice + "</td></tr>")

});

database.ref().on("child_added", function (snapshot) {

  console.log(snapshot);

   $("#tableList > tbody").append("<tr><td>" + "<input id=" + snapshot.val().Symbol + " type='button' value='X' class='delete-button' onclick='deleteRow(this)'/>" + "</td><td>" + snapshot.val().Name + "</td><td>" + snapshot.val().Symbol + "</td><td>" + snapshot.val().High +
          "</td><td>" + snapshot.val().Low + "</td><td>" + snapshot.val().LastPrice + "</td></tr>")

})

   function deleteRow(t)
{
    var row = t.parentNode.parentNode;
    document.getElementById("tableList").deleteRow(row.rowIndex);
    console.log(t);
    var x = $(t).attr('id');
    console.log(x);

    database.ref().orderByChild("Symbol").equalTo(x).once('value', function(snapshot) {
      snapshot.forEach(function(data) {
        database.ref(data.key).remove();
    });

  });

}


$(document).ready(function() {

    var Markit = {}

    Markit.QuoteService = function(sSymbol, fCallback, ECallback, GCallback, HCallback, MCallback) {
        this.symbol = sSymbol;
        this.fCallback = fCallback;
        this.ECallback = ECallback;
        this.GCallback = GCallback;
        this.HCallback = HCallback;
        this.MCallback = MCallback;
        this.DATA_SRC = "http://dev.markitondemand.com/Api/v2/Quote/jsonp";
        this.makeRequest();
    };

    Markit.QuoteService.prototype.handleSuccess = function(jsonResult) {
        this.fCallback(jsonResult);

    };

    Markit.QuoteService.prototype.handleSuccess2 = function(response1) {
        this.ECallback(response1);

    };

    Markit.QuoteService.prototype.handleSuccess3 = function(response2) {
        this.GCallback(response2);

    };

    Markit.QuoteService.prototype.handleSuccess4 = function(response3) {
        this.HCallback(response3);

    };

    Markit.QuoteService.prototype.handleSuccess5 = function(response4) {
        this.MCallback(response4);

    };

    /**
     * Ajax error callback
     */
    Markit.QuoteService.prototype.handleError = function(jsonResult) {
        console.error(jsonResult);
    };

    Markit.QuoteService.prototype.makeRequest = function() {

        //Start a new request
        this.xhr = $.ajax({
            data: {
                symbol: "AAPL"
            },
            url: this.DATA_SRC,
            dataType: "jsonp",
            success: this.handleSuccess,
            error: this.handleError,
            context: this
        });

        this.xhr = $.ajax({
            data: {
                symbol: "GOOGL"
            },
            url: this.DATA_SRC,
            dataType: "jsonp",
            success: this.handleSuccess2,
            error: this.handleError,
            context: this
        });

        this.xhr = $.ajax({
            data: {
                symbol: "FB"
            },
            url: this.DATA_SRC,
            dataType: "jsonp",
            success: this.handleSuccess3,
            error: this.handleError,
            context: this
        });

        // this.xhr = $.ajax({
        //     data: {
        //         symbol: "CSCO"
        //     },
        //     url: this.DATA_SRC,
        //     dataType: "jsonp",
        //     success: this.handleSuccess4,
        //     error: this.handleError,
        //     context: this
        // });

        this.xhr = $.ajax({
            data: {
                symbol: "MSFT"
            },
            url: this.DATA_SRC,
            dataType: "jsonp",
            success: this.handleSuccess4,
            error: this.handleError,
            context: this
        });
    };


    new Markit.QuoteService(name, function(jsonResult) {
        //Catch errors
        if (!jsonResult || jsonResult.Message) {
            console.error("Error: ", jsonResult.Message);
            return;
        }
        //If all goes well, your quote will be here.
        console.log(jsonResult);
        //Now proceed to do something with the data.

        $("#stockInfo").append("<h1>" + jsonResult.Symbol + "</h1>");
        $("#stockInfo").append("<p>" + "High: " + jsonResult.High + "</p><p>" + "Low: " + jsonResult.Low + "</p><p>" + "Current: " + jsonResult.LastPrice + "</p>");


    }, function(response1) {

        console.log(response1);

        $("#stockInfo2").append("<h1>" + response1.Symbol + "</h1>");
        $("#stockInfo2").append("<p>" + "High: " + response1.High + "</p><p>" + "Low: " + response1.Low + "</p><p>" + "Current: " + response1.LastPrice + "</p>");
    }, function(response2) {

        console.log(response2);

        $("#stockInfo3").append("<h1>" + response2.Symbol + "</h1>");
        $("#stockInfo3").append("<p>" + "High: " + response2.High + "</p><p>" + "Low: " + response2.Low + "</p><p>" + "Current: " + response2.LastPrice + "</p>");

    }, function(response3) {
        console.log(response3);

        $("#stockInfo4").append("<h1>" + response3.Symbol + "</h1>");
        $("#stockInfo4").append("<p>" + "High: " + response3.High + "</p><p>" + "Low: " + response3.Low + "</p><p>" + "Current: " + response3.LastPrice + "</p>");
    });
});
