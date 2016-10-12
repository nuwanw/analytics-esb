var href = parent.window.location.href,
    hrefLastSegment = href.substr(href.lastIndexOf('/') + 1),
    resolveURI = parent.ues.global.dashboard.id == hrefLastSegment ? '../' : '../../';

var SHARED_PARAM = "&shared=true";

$(function() {
    var page = gadgetUtil.getCurrentPage();
    var qs = gadgetUtil.getQueryString();
    
    $("#txtSearchOperation").attr('placeholder', 'Search Operation' + ' ...');

   if(qs[PARAM_OPERATION] != null) {
       $("#txtSearchOperation").val(qs[PARAM_OPERATION]);
   }

    gadgetUtil.fetchData(CONTEXT, {
        type: page.type, id:qs[PARAM_ID]
    }, onData, onError); 

    function onData(response) {
        $('.typeahead').typeahead({
            hint: true,
            highlight: true,
            minLength: 0
        },{
            name: 'proxyName',
            source: substringMatcher(response.message)
        }).on('typeahead:selected', function(evt, item) {
            var href = parent.window.location.href;
            if(qs[PARAM_OPERATION]) {
                href = href.replace(/(operation=)[^\&]+/, '$1' + item);
            } else {
                if (href.includes("?")) {
                    href = href + "&" + PARAM_OPERATION + "=" + item;
                } else {
                    href = href + "?" + PARAM_OPERATION + "=" + item;
                }
            }
            parent.window.location = href;
        }).on('typeahead:open', function(evt, item) {
            wso2.gadgets.controls.resizeGadget({
                height: "200px"
            }); 
        }).on('typeahead:close', function(evt, item) {
            wso2.gadgets.controls.restoreGadget();
        }).focus().blur();
    }

    function onError(error) {

    }

    var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
            var matches, substringRegex;

            // an array that will be populated with substring matches
            matches = [];

            // regex used to determine if a string contains the substring `q`
            substrRegex = new RegExp(q, 'i');

            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function(i, str) {
                if (substrRegex.test(str)) {
                    matches.push(str);
                }
            });

            cb(matches);
        };
    };
});