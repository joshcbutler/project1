   // This .on("click") function will trigger the AJAX Call
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
           $("#name").text(jsonResult.Name);
           $("#highPrice").text("High Price:" + "  " + jsonResult.High);
           $("#lowPrice").text("Low Price:" + "  " + jsonResult.Low);
           $("#lastPrice").text("Current Price:" + "  " + jsonResult.LastPrice);

           $("#tableList > tbody").append("<tr><td>" + jsonResult.Name + "</td><td>" + jsonResult.Symbol + "</td><td>" + jsonResult.High +
            "</td><td>" + jsonResult.Low + "</td><td>" + jsonResult.LastPrice + "</td></tr>")

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
           $("#legal_name").text(response.legal_name)
           $("#business_address").text(response.business_address)
           $("#company_url").text(response.company_url)
           $("#long_description").text(response.long_description)
       });
   });
