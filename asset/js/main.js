var resizeHandler, startFrom = 0, effect_time = 800, NO_MORE = false;

basics();
function basics()
{
    if(window.parent.location!=window.location)
        window.parent.location =window.location;

    try
    {
        $().ready(function(){
            init();
        });
    }
    catch(ex)
    {
        setTimeout("basics();",1000);
    }
}

function init()
{
    extendJs();
    updateUI();
    $("<div id='white-screen'></div>").appendTo('body').fadeOut(effect_time);
    loadEvents();
    loadAdditionals();
}

function extendJs()
{

    jQuery.cachedScript = function( url, options ) {
        options = $.extend( options || {}, {
            dataType: "script",
            cache: true,
            url: url
        });
        return jQuery.ajax( options );
    };

}

function updateUI()
{
    var $myPic = $("#my-pic");
    if($myPic)
    {
        if (window.innerWidth < 1100) {
            rj.log(window.innerWidth);
            var picWidth = $myPic.width();
            $("#my-pic-container img").css('margin-left', (-picWidth / 2) + 'px');

        } else {
            $("#my-pic-container img").css('margin-left', '');
        }
    }
}

function loadEvents()
{
    $(window).resize(function(){
        if(resizeHandler!=undefined) clearTimeout(resizeHandler);
        resizeHandler = setTimeout("updateUI();",50);
    });

    $(document).delegate('a.project-img-link', 'click', function(event) { event.preventDefault(); $(this).ekkoLightbox({'gallery_parent_selector': '#project-images'}); });

    $(document).on('click', '#btn-load-more', function(e){
        var $this = $(this);
        $this.attr('disabled', 'disabled');
        startFrom += 1;
        $.post(document.location.href, {'fetch': startFrom}, function(data){
            $this.removeAttr('disabled');
            $(data).hide().appendTo('#project-images').show(effect_time);
            if(!data || NO_MORE) $this.fadeOut(effect_time /2);
            $('html,body').animate({ scrollTop: $('html').height() * 10}, effect_time);
        });
    });

    $(document).on('click', '.btn-view-images', function(e){
        var caption = $(this).parent().parent();
        var prjImage = caption.parent().find('img.project-preview');
        var prjId = prjImage.data('id');
        var prjTitle = prjImage.attr('alt');

        var $i = 0;
        var $total = caption.find('img').size();
        caption.find('img').each(function(){
            $i++;
            var $this = $(this);
            if($this.data('processed')) return false;
            $this.data('processed', true);
            if($i == 1) return true;
            $this.wrap('<a href="'+$this.attr('src')+'" data-toggle="lightbox" data-gallery="project' + prjId +'" data-title="' + prjTitle + ' | ' + $i + ' of ' + $total + '"></a>');
        });

        prjImage.parent().data('title',  prjTitle + ' | 1 of ' + $total);
        prjImage.click();
    })

    $(document).on('click', '.navbar-nav a,a.regular', function(e){
        $('#white-screen').fadeIn(effect_time);
    });
}

function loadAdditionals()
{
    $.cachedScript( "asset/js/ga.js" );
}

var rj = [];
    rj.log =
    function(output){
        if(typeof console != "undefined")
        console.log(output);
}