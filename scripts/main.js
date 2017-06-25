'use strict';

function getClass(name) {
    return document.getElementsByClassName(name)[0];
}

function getId(name) {
    return document.getElementById(name);
}

/**
 *
 * @param element takes list or single class / id
 * @param height takes list or single value with our without px's
 */

function changeHeight(element, height) {
    function setHeight(element, height) {
        if (height.toString().indexOf("px") > -1) {
            getClass(element).style.height = height;
        } else {
            getClass(element).style.height = height + 'px';
        }
    }

    if (Array.isArray(element) && Array.isArray(height)) {
        for (var i = 0; i < element.length; i++) {
            setHeight(element[i], height[i]);
        }
    } else {
        setHeight(element, height);
    }
}

/**
 *
 * @param elementOnScroll - scrolling this element will execute changing opacity
 * @param elementOpacity - element or elements [list] of which opacity changes
 * @param range - speed of changing opacity (e.g. 200)
 * @param direction defines if elements increase or decrease their opacity when scrolling, takes one of two values ['inc', 'dec']
 */
function changeOpacityOnScroll(elementOnScroll, elementOpacity, range, direction) {
    elementOnScroll.addEventListener('scroll', function () {
        function setOpacity(elementOpacity) {
            if (direction == 'inc') {
                elementOpacity.style.opacity = elementOnScroll.scrollTop / range;
            } else if (direction == 'dec') {
                elementOpacity.style.opacity = 1 - elementOnScroll.scrollTop / range;
            }
        }

        if (Array.isArray(elementOpacity)) {
            for (var i = 0; i < elementOpacity.length; i++) {
                setOpacity(elementOpacity[i]);
            }
        } else {
            setOpacity(elementOpacity);
        }
    });
}

/**
 *
 * @param element takes element which parameters will change
 * @param opacity takes numeric value or null
 * @param visbility takes string value or null
 * @param display takes string value or null
 */
function displayElement(element, opacity, visbility, display) {
    if (opacity || opacity == 0 && opacity != null) {
        // because if (0) is treated same as if (null)
        element.style.opacity = opacity;
    }
    if (visbility) {
        element.style.visibility = visbility;
    }
    if (display) {
        element.style.display = display;
    }
}

/**
 *
 * @param element is hidden if opacity == 1
 */
function toggleElement(element) {
    if (element.style.opacity == 1) {
        displayElement(element, 0, 'hidden');
    } else {
        displayElement(element, 1, 'visible');
    }
}

function timeline(element, scrollableElement) {
    var selectors = {
        id: element,
        item: element.querySelectorAll('.timeline-item'),
        activeClass: 'timeline-item--active',
        img: '.timeline__img'
    };

    selectors.id.style.backgroundImage = 'url(' + selectors.item[0].querySelector(selectors.img).getAttribute('src') + ')';
    var itemLength = selectors.item.length;

    scrollableElement.addEventListener('scroll', function () {
        var max, min;
        var pos = element.scrollTop + element.clientHeight / 15;
        selectors.item.forEach(function (element, index, array) {
            var computedStyle = getComputedStyle(element);
            var elementHeight = element.clientHeight - (parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom)); // height without padding
            min = element.getBoundingClientRect().top + document.body.scrollTop;
            max = elementHeight + min;
            if (index == itemLength - 2 && pos > min + elementHeight) {
                selectors.item.forEach(function (element) {
                    element.classList.remove(selectors.activeClass);
                });
                selectors.id.style.backgroundImage = 'url(' + selectors.item[selectors.item.length - 1].querySelector(selectors.img).getAttribute('src') + ')';
                selectors.item[selectors.item.length - 1].classList.add(selectors.activeClass);
            } else if (pos <= max - 40 && pos >= min) {
                selectors.item.forEach(function (element) {
                    element.classList.remove(selectors.activeClass);
                });
                selectors.id.style.backgroundImage = 'url(' + element.querySelector(selectors.img).getAttribute('src') + ')';
                element.classList.add(selectors.activeClass);
            }
        });
    });
}

function resetValue() {
    getClass('form__button').value = 'Send message';
}

var projects = document.querySelectorAll('.piotrantosz, .cyfrowa, .dhole, .megatruck, .taxi, .sugarizer');
var projectsHidden = getClass('projects__hidden');
var projectsCard = getClass('projects__cards');
var projectsTitle = getClass('projects').getElementsByClassName('title')[0];

projects.forEach(function (entry) {
    entry.addEventListener('click', function () {
        var projectDescription = getClass(entry.getAttribute('class') + '__description');
        displayElement(projectsHidden, 1, 'visible');
        displayElement(projectDescription, 1, 'visible', 'block');
        displayElement(projectsCard, 0, 'hidden');
        if (document.body.clientWidth < 1100) {
            displayElement(projectsTitle, 0, 'hidden');
        }
        document.querySelectorAll('.title, .close').forEach(function (entry) {
            entry.addEventListener('click', function () {
                displayElement(projectDescription, null, null, 'none');
                displayElement(projectsHidden, 0, 'hidden');
                displayElement(projectsCard, 1, 'visible');
                if (document.body.clientWidth < 1100) {
                    displayElement(projectsTitle, 1, 'visible');
                }
            }, false);
        });
    }, false);
});

var form = getClass('form');
var formButton = getClass('form__button');
form.addEventListener('submit', function (evt) {
    formButton.value = ('Message sent');
});

var headerMenu = getClass('header__menu');
var overlay = getClass('overlay');
var closeMenuElements = [headerMenu];
var navLinks = overlay.getElementsByClassName('nav__link');

for (var i = 0; i < navLinks.length; i++) {
    closeMenuElements.push(navLinks[i])
}

closeMenuElements.forEach(function (element) {
    element.addEventListener('click', function () {
        toggleElement(overlay);
        if (overlay.style.opacity == 1) {
            headerMenu.style.color = '#013BFF'
        } else {
            headerMenu.style.color = '#000000'
        }
    }, false);
});


getClass('scroll').style.marginTop = 'calc(' + document.documentElement.clientHeight + 'px - 4em)';
changeOpacityOnScroll(getClass('content'), [getClass('scroll'), getClass('about__scroll')], 200, 'dec');
changeHeight('wrapper', document.documentElement.clientHeight);
timeline(getId('timeline'), getClass('content'));

var projectsSection = getClass('projects');

if (getClass('projects__hidden') <= projectsSection.clientHeight) {
    changeHeight('projects__hidden', projectsSection.clientHeight)
}