

const version = "1.1.0";
const namespace = "yearpicker";

if (!jQuery) {
  alert(`${namespace} ${version} requires jQuery`);
}
const event_click = "click.";
const event_focus = "focus.";
const event_keyup = "keyup.";
const event_selected = "selected.";
const event_show = "show.";
const event_hide = "hide.";

const methods = {
  // Show datepicker
  showView: function showView() {
    const $this = this;

    if (!$this.build) {
      $this.init();
    }

    if ($this.show) {
      return;
    }

    $this.show = true;
    const $template = $this.$template,
      options = $this.options;

    $template
      .removeClass(options.hideClass)
      // .fadeIn(400) // Adjust the duration (400ms) as needed
      .slideDown(400)
      .on(event_click, $.proxy($this.click, $this));

      // $template
      // .css({
      //   display: 'block',  // Make sure it’s visible to animate
      //   height: 'auto',    // Set to auto to get the natural height
      //   overflow: 'hidden' // Hide overflow to animate height
      // })
      // .hide() // Initially hide the element to prepare for slideDown
      // .slideDown(400) // Slide down over 400ms
      // .on(event_click, $.proxy($this.click, $this));
    

    $(document).on(
      event_click,
      (this.onGlobalClick = $.proxy($this.globalClick, $this)),
      CheckNextBtn()
    );

    if (options.onShow && $.isFunction(options.onShow)) {
      options.onShow($this.year);
    }
  },

  // Hide the datepicker
  hideView: function hideView() {
    const $this = this;

    if (!$this.show) {
      return;
    }

    // if ($this.trigger(event_hide).isDefaultPrevented()) {
    //   return;
    // }

    const $template = $this.$template,
      options = $this.options;

    $template.addClass(options.hideClass).off(event_click, $this.click);
    $(document).off(event_click, $this.onGlobalClick);
    $this.show = false;

    if (options.onHide && $.isFunction(options.onHide)) {
      options.onHide($this.year);
    }
  },
  // toggle show and hide
  toggle: function toggle() {
    if (this.show) {
      this.hideView();
    } else {
      this.show();
    }
  },
};

const handlers = {
  click: function click(e) {
    const $target = $(e.target),
      viewYear = this.viewYear;

    if ($target.hasClass("disabled")) {
      return;
    }

    const view = $target.data("view");
    switch (view) {
      case "yearpicker-prev":
        var year = viewYear - 12;
        this.viewYear = year;
        this.renderYear();
        break;
      case "yearpicker-next":
        var year = viewYear + 12;
        this.viewYear = year;
        this.renderYear();
        break;
      // case "yearpicker-items":
      case "flatpickr-monthSelect-month":
        this.year = parseInt($target.html());
        this.renderYear();
        this.hideView();
        break;
      default:
        break;
    }
  },
  globalClick: function globalClick(_ref) {
    let target = _ref.target;
    let element = this.element;
    let hidden = true;

    if (target !== document) {
      while (
        target === element ||
        $(target).closest(".yearpicker-header").length === 1
      ) {
        hidden = false;
        break;
      }

      target = target.parentNode;
    }

    if (hidden) {
      this.hideView();
    }
  },
};

