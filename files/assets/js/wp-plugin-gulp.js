/**
* Jquery Scripts
*
* @author  Deepen
* @since  1.0.0
* @modified in 2.0.0
* @2017 January
*/
window.jQuery = window.$ = jQuery;
jQuery(document).ready(function($) {
  $('.zvc-hacking-select').select2();

  //For Datepicker
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  var time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
  var output = d.getFullYear() + '-' +
  (month<10 ? '0' : '') + month + '-' +
  (day<10 ? '0' : '') + day + ' ' + time;
  var start_date_check = $('#datetimepicker').data('existingdate');
  if( start_date_check ) {
    output = start_date_check;
  }
  $('#datetimepicker').datetimepicker({
    value: output,
    step: 15,
    minDate: 0,
    format:'Y-m-d H:i:s'
  });

  //For Reports Section
  $('#reports_date').datepicker({
    changeMonth: true,
    changeYear: false,
    showButtonPanel: true,
    dateFormat: 'MM yy'
  }).focus(function() {
    var thisCalendar = $(this);
    $('.ui-datepicker-calendar').detach();
    $('.ui-datepicker-close').click(function() {
      var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
      var year = $("#ui-datepicker-div .ui-datepicker-year").html();
      thisCalendar.datepicker('setDate', new Date(year, month, 1));
    });
  });
  $( ".zoom_account_datepicker" ).datepicker( {dateFormat: "yy-mm-dd"} );

  /***********************************************************
  * Start For Users and Meeting DATA table Listing Section
  **********************************************************/
  $('#zvc_users_list_table, #zvc_meetings_list_table').dataTable({
    "pageLength": 25,
    "columnDefs": [{
      "targets": 0,
      "orderable": false
    }]
  });

  //Check All Table Elements for Meetings List
  $("#zvc_meetings_list_table #checkall").click(function () {
    if ($(this).is(':checked')) {
      $("#zvc_meetings_list_table input[type=checkbox]").each(function () {
        $(this).prop("checked", true);
      });
    } else {
      $("#zvc_meetings_list_table input[type=checkbox]").each(function () {
        $(this).prop("checked", false);
      });
    }
  });

  /**
  * Bulk Delete Function
  * @author  Deepen
  * @since 2.0.0
  */
  $('#bulk_delete_meeting_listings').click(function() {
    var r = confirm("Confirm bulk delete these Meeting?");
    if (r === true) {
      var arr_checkbox = [];
      $("#zvc_meetings_list_table input.checkthis").each(function () {
        if($(this).is(':checked')) {
          arr_checkbox.push($(this).val());
        }
      });

      var hostid = $(this).data('hostid');
      //Process bulk delete
      if(arr_checkbox) {
        var data = { meetings_id: arr_checkbox, host_id: hostid, action: 'zvc_bulk_meetings_delete', security: zvc_ajax.zvc_security };
        $('#zvc-cover').show();
        $.post(zvc_ajax.ajaxurl, data).done(function(response) {
          $('#zvc-cover').fadeOut('slow');
          var stringify = jQuery.parseJSON(response);
          var show_on_meeting_delete_error = $('.show_on_meeting_delete_error');
          if(stringify.error == 1) {
            show_on_meeting_delete_error.show().html('<p>'+stringify.msg+'</p>');
          } else {
            show_on_meeting_delete_error.show().html('<p>'+stringify.msg+'</p>');
            location.reload();
          }
        });
      }
    } else {
      return false;
    }
  });

});

/**
 * Confirm Deletion of the User
 * @param  {[type]} id
 */
 function confirm_delete_user(id) {
  var r = confirm("Confirm Delete ?");
  if (r === true) {
    var data = { user_id: id, action: 'zvc_delete_user', security: zvc_ajax.zvc_security };
    jQuery('#zvc-cover').show();
    jQuery.post(zvc_ajax.ajaxurl, data).done(function(result) {
      jQuery('#zvc-cover').fadeOut('slow');
      var result_data = jQuery.parseJSON(result);
      if( result_data.status == 1 ) {
        jQuery('.show_on_user_delete_success').html( '<p>' + result_data.msg + '</p>').show();
        location.reload();
      } else {
        jQuery('.show_on_user_delete_success').html( '<p>' + result_data.msg + '</p>').show();
      }
    });
  } else {
    return false;
  }
 }

