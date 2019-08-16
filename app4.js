(function() {
    var encoder_ip = '10.24.20.70';
    var base = 'http://' + encoder_ip + '/api/LiveTaskNode/Tasks';
    var task_id_url = base + '/?elements';
    var taskname = "Test";
    var tasknameURL = base;
    var task_ids = [];

    function get_task_ids() {
        $.ajax({
            method: 'GET',
            url: task_id_url,
            //dataType: '', //TODO need datatype
            success: function(rslt) {
                var sel = $('#task-select');
                sel.empty();

                $.each(rslt, function(i, v) {
                    tasknameURL = base + "/" + v + "/_state_/Config/CustomName"
                    $.ajax({
                        method: 'GET',
                        url: tasknameURL,
                        success: function(taskname) {
                            var ctrl = $('<input/>').attr({ type: 'checkbox', name: 'tasks[]', value: v, id: `task_${v}`, autocomplete: 'off' });
                            var label = $('<label></label>').attr({ for: `task_${v}` }).text(taskname).prepend(ctrl);
                            var o = $('<div></div>').append(label);
                            $(sel).append(o);
                        }
                    });
                });
            },
            error: function(rslt) {
                alert('cannot contact ' + task_id_url);
            }
       });
    };

    function get_url(action, task_id = 1) {
        switch (action) {
            case 'start':
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
                break;
        }
    };

    function post_start_stop(action) {
        if (!task_ids.length) {
            alert('No task selected');
        }
        for (var i = 0; i <= task_ids.length - 1; i++) {
            var url = get_url(action, task_ids[i]);

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
                    }
                    else {
                        alert('Deactivated');
                    }
                },
                error: function(rslt) {
                    alert('cannot contact activation/deactivation url');
                }
            });
        }
    };

    //bind buttons to action 
    $('#start-ctrl').on('click', function() {
        post_start_stop('start');
    });

    $('#stop-ctrl').on('click', function() {
        post_start_stop('stop');
    });

    $(document).on('click', '#task-select input', function() {
        var val = $(this).val();
        var pos = task_ids.indexOf(val);
        if ($(this).prop("checked") == true) {
            if (pos === -1) {
                task_ids.push(val);
            }
        }
        else {
            if (pos !== -1) {
                task_ids.splice(pos, 1);
            }
        }
    })

    //get tasks when document loads
    get_task_ids();
}());