const render = {
  renderYear: function renderYear() {
    const $this = this,
      options = this.options,
      startYear = options.startYear,
      endYear = options.endYear;

    const disabledClass = options.disabledClass,
      viewYear = $this.viewYear,
      selectedYear = $this.year,
      now = new Date(),
      thisYear = now.getFullYear(),
      start = -5,
      end = 6,
      items = [];

    let prevDisabled = false;
    let nextDisabled = false;
    let i = void 0;

    for (i = start; i <= end; i++) {
      let year = viewYear + i;
      let disabled = false;

      if (startYear) {
        disabled = year < startYear;
        if (i === start) {
          prevDisabled = disabled;
        }
      }

      if (!disabled && endYear) {
        disabled = year > endYear;
        if (i === end) {
          nextDisabled = disabled;
        }
      }

      // check for this is a selected year
      const isSelectedYear = year === selectedYear;
      const view = isSelectedYear ?"flatpickr-monthSelect-month":"flatpickr-monthSelect-month";// "yearpicker-items" : "yearpicker-items";
      items.push(
        $this.createItem({
          selected: isSelectedYear,
          disabled: disabled,
          text: viewYear + i,
          view: disabled ? "flatpickr-monthSelect-month disabled" : view,
          // view: disabled ? "yearpicker-items disabled" : view,
          highlighted: year === thisYear,
        })
      );
    }

    $this.yearsPrev.toggleClass(disabledClass, prevDisabled);
    $this.yearsNext.toggleClass(disabledClass, nextDisabled);
    // $this.yearsCurrent.html(selectedYear);
    $this.yearsCurrent.val(selectedYear);
    $this.yearsBody.html(items.join(" "));
    $this.setValue();
    CheckNextBtn()
  },
};

