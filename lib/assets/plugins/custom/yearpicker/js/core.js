// Load Options 
// $.ajax({
//     // url: 'Options.json',
//     url:`${Host_Url}/custom/yearpicker/js/Options.json`,
//     // url:'D:/xyz/26Aug/calbiobms/CalbioBms_UI/wwwroot/assets/js/custom/yearpicker/js/Options.json',
//     // url:'file:///D:/xyz/26Aug/calbiobms/CalbioBms_UI/Views/FinanceReport/Options.json',
// //     type: 'GET',
// //   dataType: 'json',
//     success: function (data) {
//         if (!data) {
//             return;
//         }

//         const tbody = $('#tblSettings tbody');
//         $.each(data, function (index, item) {
//             const tr = $('<tr><td class="Property"></td><td class="Default"></td><td class="Description"></td></tr>');
//             tr.find('.Property').html(item.Property);
//             tr.find('.Default').html(item.Default);
//             tr.find('.Description').html(item.Description);
//             tbody.append(tr);
//         })
//     }
// });

var tempData = [
    {
      "Property": "year",
      "Default": "null",
      "Required": false,
      "Description": "Number"
    },
    {
      "Property": "startYear",
      "Default": "null",
      "Required": false,
      "Description": "Number"
    },
    {
      "Property": "endYear",
      "Default": "null",
      "Required": false,
      "Description": "Number"
    },
    {
      "Property": "selectedClass",
      "Default": "selected",
      "Required": false,
      "Description": "Class will be added to the selected item"
    },
    {
      "Property": "disabledClass",
      "Default": "disabled",
      "Required": false,
      "Description": "Class will be added to the disabled items"
    },
    {
      "Property": "onChange",
      "Default": "null",
      "Required": false,
      "Description": "A callback function that fires when the selected value is changed"
    },
    {
      "Property": "onShow",
      "Default": "null",
      "Required": false,
      "Description": "A callback function that fires when a yearpicker is show"
    },
    {
      "Property": "onHide",
      "Default": "null",
      "Required": false,
      "Description": "A callback function that fires when a yearpicker is hide"
    }
  ]
  
  const tbody = $('#tblSettings tbody');
          $.each(tempData, function (index, item) {
              const tr = $('<tr><td class="Property"></td><td class="Default"></td><td class="Description"></td></tr>');
              tr.find('.Property').html(item.Property);
              tr.find('.Default').html(item.Default);
              tr.find('.Description').html(item.Description);
              tbody.append(tr);
          })

// $.getJSON('Options.json')
//   .done(function(data) {
//     console.log('Data loaded successfully:', data);
//     const tbody = $('#tblSettings tbody');
//         $.each(data, function (index, item) {
//             const tr = $('<tr><td class="Property"></td><td class="Default"></td><td class="Description"></td></tr>');
//             tr.find('.Property').html(item.Property);
//             tr.find('.Default').html(item.Default);
//             tr.find('.Description').html(item.Description);
//             tbody.append(tr);
//         })
//   })
//   .fail(function(jqXHR, textStatus, errorThrown) {
//     console.error('Error loading data:', textStatus, errorThrown);
//   });

// toggle sidenav on menu button click
// document.querySelector('.menu-toggle').addEventListener('click', function () {
//     const element = document.querySelector('body');
//     const isMenuOpen = element.className.indexOf('menu-close') > -1;
//     if (isMenuOpen) {
//         element.classList.remove('menu-close');
//     } else {
//         element.classList.add('menu-close');
//     }
// });


// Show / Hide the side nav based on the screen size
$(document).ready(function () {

    const ToggleSideMenuByScreenSize = function () {
        const ww = document.body.clientWidth;
        const screenWidth = 900;
        if (ww < screenWidth) {
            $('body').addClass('menu-close');
        } else if (ww >= screenWidth) {
            $('body').removeClass('menu-close');
        };
    };

    $(window).resize(function () {
        ToggleSideMenuByScreenSize();
    });

    //Fire it when the page first loads:
    ToggleSideMenuByScreenSize();

});

const menuList = document.querySelectorAll("ul.menu a");
menuList.forEach(item => {
    item.addEventListener("click", function (e) {
        e.preventDefault();
        const selectedElement = this.getAttribute("href");

        let to = 0;
        if (selectedElement && selectedElement !== '#') {
            to = $(selectedElement).position().top - 30;
        }

        $(".page-content").animate({
            scrollTop: to
        }, 1000)

    });
});