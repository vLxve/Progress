var Progress = RegisterApp('Progress');
var ProgressBox;
var interval;

Progress.addNuiListener("Start", (Data) => {
    var progressLabel = $('#progress-label');
    var progressPercentage = $('#progress-percentage');
    var progressBarContainer = $('.progress-bar-container');

    progressLabel.text(Data.Title);
    progressPercentage.text('0%');

    $.when($('.progress-container').fadeIn(250)).done(() => {
        progressLabel.show();
        progressPercentage.show();  
        progressBarContainer.show();

        ProgressBox = new ProgressBar.Circle('.responsive-bar', {
            color: '#01e2c0',
            trailColor: 'rgba(255, 255, 255, 0.5)',
            strokeWidth: 0,
            trailWidth: 0,
            duration: parseInt(Data.Duration) || 5000,
            easing: 'linear',
            text: { autoStyleContainer: false },
        });

        ProgressBox.animate(1.0, {}, () => {
            progressLabel.hide();
            progressPercentage.hide();
            progressBarContainer.hide()

            progressBarContainer.fadeOut(500);

            clearInterval(interval);

            setTimeout(() => {
                $.post('https://mercy-ui/Progress/Done', JSON.stringify({}));
            }, 250);
        });

        interval = setInterval(function () {
            var kne = 25;
            updateBar(kne, parseInt(Data.Duration) || 5000);
        });
    });
});

Progress.addNuiListener("Stop", () => {
    $("#progress-label, #progress-percentage, .progress-bar-container").hide();

    clearInterval(interval);

    var items = $('.item');
    items.removeClass('filled');

    if (ProgressBox) {
        ProgressBox.stop();
    }

    if (ProgressBox && ProgressBox.text) {
        ProgressBox.setText('');
        ProgressBox.set(0);
    }

    $('#progress-percentage').text('0%');

    console.log('Event listener "Stop" has been triggered and processed.');
});


function updateBar(kne, duration) {
    var kneBar = $("#kneBar");
    var progressPercentage = $("#progress-percentage");

    if (kneBar.length && progressPercentage.length) {
        kneBar.html('');
        for (var i = 0; i < 25; i++) {
            var item = $('<div class="item"></div>');
            kneBar.append(item);
        }

        var i = 0;
        clearInterval(interval);
        interval = setInterval(function () {
            if (i <= kne) {
                var item = kneBar.children().eq(i);
                item.addClass('filled');
                i++;
                var percentage = Math.round((i / kne) * 100);
                progressPercentage.text(percentage + "%");
            } else {
                clearInterval(interval);
            }
        }, duration / kne);
    } else {
    }
}
