module ApplicationHelper

  # Shortcut for `content_for(:head)` receives a block that is then
  # passed to content_for and called.
  # @yield the content to be included in the head.
  def head(&block)
    content_for(:head) { block.call }
  end

  # Sets the title of the page and returns a string consisting of an h1
  # element with the page title and the options passed to it.
  # @param [String] page_title the title of the page.
  # @param [Hash] options the options for the HTML element, same as `content_tag`.
  def title(page_title, options={})
    content_for(:title, page_title.to_s)
    return content_tag(:h1, page_title, options)
  end

  # Javascript files to include within the `<head>` tags.
  def javascript(*args)
    args = args.map { |arg| arg == :defaults ? arg : arg.to_s }
    head { javascript_include_tag *args }
  end

  # Stylesheets to include within the `<head>` tags.
  def stylesheet(*args)
    head { stylesheet_link_tag *args }
  end

  # Generates the cache key for a voice.
  # @param [Voice] voice the voice for which to generate the key.
  # @return [String] the cache key.
  def cache_key_for_posts(voice)
    mod_key = params[:mod] ? 'mod' : 'public'
    (current_user && current_user.is_admin?) ? "admin_voice_#{voice.id}_#{mod_key}" : "voice_#{voice.id}_#{mod_key}"
  end

  # Returns the google analytics include.
  # @todo Make this a setting, or remove it.
  # @return [String] the google analytics include code.
  def google_analytics
    code = <<-eos
    <script type="text/javascript">

      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-35147837-1']);
      _gaq.push(['_trackPageview']);

      (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();

    </script>
    eos
    code.html_safe
  end

  # Returns the chartbeat code for the top.
  # @todo Make this a setting or remove it.
  # @return [String] the chartbeat javascript.
  def chartbeat_top
    code = <<-eos
      <script type="text/javascript">var _sf_startpt=(new Date()).getTime()</script>
    eos
    code.html_safe
  end

  # Returns the chartbeat code.
  # @todo Make this a setting or remove it.
  # @return [String] the chartbeat javascript.
  def chartbeat
    code = <<-eos
      <script type="text/javascript">
      var _sf_async_config={uid:13467,domain:"bahrainhub.org"};
      (function(){
        function loadChartbeat() {
          window._sf_endpt=(new Date()).getTime();
          var e = document.createElement('script');
          e.setAttribute('language', 'javascript');
          e.setAttribute('type', 'text/javascript');
          e.setAttribute('src',
            (("https:" == document.location.protocol) ? "https://s3.amazonaws.com/" : "http://") +
            "static.chartbeat.com/js/chartbeat.js");
          document.body.appendChild(e);
        }
        var oldonload = window.onload;
        window.onload = (typeof window.onload != 'function') ?
          loadChartbeat : function() { oldonload(); loadChartbeat(); };
      })();
      </script>
    eos
    code.html_safe
  end
end
