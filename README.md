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
    Handlebars.quick({
        template: '<div class="entry"><h1>{{title}}</h1><div class="body">{{body}}</div></div>',
        spec: {title: "My New Post", body: "This is my first post!"},
        target: '#content'
    });
    </script>
</body>
</html>
```

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
    Handlebars.quickAsync({
        templateUrl: 'template-path/template.hbt',
        specUrl: 'spec-path/spec.json',
        target: '#content'
    }, function () {
        console.log('Handlebars.quickAsync has completed its job!');
    });
    </script>
</body>
</html>
```
