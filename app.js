
(function() {
    var task_id = null;
    var is_activated = false;

    var encoder_ip = '10.24.20.70';
    var base = 'http://' + encoder_ip + '/api/LiveTaskNode/Tasks';
	var task_id_url = 'http://' + encoder_ip + '/api/LiveTaskNode'
    //task_id_url = base + '?elements';
	
	function get_task_ids() {
        //get task_id and set it to variable task_id
        $.ajax({
            method: 'GET',
            url: task_id_url,
            success: function(rslt) {
				var sel = $('#task-select');
				sel.empty();
                
				$.each(rslt.Tasks, function(i, v) {
					var customName = v._state_.Config.CustomName;
					var o = $('<option></option>');
					$(o)
						.val(i)
						.text(customName);
					$(sel).append(o);
				});

            },
            error: function(rslt) {
                alert('cannot contact ' + task_id_url);
            }
        });
    };
	
	    function post_change() {
        var value = $('#task-select').val();
        var data = JSON.stringify(value);

        $.ajax({
            method: 'POST',
			data: data,
            url: get_url('change'),
            dataType: 'text',
            success: function(rslt) {
                console.log('task changed to ' + value);
            },
            error: function(rslt) {
                alert('cannot contact task update url');
            }
        });
    };


    function get_url(action) {
        //build a url from specific action
/*         var checkcount = 0
        while (task_id === null) {
            //make sure task_id is set. only check a few times
            checkcount += 1;
            if (checkcount >= 3) {
                alert('giving up ');
                break
            }
            else {
                get_task_id();    
            }
        } */
		
		if (! task_id) {
			//default to current shown task id if no task id selected.
			task_id = $('#task-select').val();
		};
		
        switch (action) {
            case 'start':
				///api/LiveTaskNode/Tasks/X/_state_/Activation/_type_?set
                return base + '/' + task_id + '/_state_/Activation/_type_?set';
                break
            case 'stop':
                return base + '/' + task_id + '/_state_/Activation/_type_?set';
                break
            case 'change':
                return base + '/' + task_id + '/_state_/Config/Input/InputMode/_value_/SDI/InputInterface';
                break
            default:
                alert('no action passed to url builder');
        }
    };

    
    function post_start_stop(action) {
        
		var url = get_url(action);

        if (action == 'start') {
            data = JSON.stringify('ACTIVATED');
        }
        else if (action == 'stop') {
            data = JSON.stringify('DEACTIVATED');
        }
        else {
            alert('incorrect action passed to post start/stop');
            return;
        }

        $.ajax({
            type: 'POST',
            url: url,
			data: data,
            dataType: 'text',
            success: function(rslt) {
				console.log(rslt);
				if (rslt.length > 3) {
					alert(rslt);
					return;
				};
                if (action === 'start') {
                    alert('Activated');
                    is_activated = true;
                             }
                else {
                    alert('Deactivated');
                    is_activated = false;
                    
                }
                able_disable_sdi();
            },
            error: function(rslt) {
                alert('cannot contact activation/deactivation url');
            }
        });
    };


    function post_change() {
        var value = $('#sdi-select').val();
        var data = JSON.stringify(value);

        $.ajax({
            method: 'POST',
			data: data,
            url: get_url('change'),
            dataType: 'text',
            success: function(rslt) {
                console.log('sdi changed to ' + value);
            },
            error: function(rslt) {
                alert('cannot contact sdi update url');
            }
        });
    };


    function able_disable_sdi() {
        if (is_activated) {
            $('#sdi-select')
                .addClass('disabled')
                .mousedown(function(event) {
                    event.preventDefault();
                    return false;
                });
        }
        else {
            $('#sdi-select')
                .removeClass('disabled')
                .unbind('mousedown');
        };
    };

    
    //bind buttons to action 
    $('#start-ctrl').on('click', function() {
        post_start_stop('start');
    });

    $('#stop-ctrl').on('click', function() {
        post_start_stop('stop');
    });

    $('#sdi-select').on('change', function() {
        post_change();
    });
	
	$('#task-select').on('change', function() {
		is_activated = false;
		able_disable_sdi();
        task_id = $(this).val();
    });

    //get task id when document loads
    get_task_ids();


}());
