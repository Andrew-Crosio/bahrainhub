// perform JavaScript after the document is scriptable.
$(document).ready(function() {

    /**
     * Skin select elements
     */
    $('select').each(function(){
        var select = this;
        $(this).attr('size',$(this).find('option').length+1).wrap('<span class="ui-select" />')
            .before('<span class="ui-select-value" />')
            .bind('change, click', function(){
                $(this).hide().prev().html($(this).find('option:selected').text());
            })
            .after('<a class="ui-select-button button button-gray"><span></span></a>')
            .next().click(function(){
                if ($(select).toggle().is(':visible')) {
                    $(select).focus();
                }
                return false;
            })
            .prev().prev().html($(this).find('option:selected').text())
            .click(function(){
                if ($(select).toggle().is(':visible')) {
                    $(select).focus();
                }
                return false;
            });
        $(this).blur(function(){ $(this).hide(); }).parent().disableSelection();
    });

    /**
     * Skin file input elements
     */
    $(':file').each(function(){
        var file = this;
        $(this).attr('size', 25).wrap('<span class="ui-file" />')
            .before('<span class="ui-file-value">No file chosen</span><button class="ui-file-button button button-gray">Browse...</button>')
            .change(function(){
                $(file).parent().find('.ui-file-value').html($(this).val()? $(this).val() : 'No file chosen');
           })
            .hover(
                function(){ $(file).prev().addClass('hover');},
                function(){ $(file).prev().removeClass('hover');}
            ).mousedown(function(){$(file).prev().addClass('active');})
            .bind('mouseup mouseleave', function(){$(file).prev().removeClass('active');})
            .parent().disableSelection();
    });

    var geocoder = new Map.geocoder();
    $('#voice_location').change(function() {
        geocoder.geocode({address: this.value}, function(results, statusResponse) {
            if(statusResponse == "OK" && results && !results[0].partial_match) {
                $('#voice_latitude').val(results[0].geometry.location.lat());
                $('#voice_longitude').val(results[0].geometry.location.lng());
            } else {
                $('#voice_latitude, #voice_longitude').val('');
            }
        });
    });

    $('.section-btn').click(function () {
        //$(this).addClass('hide-panel');
        $(this).next('div').toggle();
    });

    $('.location-tabs li').click(function () {
       $('.location-tabs li').removeClass('selected');
       $(this).addClass('selected');
       var Tab = $(this).attr("data-tab");
       $('.tab-option').addClass('hide-panel');
       $(Tab).removeClass('hide-panel');
    });


    $('.ask-me').hover(
          function () {
              $(this).parent().next('.answere').fadeIn('fast');
          },
          function () {
              $(this).parent().next('.answere').fadeOut('fast');
          }
    );


  $(function (argument) {
      $('#voices').sortable({
          axis: 'y',
          dropOnEmpty: false,
          cursor: 'crosshair',
          items: 'li',
          opacity: 0.4,
          scroll: true,
          update: function(){
              $.ajax({
                  type: 'put',
                  data: $('#voices').sortable('serialize'),
                  dataType: 'script',
                  url: '/admin/homepage',
                  complete: function(request){
                      $('#voices').effect('highlight');
                  }
              });
          }
      });
  });
});