const Yearpicker = (function () {
  function YearPicker(element, options) {
    let defaults = {
      // The Initial Date
      year: null,
      // Start Date
      startYear: null,
      // End Date
      endYear: null,
      // A element tag items
      itemTag: "li",
      //css class selected date item
      selectedClass: "selected",
      // css class disabled
      disabledClass: "disabled",
      hideClass: "hide", 
      // Adding style by NR on  01-04-2025
      template: `<div class="yearpicker-container" style="top: 40.5px;left: 3px;right: auto;"> 
                    <div class="flatpickr-months yearpicker-header">
                      <div class="yearpicker-prev" data-view="yearpicker-prev">&lsaquo;</div>
                      
                      <div class="flatpickr-month">
                        <div class="flatpickr-current-month">
                          <div class="numInputWrapper pe-none ">
                            <input class="numInput cur-year yearpicker-current" type="number" tabindex="-1" aria-label="Year">
                          </div>
                        </div>
                      </div>

                      <div class="yearpicker-next" data-view="yearpicker-next">&rsaquo;</div>
                    </div>                  
                    <div class="yearpicker-body">
                        <div class="yearpicker-year" data-view="years">
                        </div>
                    </div>
                  </div>
    `,
    
      // Event shortcuts
      onShow: null,
      onHide: null,
      onChange: null,
    };
    const $this = this;

    $this.options = $.extend({}, defaults, options);
    $this.$element = $(element);
    $this.element = element;
    $this.build = false;
    $this.show = false;
    $this.startYear = null;
    $this.endYear = null;
    $this.$template = $($this.options.template);
    $this.init();
  }

  YearPicker.prototype = {
    /**
     * constructor
     * configure the yearpicker before initialize
     * @returns {null}
     */
    init: function () {
      const $this = this,
        $element = this.$element,
        options = this.options;

      if (this.build) {
        return;
      }
      $this.build = true;

      const startYear = options.startYear,
        endYear = options.endYear,
        defaultYear = $this.getValue(),
        $template = $this.$template;

      let year = options.year;

      $this.isInput = $element.is("input") || $element.is("textarea");
      // $this.icon = $element.next('.input-group-append').find('span'); // New Get the icon element
      $this.initialValue = defaultYear;
      $this.oldValue = defaultYear;

      // $this.icon.on(event_click, function(e) {
      //   e.stopPropagation();  //  New Prevent event from reaching the input field
      // });

      // if ($this.isInput) {
      //   $element.on(event_focus, $.proxy($this.showView, $this));
      //   console.log("Year picker should open here");
      // } else {
      //   $element.on(event_click, $.proxy($this.showView, $this));
      // }

      const currentYear = new Date().getFullYear();
      // set the defaultyear
      year = year || defaultYear || null;

      // set the startyear
      if (startYear) {
        if (year && year < startYear) {
          year = startYear;
        }
        $this.startYear = startYear;
      }

      // set the endyear
      if (endYear) {
        if (year && year > endYear) {
          year = endYear;
        }
        $this.endYear = endYear;
      }

      $this.year = year;
      $this.viewYear = year || currentYear;
      $this.initialYear = year || currentYear;

      $this.bind();

      $this.yearsPrev = $template.find(".yearpicker-prev");
      $this.yearsCurrent = $template.find(".yearpicker-current");
      $this.yearsNext = $template.find(".yearpicker-next");
      $this.yearsBody = $template.find(".yearpicker-year");

      $template.addClass(options.hideClass);
      $element.after($template.addClass(namespace + "-dropdown"));
      $this.renderYear();
    },
    // assign a events
    bind: function () {
      const $this = this,
        $element = this.$element,
        options = this.options;

      if ($.isFunction(options.show)) {
        $element.on(event_show, options.show);
      }
      if ($.isFunction(options.hide)) {
        $element.on(event_hide, options.hide);
      }
      if ($.isFunction(options.click)) {
        $element.on(event_click, options.click);
      }
      // Modified by NR on 01-04-2025
      if ($this.isInput) {
        // $element.on(event_focus, $.proxy($this.showView, $this));
        $element.on(event_click, $.proxy($this.showView, $this)); // modified by NR on 01-04-2025
        // console.log("Year picker should open here");
      } else {
        // $element.on(event_click, $.proxy($this.showView, $this));
        $element.on(event_focus, $.proxy($this.showView, $this));//New
      }
    },
    getValue: function () {
      const $this = this,
        $element = this.$element;

      const value = $this.isInput ? $element.val() : $element.text();
      return parseInt(value);
    },
    setValue: function () {
      const $this = this,
        $element = this.$element,
        options = this.options,
        value = this.year;
      const previousValue = $this.isInput ? $element.val() : $element.text();

      if ($this.isInput) {
        $element.val(value);
      } else {
        $element.html(value);
      }

      if (previousValue != value) {
        if (options.onChange && $.isFunction(options.onChange)) {
          options.onChange($this.year);
        }
      }

      $element.trigger("change");

    },
    trigger: function (type, data) {
      data = data || this.year;
      const e = $.Event(type, data);
      this.$element.trigger(e);
      return e;
    },
    createItem: function (data) {
      const options = this.options,
        itemTag = options.itemTag,
        classes = [];

      const items = {
        text: "",
        view: "",
        selected: false,
        disabled: false,
        highlighted: false,
      };

      $.extend(items, data);
      if (items.selected) {
        classes.push(options.selectedClass);
      }
      if(new Date().getFullYear() < items.text){
        items.disabled = true;
      }
      // if (items.disabled) {
      //   classes.push(options.disabledClass);
      // }
      return `<span class="${items.view} ${classes.join(" ")} ${items.disabled ? 'flatpickr-disabled disabled' : ''} ${new Date().getFullYear() == items.text ? "today" : ""}" data-view="${items.view}" >${items.text}</span>`;
      // return `<${itemTag} class="${items.view} ${classes.join(
      //   " "
      // )}" data-view="${items.view}">${items.text}</${itemTag}>`;
    },
  };
  return YearPicker;
})();

if ($.extend) {
  $.extend(Yearpicker.prototype, methods, render, handlers);
}

if ($.fn) {
  $.fn.yearpicker = function jQueryYearpicker(options) {
    var result = void 0;

    this.each(function (index, element) {
      var $element = $(element);
      var isDestory = options === "destroy";
      var yearpicker = $element.data(namespace);

      if (!yearpicker) {
        if (isDestory) {
          return;
        }
        yearpicker = new Yearpicker(element, options);
        $element.data(namespace, yearpicker);
      }
      if (typeof options === "string") {
        var fn = yearpicker[options];

        if ($.isFunction(fn)) {
          result = fn.apply(yearpicker, args);

          if (isDestory) {
            $element.removeData(namespace);
          }
        }
      }
    });

    return !result ? result : this;
  };
  $.fn.yearpicker.constractor = Yearpicker;
}

function CheckNextBtn(){
  if( $(".yearpicker-year").find(".flatpickr-disabled").length>0){
    $(".yearpicker-next").css("visibility","hidden");
  }
  else{
    $(".yearpicker-next").css("visibility","visible");
  }
}
