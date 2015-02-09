[![Bower version](https://badge.fury.io/bo/handlebars-quick.svg)](https://github.com/shamasis/handlebars-quick.git)

# Handlebars Quick

Simple extension for handlebars to get up and running within minutes and with no dependency on other libraries.

## Background

_[Handlebars](http://handlebarsjs.com) provides the power necessary to let you build semantic templates effectively with
no frustration._ This plugin makes using Handlebars easier than before.

This simple extension makes life easier for developers starting to use handlebars or for developers who simply need the
tempting abilities of handlebars right out of the box.

## What do you get?

Simply store your HTML template in a file, your specifications in a JSON file and ask Handlebars Quick to access them and
apply the result to a DOM element.

You would not need `jQuery` or other libraries for AJAX or DOM manipulation.

## Usage Example

```html
<html>
<head>
    <script src="handlebars.js"></script>
    <script src="handlebars.quick.min.js"></script>
</head>

<body>
    <div id="content"></div>
    <script type="text/javascript">
    Handlebars.quick.render('#content', '<div class="entry"><h1>{{title}}</h1><div class="body">{{body}}</div></div>', {
        title: "My New Post",
        body: "This is my first post!"
    });
    </script>
</body>
</html>
```

The first parameter is the element selector to which the compiled template from second parameter will be rendered in
context of the specification object in third parameter. The selector can be an element id prefixed by `#` or a class
name prefixed by `.`. The selector can also be a tag name or an array of all the aforementioned combinations.

> The selector parameter does not support full blown selection functionalities in order to reduce the weight and
> complexity of this library. You can pair `Handlebars.quick` with jQuery, Sizzle or other such libraries (or use
> native `querySelectorAll`) to achieve advanced selection capabilities.

### Loading templates and spec JSON from files

In case you want to store your handlebars template and specifications in separate files, you may use the `quickAsync`
function to fetch them using `AJAX`.

```html
<html>
<head>
    <script src="handlebars.js"></script>
    <script src="handlebars.quick.min.js"></script>
</head>

<body>
    <div id="content"></div>
    <script type="text/javascript">
    Handlebars.quick.renderAsync('#content' 'template-filename', 'spec-filename', function () {
        console.log('Handlebars.quick.renderAsync has completed its job!');
    });
    </script>
</body>
</html>
```

> Note that by default by default `Handlebars.quick` expects the template file's name to have a `.hbs` extension and the
> specification file to have `.json` extension. It also expects the file to stay in a path relative to the URL. You can
> configure these behaviours in `Handlebars.quick.options` object.

One can also load just the template and pass an `object` as the JSON spec.

```javascript
Handlebars.quick.renderAsync('#content' 'template-filename', { title: 'sherlock', body: 'watson' }, function () {
    console.log('Handlebars.quick.renderAsync has completed its job!');
});
```

### Loading partials from file

`Handlebars.quick` also allow you to load partials asynchronously from files. Using the `registerPartialAsync` and then
waiting for the `callback` to use the partials would do the trick.

```javascript
Handlebars.quick.registerPartialAsync('partial-name', function () {
    console.log('Handlebars.quick.registerPartialAsync has done its job!');
});
```

> Note that `Handlebars.quick` expects the partial file's name to start with an underscore (`_`) and this behaviour can
> be configured in `Handlebars.quick.options` object.

Multiple partials can be loaded by passing the partial names as an array. The `callback` for completion of loading the
partials will be executed only once - after all partials in the array are loaded.

```javascript
Handlebars.quick.registerPartialAsync(['partial-name-1', 'partial-name-2'], function () {
    console.log('Handlebars.quick.registerPartialAsync has done its job!');
});
```

### Configuration options

The following is the default configuration object and it's default values. The option names are likely to be self
explanatory.

```javascript
{
    templatePath: '',
    templateFileExtension: '.hbs',
    partialPath: '',
    partialFilePrefix: '_',
    specPath: '',
    specFileExtension: '.json'
}
```

## Installing Handlebars Quick

You can either download the latest release from GitHub or use `bower` to install the package. To download, simply follow
the [latest release link](https://github.com/shamasis/handlebars-quick/releases/latest) on GitHub. To install the
package using bower, type `bower install handlebars-quick` in your project working directory using a terminal.
