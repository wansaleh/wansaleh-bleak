jQuery(function($) {

  var html = $('html');
  var body = $('body');
  var $window = $(window);

  /* ==========================================================================
     Menu Function
     ========================================================================== */

  body.on('click', '[data-action="menu"]', function() {
    var action = $(this).data('action');
    var target = $('[data-target="' + $(this).data('target') + '"]').not('[data-action]');
    menu(target)
  });

  var menuActive = false;

  function menu(target) {
    if (!menuActive) {
      html.addClass('menu-initial');
      target.addClass('initial');
      setTimeout(function() {
        html.addClass('menu-active');
        target.addClass('active');
      }, 1);
      menuActive = true;
    } else {
      target.removeClass('active');
      html.removeClass('menu-active');
      setTimeout(function() {
        target.removeClass('initial');
        html.removeClass('menu-initial');
      }, 300);
      menuActive = false;
    }
  }

  body.on('click', '.overlay, #menu a', function() {
    if (html.hasClass('menu-active')) {
      var target = $('[data-target="menu"]').not('[data-action]');
      menu(target);
    }
  });

  /* ==========================================================================
     Current Menu Item
     ========================================================================== */

  /*
  	Actually this should be handled by GHost itself, but the {{current}} handler doesn't
  	work as aspected everytime so I add this little FUnction to fix this on the client side.
  */

  function currentMenuFix() {
    $('.menu-list-item a').each(function() {
      var link = $(this);
      link.removeClass('current');
      if (link.attr('href') == window.location.href) {
        link.addClass('current');
      }
    });
  }
  currentMenuFix();

  /* ==========================================================================
     Masonry
     ========================================================================== */

  function grid() {
    $('.post-list .post .post-image img').each(function() {
      var img = $(this);
      img.load(function() {
        img.parents('.post-image').css({
          'height': '0',
          'padding-bottom': 100 / img.width() * img.height() + '%'
        });
      });
    });
    var postlist = $('.post-list').masonry({
      itemSelector: '.post',
      isAnimated: false,
      gutter: 0,
      columnWidth: 1,
      transitionDuration: 0
    }).imagesLoaded().always(function() {
      postlist.masonry('layout');
    });
  }
  grid();

  /* ==========================================================================
     Run Highlight
     ========================================================================== */

  function highlight() {
    $('pre code').each(function(i, e) {
      hljs.highlightBlock(e);
      var code = $(this);
      var lines = code.html().split(/\n/).length;
      var numbers = [];
      for (i = 1; i < lines; i++) {
        numbers += '<span class="line">' + i + '</span>';
      }
      code.parent().addClass('codeblock').append('<div class="lines">' + numbers + '</div>');
    });
  }
  highlight();

  /* ==========================================================================
     Fitvids
     ========================================================================== */

  function video() {
    $('#wrapper').fitVids();
  }
  video();

  /* ==========================================================================
     Initialize and load Disqus
     ========================================================================== */

  function comments() {
    if (typeof disqus === 'undefined' || !document.getElementById('disqus_thread')) {
      $('.post-comments').css({
        'display': 'none'
      });
    } else {
      if (window.DISQUS) {
        return DISQUS.reset({
          reload: true,
          config: function() {
            this.page.identifier = location.pathname;
            this.page.url = location.origin + location.pathname;
          }
        });
      }

      $.ajax({
        type: "GET",
        url: "//" + disqus + ".disqus.com/embed.js",
        dataType: "script",
        cache: true
      });
    }
  }
  comments();

  /* ==========================================================================
     Reading Time
     ========================================================================== */

  function readingTime() {
    // Don't execute on the front page
    if (location.pathname === '/') {
      return;
    }

    var post = body.find('article');
    var postContent = body.find('.post-content');
    var postReadingTime = post.find('.post-reading-time');

    // Calculate Reading Time
    var ert = postContent.readingtime();

    var text = postContent.text();
    var regex = /\s+/gi;
    var wordCount = text.trim().replace(regex, ' ').split(' ').length;
    var totalChars = text.length;
    var charCount = text.trim().length;
    var charCountNoSpace = text.replace(regex, '').length;

    postReadingTime.find('.word-count').text(wordCount);
    postReadingTime.find('.estimated-reading-time').text(ert + ' min');

    // post.readingTime({
    //   readingTimeTarget: postReadingTime.find('.estimated-reading-time'),
    //   wordCountTarget: postReadingTime.find('.word-count'),
    //   error: function() {
    //     postReadingTime.find('.post-reading-time').remove();
    //   }
    // });
  }
  readingTime();

  /* ==========================================================================
     Reload all scripts after AJAX load
     ========================================================================== */

  function reload() {
    grid();
    ajaxLinkClass();
    highlight();
    video();
    comments();
    currentMenuFix();
    readingTime();

    ws_setUserOS();
    ws_setUserAgent();
    ws_headerClass();
    ws_initSkrollr();
  }

  /* ==========================================================================
     Add class for ajax loading
     ========================================================================== */

  function ajaxLinkClass() {

    $('a[href^="' + window.location.origin + '"], .post-image a, .post-title a, .post-more a, .post-meta a, .post-tags a, #pagination a').each(function() {
      var link = $(this);

      if (!link.hasClass('rss')) {
        link.addClass('js-ajax-link');

        if (link.attr('href').indexOf('page') > -1) {
          link.addClass('js-archive-index');
        }

        if (link.attr('href') == window.location.origin) {
          link.addClass('js-show-index');
        }

        if (link.attr('href').indexOf('tag') > -1) {
          link.addClass('js-tag-index');
        }

        if (link.attr('href').indexOf('author') > -1) {
          link.addClass('js-author-index');
        }
      }
    });
  }
  ajaxLinkClass();


  function ws_headerClass() {
    // ADDED BY WAN
    if ($('header.has-cover').length > 0)
      body.addClass('header-has-cover').removeClass('header-no-cover');
    if ($('header.no-cover').length > 0)
      body.addClass('header-no-cover').removeClass('header-has-cover');
  }
  ws_headerClass();

  var $window = $(window);
  var $body = $('body');

  function ws_setUserOS() {
    var OSName = "";
    if (navigator.appVersion.indexOf("Win") != -1) OSName = "windows";
    if (navigator.appVersion.indexOf("Mac") != -1) OSName = "mac";
    if (navigator.appVersion.indexOf("X11") != -1) OSName = "unix";
    if (navigator.appVersion.indexOf("Linux") != -1) OSName = "linux";

    $body.addClass(OSName);
  };

  function ws_setUserAgent() {
    if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
      $body.addClass('mobile');
    } else {
      $body.addClass('desktop');
      if (navigator.userAgent.match(/MSIE 9.0/)) {
        $body.addClass('ie9');
      }
    }
  };

  ws_setUserOS();
  ws_setUserAgent();
  var ws_skrollr;

  function ws_initSkrollr() {
    $window.resize(function() {
      if ($body.hasClass('mobile')) {
        if (ws_skrollr) ws_skrollr.destroy();
        delete ws_skrollr;
        return;
      }

      if (!ws_skrollr) {
        ws_skrollr = skrollr.init({
          forceHeight: false,
          smoothScrollingDuration: 150
        });
      }

      // Get window size
      var winH = $window.height();

      // Keep minimum height 550
      if (winH <= 550)
        winH = 550;

      // $('header').height(winH);

      // Reparse skrollr
      if (ws_skrollr) ws_skrollr.refresh();
    });
    $window.resize();
  };

  ws_initSkrollr();

  /* ==========================================================================
     Ajax Loading
     ========================================================================== */

  var History = window.History;
  var loading = false;
  var ajaxContainer = $('#ajax-container');

  if (!History.enabled) {
    return false;
  }

  History.Adapter.bind(window, 'statechange', function() {
    html.addClass('loading');
    var State = History.getState();
    $.get(State.url, function(result) {
      var $html = $(result);
      var newContent = $('#ajax-container', $html).contents();
      var title = result.match(/<title>(.*?)<\/title>/)[1];

      ajaxContainer.fadeOut(500, function() {
        if (html.hasClass('push-next')) {
          html.removeClass('push-next');
          html.addClass('pushed-next');
        }
        if (html.hasClass('push-prev')) {
          html.removeClass('push-prev');
          html.addClass('pushed-prev');
        }
        document.title = $('<textarea/>').html(title).text();
        ajaxContainer.html(newContent);
        body.removeClass();
        body.addClass($('#body-class').attr('class'));
        NProgress.done();
        ajaxContainer.fadeIn(500);
        $(document).scrollTop(0);
        setTimeout(function() {
          html.removeClass('loading');
        }, 50);
        reload();
        loading = false;
      });
    });
  });
  $('body').on('click', '.js-ajax-link', function(e) {
    e.preventDefault();

    var link = $(this);

    if (link.hasClass('post-nav-item') || link.hasClass('pagination-item')) {
      if (link.hasClass('post-nav-next') || link.hasClass('pagination-next')) {
        html.removeClass('pushed-prev');
        html.addClass('push-next');
      }
      if (link.hasClass('post-nav-prev') || link.hasClass('pagination-prev')) {
        html.removeClass('pushed-next');
        html.addClass('push-prev');
      }
    } else {
      html.removeClass('pushed-next');
      html.removeClass('pushed-prev');
    }

    if (loading === false) {
      var currentState = History.getState();
      var url = $(this).prop('href');
      var title = $(this).attr('title') || null;

      if (url.replace(/\/$/, "") !== currentState.url.replace(/\/$/, "")) {
        loading = true;
        html.addClass('loading');
        NProgress.start();
        History.pushState({}, title, url);
      }
    }
  });

  $('body').on('click', '#post-index .post .js-ajax-link', function() {
    var post = $(this).parents('.post');
    post.addClass('initial');
    setTimeout(function() {
      post.addClass('active');
    }, 1);
  });
});