/**
* Get The User Info
* @param  {[INT]} id
* @return {[type]} json
*/
function get_user_info(id) {
  var data = { userId: id, action: 'zvc_get_user_info', security: zvc_ajax.zvc_security };
  jQuery.post(zvc_ajax.ajaxurl, data).done(function(result) {
    var parsedData = jQuery.parseJSON(result);
    console.log(parsedData);
    var page_html = '';
    page_html += '<p><strong>User ID: </strong>'+parsedData.id+'</p>';
    page_html += '<p><strong>Email: </strong>'+parsedData.email+'</p>';
    if( parsedData.type == 1 ) {
      page_html += '<p><strong>User Type: </strong>Basic User</p>';
    } else if( parsedData.type == 2 ) {
      page_html += '<p><strong>User Type: </strong>PRO User</p>';
    } else {
      page_html += '<p><strong>User Type: </strong>Corp</p>';
    }
    page_html += '<p><strong>First Name: </strong>'+parsedData.first_name+'</p>';
    page_html += '<p><strong>Last Name: </strong>'+parsedData.last_name+'</p>';
    if(parsedData.meeting_capacity) {
      page_html += '<p><strong>Meeting Capacity: </strong>'+parsedData.meeting_capacity+'</p>';
    }

    if(parsedData.enable_webinar) {
      page_html += '<p><strong>Webinar Enabled: </strong>'+parsedData.enable_webinar+'</p>';
    }

    if(parsedData.webinar_capacity) {
      page_html += '<p><strong>Webinar Capacity: </strong>'+parsedData.webinar_capacity+'</p>';
    }

    if(parsedData.dept) {
      page_html += '<p><strong>Department: </strong>'+parsedData.dept+'</p>';
    }

    if(parsedData.timezone) {
      page_html += '<p><strong>Timezone: </strong>'+parsedData.timezone+'</p>';
    }

    if(parsedData.lastClientVersion) {
      page_html += '<p><strong>Last Client Version: </strong>'+parsedData.lastClientVersion+'</p>';
    }
    if(parsedData.lastLoginTime) {
      page_html += '<p><strong>Last Login Time: </strong>'+parsedData.lastLoginTime+'</p>';
    }
    $('.zvc_getting_user_info_content').html(page_html);
  });
}

/**
 * Confirm Deletion of the Meeting
 * @param  {[type]} id
 */
 function confirm_delete_meeting(id, host_id) {
  var r = confirm("Confirm Delete this Meeting?");
  if (r === true) {
    var data = { meeting_id : id, host_id: host_id, action : 'zvc_delete_meeting', security: zvc_ajax.zvc_security };
    jQuery('#zvc-cover').show();
    jQuery.post(zvc_ajax.ajaxurl, data).done(function(result) {
      jQuery('#zvc-cover').fadeOut('slow');
      var stringify = jQuery.parseJSON(result);
      var show_on_meeting_delete_error = jQuery('.show_on_meeting_delete_error');
      if(stringify.error == 1) {
        show_on_meeting_delete_error.show().html('<p>'+stringify.msg+'</p>');
      } else {
        show_on_meeting_delete_error.show().html('<p>'+stringify.msg+'</p>');
        location.reload();
      }
    });
  } else {
    return false;
  }
 }

//FOr the Password Hashing API
function toggle_password_api(target){
  var d = document;
  var tag = d.getElementById(target);
  var tag2 = d.getElementById("showhide");

  if( tag2.innerHTML == 'Show' ){
    tag.setAttribute('type', 'text');
    tag2.innerHTML = 'Hide';
  } else {
    tag.setAttribute('type', 'password');
    tag2.innerHTML = 'Show';
  }
}

//FOr the Password Hashing Secret
function toggle_password_secret(target){
  var d = document;
  var tag = d.getElementById(target);
  var tag2 = d.getElementById("showhide1");

  if( tag2.innerHTML == 'Show' ){
    tag.setAttribute('type', 'text');
    tag2.innerHTML = 'Hide';
  } else {
    tag.setAttribute('type', 'password');
    tag2.innerHTML = 'Show';
  }
}